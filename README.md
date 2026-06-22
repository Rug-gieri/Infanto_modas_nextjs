# Infanto Modas

Landing page para loja de roupas infantis com administração integrada. Desenvolvido em **Next.js 14 (App Router)** com TypeScript.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilo:** Tailwind CSS v4 + shadcn/ui v4 (base-ui/react, style: base-nova)
- **Banco:** PostgreSQL via `pg` (4 tabelas: clientes, produtos, pedidos, pedido_itens)
- **Ícones:** lucide-react
- **Fontes:** Playfair Display (`--font-display`) + Nunito (`--font-body`) via `next/font/google`

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:3000` |
| `npm run build` | Build de produção (TypeScript + Next.js) |
| `npm run start` | Inicia servidor de produção |

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | String de conexão PostgreSQL |
| `ADMIN_SECRET` | Senha/token do painel administrativo |

## Estrutura

```
app/
├── globals.css              # Tailwind + design tokens + animações
├── layout.tsx               # Layout raiz (Navbar, Footer, BottomNav)
├── page.tsx                 # Landing page (seções: hero, categorias, destaques, galeria, depoimentos, cadastro)
├── lib/
│   ├── db.ts                # Pool de conexão PostgreSQL
│   └── utils.ts             # Utilitário cn() (clsx + tailwind-merge)
├── components/
│   ├── ui/                  # 12 componentes shadcn/ui
│   ├── AnnouncementBar.tsx  # Barra superior de frete grátis
│   ├── BottomNav.tsx        # Navegação fixa mobile
│   ├── CadastroForm.tsx     # Formulário de newsletter/cadastro
│   ├── Footer.tsx           # Rodapé do site
│   ├── Gallery.tsx          # Galeria de fotos
│   ├── HeroCarousel.tsx     # Carrossel hero (4 slides, touch)
│   ├── Navbar.tsx           # Navegação desktop + menu mobile (Sheet)
│   ├── Testimonials.tsx     # Depoimentos de clientes
│   ├── WhatsAppButton.tsx   # Botão WhatsApp (link + floating FAB)
│   ├── AdminSidebar.tsx     # Sidebar do painel admin
│   ├── AdminDashboard.tsx   # Métricas do dashboard (4 cards)
│   ├── AdminClientes.tsx    # CRUD clientes + CSV + popup pedidos
│   ├── AdminProdutos.tsx    # CRUD produtos + ativar/desativar
│   └── AdminPedidos.tsx     # Kanban de pedidos + criação
├── (shop)/
│   └── layout.tsx           # Layout para futuras páginas de loja
├── admin/
│   ├── layout.tsx           # Tema bubblegum (pink/candy)
│   └── page.tsx             # Login + painel completo (4 abas)
└── api/
    ├── admin/login/         # POST — autenticação admin (retorna token)
    ├── admin/dashboard/     # GET — métricas do dashboard
    ├── clientes/            # POST/GET/PUT/DELETE — CRUD clientes
    ├── produtos/            # POST/GET/PUT/DELETE — CRUD produtos
    ├── pedidos/             # POST/GET/PUT/DELETE — CRUD pedidos
    └── init-db/             # GET — inicializa as 4 tabelas
```

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

### Temas CSS

- **`.theme-main`** — Rose/mint (site principal)
- **`.theme-bubblegum`** — Pink/candy, `--radius: 1rem` (admin)

## API

| Rota | Métodos | Auth | Descrição |
|------|---------|------|-----------|
| `/api/clientes` | `POST` / `GET` / `PUT` / `DELETE` | GET/PUT/DELETE: `x-admin-token` | CRUD clientes |
| `/api/produtos` | `POST` / `GET` / `PUT` / `DELETE` | POST/PUT/DELETE: `x-admin-token`; GET público (só ativos) | CRUD produtos com filtro por categoria |
| `/api/pedidos` | `POST` / `GET` / `PUT` / `DELETE` | `x-admin-token` | CRUD pedidos com itens e transição de status |
| `/api/admin/login` | `POST` | — | Autenticação admin (retorna token) |
| `/api/admin/dashboard` | `GET` | `x-admin-token` | Métricas: total clientes, produtos ativos, pedidos do mês, receita |
| `/api/init-db` | `GET` | — | Cria as 4 tabelas (clientes, produtos, pedidos, pedido_itens) |

## Responsividade

- Mobile-first com breakpoints `sm:` (640px) e `md:` (768px)
- Navegação mobile: `BottomNav` fixo + Sheet para menu hambúrguer
- Seções: `py-14 px-4 sm:py-20 sm:px-8`

## Notas

- O fluxo de compras é finalizado via WhatsApp (número `5569992327118`)
- Erro `ECONNREFUSED ::1:5432` no build é esperado — as API routes tentam conectar ao PostgreSQL local durante SSG
- Verificação visual com `npm run dev` (não há testes automatizados)
- Admin: senha definida via `ADMIN_SECRET`; autenticação via token armazenado em `localStorage`
