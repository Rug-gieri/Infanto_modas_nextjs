# AGENTS.md — Infanto Modas

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Next.js) |
| `npm run build` | Build de produção (verifica TypeScript + compila) |
| `npm run start` | Inicia servidor de produção |

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilo:** Tailwind CSS v4 + shadcn/ui v4 (base-ui/react, style: base-nova)
- **Banco:** PostgreSQL via `pg` (API routes em `/api/`)
- **Fontes:** Playfair Display (`next/font/google`, `--font-display`) + Nunito (`--font-body`)
- **Ícones:** lucide-react

## Design System

### Cores
| Token | Valor | Uso |
|-------|-------|-----|
| `--primary` | `#E07A92` (rose-deep) | Ações principais |
| `--secondary` | `#A8D8C8` (mint) | Ações secundárias |
| `--background` | `#FDF8F3` (cream) | Fundo da página |
| `--foreground` | `#2D2D2D` (charcoal) | Texto principal |
| `--accent` | `#D4A847` (gold) | Destaques/estrelas |
| `--muted` | `#E4F5F0` (mint-light) | Fundos suaves |
| `--border` | `#F0E4E8` | Bordas |
| `--radius` | `0.75rem` | Arredondamento padrão |

### Temas
- `.theme-main` — Rose/mint (site principal, aplicado no `<body>`)
- `.theme-bubblegum` — Pink/candy, `--radius: 1rem` (admin, aplicado no layout `/admin`)

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
├── globals.css          # Tailwind + temas + keyframes (275 linhas)
├── layout.tsx           # Layout raiz (theme-main, BottomNav)
├── page.tsx             # Landing page
├── components/
│   ├── ui/              # shadcn/ui (12 componentes)
│   ├── AnnouncementBar.tsx
│   ├── BottomNav.tsx
│   ├── CadastroForm.tsx
│   ├── Footer.tsx
│   ├── Gallery.tsx
│   ├── Navbar.tsx
│   ├── Testimonials.tsx
│   └── WhatsAppButton.tsx
├── admin/
│   ├── layout.tsx       # theme-bubblegum
│   └── page.tsx         # Login + dashboard clientes
├── (shop)/
│   └── layout.tsx       # theme-main
└── api/
    ├── admin/login/
    ├── clientes/
    └── init-db/
```

## APIs

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/clientes` | POST | Cadastro de cliente |
| `/api/clientes` | GET | Lista clientes (requer `x-admin-token`) |
| `/api/admin/login` | POST | Autenticação admin (retorna token) |
| `/api/init-db` | GET | Inicializa tabela no banco |

## Notas

- Erro `ECONNREFUSED ::1:5432` no build é esperado — API routes tentam conectar ao PostgreSQL local durante SSG. Ignorar.
- O projeto não tem testes automatizados. Verificação visual com `npm run dev`.
- O WhatsApp number padrão é `5569992327118`.
