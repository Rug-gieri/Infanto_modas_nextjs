# Infanto Modas

Landing page para loja de roupas infantis com administração integrada. Desenvolvido em **Next.js 14 (App Router)** com TypeScript.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilo:** Tailwind CSS v4 + shadcn/ui (base-ui/react, style: base-nova)
- **Banco:** PostgreSQL via `pg`
- **Ícones:** lucide-react
- **Fontes:** Playfair Display + Nunito (`next/font/google`)

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:3000` |
| `npm run build` | Build de produção (TypeScript + Next.js) |
| `npm start` | Inicia servidor de produção |

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
│   ├── Navbar.tsx           # Navegação desktop + menu mobile (Sheet)
│   ├── Testimonials.tsx     # Depoimentos de clientes
│   └── WhatsAppButton.tsx   # Botão WhatsApp (link + floating FAB)
├── (shop)/
│   └── layout.tsx           # Layout para futuras páginas de loja
├── admin/
│   ├── layout.tsx           # Tema bubblegum (pink/candy)
│   └── page.tsx             # Login + dashboard de clientes
└── api/
    ├── admin/login/         # POST — autenticação admin (retorna token)
    ├── clientes/            # POST — cadastro | GET — lista (autenticado)
    └── init-db/             # GET — inicializa tabela clientes
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

| Rota | Método | Auth | Descrição |
|------|--------|------|-----------|
| `/api/clientes` | `POST` | — | Cadastro de cliente (nome, email, telefone, newsletter) |
| `/api/clientes` | `GET` | `x-admin-token` | Lista todos os clientes |
| `/api/admin/login` | `POST` | — | Autenticação admin (retorna token) |
| `/api/init-db` | `GET` | — | Cria tabela `clientes` no banco |

## Responsividade

- Mobile-first com breakpoints `sm:` (640px) e `md:` (768px)
- Navegação mobile: `BottomNav` fixo + Sheet para menu hambúrguer
- Seções: `py-14 px-4 sm:py-20 sm:px-8`

## Notas

- O fluxo de compras é finalizado via WhatsApp (número `5569992327118`)
- Erro `ECONNREFUSED ::1:5432` no build é esperado — as API routes tentam conectar ao PostgreSQL local durante SSG
- Verificação visual com `npm run dev` (não há testes automatizados)
