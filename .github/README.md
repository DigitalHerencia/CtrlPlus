# 🤖 Copilot Resources

**PATH: "C:\Users\scree\AppData\Roaming\Code\User\prompts"**

## 🚀 What is it?

This directory provides a comprehensive toolkit for enhancing GitHub Copilot with specialized:

- **👉** [**Awesome Agents**](docs/README.agents.md) - Specialized GitHub Copilot agents that integrate with MCP servers to provide enhanced capabilities for specific workflows and tools
- **👉** [**Awesome Instructions**](docs/README.instructions.md) - Comprehensive coding standards and best practices that apply to specific file patterns or entire projects
- **👉** [**Awesome Hooks**](docs/README.hooks.md) - Automated workflows triggered by specific events during development, testing, and deployment
- **👉** [**Awesome Agentic Workflows**](docs/README.workflows.md) - AI-powered repository automations that run coding agents in GitHub Actions with natural language instructions
- **👉** [**Awesome Skills**](docs/README.skills.md) - Self-contained folders with instructions and bundled resources that enhance AI capabilities for specialized tasks
- **👉** [**Awesome Plugins**](docs/README.plugins.md) - Curated plugins of related agents and skills organized around specific themes and workflows
- **👉** [**Awesome Cookbook Recipes**](cookbook/README.md) - Practical, copy-paste-ready code snippets and real-world examples for working with GitHub Copilot tools and features

## 🌟 Featured Plugins

Discover our curated plugins of agents and skills organized around specific themes and workflows.

| Name                                                 | Description                                                                                                                                                                                                      | Items    | Tags                                                                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| [Awesome Copilot](plugins/awesome-copilot/README.md) | Meta skills that help you discover and generate curated GitHub Copilot agents, collections, instructions, and skills.                                                                                            | 5 items  | github-copilot, discovery, meta, prompt-engineering, agents                                                   |
| [Copilot SDK](plugins/copilot-sdk/README.md)         | Build applications with the GitHub Copilot SDK across multiple programming languages. Includes comprehensive instructions for C#, Go, Node.js/TypeScript, and Python to help you create AI-powered applications. | 5 items  | copilot-sdk, sdk, csharp, go, nodejs, typescript, python, ai, github-copilot                                  |
| [Partners](plugins/partners/README.md)               | Custom agents that have been created by GitHub partners                                                                                                                                                          | 20 items | devops, security, database, cloud, infrastructure, observability, feature-flags, cicd, migration, performance |

## 📄 llms.txt

An [`llms.txt`](https://awesome-copilot.github.com/llms.txt) file following the [llmstxt.org](https://llmstxt.org/) specification is available on the GitHub Pages site. This machine-readable file makes it easy for Large Language Models to discover and understand all available agents, instructions, and skills, providing a structured overview of the repository's resources with names and descriptions.

## 🔧 How to Use

### 🔌 Plugins

Plugins are installable packages that bundle related agents and skills, making it easy to install a curated set of resources.

#### Installing Plugins

First, add the Awesome Copilot marketplace to your Copilot CLI:

```bash
copilot plugin marketplace add github/awesome-copilot
```

Then install any plugin:

```bash
copilot plugin install <plugin-name>@awesome-copilot
```

Alternatively, you can use the `/plugin` command within a Copilot chat session to browse and install plugins interactively.

### 🤖 Custom Agents

Custom agents can be used in Copilot coding agent (CCA), VS Code, and Copilot CLI (coming soon). For CCA, when assigning an issue to Copilot, select the custom agent from the provided list. In VS Code, you can activate the custom agent in the agents session, alongside built-in agents like Plan and Agent.

### 🎯 Skills

Skills are self-contained folders with instructions and bundled resources that enhance AI capabilities for specialized tasks. They can be accessed through the GitHub Copilot interface or installed via plugins.

### 📋 Instructions

Instructions automatically apply to files based on their patterns and provide contextual guidance for coding standards, frameworks, and best practices.

### 🪝 Hooks

Hooks enable automated workflows triggered by specific events during GitHub Copilot coding agent sessions (like sessionStart, sessionEnd, userPromptSubmitted). They can automate tasks like logging, auto-committing changes, or integrating with external services.

### ⚡ Agentic Workflows

[Agentic Workflows](https://github.github.com/gh-aw) are AI-powered repository automations that run coding agents in GitHub Actions. Defined in markdown with natural language instructions, they enable event-triggered and scheduled automation — from issue triage to daily reports.

## 🎯 Why Use?

- **Productivity**: Pre-built agents and instructions save time and provide consistent results.
- **Best Practices**: Benefit from community-curated coding standards and patterns.
- **Specialized Assistance**: Access expert-level guidance through specialized custom agents.
- **Continuous Learning**: Stay updated with the latest patterns and practices across technologies.

## 📖 Directory Structure

```plaintext
├── instructions/     # Coding standards and best practices (.instructions.md)
├── agents/           # AI personas and specialized modes (.agent.md)
├── hooks/            # Automated hooks for Copilot coding agent sessions
├── workflows/        # Agentic Workflows for GitHub Actions automation
├── plugins/          # Installable plugins bundling related items
├── docs/             # Documentation and guides
└── skills/           # AI capabilities for specialized tasks
```
