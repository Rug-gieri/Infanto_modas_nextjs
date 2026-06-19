# pedidos-api

## Purpose

TBD

### Requirement: API de pedidos protegida por autenticação admin

Todas as operações em `/api/pedidos` SHALL exigir o header `x-admin-token` válido.

#### Scenario: Requisição sem token retorna 401

- **WHEN** qualquer requisição a `/api/pedidos` é feita sem `x-admin-token`
- **THEN** a API retorna status 401

### Requirement: Criar pedido com cliente e itens

O POST `/api/pedidos` SHALL receber `{ cliente_id, observacoes, itens: [{ produto_id, quantidade }] }`. Deve calcular `preco_unitario` e `valor_total` automaticamente a partir da tabela `produtos`.

#### Scenario: POST cria pedido com dois itens

- **WHEN** POST é feito com `cliente_id: 1` e dois itens `[{ produto_id: 1, quantidade: 2 }, { produto_id: 2, quantidade: 1 }]`
- **THEN** a API insere o pedido, calcula `valor_total` como a soma de `quantidade * preco` de cada item, e retorna status 201 com o pedido completo

#### Scenario: POST sem itens retorna 400

- **WHEN** POST é feito com array `itens` vazio ou ausente
- **THEN** a API retorna status 400 com `{ error: "O pedido deve ter pelo menos um item." }`

### Requirement: Listar pedidos com filtro por status

O GET `/api/pedidos` SHALL retornar pedidos ordenados por `criado_em DESC`. Aceitar query param `?status=pendente` para filtrar.

#### Scenario: GET retorna todos os pedidos

- **WHEN** GET é feito sem query params
- **THEN** a API retorna array de pedidos com cliente (nome, email) e itens (produto, quantidade, preco)

#### Scenario: GET filtra por status

- **WHEN** GET é feito com `?status=enviado`
- **THEN** a API retorna apenas pedidos com status "enviado"

### Requirement: Atualizar status do pedido

O PUT `/api/pedidos` SHALL receber `{ id, status }` e atualizar o status do pedido. Também SHALL atualizar o campo `atualizado_em` para `NOW()`.

#### Scenario: PUT transita pedido para confirmado

- **WHEN** PUT é feito com `{ id: 1, status: "confirmado" }`
- **THEN** o pedido 1 tem seu status alterado para "confirmado" e `atualizado_em` atualizado

### Requirement: Excluir pedido por ID

O DELETE `/api/pedidos` SHALL receber `{ id }` e remover o pedido e seus itens (via `ON DELETE CASCADE`).

#### Scenario: DELETE remove pedido e itens

- **WHEN** DELETE é feito com `{ id: 1 }`
- **THEN** o pedido 1 e todos os seus `pedido_itens` são removidos do banco