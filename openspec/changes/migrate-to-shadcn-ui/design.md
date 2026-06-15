## Context

Infanto Modas is a Next.js 14 App Router project for a children's clothing e-commerce store. Currently it has a landing page, a registration form (cadastro), and a basic admin page. All styling lives in a single 1954-line `app/globals.css` with 7 CSS custom properties, BEM-like class naming, and no framework. The project uses TypeScript, React 18, and PostgreSQL via the `pg` library.

The site is Portuguese (pt-BR), solo developer, targeting mobile-first shoppers via WhatsApp commerce.

## Goals / Non-Goals

**Goals:**
- Establish a design system with semantic color, typography, spacing, and radius tokens
- Provide reusable, accessible UI primitives (Button, Card, Sheet, Table, Form, etc.)
- Rewrite all existing components to use Tailwind utilities + shadcn/ui with visual parity
- Add mobile-first bottom navigation with Sheet-based drawers
- Provide a distinct bubblegum theme for admin CRM pages
- Shrink globals.css to ~50 lines (directives + themes + animations)

**Non-Goals:**
- Dark mode (explicitly deferred)
- Products/cart/payment/orders/account pages (separate changes after foundation)
- Authentication system (separate change)
- Removing React or switching to Server Components-only (keep existing patterns)
- SEO or metadata changes

## Decisions

### 1. Tailwind CSS + shadcn/ui over other frameworks

**Chosen**: Tailwind CSS with shadcn/ui (New York style)
**Alternatives considered**:
- **CSS Modules**: Built into Next.js, zero config, but no design system enforcement, no utility classes, manual theming
- **Styled Components**: Runtime CSS-in-JS, conflicts with React Server Components, heavier bundle
- **Sass**: Still global-scoped, doesn't solve the organization problem
- **Panda CSS / Vanilla Extract**: Zero-runtime, but steeper learning curve, smaller ecosystem than Tailwind

**Rationale**: Tailwind provides utility-first rapid development with built-in design system constraints. shadcn/ui adds production-quality accessible components that live in our codebase (not a node_modules dependency). The combination is the most popular Next.js stack, with excellent documentation and community support. New York style chosen for larger border-radius (0.75rem) and cleaner aesthetic that fits a fashion brand.

### 2. CSS Custom Properties for theming (not Tailwind class variants)

**Chosen**: shadcn/ui's CSS variable approach (CSS custom properties in `:root` and theme classes)
**Alternatives considered**:
- **Tailwind `dark:` / theme variants**: Works for dark mode but not arbitrary theme switching
- **CSS-in-JS theme provider**: Runtime overhead, dependency

**Rationale**: shadcn/ui already uses CSS variables for its theme. Adding a second theme is as simple as defining a `.theme-bubblegum` class that overrides the same variables. No runtime JavaScript needed. Both themes are in `globals.css`.

### 3. Two theme variants: main (New York rose/mint) and admin (bubblegum)

**Chosen**: Scoped CSS class approach — `.theme-main` on main layout, `.theme-bubblegum` on admin layout
**Alternatives considered**:
- **Single theme everywhere**: Admin blends in, less visual distinction
- **CSS-in-JS ThemeProvider**: More complex, runtime cost

**Rationale**: Admin pages need distinct visual identity so it's clear you're in the admin area. Bubblegum theme uses hotter pinks and rounder corners. Both variants share the same CSS variable names (--primary, --secondary, etc.) with different values, so components render correctly under either theme.

### 4. Component migration strategy: one component at a time

**Chosen**: Sequential migration — rewrite one component's JSX + delete its CSS from globals.css, verify, commit
**Alternatives considered**:
- **Big bang rewrite**: Risk of regressions, hard to verify
- **Keep old CSS + add Tailwind alongside**: Duplicate styles, confusing

**Rationale**: Each component is independent (they don't share CSS except through globals.css). By migrating one at a time, we can verify visual parity after each step. The old CSS class is removed from globals.css only when its component is fully migrated.

### 5. shadcn/ui components: copy-paste (not npm dependency)

**Chosen**: `npx shadcn-ui@latest add` which copies source into `components/ui/`
**Rationale**: This is shadcn/ui's design philosophy. Components are ours to modify. No version lock-in from npm. We can customize them to match the brand identity (rounded corners, color usage, typography) by editing the source directly.

### 6. Google Fonts via next/font (not CSS @import)

**Chosen**: `next/font/google` with `Playfair_Display` and `Nunito`
**Alternatives considered**:
- **Keep @import in globals.css**: Works but causes FOUT, no font optimization
- **Self-host fonts**: More control but more work, no clear benefit

**Rationale**: `next/font/google` is the Next.js recommended approach. It provides automatic font optimization, eliminates layout shift, and handles subset loading. The current `@import` approach causes flash of unstyled text (FOUT).

### 7. Mobile bottom navigation over hamburger-only

**Chosen**: Fixed bottom bar on mobile (<md breakpoint) with Sheet-based drawers
**Alternatives considered**:
- **Hamburger only** (current): Worse conversion on mobile e-commerce
- **Tab bar at top**: Less reachable on larger phones

**Rationale**: E-commerce best practice — bottom navigation is more accessible on mobile (thumb reach). The Sheet component provides native-feeling slide-in drawers for cart, filters, and full navigation menu. Desktop keeps the existing top navbar pattern.

### 8. Color token fix: --charcoal from blue to actual dark

**Chosen**: Change `--charcoal` from `#3ca7ee` to `#2D2D2D`
**Rationale**: The name "charcoal" implies a dark gray. The current value `#3ca7ee` is a bright blue, likely a typo or misconfiguration. A proper dark foreground color is needed for readable text. The existing blue usage (if any) will be mapped to a new token or to `--accent`.

## Risks / Trade-offs

- **[Risk] Visual regression during migration** → Mitigation: One component at a time, verify in browser after each. Keep the old globals.css classes until their component is migrated.
- **[Risk] shadcn/ui init overwrites globals.css** → Mitigation: Back up current globals.css before running init. Review the diff carefully. Merge custom animations and themes into the new file.
- **[Risk] Tailwind utility class verbosity in JSX** → Mitigation: Extract repeated patterns into shadcn/ui component variants or Tailwind `@apply` in globals.css for very common patterns.
- **[Risk] Two themes add maintenance burden** → Mitigation: Both themes share the same variable structure. Changing a component's design only requires editing one set of variables. The themes are side-by-side in globals.css, ~20 lines each.
- **[Trade-off] Learning curve for Tailwind** → Acceptable. The initial setup takes a few hours, but subsequent development is faster. Solo developer, no team to train.

## Migration Plan

### Phase 1: Foundation (no visual change yet)
1. Install Tailwind CSS, PostCSS, autoprefixer
2. Run `npx shadcn-ui@latest init` (New York, Neutral base)
3. Back up and compare the generated globals.css
4. Merge custom themes (main + bubblegum) into globals.css
5. Install Google Fonts via next/font/google
6. Add first shadcn components (button, card, sheet, badge, separator)
7. Verify `npm run build` passes

### Phase 2: Component migration (incremental)
8. Migrate components one at a time, smallest first:
   - AnnouncementBar → Navbar → Footer → WhatsAppButton → Gallery → Testimonials → CadastroForm
9. After each: delete that component's CSS from globals.css, verify visual parity
10. Migrate page.tsx (landing page) — the largest task
11. Migrate admin/page.tsx with bubblegum theme

### Phase 3: New patterns
12. Add BottomNav component
13. Create admin/layout.tsx with bubblegum theme wrapper
14. Create shop route group layout

### Phase 4: Verification
15. Full build, visual check at 375px / 768px / 1024px

### Rollback
- All changes are in git. Revert to previous commit.
- Old globals.css is preserved in git history.
- No database changes, no API changes.

## Open Questions

None. All design decisions have been resolved through exploration.
