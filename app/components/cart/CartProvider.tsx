'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem } from '@/app/lib/shop'

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isReady: boolean
  addItem: (item: Omit<CartItem, 'quantidade'>) => void
  updateQuantity: (produtoId: number, quantidade: number) => void
  removeItem: (produtoId: number) => void
  clearCart: () => void
}

const STORAGE_KEY = 'infanto-modas-cart'

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)

      if (saved) {
        const parsed = JSON.parse(saved)

        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    } finally {
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [isReady, items])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantidade, 0)
    const subtotal = items.reduce((total, item) => total + item.preco * item.quantidade, 0)

    return {
      items,
      itemCount,
      subtotal,
      isReady,
      addItem(item) {
        setItems((currentItems) => {
          const existingItem = currentItems.find((currentItem) => currentItem.produto_id === item.produto_id)

          if (existingItem) {
            return currentItems.map((currentItem) =>
              currentItem.produto_id === item.produto_id
                ? { ...currentItem, quantidade: currentItem.quantidade + 1 }
                : currentItem
            )
          }

          return [...currentItems, { ...item, quantidade: 1 }]
        })
      },
      updateQuantity(produtoId, quantidade) {
        setItems((currentItems) => {
          if (quantidade <= 0) {
            return currentItems.filter((item) => item.produto_id !== produtoId)
          }

          return currentItems.map((item) =>
            item.produto_id === produtoId ? { ...item, quantidade } : item
          )
        })
      },
      removeItem(produtoId) {
        setItems((currentItems) => currentItems.filter((item) => item.produto_id !== produtoId))
      },
      clearCart() {
        setItems([])
      },
    }
  }, [isReady, items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
