# ui-components

## Purpose

TBD


### Requirement: shadcn/ui Button component is available

The system SHALL provide a Button component at `components/ui/button.tsx` with variants:
- `default`: Primary action, rose-deep background, white text
- `secondary`: Secondary action, mint background, charcoal text
- `outline`: Bordered, transparent background
- `whatsapp`: WhatsApp green (#25D366) with WhatsApp-specific styling
- `ghost`: Transparent with hover background
- `link`: Text-only with underline on hover

Each variant SHALL support at least 3 sizes: `default`, `sm`, `lg`.

#### Scenario: Primary CTA button renders

- **WHEN** a component renders `<Button variant="default">Comprar</Button>`
- **THEN** the button has rose-deep background, white text, and rounded corners matching `--radius`

#### Scenario: WhatsApp button renders

- **WHEN** a component renders `<Button variant="whatsapp">Falar no WhatsApp</Button>`
- **THEN** the button has #25D366 green background and WhatsApp icon

### Requirement: shadcn/ui Card component is available

The system SHALL provide a Card component at `components/ui/card.tsx` with subcomponents: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

#### Scenario: Product card renders

- **WHEN** a product card uses `<Card>` with image, title, and price
- **THEN** the card has warm-white background, border with brand border color, and shadow

### Requirement: shadcn/ui Sheet component is available

The system SHALL provide a Sheet component at `components/ui/sheet.tsx` for slide-in drawers from any edge (top, right, bottom, left).

#### Scenario: Mobile cart opens as right drawer

- **WHEN** user taps cart icon on mobile
- **THEN** a Sheet slides in from the right edge with cart contents
- **AND** the background is dimmed with an overlay

### Requirement: shadcn/ui Form components are available

The system SHALL provide Form components at `components/ui/form.tsx`, `input.tsx`, `checkbox.tsx` that integrate with React Hook Form or native form handling. Input component SHALL support validation states (error, success) with visual feedback.

#### Scenario: Registration form with validation

- **WHEN** user submits the cadastro form with invalid email
- **THEN** the email input shows a red border and error message below

### Requirement: shadcn/ui Table component is available

The system SHALL provide a Table component at `components/ui/table.tsx` for data display, primarily used in admin CRM pages.

#### Scenario: Admin clientes table renders

- **WHEN** admin page renders the clientes data
- **THEN** the table has proper headers, row dividers, and horizontal scroll on mobile

### Requirement: shadcn/ui Badge component is available

The system SHALL provide a Badge component at `components/ui/badge.tsx` for status indicators and labels (e.g., "Novo", "Mais vendido", stock status).

#### Scenario: Sale badge on product card

- **WHEN** a product has a "Novo" badge
- **THEN** it renders as a small colored pill in the top-left corner of the product image

### Requirement: shadcn/ui Tabs component is available

The system SHALL provide a Tabs component at `components/ui/tabs.tsx` for tabbed interfaces (age guide switching, account settings, admin sections).

#### Scenario: Age guide tabs switch content

- **WHEN** user clicks "4-6 anos" tab
- **THEN** that tab becomes active (styled with primary color)
- **AND** the corresponding age guide panel content displays

### Requirement: shadcn/ui Skeleton component is available

The system SHALL provide a Skeleton component at `components/ui/skeleton.tsx` for loading placeholders.

#### Scenario: Products loading state

- **WHEN** products page is fetching data
- **THEN** skeleton cards SHALL display as placeholders matching the product card layout

### Requirement: shadcn/ui Separator component is available

The system SHALL provide a Separator component at `components/ui/separator.tsx` for visual dividers between content sections.

#### Scenario: Divider between cart items

- **WHEN** cart has multiple items
- **THEN** a thin horizontal separator SHALL appear between each item row

### Requirement: shadcn/ui Dialog component is available

The system SHALL provide a Dialog component at `components/ui/dialog.tsx` for modal confirmations and overlays.

#### Scenario: Delete confirmation in admin

- **WHEN** admin clicks "delete" on a record
- **THEN** a Dialog modal SHALL appear with "Confirmar" and "Cancelar" buttons
