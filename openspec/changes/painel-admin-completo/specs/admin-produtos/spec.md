## ADDED Requirements

### Requirement: Lista de produtos com busca e filtro por categoria

O painel admin SHALL exibir uma tabela de produtos com colunas: Imagem, Nome, Categoria, Preço, Badge, Status (Ativo/Inativo), Ações (Editar/Excluir). Deve haver campo de busca textual (nome) e dropdown de filtro por categoria.

#### Scenario: Tabela exibe produtos cadastrados

- **WHEN** o admin acessa a seção Produtos e há produtos no banco
- **THEN** a tabela lista todos os produtos com suas informações

#### Scenario: Busca filtra por nome

- **WHEN** o admin digita "tricô" no campo de busca
- **THEN** apenas produtos cujo nome contém "tricô" são exibidos

#### Scenario: Filtro por categoria

- **WHEN** o admin seleciona "bebê" no dropdown de categoria
- **THEN** apenas produtos da categoria "bebê" são exibidos

### Requirement: Formulário de criação de produto

O admin SHALL poder criar um novo produto via formulário com campos: Nome, Descrição, Preço, Categoria (select), Faixa Etária, URL da Imagem, Badge (select), Ativo (checkbox). Todos os campos obrigatórios devem ser validados antes do envio.

#### Scenario: Criar produto com sucesso

- **WHEN** o admin preenche todos os campos obrigatórios e clica em "Salvar"
- **THEN** o produto é criado via API, a tabela é atualizada, e uma mensagem de sucesso é exibida

#### Scenario: Criar produto sem campos obrigatórios

- **WHEN** o admin tenta salvar sem preencher Nome
- **THEN** uma mensagem de erro de validação é exibida e o formulário não é enviado

### Requirement: Edição de produto existente

O admin SHALL poder editar um produto clicando no botão "Editar" na tabela. O formulário deve pré-preencher todos os campos com os valores atuais do produto.

#### Scenario: Editar produto

- **WHEN** o admin clica em "Editar" no produto "Tricô Beje" e altera o preço para R$ 99,90
- **THEN** o produto é atualizado via API e a tabela reflete o novo preço

### Requirement: Exclusão de produto com confirmação

O admin SHALL poder excluir um produto clicando no botão "Excluir". Um diálogo de confirmação deve ser exibido antes da exclusão.

#### Scenario: Excluir produto confirmado

- **WHEN** o admin clica em "Excluir", confirma no diálogo
- **THEN** o produto é removido do banco e some da tabela

#### Scenario: Excluir produto cancelado

- **WHEN** o admin clica em "Excluir" mas cancela no diálogo
- **THEN** o produto permanece na tabela sem alterações

### Requirement: Toggle ativo/inativo inline

O admin SHALL poder ativar/desativar um produto diretamente na tabela via um badge clicável, sem abrir o formulário de edição.

#### Scenario: Desativar produto

- **WHEN** o admin clica no badge "Ativo" de um produto
- **THEN** o produto é marcado como inativo via API e o badge muda para "Inativo"
