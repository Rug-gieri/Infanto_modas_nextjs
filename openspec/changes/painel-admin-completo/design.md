## Context

O painel admin atual (`app/admin/page.tsx`) é uma página única com login + listagem de clientes. O token de autenticação é mantido em `useState`, perdendo-se ao recarregar a página. Não há banco de dados para produtos ou pedidos — os produtos exibidos na landing page são hardcoded no próprio `app/page.tsx`.

A stack já definida (Next.js 14 App Router, Tailwind v4, shadcn/ui, PostgreSQL via `pg`, TypeScript) será mantida. O padrão de API routes existente (exportar funções GET/POST/PUT/DELETE nomeadas no mesmo arquivo `route.ts`) também será seguido.

## Goals / Non-Goals

**Goals:**
- Permitir que o administrador gerencie produtos sem alterar código-fonte
- Permitir registro e acompanhamento de pedidos feitos via WhatsApp
- Melhorar a gestão de clientes (editar, excluir, visualizar histórico)
- Tornar a landing page dinâmica (produtos carregados do banco)
- Fornecer navegação estruturada entre as seções do admin
- Persistir a sessão admin além do recarregamento da página

**Non-Goals:**
- Carrinho de compras ou checkout online (continua via WhatsApp)
- Autenticação multi-usuário (mantém senha única via `ADMIN_SECRET`)
- Upload de imagens (URLs de imagem serão inseridas manualmente)
- Notificações ou integração com WhatsApp API
- Paginação nas listagens (os volumes esperados são baixos)
- Testes automatizados (não estão no escopo do projeto)

## Decisions

### 1. Persistência de sessão admin via `localStorage`

**Escolha**: Armazenar o token no `localStorage` em vez de `useState` puro.

**Alternativa considerada**: Cookies HTTP-only. Descartada por adicionar complexidade de middleware sem necessidade real de segurança (senha única, ambiente interno).

**Racional**: `localStorage` é suficiente para esse caso de uso. O token é setado no login e lido no mount de qualquer página admin. O logout limpa o storage.

### 2. Sidebar com links e highlight ativo

**Escolha**: Sidebar fixa à esquerda com ícones `lucide-react` + labels, destacando a página ativa baseada em estado local (`activeSection`). Conteúdo renderizado condicionalmente no mesmo `page.tsx`.

**Alternativa considerada**: Múltiplas rotas (`/admin/produtos`, `/admin/pedidos`, etc). Descartada porque exigiria middleware de auth em cada rota ou um context provider compartilhado entre layouts. A abordagem condicional mantém tudo em um arquivo com um único ponto de auth.

**Racional**: Simplicidade. O admin tem no máximo 4 seções — não justifica um roteador completo. A sidebar usa o tema bubblegum já existente.

### 3. API de produtos com endpoint público para o site

**Escolha**: `/api/produtos` com GET autenticado (admin) e GET público com query `?ativos=true` (landing page). POST/PUT/DELETE sempre autenticados.

**Racional**: A landing page não tem autenticação — precisa de um endpoint público. Usar query param `?ativos=true` permite que a mesma rota sirva ambos os casos, evitando duplicação.

### 4. Tabela `produtos` com schema enxuto

**Escolha**: Colunas: `id SERIAL PK`, `nome VARCHAR(150)`, `descricao TEXT`, `preco NUMERIC(10,2)`, `categoria VARCHAR(30)`, `faixa_etaria VARCHAR(30)`, `imagem_url VARCHAR(300)`, `badge VARCHAR(30)`, `ativo BOOLEAN DEFAULT true`, `criado_em TIMESTAMP DEFAULT NOW()`.

**Racional**: Mapeia diretamente os campos já usados nos objetos hardcoded do `page.tsx`. Sem overengineering — sem tabelas separadas para categorias ou badges.

### 5. Tabelas `pedidos` + `pedido_itens` com status tracking

**Escolha**: 
- `pedidos`: `id SERIAL PK`, `cliente_id INT REFERENCES clientes(id)`, `status VARCHAR(20) DEFAULT 'pendente'`, `valor_total NUMERIC(10,2) DEFAULT 0`, `observacoes TEXT`, `criado_em TIMESTAMP DEFAULT NOW()`, `atualizado_em TIMESTAMP DEFAULT NOW()`.
- `pedido_itens`: `id SERIAL PK`, `pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE`, `produto_id INT REFERENCES produtos(id)`, `quantidade INT DEFAULT 1`, `preco_unitario NUMERIC(10,2)`.

**Racional**: Status como VARCHAR (não enum) para facilitar evolução futura. `ON DELETE CASCADE` em `pedido_itens` para evitar itens órfãos.

### 6. API `/api/clientes` ganha PUT e DELETE

**Escolha**: Adicionar exports `PUT` e `DELETE` no mesmo arquivo `route.ts`. PUT recebe `{ id, nome, email, telefone, aceita_newsletter }`. DELETE recebe `{ id }`.

**Racional**: Segue o padrão existente. Mínimo de novos arquivos.

### 7. Exportação CSV no client-side

**Escolha**: Gerar CSV no browser a partir dos dados já carregados, usando `Blob` + `URL.createObjectURL` + `<a download>`.

**Racional**: Evita um endpoint dedicado só para export. Os dados já estão em memória no client.

### 8. Landing page com `useEffect` + `fetch` para carregar produtos

**Escolha**: `app/page.tsx` já é `'use client'`. Adicionar `useEffect` que faz `fetch('/api/produtos?ativos=true')` e popula o estado. Manter fallback com dados hardcoded caso a API falhe.

**Racional**: Se o banco estiver offline (ex: durante build), o site ainda funciona com os dados hardcoded. Experiência degradada graceful.

### 9. Dashboard com queries agregadas via API

**Escolha**: Criar `/api/admin/dashboard` que retorna `{ totalClientes, produtosAtivos, pedidosDoMes, receitaEstimada }`. Cada métrica é uma query SQL simples.

**Racional**: Evita que o client faça múltiplas chamadas e processe agregações. O endpoint retorna exatamente o que o dashboard precisa.

## Risks / Trade-offs

- **[Risco] Dados de produtos ficam desatualizados se a API falhar**: O fallback hardcoded no `page.tsx` serve como safety net, mas pode mostrar produtos que não refletem o estado real do banco. **Mitigação**: O fetch é tentado a cada carregamento da página; o fallback só é usado em erro de rede/servidor.
- **[Risco] `localStorage` não é seguro para tokens em ambientes compartilhados**: Um XSS poderia roubar o token. **Mitigação**: O token é a própria senha (`ADMIN_SECRET`) — em caso de comprometimento, basta trocar a variável de ambiente.
- **[Trade-off] Sidebar condicional vs múltiplas rotas**: A abordagem condicional funciona bem para 4 seções, mas se o admin crescer muito, migrar para rotas separadas será necessário. **Mitigação**: A estrutura já isola cada seção em seu próprio componente, facilitando futura extração para páginas independentes.
- **[Trade-off] Sem paginação**: Supõe volumes baixos (< 1000 registros). Se o negócio escalar, a listagem ficará lenta. **Mitigação**: Adicionar paginação é um `LIMIT/OFFSET` na query SQL — baixo custo de refatoração futura.

## Migration Plan

1. Rodar `GET /api/init-db` (atualizado) para criar as 3 novas tabelas
2. Fazer deploy do código — o admin antigo é substituído pelo novo layout com sidebar
3. Landing page começa a carregar produtos da API; enquanto a tabela estiver vazia, mostra fallback hardcoded
4. Admin cadastra produtos via painel; ao salvar o primeiro, a landing page passa a exibi-los

**Rollback**: Reverter o deploy. As tabelas novas permanecem no banco mas sem impacto (não quebram queries existentes).

## Open Questions

- Nenhuma pendente — todas as decisões de design foram tomadas acima.
