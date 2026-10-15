import { NextRequest, NextResponse } from 'next/server'
import { handleCorsOptions, jsonWithCors } from '../../lib/cors'

function normalizeProduto(produto: Record<string, unknown>) {
  return {
    ...produto,
    preco:
      typeof produto.preco === 'number'
        ? produto.preco
        : typeof produto.preco === 'string'
          ? Number(produto.preco)
          : 0,
  }
}

function normalizeProdutos(produtos: Record<string, unknown>[]) {
  return produtos.map(normalizeProduto)
}

const MOCK_PRODUTOS = [
  {
    id: 1,
    nome: 'Conjunto Feminino Rosa Chiclete',
    descricao: 'Conjunto super confortável em algodão com detalhes delicados.',
    preco: 89.9,
    categoria: 'conjuntos',
    faixa_etaria: '1–3 anos',
    imagem_url: '/conjunto_feminino_pink.jpg',
    badge: 'Mais Vendido',
    ativo: true,
  },
  {
    id: 2,
    nome: 'Conjunto Menino Azul Royal',
    descricao: 'Look moderno e fresquinho para passeios e brincadeiras.',
    preco: 94.9,
    categoria: 'conjuntos',
    faixa_etaria: '4–6 anos',
    imagem_url: '/conjunto_menino_blue.jpg',
    badge: 'Destaque',
    ativo: true,
  },
  {
    id: 3,
    nome: 'Conjunto Menino Verde Floresta',
    descricao: 'Peça macia e resistente para o dia a dia e muitas aventuras.',
    preco: 79.9,
    categoria: 'conjuntos',
    faixa_etaria: '1–3 anos',
    imagem_url: '/conjunto_menino_green.jpg',
    badge: 'Novo',
    ativo: true,
  },
  {
    id: 4,
    nome: 'Casaco Tricô Bege Avelã',
    descricao: 'Tricô quentinho e sofisticado, toque suave e antialérgico.',
    preco: 129.9,
    categoria: 'trico',
    faixa_etaria: '0–12m',
    imagem_url: '/trico_beje.jpg',
    badge: 'Coleção Inverno',
    ativo: true,
  },
  {
    id: 5,
    nome: 'Conjunto Menino Vermelho Energia',
    descricao: 'Estilo vibrante com caimento confortável.',
    preco: 84.9,
    categoria: 'conjuntos',
    faixa_etaria: '4–6 anos',
    imagem_url: '/conjunto_menino_red.jpg',
    badge: null,
    ativo: true,
  },
  {
    id: 6,
    nome: 'Casaco Tricô Branco Neve',
    descricao: 'Perfeito para ocasiões especiais e batizados.',
    preco: 119.9,
    categoria: 'trico',
    faixa_etaria: '0–12m',
    imagem_url: '/trico_branco.jpg',
    badge: null,
    ativo: true,
  },
]

export function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req)
}

export async function GET(req: NextRequest) {
  return jsonWithCors(req, { produtos: MOCK_PRODUTOS })
}

