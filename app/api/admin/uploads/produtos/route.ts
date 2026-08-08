import { NextResponse } from 'next/server'

import { getAdminSessionToken, unauthorizedResponse, withUnauthorizedCookieCleanup } from '@/lib/server/admin-session'
import { getCloudinary } from '@/lib/server/cloudinary'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(request: Request) {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Selecione uma imagem para enviar.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Formato invalido. Use JPG, PNG ou WEBP.' }, { status: 400 })
    }

    if (file.size <= 0) {
      return NextResponse.json({ error: 'Arquivo de imagem invalido.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'A imagem deve ter no maximo 5 MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`
    const result = await getCloudinary().uploader.upload(dataUri, {
      folder: 'infanto/produtos',
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    })

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (error) {
    const status = error instanceof Error && error.message === 'Sessao expirada.' ? 401 : 500
    const response = NextResponse.json(
      {
        error: error instanceof Error && error.message ? error.message : 'Erro ao enviar imagem.',
      },
      { status }
    )

    return withUnauthorizedCookieCleanup(response, status)
  }
}
