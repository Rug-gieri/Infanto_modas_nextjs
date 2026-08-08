import { requestJson } from '@/lib/http/client'
import type { DashboardMetrics } from '@/lib/types/admin'

export async function getDashboardMetrics() {
  const data = await requestJson<{ metrics: DashboardMetrics }>('/api/admin/dashboard')
  return data.metrics
}
