# admin-theme

## Purpose

TBD


### Requirement: Admin pages use bubblegum theme

The system SHALL render all pages under `/admin` with the `.theme-bubblegum` CSS class applied to their layout wrapper, overriding the default `.theme-main` colors with a pink/candy palette.

#### Scenario: Admin page renders with bubblegum colors

- **WHEN** user navigates to `/admin`
- **THEN** the primary color is a hot pink instead of rose-deep
- **AND** the background is a light pink instead of cream
- **AND** border-radius is larger (1rem) than the main site

#### Scenario: Main site is unaffected by bubblegum theme

- **WHEN** user navigates to `/` (landing page)
- **THEN** the page renders with the default rose/mint main theme
- **AND** no bubblegum colors are visible

### Requirement: Bubblegum theme has distinct color tokens

The bubblegum theme SHALL override the following CSS custom properties:
- `--primary`: Hot pink (e.g., #FF69B4 or similar candy pink)
- `--primary-foreground`: White
- `--secondary`: Light bubblegum pink (e.g., #FFB6C1)
- `--secondary-foreground`: Dark pink
- `--background`: Very light pink (e.g., #FFF0F5)
- `--foreground`: Dark charcoal (#2D2D2D)
- `--radius`: 1rem (rounder than main theme's 0.75rem)

#### Scenario: Admin button uses bubblegum primary

- **WHEN** a `<Button variant="default">` renders inside the bubblegum theme
- **THEN** the button background is hot pink instead of rose-deep

### Requirement: Admin login screen uses bubblegum theme

The system SHALL render the admin login page with bubblegum theme styling. The login form SHALL use shadcn/ui Card, Input, and Button components.

#### Scenario: Admin login renders

- **WHEN** an unauthenticated user navigates to `/admin`
- **THEN** a login card appears centered on the page
- **AND** the card, input, and button use bubblegum theme colors

### Requirement: Admin dashboard uses shadcn Table and Card components

The system SHALL render the admin dashboard (clientes list) using shadcn/ui Table and Card components instead of the current `.admin-dashboard`, `.stats-grid`, `.admin-search`, `.admin-table` CSS classes. The bubblegum theme SHALL apply to all admin components.

#### Scenario: Admin clientes table renders

- **WHEN** an authenticated admin views the clientes table
- **THEN** the table uses shadcn Table with bubblegum styling
- **AND** stat cards above the table use bubblegum-colored Card components
- **AND** the search input uses shadcn Input with bubblegum theme

### Requirement: Sidebar inherits bubblegum theme

The admin sidebar SHALL use the bubblegum theme colors: active item background uses `--primary` (hot pink), inactive items use `--muted-foreground`, the sidebar background uses `--background` (light pink).

#### Scenario: Sidebar renders with bubblegum colors

- **WHEN** the admin page renders the sidebar
- **THEN** the sidebar background is light pink
- **AND** the active navigation item has a hot pink background
- **AND** roundness follows `--radius: 1rem`

### Requirement: Admin dashboard cards use bubblegum theme

All cards (Dashboard metrics, Produtos, Pedidos, Clientes) in the admin SHALL use the bubblegum theme with appropriate card padding (Card `p-0` + CardContent `p-5` pattern from AGENTS.md).

#### Scenario: Dashboard cards render with bubblegum styling

- **WHEN** the admin views the Dashboard, Produtos, Pedidos, or Clientes section
- **THEN** all Card components use bubblegum colors (hot pink accents, light pink backgrounds)

### Requirement: Forms and tables in admin use bubblegum theme

All Input, Select, Button, Table, Badge, and Dialog components in the admin sections SHALL render with bubblegum theme colors consistent with the existing login and clientes pages.

#### Scenario: Produto form uses bubblegum inputs and buttons

- **WHEN** the admin opens the product creation form
- **THEN** the Input fields, select dropdowns, and submit Button use bubblegum theme styling
- **AND** the form layout is consistent with the existing admin login page

### Requirement: Bubblegum theme is defined in globals.css

The bubblegum theme CSS custom properties SHALL be defined in `app/globals.css` within a `.theme-bubblegum` class selector. This SHALL be alongside the `.theme-main` class, keeping both themes in one file for easy comparison and maintenance.

#### Scenario: Developer can find both themes in one file

- **WHEN** developer opens `app/globals.css`
- **THEN** both `.theme-main` and `.theme-bubblegum` definitions are visible
- **AND** they share the same CSS variable structure for consistency
