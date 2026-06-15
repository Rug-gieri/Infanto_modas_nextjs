## ADDED Requirements

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
