# Infanto Modas

Site publico da loja de roupas infantis com catalogo, carrinho, checkout por PIX manual e API integrada para consumo do proprio site e do app administrativo externo. Desenvolvido em **Next.js 14 (App Router)** com TypeScript.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilo:** Tailwind CSS v4 + shadcn/ui v4 (base-ui/react, style: base-nova)
- **Banco:** PostgreSQL via `pg` e `DATABASE_URL`
- **Icones:** lucide-react
- **Fontes:** Playfair Display (`--font-display`) + Nunito (`--font-body`) via `next/font/google`

## Comandos

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:3000` |
| `npm run build` | Build de producao (TypeScript + Next.js) |
| `npm run start` | Inicia servidor de producao |

## Variaveis de Ambiente

| Variavel | Descricao |
|----------|-----------|
| `DATABASE_URL` | String de conexao PostgreSQL |
| `ADMIN_SECRET` | Senha/token do painel administrativo |
| `ADMIN_APP_ORIGIN` | Origem permitida para o app admin separado, ex: `http://localhost:3001` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nome do cloud no Cloudinary, usado para padronizar a origem das imagens |
| `NEXT_PUBLIC_PIX_KEY` | Chave PIX exibida na pagina de confirmacao do pedido |
| `NEXT_PUBLIC_PIX_RECEIVER` | Nome do recebedor exibido nas instrucoes de PIX |

## Railway

1. Crie um projeto no Railway com `Next.js` e um servico `PostgreSQL`.
2. Defina `DATABASE_URL`, `ADMIN_SECRET` e `ADMIN_APP_ORIGIN` nas variaveis de ambiente.
3. Se usar checkout PIX manual, defina `NEXT_PUBLIC_PIX_KEY` e `NEXT_PUBLIC_PIX_RECEIVER`.
4. Rode `/api/init-db` uma vez para criar ou atualizar o schema inicial.
5. No deploy, o app usa `DATABASE_URL` automaticamente.

## Schema

O schema fica em `database/schema.sql` e hoje cobre:

- `clientes` com dados de contato e endereco
- `produtos` com catalogo e status de exibicao
- `pedidos` com snapshot do cliente, endereco, pagamento e observacoes
- `pedido_itens` com os itens do pedido

## Estrutura

```txt
app/
├── globals.css               # Tailwind + design tokens + animacoes
├── layout.tsx                # Layout raiz do site publico
├── page.tsx                  # Landing page principal
├── lib/
│   ├── cors.ts               # Helpers de CORS para o admin externo
│   ├── db.ts                 # Pool de conexao PostgreSQL
│   └── shop.ts               # Tipos e helpers de carrinho/checkout
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   ├── cart/
│   │   └── CartProvider.tsx  # Estado global do carrinho
│   ├── AnnouncementBar.tsx   # Barra superior
│   ├── BottomNav.tsx         # Navegacao fixa mobile
│   ├── CadastroForm.tsx      # Formulario de newsletter/cadastro
│   ├── Footer.tsx            # Rodape do site
│   ├── Gallery.tsx           # Galeria de fotos
│   ├── HeroCarousel.tsx      # Carrossel hero
│   ├── Navbar.tsx            # Navegacao desktop + menu mobile
│   ├── Testimonials.tsx      # Depoimentos de clientes
│   └── WhatsAppButton.tsx    # Botao WhatsApp
├── (shop)/
│   ├── layout.tsx            # Layout das paginas de loja
│   ├── produtos/page.tsx     # Catalogo publico
│   ├── carrinho/page.tsx     # Carrinho persistido no navegador
│   ├── checkout/page.tsx     # Checkout visitante com endereco
│   └── pedido/[id]/page.tsx  # Confirmacao do pedido + instrucoes PIX
└── api/
    ├── admin/login/          # POST - autenticacao para o app admin externo
    ├── admin/dashboard/      # GET - metricas consumidas pelo app admin externo
    ├── checkout/             # POST - checkout publico
    │   └── [id]/             # GET - consulta publica do pedido
    ├── clientes/             # POST/GET/PUT/DELETE - CRUD clientes
    ├── produtos/             # POST/GET/PUT/DELETE - CRUD produtos
    ├── pedidos/              # POST/GET/PUT/DELETE - CRUD pedidos
    └── init-db/              # GET - inicializa/atualiza o schema
```

## API

| Rota | Metodos | Auth | Descricao |
|------|---------|------|-----------|
| `/api/clientes` | `POST` / `GET` / `PUT` / `DELETE` | GET/PUT/DELETE: `x-admin-token` | CRUD clientes com suporte a endereco |
| `/api/produtos` | `POST` / `GET` / `PUT` / `DELETE` | POST/PUT/DELETE: `x-admin-token`; GET publico para `?ativos=true` | CRUD produtos com filtro por categoria |
| `/api/pedidos` | `POST` / `GET` / `PUT` / `DELETE` | `x-admin-token` | CRUD pedidos com itens e transicao de status |
| `/api/checkout` | `POST` | - | Checkout publico: valida carrinho, cria/atualiza cliente e gera pedido PIX manual |
| `/api/checkout/[id]` | `GET` | - | Consulta publica do pedido para tela de confirmacao |
| `/api/admin/login` | `POST` | - | Autenticacao do app admin externo |
| `/api/admin/dashboard` | `GET` | `x-admin-token` | Metricas para o app admin externo |
| `/api/init-db` | `GET` | - | Cria e atualiza o schema no banco |

## Fluxo de Compra

### Jornada atual

1. O cliente acessa `/produtos` ou adiciona itens pelos destaques da home.
2. O carrinho fica salvo no navegador via `localStorage`.
3. Em `/carrinho`, o cliente ajusta quantidades e segue para o checkout.
4. Em `/checkout`, o cliente finaliza como visitante com dados pessoais e endereco.
5. O backend cria ou atualiza o cliente por e-mail, recalcula o total pelo banco e cria o pedido.
6. Em `/pedido/[id]`, o cliente ve as instrucoes de PIX manual e envia o comprovante por WhatsApp.

### Observacoes do MVP

- O checkout atual nao exige login.
- O pagamento atual e `PIX manual`.
- O frete nao e calculado automaticamente nesta versao.
- O admin continua usando `/api/pedidos` para acompanhamento e atualizacao de status.

## Responsividade

- Mobile-first com breakpoints `sm:` (640px) e `md:` (768px)
- Navegacao mobile: `BottomNav` fixo + Sheet para menu hamburger
- Secoes: `py-14 px-4 sm:py-20 sm:px-8`

## Imagens de Produtos

- O campo `imagem_url` dos produtos deve receber uma URL HTTPS do Cloudinary.
- O frontend aceita imagens remotas de `res.cloudinary.com` via `next/image`.
- A API de produtos rejeita URLs fora do Cloudinary para evitar links invalidos ou imagens hospedadas em outra origem.
- Exemplo de `imagem_url` valida:

```txt
https://res.cloudinary.com/<cloud_name>/image/upload/v123/produtos/item.jpg
```

## Notas

- O numero padrao de WhatsApp usado no site e `556992228016`.
- O fluxo principal agora pode ser concluido no proprio site ate a etapa de instrucao de pagamento.
- O envio do comprovante de PIX continua sendo feito por WhatsApp.
- Erro `ECONNREFUSED ::1:5432` no build pode acontecer em ambiente local quando API routes tentam conectar ao PostgreSQL durante a geracao.
- Verificacao visual com `npm run dev`.
- O projeto nao tem testes automatizados no momento.
- O painel administrativo foi extraido para um app separado que consome esta API.

## Pendencias

- Evoluir o projeto para um fluxo de migracoes SQL versionadas.
- Remover o uso de `/api/init-db` como forma principal de inicializacao do banco.
- Automatizar a aplicacao do schema no deploy do Railway.
- Implementar calculo de frete e regras de entrega.
- Automatizar conciliacao e confirmacao de pagamento PIX.

## Bot do Telegram

Planejamento do bot administrativo do Telegram, restrito a um `telegram user id` autorizado.

### Objetivo

Permitir o cadastro e a manutencao de produtos pelo Telegram, reduzindo a dependencia do painel web para entrada de novos itens.

### Fluxo de cadastro

1. O admin envia uma foto para o bot.
2. O bot solicita o nome do produto.
3. O bot solicita a marca ou fabricante.
4. O bot solicita o valor.
5. O bot solicita a categoria ou publico.
6. O bot solicita o tipo do produto.
7. O bot solicita o status.
8. O bot exibe um resumo final.
9. O admin confirma e o produto e salvo.

### Campos do produto

- `nome`
- `marca_fabricante`
- `preco`
- `categoria`
- `tipo`
- `status`
- `tamanho_idade`
- `imagem_url`

### Valores sugeridos

- `categoria`: `bebe`, `feminino`, `masculino`
- `tipo`: `camiseta`, `short`, `kit`, `vestido`, `conjunto`, `body`, `macacao`, `outro`
- `status`: `disponivel`, `vendido`

### Regras de exibicao no site

- `disponivel` entra no catalogo da loja.
- `vendido` aparece como `Mais vendidos`.
- O site pode usar o campo `status` para separar listas e destaques.

### Seguranca

- O bot aceita comandos apenas do `telegram user id` autorizado.
- O token do bot e dados sensiveis devem ficar em variaveis de ambiente.
- O bot nao deve aceitar cadastro ou alteracao de produto de usuarios nao autorizados.

### Proximas etapas planejadas

- Cadastro de produto via conversa no Telegram.
- Upload da imagem para storage externo.
- Alteracao de status de produto via bot.
- Remocao de produto via bot.
- Notificacao de pedido confirmado no Telegram.

## 21 de jul > vamos otimizar 

- concluir mvp site e cadastro de produtos 
- entregar no ar
