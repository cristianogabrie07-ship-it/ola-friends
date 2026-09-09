import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  promo_price?: number | null | undefined;
  image?: string | null | undefined;
  quantity: number;
  size?: string | null | undefined;
  color?: string | null | undefined;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, size: string | undefined, quantity: number, color?: string) => void;
  clearCart: () => void;
}

// Dois itens são o mesmo produto só se id + tamanho + cor forem iguais
const sameVariant = (
  item: CartItem,
  id: string,
  size?: string | null,
  color?: string | null
) => item.id === id && (item.size ?? undefined) === (size ?? undefined) && (item.color ?? undefined) === (color ?? undefined);

// Helpers puros — calculam sempre em cima dos items atuais.
// (Não usar getters no store: o merge do persist no zustand converte
// getters em propriedades fixas e o total ficava travado em 0.)
export function getCartTotal(items: CartItem[]): number {
  return items.reduce(
    (acc, item) => acc + (item.promo_price || item.price) * item.quantity,
    0
  );
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem: CartItem) => {
        const items = get().items;
        const existingItem = items.find((item) =>
          sameVariant(item, newItem.id, newItem.size, newItem.color ?? undefined)
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              sameVariant(item, newItem.id, newItem.size, newItem.color ?? undefined)
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (id: string, size?: string, color?: string) => {
        set({
          items: get().items.filter((item) => !sameVariant(item, id, size, color)),
        });
      },
      updateQuantity: (id: string, size: string | undefined, quantity: number, color?: string) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color);
          return;
        }
        set({
          items: get().items.map((item) =>
            sameVariant(item, id, size, color) ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      // Salvar apenas os items — evita qualquer valor antigo sobrescrever cálculos
      name: 'martins-multimarcas-cart-v2',
      partialize: (state) => ({ items: state.items }),
    }
  )
);