# landing-page

## Purpose

TBD


### Requirement: Hero section uses Tailwind and maintains visual parity

The system SHALL render the Hero section using Tailwind utility classes instead of the current `.hero`, `.hero-content`, `.hero-text`, `.hero-badge`, `.hero-title`, `.hero-subtitle`, `.hero-actions`, `.hero-visual`, `.hero-floating-pill`, `.hero-image-frame`, `.hero-image` CSS classes. Visual appearance SHALL match the original.

#### Scenario: Hero renders on mobile

- **WHEN** the landing page loads at 375px width
- **THEN** the hero image, badge text, heading, subtitle, and CTA buttons appear
- **AND** the layout matches the current visual appearance (stacked vertically, full-width)

#### Scenario: Hero renders on desktop

- **WHEN** the landing page loads at 1024px width
- **THEN** the hero content is side-by-side (text left, image right)
- **AND** floating pills are positioned as decorative elements

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

#### Scenario: Age guide tabs function correctly

- **WHEN** user clicks a different age tab
- **THEN** the corresponding panel content displays (becoming visible)
- **AND** the active tab is visually highlighted with the primary color
- **AND** only one panel is visible at a time

#### Scenario: Age guide tabs show filtered products

- **WHEN** user clicks the "Bebê (0-12m)" tab
- **THEN** the tips and description are shown as editorial content
- **AND** relevant products for that age range are loaded from the API

### Requirement: Gallery section uses Tailwind grid

The system SHALL render the Gallery section using Tailwind grid classes instead of `.gallery-grid`, `.gallery-item`, and related CSS classes. Complex spanning rules (some items span 2 rows) SHALL use inline `style` or arbitrary Tailwind values.

#### Scenario: Gallery grid renders with varying item sizes

- **WHEN** the gallery section renders
- **THEN** certain items span 2 rows for visual interest
- **AND** the grid is responsive (2 columns on mobile, 3 on tablet, 4 on desktop)

### Requirement: Testimonials section uses shadcn Card components

The system SHALL render the Depoimentos (testimonials) section using shadcn/ui Card components instead of `.testimonials-grid`, `.testimonial-card` CSS classes.

#### Scenario: Testimonial cards render

- **WHEN** the testimonials section renders
- **THEN** each testimonial appears as a Card with quote text, author name, and star rating
- **AND** cards are arranged in a responsive grid (1 column mobile, 2-3 desktop)

### Requirement: WhatsApp CTA section uses Tailwind and shadcn Button

The system SHALL render the WhatsApp call-to-action section using Tailwind utilities and shadcn/ui Button component instead of `.whatsapp-section`, `.whatsapp-card`, `.whatsapp-features` CSS classes.

#### Scenario: WhatsApp section renders

- **WHEN** the WhatsApp CTA section renders
- **THEN** it shows a centered card with heading, description, feature checkmarks, and a prominent WhatsApp button
- **AND** the button links to the WhatsApp number with a pre-filled message

### Requirement: All custom CSS animations are preserved

The system SHALL preserve the existing custom keyframe animations (`float`, `fadeSlideUp`, `morphBlob`, `floatWA`) from the original CSS. These SHALL remain in `globals.css` or be added to Tailwind's animation config.

#### Scenario: Hero animations play

- **WHEN** the landing page loads
- **THEN** the hero decorations animate with float, fadeSlideUp, and morphBlob keyframes
- **AND** the WhatsApp floating button animates with floatWA

### Requirement: Products API integration on landing page

The landing page SHALL fetch products from `/api/produtos?ativos=true` on initial render using `useEffect`. While loading, skeleton placeholders SHALL be shown. On error, the hardcoded fallback data SHALL be used.

#### Scenario: Products load successfully

- **WHEN** the landing page mounts and API responds with products
- **THEN** highlights and category sections display products from the database

#### Scenario: Loading state shows skeletons

- **WHEN** the API request is in progress
- **THEN** skeleton cards are shown in place of product cards

### Requirement: WhatsApp floating button uses shadcn Button variant

The system SHALL render the floating WhatsApp button using a shadcn/ui Button with the `whatsapp` variant, positioned fixed bottom-right. The animation `floatWA` SHALL still apply.

#### Scenario: Floating WhatsApp button on mobile

- **WHEN** the landing page renders on mobile
- **THEN** a round WhatsApp button is fixed at bottom-right (above the bottom nav)
- **AND** it gently bobs up and down with the floatWA animation
