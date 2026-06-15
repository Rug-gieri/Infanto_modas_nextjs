## Why

O painel admin atual só lista clientes cadastrados via newsletter. A loja precisa gerenciar seu catálogo de produtos, acompanhar pedidos feitos por WhatsApp e ter controle completo sobre os clientes. Sem isso, toda alteração no site (novos produtos, mudança de preços, ativar/desativar itens) depende de editar código.

## What Changes

- **Novo módulo de Produtos**: CRUD completo (criar, listar, editar, excluir) com tabela `produtos` no banco e API REST. Produtos podem ser ativados/desativados para controlar visibilidade no site.
- **Novo módulo de Pedidos**: CRUD de pedidos com status tracking (pendente → confirmado → enviado → entregue / cancelado). Vinculação cliente-produto via `pedido_itens`. Criação manual de pedidos (vendas por WhatsApp).
- **Melhorias na Gestão de Clientes**: Editar e excluir clientes; visualizar histórico de pedidos do cliente; exportar lista para CSV.
- **Landing page dinâmica**: Seções de Destaques e Categorias passam a carregar produtos do banco via API, em vez de usar dados hardcoded.
- **Navegação lateral no admin**: Sidebar com links para Dashboard, Clientes, Produtos e Pedidos, substituindo a página única atual.
- **Dashboard com métricas**: Cards com total de clientes, produtos ativos, pedidos do mês e receita estimada.
- **Novas tabelas no banco**: `produtos`, `pedidos`, `pedido_itens` (via init-db).

## Capabilities

### New Capabilities

- `admin-produtos`: CRUD de produtos no painel admin — formulário de criação/edição, listagem com busca e filtro por categoria, toggle ativo/inativo.
- `admin-pedidos`: Gestão de pedidos no painel admin — kanban por status, criação manual, vinculação cliente + itens, transição de status.
- `admin-clientes-melhorias`: Edição e exclusão de clientes, visualização do histórico de pedidos do cliente, exportação CSV.
- `admin-navigation`: Sidebar de navegação com links para Dashboard, Clientes, Produtos e Pedidos.
- `admin-dashboard`: Dashboard com cards de métricas (total clientes, produtos ativos, pedidos do mês, receita estimada).
- `produtos-api`: API REST `/api/produtos` com CRUD completo, search e filtro por categoria, protegida por `x-admin-token`.
- `pedidos-api`: API REST `/api/pedidos` com CRUD completo, transição de status, protegida por `x-admin-token`.

### Modified Capabilities

- `landing-page`: Seções Destaques e Categorias passam a buscar produtos da API `/api/produtos` em vez de usar dados hardcoded. A estrutura visual (Cards, Tabs, Badges) permanece igual.
- `admin-theme`: O tema bubblegum se estende às novas páginas do admin (Produtos, Pedidos, Dashboard, Sidebar), mantendo consistência visual.

## Impact

- **Banco de dados**: 3 novas tabelas (`produtos`, `pedidos`, `pedido_itens`). Atualização do `/api/init-db` para criá-las.
- **API**: 2 novas rotas (`/api/produtos`, `/api/pedidos`). Rota `/api/clientes` ganha PUT e DELETE.
- **Admin**: Refatoração completa do layout admin (`app/admin/layout.tsx` e `app/admin/page.tsx`) para suportar sidebar + múltiplas páginas.
- **Landing page**: `app/page.tsx` precisa buscar produtos da API. Os dados hardcoded (`highlights`, categorias) serão removidos.
- **Componentes**: Nenhum componente existente quebrado — o `CadastroForm`, `Gallery`, `Testimonials` etc. permanecem iguais.
