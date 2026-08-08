import { requestJson } from '@/lib/http/client'
import type { Produto, ProdutoSaveInput } from '@/lib/types/admin'

export async function listProdutos(categoria?: string) {
  const params = new URLSearchParams()

  if (categoria) {
    params.set('categoria', categoria)
  }

  const path = `/api/admin/produtos${params.toString() ? `?${params.toString()}` : ''}`
  const data = await requestJson<{ produtos: Produto[] }>(path)
  return data.produtos
}

export async function saveProduto(input: ProdutoSaveInput) {
  const method = input.id ? 'PUT' : 'POST'
  return requestJson<{ produto: Produto }>('/api/admin/produtos', {
    method,
    body: JSON.stringify(input),
  })
}

export async function deleteProduto(id: number) {
  return requestJson<{ success: boolean }>('/api/admin/produtos', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}
