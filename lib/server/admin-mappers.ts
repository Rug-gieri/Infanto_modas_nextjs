import type {
  Cliente,
  ClienteInfo,
  ClientePedido,
  DashboardMetrics,
  Pedido,
  PedidoItem,
  Produto,
  ProdutoOption,
} from '@/lib/types/admin'
import type { ClienteDto, DashboardMetricsDto, PedidoDto, PedidoItemDto, ProdutoDto } from '@/lib/server/admin-contracts'

export function mapDashboardMetrics(dto: DashboardMetricsDto): DashboardMetrics {
  return {
    totalClientes: dto.totalClientes,
    produtosAtivos: dto.produtosAtivos,
    pedidosDoMes: dto.pedidosDoMes,
    receitaEstimada: dto.receitaEstimada,
  }
}

export function mapCliente(dto: ClienteDto): Cliente {
  return {
    id: dto.id,
    nome: dto.nome,
    email: dto.email,
    telefone: dto.telefone,
    aceita_newsletter: dto.aceita_newsletter,
    criado_em: dto.criado_em,
  }
}

export function mapClienteInfo(dto: ClienteDto): ClienteInfo {
  return {
    id: dto.id,
    nome: dto.nome,
    email: dto.email,
    telefone: dto.telefone,
  }
}

export function mapPedidoItem(dto: PedidoItemDto): PedidoItem {
  return {
    id: dto.id,
    produto_id: dto.produto_id,
    produto_nome: dto.produto_nome,
    quantidade: dto.quantidade,
    preco_unitario: dto.preco_unitario,
  }
}

export function mapPedido(dto: PedidoDto): Pedido {
  return {
    id: dto.id,
    cliente_id: dto.cliente_id,
    cliente_nome: dto.cliente_nome ?? null,
    cliente_email: dto.cliente_email ?? null,
    status: dto.status,
    valor_total: dto.valor_total,
    observacoes: dto.observacoes,
    criado_em: dto.criado_em,
    itens: (dto.itens || []).map(mapPedidoItem),
  }
}

export function mapClientePedido(dto: PedidoDto): ClientePedido {
  return {
    id: dto.id,
    cliente_id: dto.cliente_id,
    status: dto.status,
    valor_total: dto.valor_total,
    observacoes: dto.observacoes,
    criado_em: dto.criado_em,
    itens: (dto.itens || []).map((item) => ({
      produto_nome: item.produto_nome,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
    })),
  }
}

export function mapProduto(dto: ProdutoDto): Produto {
  return {
    id: dto.id,
    nome: dto.nome,
    descricao: dto.descricao,
    preco: dto.preco,
    categoria: dto.categoria,
    faixa_etaria: dto.faixa_etaria,
    imagem_url: dto.imagem_url,
    badge: dto.badge,
    ativo: dto.ativo,
    criado_em: dto.criado_em,
  }
}

export function mapProdutoOption(dto: ProdutoDto): ProdutoOption {
  return {
    id: dto.id,
    nome: dto.nome,
    preco: dto.preco,
  }
}
