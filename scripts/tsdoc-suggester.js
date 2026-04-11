#!/usr/bin/env node
/*
 * Lightweight TSDoc suggestion helper.
 * Scans for simple exported symbols and emits a suggestions JSON.
 * Optionally applies conservative comment templates (use with --apply).
 */

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, join, relative, sep, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT = resolve(__dirname, '..')
const USAGE = `Usage: node scripts/tsdoc-suggester.js [--dry-run] [--apply]

--dry-run  (default) produce scripts/suggestions.json but do not edit files
--apply    apply conservative comment templates in-place (creates .bak files)
`

const argv = process.argv.slice(2)
const APPLY = argv.includes('--apply')
const DRY = !APPLY

// Support filtering by comma-separated include / exclude paths relative to repo root
// Usage: --include=types,lib/fetchers --exclude=lib/actions
const parseFlag = (name) => {
    const prefix = `--${name}=`
    const val = argv.find((a) => a.startsWith(prefix))
    return val ? val.slice(prefix.length) : null
}

const includesArg = parseFlag('include')
const excludesArg = parseFlag('exclude')
const INCLUDES = includesArg
    ? includesArg
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((p) => p.replace(/\\\\/g, '/'))
    : null
const EXCLUDES = excludesArg
    ? new Set(
          excludesArg
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
              .map((p) => p.replace(/\\\\/g, '/'))
      )
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

const suggestions = []

const exportRegex = /export\s+(type|interface|function|const|class|enum)\s+([A-Za-z0-9_]+)/

walk(ROOT, (file) => {
    if (!isTsFile(file)) return

    // normalize relative path using forward slashes for predictable matching
    const rel = relative(ROOT, file).split(sep).join('/')

    // apply include/exclude filters if provided
    if (INCLUDES) {
        const matches = INCLUDES.some((inc) => rel === inc || rel.startsWith(inc + '/'))
        if (!matches) return
    }

    if (EXCLUDES.size > 0) {
        for (const ex of EXCLUDES) {
            if (rel === ex || rel.startsWith(ex + '/')) return
        }
    }

    // avoid editing the scripts folder itself unless explicitly included
    if (rel.startsWith('scripts/') && !APPLY) return

    const raw = readFileSync(file, 'utf8')
    const lines = raw.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const m = line.match(exportRegex)
        if (!m) continue

        const kind = m[1]
        const name = m[2]

        // Look backwards to see if there's already a /** comment immediately above
        let j = i - 1
        while (j >= 0 && lines[j].trim() === '') j--
        const hasComment = j >= 0 && lines[j].trim().startsWith('/**')
        if (hasComment) continue

        const suggestion = buildTemplate(kind, name)
        suggestions.push({ file: rel, line: i + 1, kind, name, suggestion })
    }

    // Add a conservative top-of-file module header if the file exports anything
    // and does not already have a top JSDoc. Respect 'use client'/'use server' directives.
    const firstNonEmpty = lines.findIndex((l) => l.trim() !== '')
    let topDocExists = false
    if (firstNonEmpty >= 0) {
        if (lines[firstNonEmpty].trim().startsWith('/**')) topDocExists = true
    }
    const hasAnyExport = exportRegex.test(raw)
    if (!topDocExists && hasAnyExport) {
        let insertLine = 1
        if (firstNonEmpty >= 0) {
            const maybeDirective = lines[firstNonEmpty].trim()
            if (/^(['"])use (client|server)\1$/.test(maybeDirective)) insertLine = firstNonEmpty + 2
        }
        const parts = rel.split('/')
        const domain = parts[0] === 'lib' && parts.length > 1 ? parts[1] : parts[0]
        const moduleTemplate = buildModuleTemplate(domain)
        suggestions.push({
            file: rel,
            line: insertLine,
            kind: 'module',
            name: 'module',
            suggestion: moduleTemplate,
        })
    }
})

writeFileSync(join(ROOT, 'scripts', 'suggestions.json'), JSON.stringify(suggestions, null, 2))

console.log(`Found ${suggestions.length} suggestion(s). Wrote scripts/suggestions.json`)

if (APPLY && suggestions.length > 0) {
    // Group by file and apply edits from bottom to top per file
    const groups = suggestions.reduce((acc, s) => {
        acc[s.file] = acc[s.file] || []
        acc[s.file].push(s)
        return acc
    }, {})

    for (const [relFile, items] of Object.entries(groups)) {
        const file = join(ROOT, relFile)
        const raw = readFileSync(file, 'utf8')
        const lines = raw.split(/\r?\n/)

        // sort descending so earlier inserts don't shift later line numbers
        items.sort((a, b) => b.line - a.line)

        // backup
        const bak = file + '.bak'
        if (!existsSync(bak)) writeFileSync(bak, raw)

        for (const it of items) {
            const idx = it.line - 1
            // Insert suggestion above that line
            lines.splice(idx, 0, it.suggestion)
        }

        writeFileSync(file, lines.join('\n'))
        console.log(
            `Applied ${items.length} suggestion(s) to ${relFile} (backup: ${basename(bak)})`
        )
    }
}

function buildTemplate(kind, name) {
    if (kind === 'type' || kind === 'interface') {
        return `/**\n * ${name} — TODO: brief description of this type.\n * @description TODO: longer description of this type (optional)\n */`
    }

    if (kind === 'function') {
        return `/**\n * ${name} — TODO: brief description of this function.\n * @description TODO: longer description (optional)\n * @returns TODO: describe return value\n */`
    }

    if (kind === 'class') {
        return `/**\n * ${name} — TODO: brief description of this class.\n */`
    }

    // const, enum, fallback
    return `/**\n * ${name} — TODO: brief description.\n */`
}

if (DRY) process.exit(0)

function buildModuleTemplate(domain) {
    const capitalized =
        domain && domain.length ? domain.charAt(0).toUpperCase() + domain.slice(1) : 'Module'
    return `/**\n * @introduction ${capitalized} — TODO: brief one-line summary\n *\n * @description TODO: longer module description (1-2 sentences).\n * Domain: ${domain}\n * Public: TODO (yes/no)\n */`
}
