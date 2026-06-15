## 1. Foundation Setup

- [x] 1.1 Install Tailwind CSS, PostCSS, and autoprefixer: `npm install -D tailwindcss postcss autoprefixer`
- [x] 1.2 Run `npx tailwindcss init -p` to generate `tailwind.config.ts` and `postcss.config.mjs`
- [x] 1.3 Configure Tailwind content paths in `tailwind.config.ts` to scan `app/**/*.{ts,tsx}`, `components/**/*.{ts,tsx}` (Tailwind v4 uses CSS-based config, no content paths needed)
- [x] 1.4 Run `npx shadcn@latest init` — style: base-nova (New York equivalent), Neutral base color, CSS variables enabled
- [x] 1.5 Install shadcn dependencies: `npm install tailwind-merge clsx class-variance-authority tw-animate-css lucide-react` (installed by shadcn init)
- [x] 1.6 Verify `components.json`, `lib/utils.ts`, and `components/ui/` directory were created

## 2. Design System Configuration

- [x] 2.1 Define brand color tokens in `:root` + `@theme inline` in globals.css (rose, rose-deep → primary; mint → secondary; cream → background; charcoal → foreground; gold → accent)
- [x] 2.2 Configure font families in `@theme inline` (font-display: Playfair Display, font-body: Nunito)
- [x] 2.3 Configure `--radius` CSS variable in globals.css to 0.75rem (New York style)
- [x] 2.4 Fix `--charcoal` token: change from `#3ca7ee` to `#2D2D2D` in the color mapping
- [x] 2.5 Add `tw-animate-css` imported by shadcn init automatically
- [x] 2.6 Back up current `app/globals.css` as `app/globals.css.bak`

## 3. Theme Variants

- [x] 3.1 Create `.theme-main` CSS class in `globals.css` with rose/mint palette (primary: rose-deep, secondary: mint, background: cream, etc.)
- [x] 3.2 Create `.theme-bubblegum` CSS class in `globals.css` with candy pink palette (primary: #FF69B4, secondary: #FFB6C1, background: #FFF0F5, --radius: 1rem)
- [x] 3.3 Ensure both `.theme-main` and `.theme-bubblegum` override the same shadcn CSS variable names (--primary, --secondary, --background, --foreground, --muted, --border, --radius, etc.)

## 4. Google Fonts Setup

- [x] 4.1 Import Playfair Display and Nunito via `next/font/google` in `app/layout.tsx`
- [x] 4.2 Set font CSS variables (`--font-display`, `--font-body`) on the body element
- [x] 4.3 Remove Google Fonts `@import` statements from globals.css
- [x] 4.4 Verify fonts load correctly in dev mode (build passes)

## 5. Core shadcn/ui Components

- [x] 5.1 Add shadcn Button component: already created by `shadcn init` (base-ui/react button)
- [x] 5.2 Add shadcn Card component: `npx shadcn@latest add card`
- [x] 5.3 Add shadcn Sheet component: `npx shadcn@latest add sheet`
- [x] 5.4 Add shadcn Badge component: `npx shadcn@latest add badge`
- [x] 5.5 Add shadcn Separator component: `npx shadcn@latest add separator`
- [x] 5.6 Add shadcn Input component: `npx shadcn@latest add input`
- [x] 5.7 Add shadcn Tabs component: `npx shadcn@latest add tabs`
- [x] 5.8 Add shadcn Table component: `npx shadcn@latest add table`
- [x] 5.9 Add shadcn Dialog component: `npx shadcn@latest add dialog`
- [x] 5.10 Add shadcn Skeleton component: `npx shadcn@latest add skeleton`
- [x] 5.11 Add shadcn Label component: `npx shadcn@latest add label`
- [x] 5.12 Add shadcn Checkbox component: `npx shadcn@latest add checkbox`
- [x] 5.13 Verify all shadcn components build: `npm run build` (passes)

## 6. Component Migration — Existing Components

- [x] 6.1 Migrate `AnnouncementBar.tsx`: replace CSS classes with Tailwind utilities, delete `.announcement-bar*` classes from globals.css, verify visual parity
- [x] 6.2 Migrate `Navbar.tsx`: replace CSS classes with Tailwind, replace hamburger + mobile-menu with shadcn Sheet, delete `.navbar*`, `.hamburger*`, `.mobile-menu*` CSS from globals.css, verify visual parity
- [x] 6.3 Migrate `Footer.tsx`: replace CSS classes with Tailwind utilities, delete `.footer*` CSS from globals.css, verify visual parity
- [x] 6.4 Migrate `WhatsAppButton.tsx`: replace inline styles + embedded `<style>` with shadcn Button (whatsapp variant), keep floatWA keyframe, verify visual parity
- [x] 6.5 Migrate `Gallery.tsx`: replace CSS classes with Tailwind grid utilities, use inline `style` for complex grid-row spans, delete `.gallery*` CSS from globals.css, verify visual parity
- [x] 6.6 Migrate `Testimonials.tsx`: replace CSS classes with shadcn Card components, delete `.testimonials*` CSS from globals.css, verify visual parity
- [x] 6.7 Migrate `CadastroForm.tsx`: replace CSS classes with shadcn Form/Input/Checkbox/Label/Button, delete `.cadastro*` CSS from globals.css, verify visual parity and form submission still works

## 7. Component Migration — Pages

- [x] 7.1 Migrate `app/page.tsx` Hero section: replace `.hero*` CSS classes with Tailwind, preserve keyframe animations (float, fadeSlideUp, morphBlob), verify visual parity
- [x] 7.2 Migrate `app/page.tsx` Highlights section: replace with Tailwind grid + shadcn Card + Badge + Button (whatsapp variant)
- [x] 7.3 Migrate `app/page.tsx` Age Guide section: replace with shadcn Tabs component
- [x] 7.4 Migrate `app/page.tsx` WhatsApp CTA section: replace with Tailwind + shadcn Button + Badge for features
- [x] 7.5 Migrate `app/admin/page.tsx`: replace CSS classes with shadcn Table/Card/Input/Button, verify login + clientes list still works

## 8. New Features

- [x] 8.1 Create `components/BottomNav.tsx`: fixed bottom bar visible on mobile (< md), 4 icons (Home, Produtos, Carrinho, Conta), uses lucide-react icons
- [x] 8.2 Integrate BottomNav into `app/layout.tsx` (between main content and Footer, hidden on desktop via `md:hidden`)
- [x] 8.3 Create `app/admin/layout.tsx` with `.theme-bubblegum` class wrapper
- [x] 8.4 Apply `.theme-main` class to the body in `app/layout.tsx`
- [x] 8.5 Create shop route group layout `app/(shop)/layout.tsx` with `.theme-main` wrapper

## 9. Cleanup

- [x] 9.1 Delete all migrated CSS class definitions from `app/globals.css` (1954→275 lines, 86% reduction)
- [x] 9.2 Keep in globals.css: tailwind directives, CSS custom properties (themes), custom scrollbar styling, keyframe animations (float, fadeSlideUp, morphBlob, spin), shared section styles
- [x] 9.3 Remove Google Fonts `@import` statements from globals.css (moved to next/font)
- [x] 9.4 Remove `globals.css.bak` backup file
- [x] 9.5 Verify `npm run build` passes with no warnings

## 10. Verification

- [x] 10.1 Run `npm run build` and confirm zero errors and no unused CSS warnings (build passes)
- [ ] 10.2 Run `npm run dev` and visually verify all sections at 375px, 768px, and 1024px widths (requires dev server)
- [ ] 10.3 Verify mobile hamburger menu opens/closes via Sheet (requires visual check)
- [ ] 10.4 Verify bottom nav renders on mobile and is hidden on desktop (requires visual check)
- [ ] 10.5 Verify admin page renders with bubblegum theme and login + clientes table works (requires dev server)
- [ ] 10.6 Verify CadastroForm submits correctly and shows success/error messages (requires DB)
- [ ] 10.7 Verify WhatsApp buttons link to correct number with correct pre-filled messages (requires visual check)
- [ ] 10.8 Verify all animations play correctly (hero, floating WA button, gallery hover effects) (requires visual check)

## 11. Fix Padding & Visual Standardization

- [x] 11.1 Standardize section header `mb` values: Destaques `mb-8 sm:mb-12`, Por Idade `mb-8 sm:mb-12` (was inconsistent)
- [x] 11.2 Hero responsive: image frame 3 breakpoints, floating pills responsive sizing/position
- [x] 11.3 Highlights: grid `auto-fill minmax(260px,1fr)`, CardContent padding `p-4` → `p-5` (match original 1.25rem)
- [x] 11.4 Age Guide: TabTrigger padding `py-2` → `py-2.5`, restore 2-col grid layout (emoji left, content right on md+)
- [x] 11.5 Migrate Gallery.tsx: `.section-*` CSS classes → Tailwind utilities
- [x] 11.6 Migrate Testimonials.tsx: `.section-*` CSS classes → Tailwind utilities
- [x] 11.7 Migrate CadastroForm.tsx: `.section-*` CSS classes → Tailwind utilities
- [x] 11.8 Cleanup globals.css: remove dead `.section-inner`, `.section-header`, `.section-label`, `.section-title`, `.section-subtitle` + responsive rules
- [x] 11.9 Verify `npm run build` passes (globals.css: 275 lines, 86% reduction)
