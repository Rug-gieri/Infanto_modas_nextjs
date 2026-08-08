# Infanto Modas

App unificado da **Infanto Modas**: landing page, checkout por PIX manual, API integrada e **painel administrativo** em um único projeto **Next.js 14 (App Router)** com TypeScript.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilo:** Tailwind CSS v4 + shadcn/ui v4 (base-ui/react, style: base-nova)
- **Banco:** PostgreSQL via `pg` e `DATABASE_URL`
- **Icones:** lucide-react
- **Fontes:** Playfair Display (`--font-display`) + Nunito (`--font-body`) via `next/font/google`
- **Uploads:** Cloudinary (SDK server-side no admin)

## Comandos

| Comando | Descricao |
|---------|-----------|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:3000` |
| `npm run build` | Build de producao (TypeScript + Next.js) |
| `npm run start` | Inicia servidor de producao |

## Variaveis de Ambiente

| Variavel | Descricao |
|----------|-----------|
| `DATABASE_URL` | String de conexao PostgreSQL |
| `ADMIN_SECRET` | Senha do painel administrativo |
| `CLOUDINARY_CLOUD_NAME` | Cloud name do Cloudinary (uploads do admin) |
| `CLOUDINARY_API_KEY` | API key do Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret do Cloudinary |

Copie `.env.example` para `.env.local` e preencha.

## Rotas principais

| Rota | Descricao |
|------|-----------|
| `/` | Landing page |
| `/produtos` | Catalogo publico |
| `/carrinho` | Carrinho persistido no navegador |
| `/checkout` | Checkout visitante com endereco |
| `/pedido/[id]` | Confirmacao do pedido + instrucoes PIX |
| `/admin/login` | Login do painel administrativo |
| `/admin/dashboard` | Metricas do painel |
| `/admin/clientes` | Gestao de clientes |
| `/admin/produtos` | Gestao de produtos (com upload de imagem) |
| `/admin/pedidos` | Gestao de pedidos |

O painel administrativo usa o tema `theme-bubblegum`; o site publico usa `theme-main` (ambos definidos em `app/globals.css`).

## Docker (PostgreSQL)

1. `docker compose up -d` cria/sobe o container Postgres na porta 5432 com o `database/schema.sql`.
2. Verifique a conexao: `docker ps`.
3. Os dados persistem no volume `postgres_data`.

## Schema

O schema fica em `database/schema.sql` e hoje cobre:

- `clientes` com dados de contato e endereco
- `produtos` com catalogo e status de exibicao
- `pedidos` com snapshot do cliente, endereco, pagamento e observacoes
- `pedido_itens` com os itens do pedido

## API

| Rota | Metodos | Auth | Descricao |
|------|---------|------|-----------|
| `/api/produtos` | `GET` | - | Catalogo publico (`?ativos=true`) |
| `/api/clientes` | `POST` | - | Cadastro de cliente/newsletter |
| `/api/checkout` | `POST` | - | Checkout publico: cria/atualiza cliente e gera pedido PIX |
| `/api/checkout/[id]` | `GET` | - | Consulta publica do pedido |
| `/api/init-db` | `GET` | - | Cria e atualiza o schema no banco |
| `/api/admin/login` | `POST` | - | Autentica o admin e cria cookie `httpOnly` |
| `/api/admin/logout` | `POST` | - | Encerra a sessao admin |
| `/api/admin/session` | `GET` | cookie | Estado da sessao admin |
| `/api/admin/dashboard` | `GET` | cookie | Metricas do painel |
| `/api/admin/clientes` | `GET/PUT/DELETE` | cookie | CRUD de clientes |
| `/api/admin/clientes/[id]/pedidos` | `GET` | cookie | Pedidos de um cliente |
| `/api/admin/pedidos` | `GET/POST/PUT/DELETE` | cookie | CRUD de pedidos |
| `/api/admin/pedidos/options` | `GET` | cookie | Opcoes (clientes/produtos) para o formulario |
| `/api/admin/produtos` | `GET/POST/PUT/DELETE` | cookie | CRUD de produtos |
| `/api/admin/uploads/produtos` | `POST` | cookie | Upload de imagem para o Cloudinary |

Toda a API do admin valida a sessao pelo cookie `httpOnly` (`infanto_admin_token`) contra `ADMIN_SECRET`. As rotas de admin consultam o banco diretamente.

## Fluxo de Compra

1. O cliente acessa `/produtos` ou adiciona itens pelos destaques da home.
2. O carrinho fica salvo no navegador via `localStorage`.
3. Em `/checkout`, o cliente finaliza como visitante com dados pessoais e endereco.
4. O backend cria ou atualiza o cliente por e-mail, recalcula o total pelo banco e cria o pedido.
5. Em `/pedido/[id]`, o cliente ve as instrucoes de PIX manual e envia o comprovante por WhatsApp.

## Imagens de Produtos

- O campo `imagem_url` dos produtos deve receber uma URL HTTPS do Cloudinary.
- O frontend aceita imagens remotas de `res.cloudinary.com` via `next/image`.
- O admin faz upload direto para o Cloudinary e preenche a URL.
- Exemplo valido: `https://res.cloudinary.com/<cloud_name>/image/upload/v123/produtos/item.jpg`

## Railway

1. Crie um projeto no Railway com `Next.js` e um servico `PostgreSQL`.
2. Defina `DATABASE_URL`, `ADMIN_SECRET` e `CLOUDINARY_*` nas variaveis de ambiente.
3. Rode `/api/init-db` uma vez para criar ou atualizar o schema inicial.

## Notas

- O numero padrao de WhatsApp usado no site e `556992228016`.
- O projeto nao tem testes automatizados no momento.
- Erro `ECONNREFUSED ::1:5432` no build pode acontecer em ambiente local quando API routes tentam conectar ao PostgreSQL durante a geracao.

## Pendencias

- Evoluir para um fluxo de migracoes SQL versionadas.
- Remover o uso de `/api/init-db` como forma principal de inicializacao do banco.
- Implementar calculo de frete e regras de entrega.
- Automatizar conciliacao e confirmacao de pagamento PIX.
- Bot do Telegram para cadastro de produtos (planejado, ver histórico de planejamento).
