import { promises as fs } from 'fs'
import path from 'path'

// Enforce that `.copilot/instructions/*.instructions.md` files are scoped with
// an `applyTo` frontmatter so they are not auto-applied globally.

const INSTRUCTIONS_DIR = path.join('.copilot', 'instructions')

const domainGlobs: Record<string, string[]> = {
  admin: ['**/admin/**'],
  'auth-authz': ['**/auth**', '**/authz/**'],
  billing: ['**/billing/**'],
  catalog: ['**/catalog/**'],
  platform: ['**/platform/**'],
  scheduling: ['**/scheduling/**'],
  settings: ['**/settings/**'],
  testing: ['**/test/**', '**/tests/**'],
  visualizer: ['**/visualizer/**'],
}

function recommendGlobs(name: string) {
  const key = name.toLowerCase()
  if (domainGlobs[key]) return domainGlobs[key]
  return [`**/${key}/**`]
}

async function run() {
  try {
    const files = await fs.readdir(INSTRUCTIONS_DIR)
    const changed: string[] = []
    for (const f of files) {
      if (!f.endsWith('.instructions.md')) continue
      const p = path.join(INSTRUCTIONS_DIR, f)
      const raw = await fs.readFile(p, 'utf8')
      let body = raw
      let front = ''
      if (raw.startsWith('---')) {
        const end = raw.indexOf('\n---', 3)
        if (end !== -1) {
          front = raw.slice(0, end + 4)
          body = raw.slice(end + 4)
        }
      }

      const hasApply = /applyTo\s*:\s*/.test(front)
      const hasGlobalApply = /applyTo\s*:\s*['\"]?\*\*\/\*\*['\"]?/.test(front)

      if (hasApply && !hasGlobalApply) continue // already scoped

      const name = f.replace('.instructions.md', '')
      const globs = recommendGlobs(name)

      const newFront = ['---', 'applyTo:']
        .concat(globs.map((g) => `  - '${g}'`))
        .concat(['---', ''])
        .join('\n')

      const newContent = newFront + body
      await fs.writeFile(p, newContent, 'utf8')
      changed.push(p)
    }

    if (changed.length) {
      console.log('Updated instruction scope for files:')
      for (const c of changed) console.log(' -', c)
      process.exit(0)
    } else {
      console.log('No instruction files required scoping changes.')
      process.exit(0)
    }
  } catch (err) {
    console.error('Error enforcing instruction scope:', err)
    process.exit(2)
  }
}

run()
