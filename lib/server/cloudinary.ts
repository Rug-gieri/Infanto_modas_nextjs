import { v2 as cloudinary } from 'cloudinary'

let isConfigured = false

function getEnv(name: 'CLOUDINARY_CLOUD_NAME' | 'CLOUDINARY_API_KEY' | 'CLOUDINARY_API_SECRET') {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} nao configurada.`)
  }

  return value
}

export function getCloudinary() {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: getEnv('CLOUDINARY_CLOUD_NAME'),
      api_key: getEnv('CLOUDINARY_API_KEY'),
      api_secret: getEnv('CLOUDINARY_API_SECRET'),
      secure: true,
    })

    isConfigured = true
  }

  return cloudinary
}
