import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { siteConfig } from '../config/site'
import {
  CartContext,
  cartReducer,
  loadItems,
  saveItems,
  subscribeToItems,
  type CartContextValue,
  type CartItem,
} from './cartStore'

const { product } = siteConfig
const MAX = product.maxQuantityPerLine

const isValidLine = (item: CartItem) =>
  item.productId === product.id &&
  product.sizes.some((size) => size.label === item.size && size.available)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({
    items: loadItems(isValidLine, MAX),
    isOpen: false,
  }))
  const [announcement, setAnnouncement] = useState({ id: 0, text: '' })

  useEffect(() => {
    saveItems(state.items)
  }, [state.items])

  useEffect(
    () => subscribeToItems((items) => dispatch({ type: 'hydrate', items }), isValidLine, MAX),
    [],
  )

  const announce = useCallback((text: string) => {
    setAnnouncement((previous) => ({ id: previous.id + 1, text }))
  }, [])

  const addItem = useCallback(
    (size: string) => {
      dispatch({ type: 'add', productId: product.id, size, max: MAX })
      dispatch({ type: 'open' })
      announce(`${product.name} ${product.colorway}, size ${size}, added to your bag.`)
    },
    [announce],
  )

  const setQuantity = useCallback(
    (size: string, quantity: number) => {
      dispatch({ type: 'setQuantity', productId: product.id, size, quantity, max: MAX })
      announce(quantity < 1 ? `Size ${size} removed from your bag.` : `Quantity updated to ${quantity}.`)
    },
    [announce],
  )

  const removeItem = useCallback(
    (size: string) => {
      dispatch({ type: 'remove', productId: product.id, size })
      announce(`Size ${size} removed from your bag.`)
    },
    [announce],
  )

  const openCart = useCallback(() => dispatch({ type: 'open' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'close' }), [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
    return {
      items: state.items,
      isOpen: state.isOpen,
      itemCount,
      subtotal: product.price === null ? null : itemCount * product.price,
      addItem,
      setQuantity,
      removeItem,
      openCart,
      closeCart,
    }
  }, [state, addItem, setQuantity, removeItem, openCart, closeCart])

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        <span key={announcement.id}>{announcement.text}</span>
      </div>
    </CartContext.Provider>
  )
}
