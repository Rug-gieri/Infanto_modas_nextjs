## ADDED Requirements

### Requirement: API de produtos segue o padrão de autenticação admin

A rota `/api/produtos` SHALL exigir o header `x-admin-token` com o valor de `ADMIN_SECRET` para todas as operações de escrita (POST, PUT, DELETE). O GET público (com `?ativos=true`) SHALL ser acessível sem autenticação.

#### Scenario: POST sem token retorna 401

- **WHEN** uma requisição POST é feita para `/api/produtos` sem o header `x-admin-token`
- **THEN** a API retorna status 401 com `{ error: "Acesso não autorizado." }`

#### Scenario: POST com token válido cria produto

- **WHEN** uma requisição POST é feita com token válido e body `{ nome, preco, categoria, imagem_url }`
- **THEN** a API retorna status 201 com `{ message: "...", produto: {...} }`

### Requirement: Criar produto com validação de campos obrigatórios

A API SHALL validar que `nome`, `preco`, `categoria` e `imagem_url` estão presentes no POST. Campos opcionais: `descricao`, `faixa_etaria`, `badge`, `ativo`.

#### Scenario: POST sem nome retorna 400

- **WHEN** o body do POST não contém o campo `nome`
- **THEN** a API retorna status 400 com `{ error: "Nome, preço, categoria e imagem são obrigatórios." }`

### Requirement: Listar produtos com filtro por categoria e status

O GET autenticado SHALL retornar todos os produtos. Se query param `?categoria=feminino` for passado, filtrar por categoria. Se `?ativos=true`, retornar apenas produtos com `ativo = true`. Ordenação por `criado_em DESC`.

#### Scenario: GET com filtro de categoria

- **WHEN** uma requisição GET autenticada é feita para `/api/produtos?categoria=bebe`
- **THEN** a API retorna apenas produtos da categoria "bebe"

#### Scenario: GET público retorna apenas ativos

- **WHEN** uma requisição GET sem token é feita para `/api/produtos?ativos=true`
- **THEN** a API retorna apenas produtos com `ativo = true` sem exigir autenticação

### Requirement: Atualizar produto por ID

O PUT `/api/produtos` SHALL receber `{ id, ...campos }` e atualizar apenas os campos enviados. O campo `id` é obrigatório.

#### Scenario: PUT atualiza nome e preço

- **WHEN** uma requisição PUT é feita com `{ id: 1, nome: "Novo Nome", preco: 89.90 }`
- **THEN** a API atualiza apenas `nome` e `preco` do produto 1 e retorna o produto atualizado

#### Scenario: PUT com ID inexistente retorna 404

- **WHEN** uma requisição PUT é feita com `{ id: 999 }`
- **THEN** a API retorna status 404 com `{ error: "Produto não encontrado." }`

### Requirement: Excluir produto por ID

O DELETE `/api/produtos` SHALL receber `{ id }` e remover o produto do banco. Retornar 404 se o ID não existir.

#### Scenario: DELETE remove produto

- **WHEN** uma requisição DELETE autenticada é feita com `{ id: 1 }`
- **THEN** a API retorna `{ message: "Produto removido com sucesso." }`
