import { NextRequest, NextResponse } from 'next/server'
import pool from '../../lib/db'
import { handleCorsOptions, jsonWithCors } from '../../lib/cors'

export function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req)
}

// POST — cadastrar novo cliente (newsletter)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      nome,
      email,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      referencia,
      aceita_newsletter,
    } = body

    if (!nome || !email) {
      return jsonWithCors(
        req,
        { error: 'Nome e e-mail são obrigatórios.' },
        { status: 400 }
      )
    }

    // Verifica se e-mail já existe
    const exists = await pool.query('SELECT id FROM clientes WHERE email = $1', [email])
    if (exists.rows.length > 0) {
      return jsonWithCors(
        req,
        { error: 'Este e-mail já está cadastrado.' },
        { status: 409 }
      )
    }

    const result = await pool.query(
      `INSERT INTO clientes (
         nome,
         email,
         telefone,
         cep,
         logradouro,
         numero,
         complemento,
         bairro,
         cidade,
         estado,
         referencia,
         aceita_newsletter
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado, referencia, aceita_newsletter, criado_em`,
      [
        nome,
        email,
        telefone || null,
        cep || null,
        logradouro || null,
        numero || null,
        complemento || null,
        bairro || null,
        cidade || null,
        estado || null,
        referencia || null,
        aceita_newsletter ?? true,
      ]
    )

    return jsonWithCors(
      req,
      { message: 'Cadastro realizado com sucesso! 🎉', cliente: result.rows[0] },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Erro ao cadastrar cliente:', err)
    return jsonWithCors(
      req,
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
