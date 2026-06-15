## Why

The project uses a single monolithic `app/globals.css` (1954 lines) with raw CSS classes and no design system. As the project expands from a landing page to a full e-commerce platform (products, cart, payment, orders, user accounts, admin CRM), this approach is unsustainable. We need a proper styling foundation before building the remaining pages.

## What Changes

- Install and configure Tailwind CSS + PostCSS as the styling foundation
- Install and configure shadcn/ui for reusable, accessible UI components
- Migrate the existing color palette into a proper design system with semantic tokens
- Fix incorrect color token: `--charcoal` is currently `#3ca7ee` (blue) — replace with actual dark charcoal `#2D2D2D`
- Use shadcn/ui **New York** style (cleaner, larger border-radius, premium feel) for the main site
- Use a **bubblegum/candy** theme variant for admin CRM pages (distinct visual identity)
- Rewrite all existing 7 components from plain CSS classes to Tailwind utilities + shadcn/ui components
- Shrink `globals.css` to ~50 lines (tailwind directives + custom animations + shadcn CSS variables)
- Add mobile-first bottom navigation bar (Home, Products, Cart, Account)
- Replace hamburger menu with Sheet component for mobile navigation

## Capabilities

### New Capabilities

- `design-system`: Unified design tokens (colors, typography, spacing, radii, shadows) defined in `tailwind.config.ts` and shadcn CSS variables. Two theme variants: default New York (rose/mint palette) and admin bubblegum (candy/pink).
- `ui-components`: Reusable UI primitives (Button, Card, Sheet, Table, Dialog, Form, Input, Select, Badge, etc.) via shadcn/ui, customized to match the brand identity.
- `mobile-navigation`: Fixed bottom navigation bar for mobile e-commerce flow. Uses Sheet component for drawers (cart, filters, hamburger menu). Replaces the current CSS hamburger + mobile menu implementation.
- `landing-page`: Rewritten landing page using Tailwind classes and shadcn/ui components. Mirrors existing Hero, Highlights, Age Guide, Gallery, Testimonials, and WhatsApp CTA sections with visual parity.
- `admin-theme`: Admin CRM pages use a distinct bubblegum theme with pink/candy visual identity, separate from the main site theme via CSS class scoping.

### Modified Capabilities

None. This is a greenfield styling migration with no existing spec-level capabilities to modify.

## Impact

- **Dependencies added**: `tailwindcss`, `postcss`, `autoprefixer`, `tailwind-merge`, `clsx`, `class-variance-authority`, `tailwindcss-animate`, `lucide-react`, shadcn/ui components
- **Files created**: `tailwind.config.ts`, `postcss.config.mjs`, `components/ui/*`, `lib/utils.ts`, `components.json`, `components/BottomNav.tsx`, `app/admin/layout.tsx`
- **Files heavily modified**: `app/globals.css` (1954→~50 lines), all 7 existing components, `app/page.tsx`, `app/admin/page.tsx`, `app/layout.tsx`
- **Breaking**: All existing `className` references will be replaced with Tailwind utilities. Old globals.css class definitions removed as components migrate.
