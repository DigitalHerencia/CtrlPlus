/**
 * @introduction Constants — TODO: short one-line summary of wrap-catalog.ts
 *
 * @description TODO: longer description for wrap-catalog.ts. Keep it short — one or two sentences.
 * Domain: constants
 * Public: TODO (yes/no)
 */
// Auto-generated from hf-space-CtrlPlus/*.json

/**
 * WRAP_CATALOG — TODO: brief description.
 */
export const WRAP_CATALOG = {
    wraps: [
        {
            id: 'arctic-gloss-satin-wrap',
            name: 'Arctic Gloss Satin Wrap',
            category: 'Stealth & Performance Finishes',
            description:
                'A crisp, premium white finish engineered to look cleaner than factory paint, with seamless panel continuity and a polished, showroom-level presence. Perfect for luxury vehicles seeking an understated yet sophisticated appearance.',
            design_traits: [
                'Pristine white finish',
                'Ultra-smooth reflective surface',
                'Seamless panel coverage',
                'Clean minimal aesthetic',
            ],
            best_for: ['Luxury vehicles', 'Resale prep', 'Minimal aesthetic builds'],
            style_prompt:
                'A vehicle fully wrapped in a pristine high-gloss white finish, ultra-smooth reflective surface with a factory paint appearance, seamless panel coverage with no visible edges or breaks, subtle soft reflections across body contours, clean minimal aesthetic with no graphics or decals, pure white color with slight depth and clearcoat-like shine, studio lighting emphasizing smooth curvature and reflections, premium automotive finish, highly polished, realistic material response, no texture noise, showroom-quality appearance. Anti-prompt: avoid any patterns or graphics on windows, headlights, taillights, rims, wheels, tires, grilles, exhaust tips, or any non-body-panel surfaces.',
            prompt_template:
                'Studio automotive concept render of a {vehicle}, exact {year} {make} {model} {trim}, three-quarter front angle matching catalog hero shot positioning with identical camera perspective and vehicle stance. {style_prompt}. Preserve the real production body shape, wheelbase, glasshouse, and OEM proportions. Vehicle positioned identically to catalog reference with same angle, lighting, and pose. Neutral studio background, premium lighting, photorealistic vehicle wrap visualization with perfect wrap reproduction accuracy.',
        },
        {
            id: 'midnight-stealth-matte-wrap',
            name: 'Midnight Stealth Matte Wrap',
            category: 'Stealth & Performance Finishes',
            description:
                'A dark, understated performance finish focused on body contour, form, and a stealthy low-reflection presence. Ideal for performance vehicles that demand sophistication without attention.',
            design_traits: [
                'Deep matte charcoal gray',
                'Even light diffusion',
                'No graphics or decals',
                'Aggressive minimal styling',
            ],
            best_for: ['Performance cars', 'Luxury builds', 'Executive styling'],
            style_prompt:
                'A vehicle wrapped in a deep matte charcoal gray finish, non-reflective satin surface that diffuses light evenly, soft shadows across body lines enhancing contours and form, smooth uniform coating with no gloss hotspots, no graphics or decals, stealth performance aesthetic, subtle dark gray tone with slight variation under lighting, premium matte automotive wrap material, minimalistic aggressive styling, studio lighting emphasizing shape rather than reflections. Anti-prompt: avoid any patterns or graphics on windows, headlights, taillights, rims, wheels, tires, grilles, exhaust tips, or any non-body-panel surfaces.',
            prompt_template:
                'Studio automotive concept render of a {vehicle}, exact {year} {make} {model} {trim}, three-quarter front angle matching catalog hero shot positioning with identical camera perspective and vehicle stance. {style_prompt}. Maintain real body surfacing and realistic wrap installation across all panels. Vehicle positioned identically to catalog reference with same angle, lighting, and pose. Neutral studio setting, photoreal, premium vehicle photography with perfect wrap reproduction accuracy.',
        },
        {
            id: 'ctrlplus-fleet-wrap',
            name: 'CTRL+',
            category: 'Fleet Identity Wraps',
            description:
                'A scalable, tech-forward brand system built around geometry, motion, gradients, and bold side-panel branding. Designed for modern businesses that want to stand out while maintaining professional credibility.',
            design_traits: [
                'Layered angular shapes',
                'Diagonal motion lines',
                'Blue gradient branding',
                'Large high-contrast typography',
            ],
            best_for: ['Fleet vehicles', 'Service vans', 'Tech-enabled businesses'],
            style_prompt:
                'A vehicle wrapped in a modern tech-inspired geometric design featuring layered angular shapes and diagonal motion lines, bold blue gradient color system transitioning from deep navy to bright electric blue, crisp white accents and sharp edge overlays, large high-contrast sans-serif typography integrated into the side panels with clean readable text, clean vector-style graphics with precise edges, dynamic forward-moving composition, high readability branding, smooth satin finish base with semi-gloss graphic elements, professional fleet branding aesthetic, balanced negative space, studio lighting. Anti-prompt: avoid any patterns or graphics on windows, headlights, taillights, rims, wheels, tires, grilles, exhaust tips, or any non-body-panel surfaces. Wrap patterns applied only to exterior body panels with perfect alignment and professional installation quality.',
            prompt_template:
                'Studio automotive concept render of a {vehicle}, exact {year} {make} {model} {trim}, three-quarter front angle matching catalog hero shot positioning with identical camera perspective and vehicle stance. {style_prompt}. Keep the wrap professionally aligned across doors, quarter panels, and body seams with realistic branding placement. Vehicle positioned identically to catalog reference with same angle, lighting, and pose. Photorealistic fleet mockup, clean studio background with perfect wrap reproduction accuracy and crisp text rendering.',
        },
        {
            id: 'inferno-commercial-wrap',
            name: 'Inferno',
            category: 'Commercial Branding Wraps',
            description:
                'An aggressive flame-based commercial wrap built for maximum visibility, color impact, and street-level recall. Perfect for businesses that need to make a bold statement and be unforgettable.',
            design_traits: [
                'High-energy fire textures',
                'Hyper-saturated hot palette',
                'Oversized typography',
                'Full-body coverage',
            ],
            best_for: ['Food trucks', 'Product launches', 'Experiential marketing'],
            style_prompt:
                'A vehicle fully wrapped in an intense flame-themed design with high-energy fire textures flowing across the entire surface, hyper-saturated reds, oranges, yellows, and hints of neon green, dynamic heatwave distortion patterns, glowing ember highlights and layered flame depth, bold oversized typography integrated into the design with high-contrast readable text, aggressive high-contrast composition, full-body coverage with no empty space, glossy finish enhancing color intensity, dramatic lighting emphasizing the flames, chaotic but controlled visual flow, maximum visual impact, street-level advertising style. Anti-prompt: avoid any patterns or graphics on windows, headlights, taillights, rims, wheels, tires, grilles, exhaust tips, or any non-body-panel surfaces. Flame patterns applied only to exterior body panels with professional installation quality and perfect text legibility.',
            prompt_template:
                'Studio automotive concept render of a {vehicle}, exact {year} {make} {model} {trim}, three-quarter front angle matching catalog hero shot positioning with identical camera perspective and vehicle stance. {style_prompt}. Preserve realistic panel alignment, wheel openings, door seams, and wrap continuity. Vehicle positioned identically to catalog reference with same angle, lighting, and pose. Photorealistic high-impact commercial vehicle mockup with dramatic but controlled studio lighting and perfect wrap reproduction accuracy.',
        },
    ],
} as const
