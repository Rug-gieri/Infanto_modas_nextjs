# admin-dashboard

## Purpose

TBD

### Requirement: Dashboard com cards de métricas

A primeira seção do admin (Dashboard) SHALL exibir 4 cards com métricas: Total de Clientes, Produtos Ativos, Pedidos do Mês, e Receita Estimada (soma do valor_total dos pedidos do mês). Os dados SHALL ser carregados via `GET /api/admin/dashboard`.

#### Scenario: Dashboard carrega métricas

- **WHEN** o admin acessa o Dashboard após login
- **THEN** 4 cards são exibidos com os valores reais do banco

#### Scenario: Dashboard sem dados

- **WHEN** o banco está vazio (sem clientes, produtos ou pedidos)
- **THEN** os cards mostram zero ou "—" para cada métrica

### Requirement: Cards de métricas usam shadcn/ui Card

Os cards do dashboard SHALL usar o componente `Card` + `CardContent` do shadcn/ui com o tema bubblegum. Cada card deve ter um ícone (emoji), valor em destaque e label descritivo.

#### Scenario: Card de clientes

- **WHEN** o dashboard renderiza o card de clientes
- **THEN** exibe ícone, número total e label "Total de clientes"