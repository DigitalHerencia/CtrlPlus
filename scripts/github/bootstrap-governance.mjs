#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const cliFlags = new Set(process.argv.slice(2));
if (cliFlags.has('--help')) {
  printUsage();
  process.exit(0);
}

const selectedSteps = new Set();
if (cliFlags.has('--labels-only')) {
  selectedSteps.add('labels');
}
if (cliFlags.has('--milestones-only')) {
  selectedSteps.add('milestones');
}
if (cliFlags.has('--issues-only')) {
  selectedSteps.add('issues');
}
if (cliFlags.has('--project-only')) {
  selectedSteps.add('project');
}

const runAllSteps = selectedSteps.size === 0;
const dryRun = cliFlags.has('--dry-run');
const verbose = cliFlags.has('--verbose');

const shouldRun = (step) => runAllSteps || selectedSteps.has(step);

const labelsConfig = readJson('.github/labels.json');
const manifestPath = resolveManifestPath();
const manifest = readJson(manifestPath);
const projectConfig = readJson('.github/project-v2.json');
const tasks = collectTasks(manifest);

const repo = ghJson(['repo', 'view', '--json', 'nameWithOwner']);
if (!repo.nameWithOwner || !repo.nameWithOwner.includes('/')) {
  throw new Error('Unable to resolve repository context via gh repo view.');
}

const [owner, repoName] = repo.nameWithOwner.split('/');

const knownLabels = new Set(labelsConfig.labels.map((label) => label.name));
const unknownTaskLabels = new Set();
for (const task of tasks) {
  for (const label of task.labels) {
    if (!knownLabels.has(label)) {
      unknownTaskLabels.add(label);
    }
  }
}

if (unknownTaskLabels.size > 0) {
  throw new Error(
    `${manifestPath} references labels missing from .github/labels.json: ${Array.from(
      unknownTaskLabels
    ).join(', ')}`
  );
}

console.log(`Repository: ${owner}/${repoName}`);

if (shouldRun('labels')) {
  syncLabels(labelsConfig.labels);
}

let milestoneNumberById = new Map();
if (shouldRun('milestones')) {
  milestoneNumberById = syncMilestones(owner, repoName, manifest.milestones);
} else if (shouldRun('issues')) {
  milestoneNumberById = loadMilestoneNumbers(owner, repoName, manifest.milestones);
}

let issuesByTaskId = new Map();
if (shouldRun('issues')) {
  issuesByTaskId = syncIssues(owner, repoName, tasks, milestoneNumberById, manifest.schema_version);
}

if (shouldRun('project')) {
  if (issuesByTaskId.size === 0) {
    issuesByTaskId = loadTaskIssues(tasks);
  }

  syncProject(owner, projectConfig, tasks, issuesByTaskId);
}

console.log('GitHub governance bootstrap complete.');

function printUsage() {
  console.log(`Usage: node scripts/github/bootstrap-governance.mjs [flags]\n\nFlags:\n  --labels-only      Sync labels only\n  --milestones-only  Sync milestones only\n  --issues-only      Sync milestone-linked task issues only\n  --project-only     Sync project board/fields/items only\n  --dry-run          Print write operations without executing them\n  --verbose          Print extra diagnostics\n  --help             Show this help`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function resolveManifestPath() {
  const candidates = ['.github/task-manifest.json', 'task-manifest.json'];
  const resolved = candidates.find((candidate) => existsSync(candidate));

  if (!resolved) {
    throw new Error(
      `Unable to locate task manifest. Expected one of: ${candidates.join(', ')}`
    );
  }

  return resolved;
}

function runGh(args, input) {
  if (verbose) {
    console.log(`gh ${args.join(' ')}`);
  }

  try {
    return execFileSync('gh', args, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      input
    }).trim();
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr).trim() : '';
    const stdout = error.stdout ? String(error.stdout).trim() : '';
    const output = stderr || stdout || error.message;
    throw new Error(`Command failed: gh ${args.join(' ')}\n${output}`);
  }
}

function ghJson(args, input) {
  const raw = runGh(args, input);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Expected JSON output from gh ${args.join(' ')}, got:\n${raw}`);
  }
}

function ghWrite(args, input) {
  const rendered = `gh ${args.join(' ')}`;
  if (dryRun) {
    console.log(`[dry-run] ${rendered}`);
    return '';
  }

  return runGh(args, input);
}

function ghApi(endpoint, method = 'GET', payload) {
  const args = ['api', endpoint];
  if (method !== 'GET') {
    args.push('--method', method);
  }

  if (payload === undefined) {
    return ghJson(args);
  }

  args.push('--input', '-');
  const rendered = `gh ${args.join(' ')}`;
  if (dryRun) {
    console.log(`[dry-run] ${rendered}`);
    if (verbose) {
      console.log(JSON.stringify(payload, null, 2));
    }
    return {};
  }

  return ghJson(args, JSON.stringify(payload));
}

function collectTasks(taskManifest) {
  const collected = [];
  for (const milestone of taskManifest.milestones) {
    for (const task of milestone.tasks) {
      collected.push({
        ...task,
        milestoneId: milestone.id,
        milestoneTitle: milestone.title
      });
    }
  }

  return collected;
}

function syncLabels(labels) {
  console.log(`Syncing ${labels.length} labels...`);
  for (const label of labels) {
    const args = [
      'label',
      'create',
      label.name,
      '--color',
      label.color,
      '--description',
      label.description,
      '--force'
    ];
    ghWrite(args);
  }
}

function syncMilestones(ownerLogin, repository, milestones) {
  console.log(`Syncing ${milestones.length} milestones...`);
  const existingMilestones = ghApi(
    `repos/${ownerLogin}/${repository}/milestones?state=all&per_page=100`
  );
  const milestoneNumberById = new Map();

  for (const milestone of milestones) {
    const canonicalTitle = `${milestone.id} - ${milestone.title}`;
    const existing = existingMilestones.find(
      (item) =>
        item.title === canonicalTitle ||
        item.title === milestone.title ||
        item.title.startsWith(`${milestone.id} - `)
    );

    const payload = {
      title: canonicalTitle,
      description: `Roadmap milestone ${milestone.id}`,
      state: 'open'
    };

    let response;
    if (existing) {
      response = ghApi(
        `repos/${ownerLogin}/${repository}/milestones/${existing.number}`,
        'PATCH',
        payload
      );
    } else {
      response = ghApi(`repos/${ownerLogin}/${repository}/milestones`, 'POST', payload);
    }

    if (response.number) {
      milestoneNumberById.set(milestone.id, response.number);
    } else if (existing) {
      milestoneNumberById.set(milestone.id, existing.number);
    }
  }

  return milestoneNumberById;
}

function loadMilestoneNumbers(ownerLogin, repository, milestones) {
  const existingMilestones = ghApi(
    `repos/${ownerLogin}/${repository}/milestones?state=all&per_page=100`
  );
  const milestoneNumberById = new Map();

  for (const milestone of milestones) {
    const canonicalTitle = `${milestone.id} - ${milestone.title}`;
    const existing = existingMilestones.find(
      (item) =>
        item.title === canonicalTitle ||
        item.title === milestone.title ||
        item.title.startsWith(`${milestone.id} - `)
    );

    if (existing) {
      milestoneNumberById.set(milestone.id, existing.number);
    }
  }

  return milestoneNumberById;
}

function syncIssues(ownerLogin, repository, roadmapTasks, milestoneNumbersById, schemaVersion) {
  console.log(`Syncing ${roadmapTasks.length} task issues...`);

  const existingIssues = ghJson([
    'issue',
    'list',
    '--state',
    'all',
    '--limit',
    '500',
    '--json',
    'number,title,body,url'
  ]);

  const issueByTaskId = new Map();
  const issueNumberByTaskId = new Map();

  for (const issue of existingIssues) {
    const taskId = extractTaskId(issue);
    if (!taskId) {
      continue;
    }

    issueByTaskId.set(taskId, issue);
    issueNumberByTaskId.set(taskId, issue.number);
  }

  for (const task of roadmapTasks) {
    const milestoneNumber = milestoneNumbersById.get(task.milestoneId);
    const payload = {
      title: `[${task.id}] ${task.title}`,
      body: renderTaskIssueBody(task, issueNumberByTaskId, schemaVersion),
      labels: task.labels
    };

    if (typeof milestoneNumber === 'number') {
      payload.milestone = milestoneNumber;
    }

    const existing = issueByTaskId.get(task.id);
    if (existing) {
      ghApi(`repos/${ownerLogin}/${repository}/issues/${existing.number}`, 'PATCH', payload);
    } else {
      const created = ghApi(`repos/${ownerLogin}/${repository}/issues`, 'POST', payload);
      const createdIssue = {
        number: created.number,
        title: created.title,
        body: created.body,
        url: created.html_url
      };
      issueByTaskId.set(task.id, createdIssue);
      issueNumberByTaskId.set(task.id, created.number);
    }
  }

  // Second pass links dependencies using issue numbers created in this run.
  for (const task of roadmapTasks) {
    const issue = issueByTaskId.get(task.id);
    if (!issue) {
      continue;
    }

    const milestoneNumber = milestoneNumbersById.get(task.milestoneId);
    const payload = {
      title: `[${task.id}] ${task.title}`,
      body: renderTaskIssueBody(task, issueNumberByTaskId, schemaVersion),
      labels: task.labels
    };

    if (typeof milestoneNumber === 'number') {
      payload.milestone = milestoneNumber;
    }

    ghApi(`repos/${ownerLogin}/${repository}/issues/${issue.number}`, 'PATCH', payload);
  }

  return loadTaskIssues(roadmapTasks);
}

function loadTaskIssues(roadmapTasks) {
  const taskIds = new Set(roadmapTasks.map((task) => task.id));
  const allIssues = ghJson([
    'issue',
    'list',
    '--state',
    'all',
    '--limit',
    '500',
    '--json',
    'number,title,body,url'
  ]);

  const issueByTaskId = new Map();
  for (const issue of allIssues) {
    const taskId = extractTaskId(issue);
    if (!taskId || !taskIds.has(taskId)) {
      continue;
    }

    issueByTaskId.set(taskId, issue);
  }

  return issueByTaskId;
}

function extractTaskId(issue) {
  const marker = (issue.body ?? '').match(/<!--\s*task-id:([A-Z]+-\d+)\s*-->/i);
  if (marker) {
    return marker[1];
  }

  const titleMatch = (issue.title ?? '').match(/^\[([A-Z]+-\d+)\]/);
  return titleMatch ? titleMatch[1] : null;
}

function renderTaskIssueBody(task, issueNumberByTaskId, schemaVersion) {
  const dependencyLines =
    task.depends_on.length === 0
      ? '- None'
      : task.depends_on
          .map((dependencyTaskId) => {
            const issueNumber = issueNumberByTaskId.get(dependencyTaskId);
            if (typeof issueNumber === 'number') {
              return `- #${issueNumber} (\`${dependencyTaskId}\`)`;
            }

            return `- \`${dependencyTaskId}\``;
          })
          .join('\n');

  const acceptanceCriteria =
    Array.isArray(task.acceptance_criteria) && task.acceptance_criteria.length > 0
      ? task.acceptance_criteria.map((criterion) => `- [ ] ${criterion}`).join('\n')
      : '- [ ] Implement scope defined in file map.';

  const fileMap = Object.entries(task.file_map ?? {})
    .map(([area, files]) => {
      const title = area.charAt(0).toUpperCase() + area.slice(1);
      const fileLines = files.map((file) => `- \`${file}\``).join('\n');
      return `### ${title}\n${fileLines}`;
    })
    .join('\n\n');

  const testTypes =
    Array.isArray(task.test_types) && task.test_types.length > 0
      ? task.test_types.map((type) => `\`${type}\``).join(', ')
      : '`none`';

  return `<!-- task-id:${task.id} -->
<!-- source:task-manifest.json schema:${schemaVersion} -->
## Summary
${task.title}

## Milestone
\`${task.milestoneId}\` - ${task.milestoneTitle}

## Dependencies
${dependencyLines}

## Implementation Scope (File Map)
${fileMap}

## Acceptance Criteria
${acceptanceCriteria}

## Delivery Requirements
- [ ] Requires migration: **${task.requires_migration ? 'Yes' : 'No'}**
- [ ] Requires E2E: **${task.requires_e2e ? 'Yes' : 'No'}**
- [ ] Test coverage includes: ${testTypes}
`;
}

function syncProject(ownerLogin, projectDefinition, roadmapTasks, issueByTaskId) {
  console.log(`Syncing project '${projectDefinition.name}'...`);

  let project = findProject(ownerLogin, projectDefinition.name);
  if (!project) {
    ghWrite([
      'project',
      'create',
      '--owner',
      ownerLogin,
      '--title',
      projectDefinition.name,
      '--format',
      'json'
    ]);
    project = findProject(ownerLogin, projectDefinition.name);
  }

  if (!project) {
    throw new Error(`Failed to create or locate project '${projectDefinition.name}'.`);
  }

  ghWrite([
    'project',
    'edit',
    String(project.number),
    '--owner',
    ownerLogin,
    '--title',
    projectDefinition.name,
    '--description',
    projectDefinition.description
  ]);

  ensureProjectFields(ownerLogin, project.number, projectDefinition.fields);

  if (Array.isArray(projectDefinition.views) && projectDefinition.views.length > 0) {
    console.log('Note: project views must be configured manually in the GitHub UI.');
  }
  if (
    Array.isArray(projectDefinition.automationRules) &&
    projectDefinition.automationRules.length > 0
  ) {
    console.log('Note: project automation rules must be configured manually in the GitHub UI.');
  }

  const fieldsData = ghJson([
    'project',
    'field-list',
    String(project.number),
    '--owner',
    ownerLogin,
    '--limit',
    '100',
    '--format',
    'json'
  ]);
  const fieldsByName = new Map(fieldsData.fields.map((field) => [field.name, field]));

  const newlyAddedTaskIds = addIssuesToProject(ownerLogin, project.number, roadmapTasks, issueByTaskId);
  const itemByIssueUrl = loadProjectItemMap(ownerLogin, project.number);

  for (const task of roadmapTasks) {
    const issue = issueByTaskId.get(task.id);
    if (!issue) {
      continue;
    }

    const item = itemByIssueUrl.get(issue.url);
    if (!item) {
      continue;
    }

    const domainOption = mapDomainOption(task.labels);
    const riskOption = mapRiskOption(task.labels);

    setSingleSelectField(project.id, item.id, fieldsByName.get('Domain'), domainOption);
    setSingleSelectField(project.id, item.id, fieldsByName.get('Risk Level'), riskOption);
    setSingleSelectField(
      project.id,
      item.id,
      fieldsByName.get('Requires Migration'),
      task.requires_migration ? 'Yes' : 'No'
    );
    setSingleSelectField(
      project.id,
      item.id,
      fieldsByName.get('Requires E2E'),
      task.requires_e2e ? 'Yes' : 'No'
    );

    if (newlyAddedTaskIds.has(task.id)) {
      const statusField = fieldsByName.get('Status');
      if (statusField && Array.isArray(statusField.options)) {
        const preferredStatus =
          statusField.options.find((option) => option.name.toLowerCase() === 'backlog')?.name ??
          statusField.options.find((option) => option.name.toLowerCase() === 'todo')?.name;

        if (preferredStatus) {
          setSingleSelectField(project.id, item.id, statusField, preferredStatus);
        }
      }
    }
  }
}

function findProject(ownerLogin, projectName) {
  const projectList = ghJson([
    'project',
    'list',
    '--owner',
    ownerLogin,
    '--limit',
    '100',
    '--format',
    'json'
  ]);

  return projectList.projects.find((candidate) => candidate.title === projectName && !candidate.closed);
}

function ensureProjectFields(ownerLogin, projectNumber, projectFields) {
  const existingFieldsData = ghJson([
    'project',
    'field-list',
    String(projectNumber),
    '--owner',
    ownerLogin,
    '--limit',
    '100',
    '--format',
    'json'
  ]);
  const existingByName = new Map(existingFieldsData.fields.map((field) => [field.name, field]));

  for (const field of projectFields) {
    if (field.name === 'Status') {
      continue;
    }

    const existing = existingByName.get(field.name);
    if (!existing) {
      const dataType = field.type.toUpperCase();
      const args = [
        'project',
        'field-create',
        String(projectNumber),
        '--owner',
        ownerLogin,
        '--name',
        field.name,
        '--data-type',
        dataType === 'SINGLE_SELECT' ? 'SINGLE_SELECT' : dataType
      ];

      if (dataType === 'SINGLE_SELECT' && Array.isArray(field.options)) {
        args.push('--single-select-options', field.options.join(','));
      }

      ghWrite(args);
      continue;
    }

    if (existing.type === 'ProjectV2SingleSelectField' && Array.isArray(field.options)) {
      const optionNames = new Set(existing.options.map((option) => option.name));
      const missingOptions = field.options.filter((option) => !optionNames.has(option));
      if (missingOptions.length > 0) {
        console.log(
          `Warning: project field '${field.name}' is missing options (${missingOptions.join(', ')}). Add them manually in GitHub UI.`
        );
      }
    }
  }
}

function addIssuesToProject(ownerLogin, projectNumber, roadmapTasks, issueByTaskId) {
  const existingItems = loadProjectItemMap(ownerLogin, projectNumber);
  const newlyAddedTaskIds = new Set();

  for (const task of roadmapTasks) {
    const issue = issueByTaskId.get(task.id);
    if (!issue) {
      continue;
    }

    if (existingItems.has(issue.url)) {
      continue;
    }

    try {
      ghWrite([
        'project',
        'item-add',
        String(projectNumber),
        '--owner',
        ownerLogin,
        '--url',
        issue.url
      ]);
      newlyAddedTaskIds.add(task.id);
    } catch (error) {
      if (String(error.message).includes('already exists')) {
        continue;
      }
      throw error;
    }
  }

  return newlyAddedTaskIds;
}

function loadProjectItemMap(ownerLogin, projectNumber) {
  const itemsData = ghJson([
    'project',
    'item-list',
    String(projectNumber),
    '--owner',
    ownerLogin,
    '--limit',
    '500',
    '--format',
    'json'
  ]);

  const itemByIssueUrl = new Map();
  for (const item of itemsData.items) {
    if (item.content && item.content.url) {
      itemByIssueUrl.set(item.content.url, item);
    }
  }

  return itemByIssueUrl;
}

function mapDomainOption(labels) {
  const map = {
    'domain:tenancy': 'Tenancy',
    'domain:auth': 'Auth',
    'domain:catalog': 'Catalog',
    'domain:visualizer': 'Visualizer',
    'domain:scheduling': 'Scheduling',
    'domain:billing': 'Billing',
    'domain:admin': 'Admin',
    'domain:ci': 'CI'
  };

  for (const label of labels) {
    if (map[label]) {
      return map[label];
    }
  }

  return null;
}

function mapRiskOption(labels) {
  if (labels.includes('p0')) {
    return 'Critical';
  }
  if (labels.includes('p1')) {
    return 'High';
  }
  if (labels.includes('p2')) {
    return 'Medium';
  }

  return null;
}

function setSingleSelectField(projectId, itemId, field, optionName) {
  if (!field || !optionName || !Array.isArray(field.options)) {
    return;
  }

  const matchedOption = field.options.find(
    (option) => option.name.toLowerCase() === optionName.toLowerCase()
  );

  if (!matchedOption) {
    if (verbose) {
      console.log(`Skipping '${field.name}' update. Option '${optionName}' does not exist.`);
    }
    return;
  }

  ghWrite([
    'project',
    'item-edit',
    '--id',
    itemId,
    '--project-id',
    projectId,
    '--field-id',
    field.id,
    '--single-select-option-id',
    matchedOption.id
  ]);
}
