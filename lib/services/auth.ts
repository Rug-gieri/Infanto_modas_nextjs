import { requestJson } from '@/lib/http/client'

export async function loginAdmin(senha: string) {
  return requestJson<{ authenticated: boolean }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ senha }),
  })
}

export async function logoutAdmin() {
  return requestJson<{ authenticated: boolean }>('/api/admin/logout', {
    method: 'POST',
  })
}

export async function getAdminSession() {
  return requestJson<{ authenticated: boolean }>('/api/admin/session')
}
