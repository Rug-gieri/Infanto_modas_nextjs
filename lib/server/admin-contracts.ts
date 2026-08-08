export interface DashboardMetricsDto {
  totalClientes: number
  produtosAtivos: number
  pedidosDoMes: number
  receitaEstimada: number
}

export interface ClienteDto {
  id: number
  nome: string
  email: string
  telefone: string | null
  aceita_newsletter: boolean
  criado_em: string
}

export interface PedidoItemDto {
  id: number
  produto_id: number
  produto_nome: string
  quantidade: number
  preco_unitario: number
}

export interface PedidoDto {
  id: number
  cliente_id: number
  cliente_nome?: string | null
  cliente_email?: string | null
  status: string
  valor_total: number
  observacoes: string | null
  criado_em: string
  itens: PedidoItemDto[]
}

export interface ProdutoDto {
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
