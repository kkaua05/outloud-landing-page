import { createContext } from 'react'

export interface CartItem {
  productId: string
  size: string
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export type CartAction =
  | { type: 'add'; productId: string; size: string; max: number }
  | { type: 'setQuantity'; productId: string; size: string; quantity: number; max: number }
  | { type: 'remove'; productId: string; size: string }
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'hydrate'; items: CartItem[] }

const sameLine = (item: CartItem, productId: string, size: string) =>
  item.productId === productId && item.size === size

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((item) => sameLine(item, action.productId, action.size))
      const items = existing
        ? state.items.map((item) =>
            item === existing ? { ...item, quantity: clamp(item.quantity + 1, 1, action.max) } : item,
          )
        : [...state.items, { productId: action.productId, size: action.size, quantity: 1 }]
      return { ...state, items }
    }
    case 'setQuantity': {
      if (action.quantity < 1) {
        return {
          ...state,
          items: state.items.filter((item) => !sameLine(item, action.productId, action.size)),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          sameLine(item, action.productId, action.size)
            ? { ...item, quantity: clamp(action.quantity, 1, action.max) }
            : item,
        ),
      }
    }
    case 'remove':
      return {
        ...state,
        items: state.items.filter((item) => !sameLine(item, action.productId, action.size)),
      }
    case 'open':
      return { ...state, isOpen: true }
    case 'close':
      return { ...state, isOpen: false }
    case 'hydrate':
      return { ...state, items: action.items }
  }
}

/* ── Persistence (localStorage, defensive) ──────────────────── */

const STORAGE_KEY = 'outloud.bag.v1'

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.productId === 'string' &&
    typeof candidate.size === 'string' &&
    typeof candidate.quantity === 'number' &&
    Number.isInteger(candidate.quantity) &&
    candidate.quantity > 0
  )
}

/**
 * Restores the saved bag, dropping anything that no longer matches the
 * configured product/sizes (e.g. after a config change).
 */
export function loadItems(isValidLine: (item: CartItem) => boolean, max: number): CartItem[] {
  try {
    return parseItems(window.localStorage.getItem(STORAGE_KEY), isValidLine, max)
  } catch {
    return []
  }
}

function parseItems(
  raw: string | null,
  isValidLine: (item: CartItem) => boolean,
  max: number,
): CartItem[] {
  try {
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isCartItem)
      .filter(isValidLine)
      .map((item) => ({ ...item, quantity: clamp(item.quantity, 1, max) }))
  } catch {
    return []
  }
}

/**
 * Calls `onChange` when the bag is modified in another tab, so tabs never
 * overwrite each other's saved bag with stale state.
 */
export function subscribeToItems(
  onChange: (items: CartItem[]) => void,
  isValidLine: (item: CartItem) => boolean,
  max: number,
) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return
    onChange(parseItems(event.newValue, isValidLine, max))
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}

export function saveItems(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* Storage unavailable (private mode, quota) — the bag still works in memory. */
  }
}

/* ── Context ────────────────────────────────────────────────── */

export interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  /** `null` when the product has no configured price. */
  subtotal: number | null
  addItem: (size: string) => void
  setQuantity: (size: string, quantity: number) => void
  removeItem: (size: string) => void
  openCart: () => void
  closeCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
