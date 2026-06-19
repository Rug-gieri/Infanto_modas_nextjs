# admin-pedidos

## Purpose

TBD

### Requirement: Lista de pedidos com visualização por status

O painel admin SHALL exibir pedidos em cards agrupados por status (pendente, confirmado, enviado, entregue, cancelado). Cada card mostra: ID do pedido, nome do cliente, data, valor total, quantidade de itens, e botões de ação (mudar status, ver detalhes).

#### Scenario: Cards de pedidos agrupados por status

- **WHEN** o admin acessa a seção Pedidos e há pedidos com diferentes status
- **THEN** os pedidos são exibidos em colunas separadas por status (kanban)

### Requirement: Criar pedido manualmente

O admin SHALL poder criar um pedido manual selecionando um cliente (busca por nome/email), adicionando produtos (com quantidade), e opcionalmente adicionando observações. O valor total é calculado automaticamente.

#### Scenario: Criar pedido com cliente e dois itens

- **WHEN** o admin seleciona um cliente, adiciona 2x do produto A e 1x do produto B, e clica em "Criar Pedido"
- **THEN** o pedido é criado com status "pendente" e aparece na coluna correspondente

#### Scenario: Criar pedido sem selecionar cliente

- **WHEN** o admin tenta criar pedido sem selecionar um cliente
- **THEN** uma validação impede o envio e exibe mensagem de erro

### Requirement: Transição de status do pedido

O admin SHALL poder alterar o status de um pedido clicando no botão de próximo status no card. A transição segue o fluxo: pendente → confirmado → enviado → entregue. Cancelado pode ser aplicado a partir de qualquer status.

#### Scenario: Mover pedido de pendente para confirmado

- **WHEN** o admin clica em "Confirmar" no card de um pedido pendente
- **THEN** o pedido muda para status "confirmado" e o card se move para a coluna correspondente

### Requirement: Detalhes do pedido

O admin SHALL poder visualizar os detalhes completos de um pedido clicando no card, incluindo: dados do cliente, lista de itens com preços unitários, valor total, observações, e datas de criação/atualização.

#### Scenario: Visualizar detalhes do pedido

- **WHEN** o admin clica no card do pedido #1
- **THEN** um modal ou painel expandido mostra todas as informações do pedido e seus itens

### Requirement: Filtro de pedidos por período e cliente

O admin SHALL poder filtrar pedidos por data (mês/ano) e buscar por nome do cliente.

#### Scenario: Filtrar pedidos de junho de 2026

- **WHEN** o admin seleciona o filtro de mês "Junho 2026"
- **THEN** apenas pedidos criados naquele mês são exibidos