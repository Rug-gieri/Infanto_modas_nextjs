## ADDED Requirements

### Requirement: Fixed bottom navigation bar on mobile

The system SHALL render a fixed bottom navigation bar on viewports smaller than `md` breakpoint (768px by default). The bar SHALL contain four navigation items: Home, Products, Cart, Account. The current page's icon SHALL be highlighted with the primary color.

#### Scenario: Mobile user sees bottom nav

- **WHEN** the viewport is 375px wide (mobile phone)
- **THEN** a fixed bar at the bottom of the screen shows 4 icons with labels
- **AND** the Home icon is highlighted when on the home page

#### Scenario: Desktop user does not see bottom nav

- **WHEN** the viewport is 1024px wide (desktop)
- **THEN** the bottom navigation bar SHALL be hidden (display: none or md+ breakpoint hide)

### Requirement: Bottom nav items link to main sections

Each item in the bottom navigation bar SHALL link to the corresponding page:
- **Home**: `/` (landing page)
- **Products**: `/produtos` (products listing)
- **Cart**: Opens a Sheet drawer from the right (cart contents)
- **Account**: `/conta` (user account page)

#### Scenario: User taps Products icon

- **WHEN** user taps the Products icon on the bottom nav
- **THEN** the browser navigates to `/produtos`

#### Scenario: User taps Cart icon

- **WHEN** user taps the Cart icon
- **THEN** a Sheet drawer slides in from the right showing cart contents
- **AND** the URL does not change (stay on current page)

### Requirement: Mobile hamburger menu uses shadcn Sheet

The system SHALL replace the current CSS-based hamburger menu (`.mobile-menu`, `.hamburger`) with a shadcn/ui Sheet component. The Sheet SHALL slide in from the right edge and contain the full navigation links: Início, Categorias, Destaques, Guia por Idade, Galeria, Cadastro.

#### Scenario: User opens mobile menu

- **WHEN** user taps the hamburger icon on mobile
- **THEN** a Sheet slides in from the right with navigation links
- **AND** the background is dimmed with an overlay
- **AND** tapping a link closes the Sheet and navigates

#### Scenario: User closes mobile menu

- **WHEN** the mobile menu Sheet is open
- **AND** user taps the overlay or the X button
- **THEN** the Sheet slides out to the right

### Requirement: Sheet-based cart drawer on all viewports

The system SHALL provide a cart drawer using Sheet component. On mobile, it opens from the right edge triggered by the bottom nav Cart icon. On desktop, it opens from the right edge triggered by a cart icon in the top navbar.

#### Scenario: Desktop user opens cart

- **WHEN** user clicks the cart icon in the top navbar on desktop
- **THEN** a Sheet slides in from the right edge showing cart contents
- **AND** the sheet is narrower (max-w-sm) than on mobile (full-width)

### Requirement: Mobile filter drawer for products

The system SHALL provide a filter drawer using Sheet component that slides from the bottom on mobile, triggered from the products page. Desktop SHALL use a sidebar filter panel instead.

#### Scenario: Mobile user opens filters

- **WHEN** user taps "Filtrar" button on the products page on mobile
- **THEN** a Sheet slides up from the bottom containing filter options (categories, age range, brands)
- **AND** the Sheet takes up ~80% of the viewport height
