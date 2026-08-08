import { requestJson } from '@/lib/http/client'
import type { Cliente, ClientePedido, ClienteUpdateInput } from '@/lib/types/admin'

export async function listClientes() {
  const data = await requestJson<{ clientes: Cliente[] }>('/api/admin/clientes')
  return data.clientes
}

export async function updateCliente(input: ClienteUpdateInput) {
  return requestJson<{ cliente: Cliente }>('/api/admin/clientes', {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export async function deleteCliente(id: number) {
  return requestJson<{ success: boolean }>('/api/admin/clientes', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}

export async function listPedidosByCliente(clienteId: number) {
  const data = await requestJson<{ pedidos: ClientePedido[] }>(`/api/admin/clientes/${clienteId}/pedidos`)
  return data.pedidos
}
