## ADDED Requirements

### Requirement: Editar dados do cliente

O admin SHALL poder editar os dados de um cliente (nome, email, telefone, newsletter) clicando em "Editar" na linha da tabela de clientes. O formulário deve pré-preencher os dados atuais.

#### Scenario: Editar telefone do cliente

- **WHEN** o admin clica em "Editar" no cliente "Maria", altera o telefone e salva
- **THEN** o cliente é atualizado via API e a tabela reflete a alteração

### Requirement: Excluir cliente com confirmação

O admin SHALL poder excluir um cliente clicando no botão "Excluir". Um diálogo de confirmação SHALL ser exibido, alertando que pedidos vinculados serão preservados (cliente_id fica NULL por ON DELETE SET NULL).

#### Scenario: Excluir cliente confirmado

- **WHEN** o admin clica em "Excluir", confirma no diálogo
- **THEN** o cliente é removido da tabela `clientes` e some da listagem

### Requirement: Visualizar histórico de pedidos do cliente

O admin SHALL poder visualizar todos os pedidos de um cliente clicando em "Pedidos" na linha da tabela. Um modal ou lista deve exibir os pedidos com status, data e valor total.

#### Scenario: Cliente sem pedidos

- **WHEN** o admin clica em "Pedidos" de um cliente sem pedidos
- **THEN** uma mensagem "Nenhum pedido encontrado" é exibida

#### Scenario: Cliente com pedidos

- **WHEN** o admin clica em "Pedidos" de um cliente com 3 pedidos
- **THEN** os 3 pedidos são listados com status, data e valor

### Requirement: Exportar lista de clientes para CSV

O admin SHALL poder exportar a lista de clientes (filtrada ou completa) para um arquivo CSV. O CSV deve incluir: Nome, Email, Telefone, Newsletter, Data de Cadastro.

#### Scenario: Exportar todos os clientes

- **WHEN** o admin clica em "Exportar CSV" sem filtro ativo
- **THEN** um arquivo `.csv` com todos os clientes é baixado

#### Scenario: Exportar clientes filtrados

- **WHEN** o admin busca por "maria" e clica em "Exportar CSV"
- **THEN** apenas os clientes cujo nome contém "maria" são incluídos no CSV
