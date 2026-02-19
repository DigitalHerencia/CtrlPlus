# CTRL+ Visual System Specification
Version: 1.0.0
Status: Locked
Intended Consumers: Frontend Engineers, Design Systems, Codex / GPT Coding Agents
Scope: Landing Page and Marketing Visual Assets
Location Context: El Paso, Texas

## 1. Brand Identity
### 1.1 Logo Usage
- Use the existing boxed horizontal wordmark logo.
- Allowed placements: hero and building signage visuals.
- Do not use the business name in headline copy.
- Keep clear space equal to the height of the letter `C`.

## 2. Color System
### 2.1 Tokens
| Token | Hex | Usage |
| --- | --- | --- |
| `--color-bg-primary` | `#0E1A3A` | Primary background |
| `--color-accent-primary` | `#1F46E0` | UI frame border, primary controls |
| `--color-accent-secondary` | `#1234B5` | Secondary accents |
| `--color-text-primary` | `#F8F9FB` | Primary text |
| `--color-decorative` | `#D8DBF4` | Decorative shapes only |

### 2.2 Non-Negotiable Rules
- No gradients.
- No drop shadows.
- No bevel or emboss.
- Flat color only.

## 3. Typography
### 3.1 Font Family
- Primary: `Inter Tight`
- Fallback: `ui-sans-serif, system-ui, sans-serif`

### 3.2 Headline Rules
- Uppercase only.
- Font weight `700`.
- Letter spacing `0.024em`.
- Line height range `0.95` to `1.0`.

### 3.3 Subtext Rules
- Sentence case.
- Font weight `500`.
- Letter spacing `0.005em`.

### 3.4 Prohibited Type Choices
- Serif headline styles.
- Mixed font families.
- Decorative typefaces.

## 4. Environment Constraints
### 4.1 Required Setting
- El Paso, Texas context.
- Franklin Mountains silhouette or desert-industrial backdrop.
- Blue hour or warm desert sunset lighting.

### 4.2 Vehicles
- Allowed: Ford F-150, Chevy Silverado, Dodge Charger, Toyota Camry, Mercedes Sprinter Van.
- Prohibited: exotic supercars, showroom interiors, luxury dealership aesthetics.

## 5. Vehicle Wrap Requirements
- Every approved vehicle visual must clearly show at least one: satin color change, matte vs gloss contrast, geometric partial wrap, or commercial fleet graphics.
- Required visible characteristics: hard graphic edges, panel seam logic, layer transitions, vinyl texture differentiation.
- If surface treatment looks like paint instead of wrap, reject.

## 6. Layout Pattern
### 6.1 Base Structure
- Background token: `#0E1A3A`.
- Left side: headline block.
- Right side: image inside cobalt UI frame.

### 6.2 UI Frame Specs
- Border: `2px #1F46E0`
- Radius: `18px`
- Top bar height: `40px`
- Controls: minimal square, flat
- Optional: bottom progress pill
- No shadows
- No gradients

## 7. Approved Section Messaging
- Hero headline: `PRECISION VINYL INSTALLATION`
- Hero subtext: `Commercial - Color Change - Fleet Graphics`
- Fleet headline: `FLEET BRANDING SYSTEMS`
- Color change headline: `SATIN & MATTE COLOR TRANSFORMS`
- Window tint headline: `PROFESSIONAL WINDOW TINT`

## 8. Decorative Elements
- Abstract curved shapes only.
- Color token: `#D8DBF4`.
- Opacity range: `5%` to `8%`.
- Must not intersect headline text.
- Use sparingly.

## 9. Engineering Notes
### 9.1 Canonical Token Source
- `docs/design/system.tokens.v1.json`

### 9.2 Canonical Runtime Files
- `app/globals.css`
- `postcss.config.mjs`

### 9.3 Tailwind v4 Requirements
- `app/globals.css` must remain the Tailwind entrypoint.
- Design tokens must be declared in `@theme` inside `app/globals.css`.
- Source scanning must be declared with `@source` directives inside `app/globals.css`.

### 9.4 Frame Component Pattern
```tsx
<UIWindow>
  <TopBar />
  <Image />
  <BottomIndicator />
</UIWindow>
```

## 10. Rejection Criteria
- Uses gradients.
- Uses non-approved vehicles.
- Uses non-El Paso visual context.
- Uses vague lifestyle copy.
- Reads like a luxury supercar campaign.
- Fails to show wrap-specific material characteristics.

## 11. Tone and Positioning
- Represents: commercial discipline, West Texas credibility, precision installation, fleet capability.
- Does not represent: lifestyle luxury, influencer car culture, exotic car branding.

## 12. Change Control
- Scope includes ads, social, landing sections, and display creatives.
- All future assets must follow the token system, typography rules, layout pattern, and El Paso context.
- Changes require version increment and manifest update.
