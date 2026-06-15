## ADDED Requirements

### Requirement: Brand color tokens are defined as Tailwind theme colors

The system SHALL define all brand colors as Tailwind theme colors in `tailwind.config.ts`, mapped to semantic naming (primary, secondary, accent, background, foreground, muted, border, destructive).

Colors from the existing palette:
- `rose` (#F2A7B8) → primary-300
- `rose-deep` (#E07A92) → primary-500
- `mint` (#A8D8C8) → secondary-400
- `cream` (#FDF8F3) → background
- `warm-white` (#FFFBF7) → card
- `gold` (#D4A847) → accent
- `soft-gray` (#9A8A8A) → muted-foreground
- `charcoal` (#2D2D2D) → foreground (fixed from #3ca7ee)
- `border` (#F0E4E8) → border
- `rose-light` (#FDE8EE) → primary-100
- `mint-light` (#E4F5F0) → secondary-100

#### Scenario: Developer uses brand color in component

- **WHEN** a component uses `text-primary-500` or `bg-primary-500`
- **THEN** the rendered color matches `#E07A92`

#### Scenario: Developer references a color not in the palette

- **WHEN** a developer tries `text-pink-700` (not a brand token)
- **THEN** the Tailwind compiler SHALL only generate that utility if the color exists in the config

### Requirement: Font families are loaded via next/font/google

The system SHALL load `Playfair Display` (weights 400, 600, 700) and `Nunito` (weights 300-700) via `next/font/google` in the root layout. These SHALL be available as CSS variables `--font-display` and `--font-body`.

#### Scenario: Page renders with correct fonts

- **WHEN** the root layout mounts
- **THEN** Playfair Display is applied to headings via `font-display` Tailwind class
- **AND** Nunito is applied to body text via `font-body` Tailwind class

### Requirement: Spacing, radius, and shadow scales are defined

The system SHALL define a consistent spacing scale (Tailwind default), border-radius scale (based on shadcn's `--radius` CSS variable at 0.75rem for New York style), and shadow scale via shadcn defaults.

#### Scenario: Component uses standard radius

- **WHEN** a component uses `rounded-lg`
- **THEN** the border-radius SHALL be computed from the `--radius` CSS variable (0.75rem * 0.5 for lg)

### Requirement: --charcoal color token is fixed

The existing `--charcoal` CSS custom property (currently `#3ca7ee`, a blue) SHALL be replaced with `#2D2D2D` (actual dark charcoal gray). Any existing usage that relied on the blue value SHALL be migrated to a different token.

#### Scenario: Body text color is dark

- **WHEN** the page renders with `color: var(--charcoal)` (now mapped to `--foreground`)
- **THEN** text is dark gray (`#2D2D2D`), not blue

### Requirement: Two theme variants exist via CSS classes

The system SHALL define two theme variants in `globals.css`:
- `.theme-main`: Default New York theme with rose primary and mint secondary colors
- `.theme-bubblegum`: Admin theme with hotter pink primary and bubblegum secondary colors, larger `--radius`

Each variant SHALL override the same CSS custom properties (`--primary`, `--secondary`, `--background`, etc.).

#### Scenario: Main site renders with main theme

- **WHEN** the root layout applies `.theme-main` to the `<body>` element
- **THEN** all components render with rose/mint color palette

#### Scenario: Admin page renders with bubblegum theme

- **WHEN** the admin layout applies `.theme-bubblegum` to its wrapper element
- **THEN** all admin components render with bubblegum pink/candy palette
- **AND** border-radius is larger than the main theme
