export interface DashboardMetrics {
  totalClientes: number
  produtosAtivos: number
  pedidosDoMes: number
  receitaEstimada: number
}

export interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string | null
  aceita_newsletter: boolean
  criado_em: string
}

export interface ClienteUpdateInput {
  id: number
  nome: string
  email: string
  telefone: string | null
  aceita_newsletter: boolean
}

export interface PedidoItem {
  id: number
  produto_id: number
  produto_nome: string
  quantidade: number
  preco_unitario: number
}

export interface Pedido {
  id: number
  cliente_id: number
  cliente_nome: string | null
  cliente_email: string | null
  status: string
  valor_total: number
  observacoes: string | null
  criado_em: string
  itens: PedidoItem[]
}

export interface ClientePedido {
  id: number
  cliente_id: number
  status: string
  valor_total: number
  observacoes: string | null
  criado_em: string
  itens: Array<Pick<PedidoItem, 'produto_nome' | 'quantidade' | 'preco_unitario'>>
}

export interface Produto {
  id: number
  nome: string
  descricao: string | null
  preco: number
  categoria: string
  faixa_etaria: string | null
  imagem_url: string
  badge: string | null
  ativo: boolean
  criado_em: string
}

export interface ProdutoFormValues {
  nome: string
  descricao: string
  preco: number
  categoria: string
  faixa_etaria: string
  imagem_url: string
  badge: string
  ativo: boolean
}

export interface ProdutoSaveInput extends ProdutoFormValues {
  id?: number
}

export interface ClienteInfo {
  id: number
  nome: string
  email: string
  telefone: string | null
}

export interface ProdutoOption {
  id: number
  nome: string
  preco: number
}

export interface NovoPedidoItem {
  produto_id: number
  quantidade: number
}

export interface CreatePedidoInput {
  cliente_id: number
  observacoes: string | null
  itens: NovoPedidoItem[]
}
