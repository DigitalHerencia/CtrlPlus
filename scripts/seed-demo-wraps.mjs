import { loadEnvConfig } from '@next/env'
import sharp from 'sharp'
import { createHash } from 'crypto'
import { mkdir, rm, writeFile } from 'fs/promises'
import path from 'path'
import { createRequire } from 'module'

loadEnvConfig(process.cwd())

const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const DEMO_CATEGORY = {
    name: 'Demo Wraps',
    slug: 'demo-wraps',
}

const DEMO_WRAP_DEFINITIONS = [
    {
        name: 'Arctic White',
        slug: 'arctic-white',
        description: 'A clean white wrap for baseline catalog and visualizer checks.',
        price: 180000,
        installationMinutes: 240,
        color: '#f5f5f4',
    },
    {
        name: 'Graphite Black',
        slug: 'graphite-black',
        description: 'A dark neutral wrap for contrast and asset pipeline validation.',
        price: 195000,
        installationMinutes: 255,
        color: '#111111',
    },
    {
        name: 'Signal Red',
        slug: 'signal-red',
        description: 'A saturated red wrap for strong thumbnail and preview contrast.',
        price: 210000,
        installationMinutes: 270,
        color: '#dc2626',
    },
    {
        name: 'Ocean Blue',
        slug: 'ocean-blue',
        description: 'A deep blue wrap for catalog browse and vehicle preview checks.',
        price: 220000,
        installationMinutes: 285,
        color: '#1d4ed8',
    },
    {
        name: 'Sage Green',
        slug: 'sage-green',
        description: 'A muted green wrap for testing softer catalog imagery.',
        price: 200000,
        installationMinutes: 260,
        color: '#15803d',
    },
    {
        name: 'Sunset Orange',
        slug: 'sunset-orange',
        description: 'A warm orange wrap for visualizer and catalog differentiation.',
        price: 215000,
        installationMinutes: 275,
        color: '#ea580c',
    },
    {
        name: 'Steel Gray',
        slug: 'steel-gray',
        description: 'A medium gray wrap for neutral asset and filter testing.',
        price: 190000,
        installationMinutes: 250,
        color: '#4b5563',
    },
    {
        name: 'Cobalt Pulse',
        slug: 'cobalt-pulse',
        description: 'A bright cobalt wrap for loading and selection-state validation.',
        price: 225000,
        installationMinutes: 290,
        color: '#2563eb',
    },
]

function parseArgs(argv) {
    const options = {
        count: 8,
        logoPath: null,
        reset: true,
    }

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i]
        if (arg === '--count') {
            const next = Number(argv[i + 1])
            if (Number.isFinite(next)) {
                options.count = Math.min(8, Math.max(6, Math.trunc(next)))
            }
            i += 1
            continue
        }

        if (arg === '--logo') {
            options.logoPath = argv[i + 1] ?? null
            i += 1
            continue
        }

        if (arg === '--no-reset') {
            options.reset = false
        }
    }

    return options
}

function hexToRgb(hex) {
    const normalized = hex.replace('#', '')
    return {
        r: Number.parseInt(normalized.slice(0, 2), 16),
        g: Number.parseInt(normalized.slice(2, 4), 16),
        b: Number.parseInt(normalized.slice(4, 6), 16),
    }
}

function rgbToCss(rgb) {
    return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`
}

function contrastColor(hex) {
    const { r, g, b } = hexToRgb(hex)
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    return luminance > 0.62 ? '#111111' : '#f5f5f5'
}

function escapeXml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
}

function contentHash(buffer) {
    return createHash('sha256').update(buffer).digest('hex')
}

async function ensureDir(filePath) {
    await mkdir(path.dirname(filePath), { recursive: true })
}

async function writePng(filePath, buffer) {
    await ensureDir(filePath)
    await writeFile(filePath, buffer)
}

async function createHeroCard(definition, labelSuffix = 'Demo Wrap') {
    const background = hexToRgb(definition.color)
    const foreground = contrastColor(definition.color)
    const accent = foreground === '#111111' ? '#404040' : '#ffffff'

    const svg = Buffer.from(`
        <svg width="1600" height="1200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255,255,255,0.10)"/>
              <stop offset="100%" stop-color="rgba(0,0,0,0.18)"/>
            </linearGradient>
          </defs>
          <rect width="1600" height="1200" fill="${rgbToCss(background)}"/>
          <rect width="1600" height="1200" fill="url(#shadow)"/>
          <rect x="72" y="72" width="1456" height="1056" rx="44" fill="none" stroke="${foreground}" stroke-opacity="0.28" stroke-width="4"/>
          <rect x="108" y="108" width="250" height="58" rx="18" fill="${foreground}" fill-opacity="0.12"/>
          <text x="132" y="149" fill="${foreground}" font-size="28" font-family="Arial, sans-serif" font-weight="700" letter-spacing="4">${escapeXml(labelSuffix)}</text>
          <text x="108" y="900" fill="${foreground}" font-size="80" font-family="Arial, sans-serif" font-weight="800">${escapeXml(definition.name)}</text>
          <text x="108" y="968" fill="${foreground}" fill-opacity="0.82" font-size="32" font-family="Arial, sans-serif">${escapeXml(definition.description)}</text>
          <rect x="108" y="1012" width="248" height="16" rx="8" fill="${accent}" fill-opacity="0.35"/>
        </svg>
    `)

    return sharp({
        create: {
            width: 1600,
            height: 1200,
            channels: 4,
            background: definition.color,
        },
    })
        .composite([{ input: svg }])
        .png()
        .toBuffer()
}

async function createTextureTile(definition, includeSubtleLabel = false) {
    const texture = sharp({
        create: {
            width: 2048,
            height: 2048,
            channels: 4,
            background: definition.color,
        },
    }).png()

    if (!includeSubtleLabel) {
        return texture.toBuffer()
    }

    const foreground = contrastColor(definition.color)
    const overlay = Buffer.from(`
        <svg width="2048" height="2048" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="transparent"/>
          <text x="1024" y="1088" text-anchor="middle" fill="${foreground}" fill-opacity="0.18" font-size="120" font-family="Arial, sans-serif" font-weight="800">${escapeXml(definition.name)}</text>
        </svg>
    `)

    return texture.composite([{ input: overlay }]).toBuffer()
}

async function createGalleryCard(definition) {
    const foreground = contrastColor(definition.color)
    const overlay = Buffer.from(`
        <svg width="1600" height="1000" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="transparent"/>
          <rect x="92" y="92" width="1416" height="816" rx="36" fill="none" stroke="${foreground}" stroke-opacity="0.26" stroke-width="4"/>
          <text x="120" y="196" fill="${foreground}" fill-opacity="0.86" font-size="42" font-family="Arial, sans-serif" font-weight="700">Gallery Asset</text>
          <text x="120" y="282" fill="${foreground}" font-size="72" font-family="Arial, sans-serif" font-weight="800">${escapeXml(definition.name)}</text>
          <text x="120" y="350" fill="${foreground}" fill-opacity="0.80" font-size="30" font-family="Arial, sans-serif">${escapeXml(definition.description)}</text>
        </svg>
    `)

    return sharp({
        create: {
            width: 1600,
            height: 1000,
            channels: 4,
            background: definition.color,
        },
    })
        .composite([{ input: overlay }])
        .png()
        .toBuffer()
}

async function deriveBrandPalette(logoPath) {
    const logoStats = await sharp(logoPath).stats()
    const dominant = logoStats.dominant ?? { r: 17, g: 24, b: 39 }

    return {
        background: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
        accent: `rgb(${Math.min(255, dominant.r + 36)} ${Math.min(255, dominant.g + 36)} ${Math.min(255, dominant.b + 36)})`,
    }
}

async function createBrandHeroCard(name, description, logoPath, palette) {
    const logoBuffer = await sharp(logoPath)
        .resize({ width: 520, withoutEnlargement: true })
        .png()
        .toBuffer()

    const svg = Buffer.from(`
        <svg width="1600" height="1200" xmlns="http://www.w3.org/2000/svg">
          <rect width="1600" height="1200" fill="${palette.background}"/>
          <rect x="72" y="72" width="1456" height="1056" rx="44" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="4"/>
          <text x="108" y="154" fill="rgba(255,255,255,0.72)" font-size="28" font-family="Arial, sans-serif" font-weight="700" letter-spacing="4">BRAND DEMO</text>
          <text x="108" y="912" fill="#ffffff" font-size="78" font-family="Arial, sans-serif" font-weight="800">${escapeXml(name)}</text>
          <text x="108" y="982" fill="rgba(255,255,255,0.82)" font-size="32" font-family="Arial, sans-serif">${escapeXml(description)}</text>
          <rect x="108" y="1030" width="246" height="14" rx="7" fill="${palette.accent}" fill-opacity="0.55"/>
        </svg>
    `)

    return sharp({
        create: {
            width: 1600,
            height: 1200,
            channels: 4,
            background: palette.background,
        },
    })
        .composite([{ input: svg }, { input: logoBuffer, left: 540, top: 320 }])
        .png()
        .toBuffer()
}

async function createBrandTexture(logoPath, palette) {
    const logoBuffer = await sharp(logoPath)
        .resize({ width: 780, withoutEnlargement: true })
        .png()
        .toBuffer()

    const foreground = '#ffffff'
    const svg = Buffer.from(`
        <svg width="2048" height="2048" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${palette.background}"/>
          <rect x="160" y="160" width="1728" height="1728" rx="72" fill="none" stroke="${foreground}" stroke-opacity="0.18" stroke-width="4"/>
          <text x="1024" y="1600" text-anchor="middle" fill="${foreground}" fill-opacity="0.18" font-size="96" font-family="Arial, sans-serif" font-weight="800">BRANDED TEXTURE</text>
        </svg>
    `)

    return sharp({
        create: {
            width: 2048,
            height: 2048,
            channels: 4,
            background: palette.background,
        },
    })
        .composite([{ input: svg }, { input: logoBuffer, left: 634, top: 634 }])
        .png()
        .toBuffer()
}

async function buildSeedFileSet(definition, rootDir) {
    const heroBuffer = await createHeroCard(definition)
    const textureBuffer = await createTextureTile(definition, false)
    const galleryBuffer = await createGalleryCard(definition)

    const baseDir = path.join(rootDir, definition.slug)
    const heroPath = path.join(baseDir, 'hero.png')
    const texturePath = path.join(baseDir, 'texture.png')
    const galleryPath = path.join(baseDir, 'gallery.png')

    await Promise.all([
        writePng(heroPath, heroBuffer),
        writePng(texturePath, textureBuffer),
        writePng(galleryPath, galleryBuffer),
    ])

    return {
        hero: {
            path: heroPath,
            url: `/uploads/wraps/demo-seed/${definition.slug}/hero.png`,
            buffer: heroBuffer,
        },
        texture: {
            path: texturePath,
            url: `/uploads/wraps/demo-seed/${definition.slug}/texture.png`,
            buffer: textureBuffer,
        },
        gallery: {
            path: galleryPath,
            url: `/uploads/wraps/demo-seed/${definition.slug}/gallery.png`,
            buffer: galleryBuffer,
        },
    }
}

async function buildBrandFileSet(logoPath, rootDir) {
    const palette = await deriveBrandPalette(logoPath)
    const heroBuffer = await createBrandHeroCard(
        'Brand Spectrum',
        'Logo-derived demo wrap for visualizer testing.',
        logoPath,
        palette
    )
    const textureBuffer = await createBrandTexture(logoPath, palette)

    const baseDir = path.join(rootDir, 'brand-spectrum')
    const heroPath = path.join(baseDir, 'hero.png')
    const texturePath = path.join(baseDir, 'texture.png')

    await Promise.all([writePng(heroPath, heroBuffer), writePng(texturePath, textureBuffer)])

    return {
        definition: {
            name: 'Brand Spectrum',
            slug: 'brand-spectrum',
            description: 'Logo-derived demo wrap for visualizer pipeline testing.',
            price: 240000,
            installationMinutes: 300,
            color: '#111827',
        },
        hero: {
            path: heroPath,
            url: `/uploads/wraps/demo-seed/brand-spectrum/hero.png`,
            buffer: heroBuffer,
        },
        texture: {
            path: texturePath,
            url: `/uploads/wraps/demo-seed/brand-spectrum/texture.png`,
            buffer: textureBuffer,
        },
    }
}

async function removeExistingSeedData(seedNames) {
    const existingWraps = await prisma.wrap.findMany({
        where: { name: { in: seedNames } },
        select: { id: true },
    })

    if (existingWraps.length > 0) {
        await prisma.wrap.deleteMany({
            where: { id: { in: existingWraps.map((wrap) => wrap.id) } },
        })
    }

    await prisma.wrapCategory.deleteMany({
        where: { slug: DEMO_CATEGORY.slug },
    })
}

async function ensureDemoCategory() {
    const existing = await prisma.wrapCategory.findFirst({
        where: { slug: DEMO_CATEGORY.slug },
        select: { id: true },
    })

    if (existing) {
        return existing
    }

    return prisma.wrapCategory.create({
        data: DEMO_CATEGORY,
        select: { id: true },
    })
}

async function seedWrap(definition, categoryId, fileSet) {
    const wrap = await prisma.wrap.create({
        data: {
            name: definition.name,
            description: definition.description,
            price: definition.price,
            installationMinutes: definition.installationMinutes,
            isHidden: false,
            aiPromptTemplate: null,
            aiNegativePrompt: null,
        },
        select: {
            id: true,
            name: true,
        },
    })

    const imageSpecs = [
        {
            url: fileSet.hero.url,
            kind: 'hero',
            isActive: true,
            displayOrder: 0,
            buffer: fileSet.hero.buffer,
        },
        {
            url: fileSet.texture.url,
            kind: 'visualizer_texture',
            isActive: true,
            displayOrder: 1,
            buffer: fileSet.texture.buffer,
        },
    ]

    if (fileSet.gallery) {
        imageSpecs.splice(1, 0, {
            url: fileSet.gallery.url,
            kind: 'gallery',
            isActive: true,
            displayOrder: 1,
            buffer: fileSet.gallery.buffer,
        })
        imageSpecs[2].displayOrder = 2
    }

    await prisma.$transaction([
        prisma.wrapCategoryMapping.create({
            data: {
                wrapId: wrap.id,
                categoryId,
            },
        }),
        ...imageSpecs.map((image) =>
            prisma.wrapImage.create({
                data: {
                    wrapId: wrap.id,
                    url: image.url,
                    kind: image.kind,
                    isActive: image.isActive,
                    version: 1,
                    contentHash: contentHash(image.buffer),
                    displayOrder: image.displayOrder,
                },
            })
        ),
    ])

    return wrap
}

async function main() {
    const options = parseArgs(process.argv.slice(2))
    const selectedDefinitions = DEMO_WRAP_DEFINITIONS.slice(0, options.count)
    const seedNames = [...selectedDefinitions.map((item) => item.name)]
    const seedRoot = path.join(process.cwd(), 'public', 'uploads', 'wraps', 'demo-seed')
    if (options.logoPath) {
        seedNames.push('Brand Spectrum')
    }

    if (options.reset) {
        await removeExistingSeedData(seedNames)
        await rm(seedRoot, { recursive: true, force: true })
    }

    const category = await ensureDemoCategory()

    await mkdir(seedRoot, { recursive: true })

    let brandConfig = null
    if (options.logoPath) {
        try {
            const brandPath = path.resolve(options.logoPath)
            brandConfig = await buildBrandFileSet(brandPath, seedRoot)
        } catch {
            brandConfig = null
        }
    }

    const results = []
    for (const definition of selectedDefinitions) {
        const fileSet = await buildSeedFileSet(definition, seedRoot)
        const wrap = await seedWrap(definition, category.id, fileSet)
        results.push({ name: wrap.name, assets: ['hero', 'texture', 'gallery'] })
    }

    if (brandConfig) {
        const wrap = await seedWrap(brandConfig.definition, category.id, {
            hero: brandConfig.hero,
            texture: brandConfig.texture,
        })
        results.push({ name: wrap.name, assets: ['hero', 'texture'] })
    }

    process.stdout.write('Seeded demo wraps:\n')
    for (const item of results) {
        process.stdout.write(`- ${item.name} (${item.assets.join(', ')})\n`)
    }
}

main()
    .catch((error) => {
        console.error(error instanceof Error ? error.message : error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
