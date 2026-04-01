#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'

// Simple heuristic token estimator for large instruction sets.
// Tokens ~= Math.ceil(chars / 4) (approx. for GPT-family models)

const argv = process.argv.slice(2)
const args = {}
for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
        const [k, v] = a.replace(/^--/, '').split('=')
        args[k] = v ?? true
    }
}

// Default to scanning only the repository-local agent directories to avoid
// unintentionally scanning parent-drive or user-level instruction trees.
const defaultPaths = ['.copilot']
const paths = (args.paths ? String(args.paths).split(',') : defaultPaths)
    .map((p) => p.trim())
    .filter(Boolean)
const threshold = Number(args.threshold ?? 128000)

const textExt = new Set([
    '.md',
    '.mdx',
    '.yaml',
    '.yml',
    '.json',
    '.txt',
    '.prompt.md',
    '.instructions.md',
    '.agent.md',
    'SKILL.md',
])

function isTextFile(file) {
    const name = path.basename(file).toLowerCase()
    if (
        name.endsWith('.prompt.md') ||
        name.endsWith('.instructions.md') ||
        name.endsWith('.agent.md') ||
        name === 'skill.md'
    )
        return true
    const ext = path.extname(file).toLowerCase()
    return textExt.has(ext)
}

async function walkAndCollect(root) {
    const stats = {
        files: 0,
        bytes: 0,
        tokenEstimate: 0,
        entries: [],
    }

    async function visit(p) {
        try {
            const st = await fs.stat(p)
            if (st.isFile()) {
                if (!isTextFile(p)) return
                const content = await fs.readFile(p, 'utf8')
                const bytes = Buffer.byteLength(content, 'utf8')
                const tokens = Math.ceil(bytes / 4)
                stats.files += 1
                stats.bytes += bytes
                stats.tokenEstimate += tokens
                stats.entries.push({ path: p, bytes, tokens })
            } else if (st.isDirectory()) {
                const items = await fs.readdir(p)
                for (const item of items) {
                    if (item === 'node_modules' || item === '.git') continue
                    await visit(path.join(p, item))
                }
            }
        } catch (err) {
            // ignore missing paths
        }
    }

    await visit(root)
    return stats
}

async function analyze() {
    let totalTokens = 0
    const results = []
    for (const p of paths) {
        const resolved = path.resolve(p)
        try {
            const st = await fs.stat(p)
            if (st.isFile()) {
                const content = await fs.readFile(p, 'utf8')
                const bytes = Buffer.byteLength(content, 'utf8')
                const tokens = Math.ceil(bytes / 4)
                results.push({ path: p, type: 'file', bytes, tokens })
                totalTokens += tokens
            } else if (st.isDirectory()) {
                const stats = await walkAndCollect(p)
                results.push({
                    path: p,
                    type: 'dir',
                    files: stats.files,
                    bytes: stats.bytes,
                    tokens: stats.tokenEstimate,
                })
                totalTokens += stats.tokenEstimate
            }
        } catch (err) {
            // path doesn't exist or inaccessible
            results.push({ path: p, missing: true })
        }
    }

    console.log('\nPrompt size estimation report')
    console.log('=================================\n')
    for (const r of results) {
        if (r.missing) {
            console.log(`MISSING: ${r.path}`)
            continue
        }
        if (r.type === 'file') {
            console.log(`FILE: ${r.path} — ${r.bytes} bytes ≈ ${r.tokens} tokens`)
        } else {
            console.log(`DIR:  ${r.path} — ${r.files} files, ${r.bytes} bytes ≈ ${r.tokens} tokens`)
        }
    }
    console.log('\nTOTAL ESTIMATED PROMPT TOKENS: ' + totalTokens + '\n')
    console.log('Threshold:', threshold, 'tokens')
    if (totalTokens > threshold) {
        console.error(
            `\nERROR: estimated prompt token count (${totalTokens}) exceeds threshold (${threshold}).`
        )
        process.exit(2)
    }
    process.exit(0)
}

analyze().catch((err) => {
    console.error(err)
    process.exit(3)
})
