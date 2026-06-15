## 1. Banco de Dados

- [x] 1.1 Atualizar `/api/init-db/route.ts` para criar tabelas `produtos`, `pedidos` e `pedido_itens`
- [x] 1.2 Criar índices em `pedidos.cliente_id` e `pedido_itens.pedido_id`

## 2. API — Produtos

- [x] 2.1 Criar `/api/produtos/route.ts` com export POST (autenticado, valida campos obrigatórios)
- [x] 2.2 Adicionar export GET com suporte a `?ativos=true` (público), `?categoria=X` (autenticado), e sem filtro (autenticado)
- [x] 2.3 Adicionar export PUT (autenticado, atualiza campos enviados, ID obrigatório)
- [x] 2.4 Adicionar export DELETE (autenticado, remove por ID)

## 3. API — Pedidos

- [x] 3.1 Criar `/api/pedidos/route.ts` com export POST (autenticado, recebe `cliente_id` + `itens`, calcula totais)
- [x] 3.2 Adicionar export GET com join de clientes e itens, suporte a `?status=X`
- [x] 3.3 Adicionar export PUT para atualizar status do pedido
- [x] 3.4 Adicionar export DELETE para remover pedido e itens

## 4. API — Clientes (Melhorias)

- [x] 4.1 Adicionar export PUT em `/api/clientes/route.ts` para editar cliente por ID
- [x] 4.2 Adicionar export DELETE em `/api/clientes/route.ts` para excluir cliente por ID

## 5. API — Dashboard

- [x] 5.1 Criar `/api/admin/dashboard/route.ts` com export GET retornando `{ totalClientes, produtosAtivos, pedidosDoMes, receitaEstimada }`

## 6. Admin — Layout e Sessão

- [x] 6.1 Criar componente `AdminSidebar` com links (Dashboard, Clientes, Produtos, Pedidos), logout, e link "Voltar ao site"
- [x] 6.2 Migrar lógica de auth (`token` state) para `localStorage` para persistir sessão
- [x] 6.3 Refatorar `app/admin/layout.tsx` para aplicar sidebar + conteúdo principal lado a lado
- [x] 6.4 Refatorar `app/admin/page.tsx` para atuar como container com estado `activeSection` e renderizar o componente da seção ativa

## 7. Admin — Dashboard

- [x] 7.1 Criar componente `AdminDashboard` com 4 cards de métricas usando Card + CardContent
- [x] 7.2 Integrar fetch ao `/api/admin/dashboard` no mount

## 8. Admin — Clientes (Melhorias)

- [x] 8.1 Mover lógica de listagem de clientes do `page.tsx` atual para componente `AdminClientes`
- [x] 8.2 Adicionar botão \"Editar\" em cada linha com formulário inline/modal usando Dialog
- [x] 8.3 Adicionar botão \"Excluir\" com diálogo de confirmação
- [x] 8.4 Adicionar botão \"Pedidos\" que carrega e exibe histórico de pedidos do cliente em modal
- [x] 8.5 Adicionar botão \"Exportar CSV\" que gera e baixa arquivo .csv

## 9. Admin — Produtos

- [x] 9.1 Criar componente `AdminProdutos` com tabela de produtos (shadcn Table)
- [x] 9.2 Adicionar campo de busca textual (nome) e dropdown de filtro por categoria
- [x] 9.3 Criar formulário de criação/edição de produto (Dialog com Input, Select, Checkbox)
- [x] 9.4 Adicionar toggle ativo/inativo inline no badge da tabela
- [x] 9.5 Adicionar botão \"Excluir\" com diálogo de confirmação

## 10. Admin — Pedidos

- [x] 10.1 Criar componente `AdminPedidos` com visualização kanban (cards agrupados por status)
- [x] 10.2 Criar formulário de criação de pedido (seleciona cliente via busca, adiciona itens com quantidade)
- [x] 10.3 Implementar transição de status nos cards (botão próximo status)
- [x] 10.4 Criar modal de detalhes do pedido (cliente, itens, valores, datas)
- [x] 10.5 Adicionar filtro por mês/ano

## 11. Landing Page — Integração Dinâmica

- [x] 11.1 Adicionar `useEffect` em `app/page.tsx` para buscar produtos de `/api/produtos?ativos=true`
- [x] 11.2 Substituir array hardcoded `highlights` pela resposta da API, mantendo fallback
- [x] 11.3 Adicionar estado de loading com Skeleton cards enquanto a API carrega
