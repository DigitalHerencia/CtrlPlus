# Settings Page - Design & UX Guide

## Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│  SETTINGS                             Page Header            │
│  Profile Settings                  (WorkspacePageIntro)      │
│  Personalize how you run...                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  [Profile] [Account] [Data Export] [Documentation]          │
│                    Tab Navigation                          │
│            (WorkspacePageContextCard)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌─ User Preferences ─────────────────────────────────┐   │
│  │  Customize your interface and system defaults        │   │
│  │                                                      │   │
│  │  ◯ System      ◯ Light      ◯ Dark                │   │
│  │  Theme                                              │   │
│  │                                                      │   │
│  │  Timezone             [America/Denver          ]   │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ Contact Information ──────────────────────────────┐   │
│  │  How we'll reach you about wrap projects...          │   │
│  │                                                      │   │
│  │  Contact Name         [Jane Driver          ]       │   │
│  │  Contact Email*       [jane@example.com    ]       │   │
│  │  Contact Phone        [(555) 555-5555     ]       │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ Notification Preferences ────────────────────────┐   │
│  │  Control how and when we reach you                  │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────┐               │   │
│  │  │ Email notifications       ☑️ ON  │               │   │
│  │  └─────────────────────────────────┘               │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────┐               │   │
│  │  │ SMS notifications          ☐ OFF │               │   │
│  │  └─────────────────────────────────┘               │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────┐               │   │
│  │  │ Push notifications         ☐ OFF │               │   │
│  │  └─────────────────────────────────┘               │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ Billing Address ─────────────────────────────────┐   │
│  │  Used for invoicing and payment correspondence      │   │
│  │                                                      │   │
│  │  Address Line 1       [123 Main Street      ]       │   │
│  │  Address Line 2       [Suite 200 (optional)]       │   │
│  │                                                      │   │
│  │  City                 [Denver    ]                  │   │
│  │  State                [CO        ]                  │   │
│  │  Postal Code          [80202     ]                  │   │
│  │  Country              [US        ]                  │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ Vehicle Preferences ─────────────────────────────┐   │
│  │  Set your default wrap vehicle for project setup    │   │
│  │                                                      │   │
│  │  Make                 [Ford      ]                  │   │
│  │  Model                [Mustang   ]                  │   │
│  │  Year                 [2022      ]                  │   │
│  │  Trim                 [EcoBoost  ]                  │   │
│  │                                                      │   │
│  │                                    [Save Settings] │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ Security Settings ────────────────────────────────┐   │
│  │                                                      │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐ │   │
│  │  │ MFA                  │  │ Session security     │ │   │
│  │  │ Managed by Clerk     │  │ Server-authoritative │ │   │
│  │  └──────────────────────┘  └──────────────────────┘ │   │
│  │                                                      │   │
│  │  Credential and identity operations remain          │   │
│  │  managed by the auth provider.                      │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Color Palette

### Primary Actions

- **Button Background (Active)**: `bg-blue-600`
- **Button Hover**: `bg-blue-700`
- **Button Text**: `text-white`
- **Button Disabled**: `opacity-50`

### Text

- **Headings**: `text-neutral-100` (white-ish)
- **Primary Text**: `text-neutral-400` (lighter gray)
- **Secondary Text**: `text-neutral-500` (medium gray)
- **Muted**: `text-xs text-neutral-400`

### Containers

- **Group Background**: `bg-neutral-900/50` with `border-neutral-800`
- **Input Background**: `bg-neutral-800`
- **Input Placeholder**: `placeholder:text-neutral-500`
- **Page Background**: Default (dark gray/black)

### Accents

- **Focus/Active**: `blue-600`
- **Borders**: `border-neutral-700` or `border-neutral-800`
- **Separators**: `border-neutral-800`

## Spacing System

### Vertical Spacing

- **Between sections**: `space-y-6` (24px)
- **Within groups**: `space-y-4` (16px)
- **Within fields**: `space-y-2` (8px)
- **Padding in groups**: `p-5` (20px)

### Horizontal Spacing

- **Group padding**: `px-5` (20px)
- **Field grid gap**: `gap-2` (8px) for labels, `gap-4` (16px) for field cols
- **Tab gap**: `gap-2` (8px)

### Responsive Breakpoints

- **Mobile**: Full width, stacked
- **Tablet (md)**: 2-column grids for complex layouts
- **Desktop**: 2-column for billing/vehicle, full-width for simple forms

## Form Field Components

### Standard Field

```
┌─────────────────────────────┐
│ Label (optional)     *      │  ← Label with required indicator
│ [Input field placeholder]   │  ← Input with dark background
│ Error message if present    │  ← Error text in red
└─────────────────────────────┘
```

### Toggle Field

```
┌──────────────────────────────────────────┐
│ Email notifications              ☑️ ON   │  ← Label left, toggle right
└──────────────────────────────────────────┘
```

### Radio Field

```
◯ System     ◯ Light     ◯ Dark
```

## Tab Navigation

```
┌───────────────────────────────────────────────────┐
│ [Profile] [Account] [Data Export] [Documentation]│
└───────────────────────────────────────────────────┘
    ↑        ↑
Active Tab  Inactive Tab
(blue-600)  (outline style)
```

### Tab States

- **Active**: `bg-blue-600 text-white`
- **Inactive**: `bg-transparent border-neutral-700 text-neutral-400`
- **Hover**: Subtle background change

## Form Groups

Each section uses a card-style container:

```
┌─ Section Title ────────────────────────────────────┐
│ Optional subtitle description in smaller text       │
│                                                     │
│ [Input fields here]                                │
│ [More inputs]                                      │
│ [Additional content]                               │
│                                                     │
└──────────────────────────────────────────────────┘
```

**Styling**:

- Border: `border-neutral-800`
- Background: `bg-neutral-900/50`
- Corner radius: `rounded-lg`
- Padding: `p-5`
- Title: `text-sm font-semibold text-neutral-100`
- Subtitle: `text-xs text-neutral-400`

## Typography

### Headings

- **Page Title**: `text-3xl sm:text-4xl font-black` (WorkspacePageIntro)
- **Page Subtitle**: `text-base sm:text-base text-neutral-100`
- **Section Title**: `text-sm font-semibold text-neutral-100`
- **Description**: `text-xs text-neutral-400`

### Labels & Fields

- **Label**: `text-sm font-medium text-neutral-100`
- **Input Text**: `text-sm text-neutral-100`
- **Placeholder**: `text-sm text-neutral-500`
- **Help Text**: `text-xs text-neutral-400`
- **Error Text**: `text-xs text-red-500`

## Responsive Behavior

### Mobile (< 768px)

- Full-width layout
- Single column fields
- Stacked form groups
- Tab buttons wrap
- Padding: `px-4` (standard)

### Tablet & Desktop (≥ 768px)

- 2-column grids for related fields (billing address, vehicle)
- Side-by-side buttons if space available
- Increased padding
- Better vertical spacing

### Example: Billing Address

```
Mobile:
┌─────────────────────┐
│ Address Line 1      │
│ [________________] │
│ Address Line 2      │
│ [________________] │
│ City                │
│ [________________] │
│ State               │
│ [________________] │
└─────────────────────┘

Tablet/Desktop:
┌─────────────────────────────────────────────────┐
│ Address Line 1          │ Address Line 2         │
│ [________________]     │ [________________]     │
│ City                   │ State                  │
│ [________________]     │ [________________]     │
│ Postal Code            │ Country                │
│ [________________]     │ [________________]     │
└─────────────────────────────────────────────────┘
```

## Interaction States

### Buttons

- **Default**: Neutral outline style
- **Active**: Blue background with white text
- **Hover**: Background change with cursor pointer
- **Disabled**: Reduced opacity (50%)
- **Loading**: Spinner icon + disabled state

### Inputs

- **Default**: Dark background, neutral border
- **Focus**: Would typically add ring (browser default)
- **Filled**: Text visible, dark background
- **Error**: Red text below field
- **Disabled**: Reduced opacity

### Toggles

- **Checked**: Blue checkmark
- **Unchecked**: Empty checkbox
- **Hover**: Slight background highlight

## Accessibility Features

✅ **Color Contrast**: All text meets WCAG AA minimum
✅ **Labels**: All inputs have associated labels
✅ **Required Indicators**: Clear `*` marking required fields
✅ **Error Messages**: Clear and descriptive
✅ **Focus Management**: Natural tab order
✅ **Semantic HTML**: Proper form structure
✅ **ARIA**: Implicit roles used where appropriate

## Motion & Transitions

- **Button hover**: Instant background color change
- **Tab transitions**: Instant (no animation)
- **Form feedback**: Instant message display
- **No loading animations** on text inputs
- **Smooth transitions** where used: `transition-colors` on hover states

## Empty States

### No Exports Yet

```
┌─────────────────────────────────────────┐
│ You haven't requested any exports yet.   │
│ When you do, they'll appear here.        │
└─────────────────────────────────────────┘
```

### Documentation Section

Shows 6 doc links in responsive grid
Each link: Title, description, external link icon

## Success/Error Feedback

### Success Message

```
┌────────────────────────────────────┐
│ ✓ Settings saved successfully.     │
└────────────────────────────────────┘
```

- Border: `border-emerald-900/60`
- Background: `bg-emerald-950/30`
- Text: `text-emerald-100`

### Error Message

```
┌────────────────────────────────────┐
│ ! Unable to save settings.         │
└────────────────────────────────────┘
```

- Border: `border-red-900/60`
- Background: `bg-red-950/30`
- Text: `text-red-100`

---

_Visual design complete and production-ready._
