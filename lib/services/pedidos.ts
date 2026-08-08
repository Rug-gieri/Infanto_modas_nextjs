import { requestJson } from '@/lib/http/client'
import type { ClienteInfo, CreatePedidoInput, Pedido, ProdutoOption } from '@/lib/types/admin'

export async function listPedidos() {
  const data = await requestJson<{ pedidos: Pedido[] }>('/api/admin/pedidos')
  return data.pedidos
}

export async function updatePedidoStatus(id: number, status: string) {
  return requestJson<{ pedido: Pedido }>('/api/admin/pedidos', {
    method: 'PUT',
    body: JSON.stringify({ id, status }),
  })
}

export async function createPedido(input: CreatePedidoInput) {
  return requestJson<{ pedido: Pedido }>('/api/admin/pedidos', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function listPedidoFormOptions() {
  const data = await requestJson<{ clientes: ClienteInfo[]; produtos: ProdutoOption[] }>('/api/admin/pedidos/options')
  return data
}
