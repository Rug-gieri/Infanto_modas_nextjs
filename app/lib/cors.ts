import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HEADERS = 'Content-Type, x-admin-token'
const ALLOWED_METHODS = 'GET, POST, PUT, DELETE, OPTIONS'

function getAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get('origin')
  const allowedOrigins = [process.env.ADMIN_APP_ORIGIN].filter(Boolean)

  if (!origin || allowedOrigins.length === 0) {
    return null
  }

  return allowedOrigins.includes(origin) ? origin : null
}

export function applyCorsHeaders(req: NextRequest, res: NextResponse) {
  const allowedOrigin = getAllowedOrigin(req)

  if (!allowedOrigin) {
    return res
  }

  res.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  res.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS)
  res.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS)
  res.headers.set('Vary', 'Origin')

  return res
}

export function jsonWithCors(req: NextRequest, body: unknown, init?: ResponseInit) {
  return applyCorsHeaders(req, NextResponse.json(body, init))
}

export function handleCorsOptions(req: NextRequest) {
  return applyCorsHeaders(req, new NextResponse(null, { status: 204 }))
}
