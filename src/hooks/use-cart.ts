import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  promo_price?: number;
  image?: string;
  quantity: number;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  itemsCount: number;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === newItem.id && item.size === newItem.size
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === newItem.id && item.size === newItem.size
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (id, size) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.size === size)),
        });
      },
      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      get itemsCount() {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
      get total() {
        return get().items.reduce(
          (acc, item) => acc + (item.promo_price || item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: 'martins-multimarcas-cart',
    }
  )
);
