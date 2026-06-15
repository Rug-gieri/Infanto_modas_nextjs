## MODIFIED Requirements

### Requirement: Highlights section uses shadcn Card components

The system SHALL render the Destaques (highlights) section using shadcn/ui Card components and Tailwind grid classes. The product data SHALL be loaded from the public API endpoint `/api/produtos?ativos=true` instead of being hardcoded. If the API request fails, the system SHALL fall back to the original hardcoded data.

#### Scenario: Product cards render in a responsive grid with API data

- **WHEN** highlights section renders and API returns products
- **THEN** they display as cards in a responsive grid (2 columns on mobile, 4 on desktop)
- **AND** each card shows product image, badge, name, age range, and WhatsApp button
- **AND** the data comes from `/api/produtos?ativos=true`

#### Scenario: API fails, fallback to hardcoded data

- **WHEN** the API request to `/api/produtos?ativos=true` fails (network error or 500)
- **THEN** the highlights section displays the original 4 hardcoded products as a fallback

### Requirement: Age guide tabs use shadcn Tabs component

The system SHALL render the Guia por Idade section using shadcn/ui Tabs component. The product cards within each tab's content SHALL be loaded from the API filtered by `faixa_etaria` query parameter. The tab configuration (age ranges and their descriptions) SHALL remain hardcoded as editorial content.

#### Scenario: Age guide tabs show filtered products

- **WHEN** user clicks the "Bebê (0-12m)" tab
- **THEN** the tips and description are shown as editorial content
- **AND** relevant products for that age range are loaded from the API

## ADDED Requirements

### Requirement: Products API integration on landing page

The landing page SHALL fetch products from `/api/produtos?ativos=true` on initial render using `useEffect`. While loading, skeleton placeholders SHALL be shown. On error, the hardcoded fallback data SHALL be used.

#### Scenario: Products load successfully

- **WHEN** the landing page mounts and API responds with products
- **THEN** highlights and category sections display products from the database

#### Scenario: Loading state shows skeletons

- **WHEN** the API request is in progress
- **THEN** skeleton cards are shown in place of product cards
