# AGENTS.md — Infanto Modas

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala dependências |
| `npm run dev` | Servidor de desenvolvimento (Next.js) em `http://localhost:3000` |
| `npm run build` | Build de produção (verifica TypeScript + compila) |
| `npm run start` | Inicia servidor de produção |

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilo:** Tailwind CSS v4 + shadcn/ui v4 (base-ui/react, style: base-nova)
- **Banco:** PostgreSQL via `pg` (API routes em `/api/`)
- **Fontes:** Playfair Display (`next/font/google`, `--font-display`) + Nunito (`--font-body`)
- **Ícones:** lucide-react
- **Uploads:** Cloudinary (SDK server-side, apenas no admin)

## Design System

### Cores
| Token | Valor | Uso |
|-------|-------|-----|
| `--primary` | `#E07A92` (rose-deep) | Ações principais (site) |
| `--secondary` | `#A8D8C8` (mint) | Ações secundárias |
| `--background` | `#FDF8F3` (cream) | Fundo da página |
| `--foreground` | `#2D2D2D` (charcoal) | Texto principal |
| `--accent` | `#D4A847` (gold) | Destaques/estrelas |
| `--muted` | `#E4F5F0` (mint-light) | Fundos suaves |
| `--border` | `#F0E4E8` | Bordas |
| `--radius` | `0.75rem` | Arredondamento padrão |

### Temas
- `.theme-main` — Rose/mint (site público, aplicado no layout de `(site)`).
- `.theme-bubblegum` — Pink (painel admin, aplicado no layout de `admin/`).

Ambos os temas vivem em `app/globals.css`.

### Padrões de Seção
```tsx
<section className="py-14 px-4 sm:py-20 sm:px-8 bg-cream">
  <div className="max-w-[1200px] mx-auto">
    <div className="text-center mb-8 sm:mb-12">
      <span className="inline-block text-rose-deep font-bold text-xs uppercase tracking-[0.15em] mb-3">
        Label
      </span>
      <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-foreground mb-3 leading-tight">
        Título
      </h2>
      <p className="text-muted-foreground max-w-[520px] mx-auto">
        Subtítulo
      </p>
    </div>
    {/* conteúdo */}
  </div>
</section>
```

### Componentes shadcn/ui instalados
`button`, `card`, `sheet`, `badge`, `tabs`, `table`, `dialog`, `input`, `label`, `checkbox`, `separator`, `skeleton`

### Padrão de Card
```tsx
// Evitar double-padding: Card já aplica py-4, CardContent aplica px-4
<Card className="p-0">           {/* zera padding vertical do Card */}
  <CardContent className="p-5">   {/* padding explícito aqui */}
    ...
  </CardContent>
</Card>
```

### Responsivo
- Mobile-first com breakpoints `sm:` (640px) e `md:` (768px)
- Navegação mobile: BottomNav fixo (`md:hidden`) + Sheet para menu hamburger
- Seções: `py-14 px-4 sm:py-20 sm:px-8`

## Estrutura de Arquivos

```
app/
├── globals.css          # Tailwind + temas (theme-main e theme-bubblegum)
├── layout.tsx           # Layout raiz (fontes + body)
├── (site)/
│   ├── layout.tsx       # Chrome do site (Navbar, Footer, BottomNav, CartProvider)
│   ├── page.tsx         # Landing page
│   └── (shop)/          # produtos, carrinho, checkout, pedido
├── admin/
│   ├── layout.tsx       # theme-bubblegum
│   ├── page.tsx         # redirect /admin → dashboard ou login
│   ├── login/page.tsx   # Login admin (sem guarda)
│   └── (protected)/
│       ├── layout.tsx   # Guarda de sessão + sidebar
│       ├── dashboard/page.tsx
│       ├── clientes/page.tsx
│       ├── produtos/page.tsx
│       └── pedidos/page.tsx
├── components/          # Componentes do site
├── lib/                 # db.ts, cors.ts, shop.ts
└── api/
    ├── admin/           # API do admin (banco direto, cookie de sessão)
    ├── produtos/        # GET público (?ativos=true)
    ├── clientes/        # POST público (newsletter)
    ├── checkout/        # POST público
    └── init-db/         # schema
components/              # AdminSidebar, Admin*.tsx e ui/ (shadcn)
lib/
├── server/              # admin-auth, admin-session, admin-mappers, cloudinary
├── services/            # services do admin (clientes, dashboard, pedidos, produtos, uploads)
├── http/client.ts       # fetch helper com ApiError
└── types/admin.ts       # tipos do admin
```

## APIs

| Rota | Método | Auth | Descrição |
|------|--------|------|-----------|
| `/api/produtos` | GET | - | Catálogo público (`?ativos=true`) |
| `/api/clientes` | POST | - | Cadastro de cliente/newsletter |
| `/api/checkout` | POST | - | Checkout público |
| `/api/checkout/[id]` | GET | - | Consulta pública do pedido |
| `/api/init-db` | GET | - | Inicializa tabelas |
| `/api/admin/login` | POST | - | Login admin (cookie httpOnly) |
| `/api/admin/logout` | POST | cookie | Logout admin |
| `/api/admin/session` | GET | cookie | Estado da sessão |
| `/api/admin/dashboard` | GET | cookie | Métricas do painel |
| `/api/admin/clientes` | GET/PUT/DELETE | cookie | CRUD clientes |
| `/api/admin/clientes/[id]/pedidos` | GET | cookie | Pedidos do cliente |
| `/api/admin/pedidos` | GET/POST/PUT/DELETE | cookie | CRUD pedidos |
| `/api/admin/pedidos/options` | GET | cookie | Opções do formulário de pedido |
| `/api/admin/produtos` | GET/POST/PUT/DELETE | cookie | CRUD produtos |
| `/api/admin/uploads/produtos` | POST | cookie | Upload Cloudinary |

## Sessão Admin

- O admin usa cookie `httpOnly` `infanto_admin_token`, que guarda o `ADMIN_SECRET`.
- `lib/server/admin-session.ts` expõe `getAdminSessionToken()`, `unauthorizedResponse()` e `withUnauthorizedCookieCleanup()`.
- Toda rota `/api/admin/*` chama `getAdminSessionToken()` antes de consultar o banco (pool em `app/lib/db.ts`).
- Ao receber 401, a resposta limpa o cookie e o UI redireciona para `/admin/login`.

## Notas

- Erro `ECONNREFUSED ::1:5432` no build é esperado — API routes tentam conectar ao PostgreSQL local durante SSG. Ignorar.
- O projeto não tem testes automatizados. Verificação visual com `npm run dev`.
- O WhatsApp number padrão é `5569992327118` (ver README).
- O painel admin vive no mesmo repo; URLs `/admin/*` e API `/api/admin/*`.
