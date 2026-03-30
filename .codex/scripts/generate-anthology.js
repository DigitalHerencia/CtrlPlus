const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outDir = path.join(root, '.codex')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/T/, '_').split('.')[0]
const outPath = path.join(outDir, `codebase-anthology-${timestamp}.md`)

const folders = ['types','schemas','lib','prisma']
const extMap = {
  '.ts':'ts', '.tsx':'tsx', '.js':'js', '.jsx':'jsx', '.json':'json', '.md':'markdown', '.prisma':'prisma', '.css':'css', '.scss':'scss', '.html':'html', '.yaml':'yaml', '.yml':'yaml', '.sql':'sql', '.txt':'text'
}

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir, { withFileTypes: true })
  for (const ent of list) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules') continue
      results = results.concat(walk(full))
    } else if (ent.isFile()) {
      results.push(full)
    }
  }
  return results
}

let allFiles = []
for (const f of folders) {
  const full = path.join(root, f)
  if (fs.existsSync(full)) {
    allFiles = allFiles.concat(walk(full))
  }
}
allFiles = allFiles.sort()

let out = ''
out += '---\n'
out += `generatedAt: ${timestamp}\n`
out += `sourceFolders: [${folders.join(', ')}]\n`
out += '---\n\n'
out += `# Codebase anthology - ${timestamp}\n\n`

if (allFiles.length === 0) {
  out += '> No files found in specified folders.\n'
} else {
  out += '## Table of contents\n\n'
  for (const file of allFiles) {
    const rel = file.replace(root, '').replace(/\\/g, '/')
    const anchor = rel.replace(/[^a-zA-Z0-9\-_/]/g, '').replace(/\//g, '-').replace(/^[-]+/,'').toLowerCase()
    out += `- [${rel}](#${anchor})\n`
  }
  out += '\n---\n'
  for (const file of allFiles) {
    const rel = file.replace(root, '').replace(/\\/g, '/')
    const anchor = rel.replace(/[^a-zA-Z0-9\-_/]/g, '').replace(/\//g, '-').replace(/^[-]+/,'').toLowerCase()
    out += `\n## ${rel}\n\n`
    const ext = path.extname(file).toLowerCase()
    const lang = extMap[ext] || ''
    out += `\n\`\`\`${lang}\n`
    try {
      const content = fs.readFileSync(file, 'utf8')
      out += content + '\n'
    } catch (err) {
      out += `# FAILED TO READ: ${err.message}\n`
    }
    out += `\`\`\`\n`
  }
}

fs.writeFileSync(outPath, out, 'utf8')
console.log('WROTE:' + outPath)
