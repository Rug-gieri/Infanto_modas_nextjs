## ADDED Requirements

### Requirement: Sidebar de navegação no admin

O layout admin SHALL exibir uma sidebar fixa à esquerda (recolhível em mobile via Sheet) com links para Dashboard, Clientes, Produtos e Pedidos. O item ativo SHALL ser destacado visualmente com cor de fundo primária do tema bubblegum.

#### Scenario: Sidebar com item ativo destacado

- **WHEN** o admin está na seção Produtos
- **THEN** o link "Produtos" na sidebar tem fundo rosa/bubblegum e os demais links têm estilo neutro

#### Scenario: Navegar entre seções

- **WHEN** o admin clica em "Pedidos" na sidebar
- **THEN** o conteúdo principal muda para a seção de Pedidos e "Pedidos" fica destacado na sidebar

### Requirement: Sidebar responsiva em mobile

Em telas menores que 768px (`md:` breakpoint), a sidebar SHALL ser substituída por um menu hambúrguer que abre via shadcn/ui Sheet, seguindo o mesmo padrão do `Navbar` do site principal.

#### Scenario: Menu mobile no admin

- **WHEN** o admin acessa o painel em um dispositivo mobile (largura < 768px)
- **THEN** a sidebar não é visível fixa; um botão hambúrguer abre o Sheet com os links de navegação

### Requirement: Botão de logout e voltar ao site na sidebar

A sidebar SHALL conter um botão "Sair" que limpa o token do `localStorage` e retorna ao login. Também SHALL conter um link "← Voltar ao site" que abre a landing page.

#### Scenario: Logout limpa sessão

- **WHEN** o admin clica em "Sair" na sidebar
- **THEN** o token é removido do localStorage e a tela de login é exibida
