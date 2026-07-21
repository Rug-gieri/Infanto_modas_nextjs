import { NextRequest } from 'next/server'
import pool from '../../lib/db'
import { handleCorsOptions, jsonWithCors } from '../../lib/cors'

type CheckoutItem = {
  produto_id?: number
  quantidade?: number
}

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, maxLength) : null
}

export function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req)
}

export async function POST(req: NextRequest) {
  const client = await pool.connect()

  try {
    const body = await req.json()
    const nome = sanitizeText(body.nome, 100)
    const email = sanitizeText(body.email, 150)?.toLowerCase()
    const telefone = sanitizeText(body.telefone, 20)
    const cep = sanitizeText(body.cep, 9)
    const logradouro = sanitizeText(body.logradouro, 150)
    const numero = sanitizeText(body.numero, 20)
    const complemento = sanitizeText(body.complemento, 100)
    const bairro = sanitizeText(body.bairro, 100)
    const cidade = sanitizeText(body.cidade, 100)
    const estado = sanitizeText(body.estado, 2)?.toUpperCase()
    const referencia = sanitizeText(body.referencia, 150)
    const observacoes = sanitizeText(body.observacoes, 500)
    const itens = Array.isArray(body.itens) ? (body.itens as CheckoutItem[]) : []

    if (!nome || !email || !telefone || !cep || !logradouro || !numero || !bairro || !cidade || !estado) {
      return jsonWithCors(
        req,
        { error: 'Preencha nome, e-mail, telefone e todo o endereco obrigatorio.' },
        { status: 400 }
      )
    }

    if (itens.length === 0) {
      return jsonWithCors(req, { error: 'Seu carrinho esta vazio.' }, { status: 400 })
    }

    await client.query('BEGIN')

    const clienteExistente = await client.query('SELECT id FROM clientes WHERE email = $1', [email])

    let clienteId: number

    if (clienteExistente.rows.length > 0) {
      clienteId = clienteExistente.rows[0].id

      await client.query(
        `UPDATE clientes
         SET nome = $1,
             telefone = $2,
             cep = $3,
             logradouro = $4,
             numero = $5,
             complemento = $6,
             bairro = $7,
             cidade = $8,
             estado = $9,
             referencia = $10
         WHERE id = $11`,
        [nome, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado, referencia, clienteId]
      )
    } else {
      const novoCliente = await client.query(
        `INSERT INTO clientes
          (nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado, referencia, aceita_newsletter)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, false)
         RETURNING id`,
        [nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado, referencia]
      )

      clienteId = novoCliente.rows[0].id
    }

    const itensValidados: Array<{ produto_id: number; quantidade: number; preco_unitario: number }> = []
    let valorTotal = 0

    for (const item of itens) {
      const produtoId = Number(item.produto_id)
      const quantidade = Math.max(1, Number(item.quantidade) || 1)

      if (!Number.isInteger(produtoId) || produtoId <= 0) {
        await client.query('ROLLBACK')
        return jsonWithCors(req, { error: 'Item de carrinho invalido.' }, { status: 400 })
      }

      const produtoResult = await client.query(
        'SELECT id, preco FROM produtos WHERE id = $1 AND ativo = true',
        [produtoId]
      )

      if (produtoResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return jsonWithCors(req, { error: `Produto ${produtoId} nao esta mais disponivel.` }, { status: 400 })
      }

      const precoUnitario = Number(produtoResult.rows[0].preco)
      valorTotal += precoUnitario * quantidade
      itensValidados.push({ produto_id: produtoId, quantidade, preco_unitario: precoUnitario })
    }

    const pedidoResult = await client.query(
      `INSERT INTO pedidos
        (
          cliente_id,
          valor_total,
          forma_pagamento,
          status_pagamento,
          nome_cliente,
          email_cliente,
          telefone_cliente,
          cep,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          referencia,
          observacoes
        )
       VALUES ($1, $2, 'pix_manual', 'pendente', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id, status, status_pagamento, forma_pagamento, valor_total, criado_em`,
      [
        clienteId,
        valorTotal,
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
        observacoes,
      ]
    )

    const pedidoId = pedidoResult.rows[0].id

    for (const item of itensValidados) {
      await client.query(
        `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
      )
    }

    await client.query('COMMIT')

    return jsonWithCors(
      req,
      {
        message: 'Pedido criado com sucesso!',
        pedido: pedidoResult.rows[0],
      },
      { status: 201 }
    )
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Erro ao finalizar checkout:', err)
    return jsonWithCors(req, { error: 'Erro interno do servidor.' }, { status: 500 })
  } finally {
    client.release()
  }
}
