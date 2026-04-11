#!/usr/bin/env node
/*
 * Upgrade conservative module headers to include @introduction/@description
 * so the Dependency Graph extension can extract and display file info.
 *
 * Usage:
 *  node scripts/tsdoc-upgrade-to-intro.js --dry-run
 *  node scripts/tsdoc-upgrade-to-intro.js --apply --include=components,lib
 */

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, join, relative, sep, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

const argv = process.argv.slice(2)
const APPLY = argv.includes('--apply')
const DRY = !APPLY

const parseFlag = (name) => {
    const prefix = `--${name}=`
    const val = argv.find((a) => a.startsWith(prefix))
    return val ? val.slice(prefix.length) : null
}

const includesArg = parseFlag('include')
const excludesArg = parseFlag('exclude')
const INCLUDES = includesArg
    ? includesArg.split(',').map((s) => s.trim()).filter(Boolean).map((p) => p.replace(/\\/g, '/'))
    : null
const EXCLUDES = excludesArg
    ? new Set(excludesArg.split(',').map((s) => s.trim()).filter(Boolean).map((p) => p.replace(/\\/g, '/')))
    : new Set()

const IGNORES = new Set(['node_modules', '.git', '.next', 'dist', 'out'])

function walk(dir, cb) {
    for (const name of readdirSync(dir)) {
        if (IGNORES.has(name)) continue
        const full = join(dir, name)
        const stat = statSync(full)
        if (stat.isDirectory()) walk(full, cb)
        else cb(full)
    }
}

function isTsFile(p) {
    return p.endsWith('.ts') || p.endsWith('.tsx')
}

const matchesConservativeHeader = (commentLines) => {
    const text = commentLines.join('\n')
    return text.includes('TODO: brief module description') || text.includes('\n * Domain:')
}

function buildIntroModuleTemplate(domain, filename) {
    const capitalized = domain && domain.length ? domain.charAt(0).toUpperCase() + domain.slice(1) : 'Module'
    const brief = `${capitalized} — TODO: short one-line summary of ${filename}`
    return `/**\n * @introduction ${brief}\n *\n * @description TODO: longer description for ${filename}. Keep it short — one or two sentences.\n * Domain: ${domain}\n * Public: TODO (yes/no)\n */`
}

const modified = []

walk(ROOT, (file) => {
    if (!isTsFile(file)) return
    const rel = relative(ROOT, file).split(sep).join('/')

    if (INCLUDES) {
        const matches = INCLUDES.some((inc) => rel === inc || rel.startsWith(inc + '/'))
        if (!matches) return
    }
    if (EXCLUDES.size > 0) {
        for (const ex of EXCLUDES) if (rel === ex || rel.startsWith(ex + '/')) return
    }

    const raw = readFileSync(file, 'utf8')
    const lines = raw.split(/\r?\n/)
    const firstNonEmpty = lines.findIndex((l) => l.trim() !== '')
    if (firstNonEmpty < 0) return

    if (!lines[firstNonEmpty].trim().startsWith('/**')) return

    // collect comment block
    let end = firstNonEmpty
    while (end < lines.length && !lines[end].includes('*/')) end++
    if (end >= lines.length) return
    const commentBlock = lines.slice(firstNonEmpty, end + 1)

    if (!matchesConservativeHeader(commentBlock)) return

    const parts = rel.split('/')
    const domain = parts[0] === 'lib' && parts.length > 1 ? parts[1] : parts[0]
    const newTemplate = buildIntroModuleTemplate(domain, basename(file))

    if (DRY) {
        modified.push({ file: rel, old: commentBlock.join('\n'), suggestion: newTemplate })
        return
    }

    // apply replacement
    const bak = file + '.bak'
    if (!existsSync(bak)) writeFileSync(bak, raw)

    const before = lines.slice(0, firstNonEmpty)
    const after = lines.slice(end + 1)
    const newContents = [...before, newTemplate, ...after].join('\n')
    writeFileSync(file, newContents)
    modified.push({ file: rel })
    console.log(`Upgraded header in ${rel} (backup: ${basename(bak)})`)
})

if (DRY) {
    const out = join(ROOT, 'scripts', 'upgrade-suggestions.json')
    writeFileSync(out, JSON.stringify(modified, null, 2))
    console.log(`Dry-run: ${modified.length} file(s) would be upgraded. Wrote ${out}`)
} else {
    console.log(`Applied upgrades to ${modified.length} file(s).`)
}

process.exit(0)
