export type Produto = {
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

export type CartItem = {
  produto_id: number
  nome: string
  preco: number
  imagem_url: string
  quantidade: number
  faixa_etaria?: string | null
}

export type PedidoItem = {
  id: number
  produto_id: number
  produto_nome: string
  quantidade: number
  preco_unitario: number
  imagem_url?: string | null
}

export type PedidoResumo = {
  id: number
  status: string
  status_pagamento: string
  forma_pagamento: string
  valor_total: number
  nome_cliente: string | null
  email_cliente: string | null
  telefone_cliente: string | null
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  referencia: string | null
  observacoes: string | null
  criado_em: string
  itens: PedidoItem[]
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatCep(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)

  if (digits.length <= 5) {
    return digits
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 2) {
    return digits
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function normalizeProduto(produto: Omit<Produto, 'preco'> & { preco: number | string }): Produto {
  return {
    ...produto,
    preco: typeof produto.preco === 'number' ? produto.preco : Number(produto.preco) || 0,
  }
}
