import { requestJson } from '@/lib/http/client'

export interface UploadProdutoImageResponse {
  secure_url: string
  public_id: string
}

export async function uploadProdutoImage(file: File) {
  const formData = new FormData()
  formData.set('file', file)

  return requestJson<UploadProdutoImageResponse>('/api/admin/uploads/produtos', {
    method: 'POST',
    body: formData,
    headers: {},
  })
}
