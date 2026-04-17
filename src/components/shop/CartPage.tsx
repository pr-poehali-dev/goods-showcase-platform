import Icon from "@/components/ui/icon";
import { CartItem, Page } from "@/types/shop";

interface Props {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  setPage: (p: Page) => void;
  removeFromCart: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
}

export default function CartPage({ cart, cartCount, cartTotal, setPage, removeFromCart, changeQty }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      <h1 className="font-display text-4xl font-bold mb-8">КОРЗИНА</h1>
      {cart.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-6 animate-float inline-block">🛒</div>
          <p className="text-white/40 font-body text-lg mb-6">Корзина пуста</p>
          <button onClick={() => setPage("catalog")} className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm font-body">
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="card-glass rounded-2xl p-4 border border-white/8 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-bg-subtle flex items-center justify-center text-2xl">{item.product.emoji}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-sm truncate">{item.product.name}</div>
                  <div className="text-white/40 text-xs font-body mt-0.5">{item.product.category}</div>
                  <div className="gradient-text font-display font-bold text-lg mt-1">{item.product.price.toLocaleString()} ₽</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => changeQty(item.product.id, -1)} className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/60 hover:border-purple-500/50 hover:text-white transition-all">
                    <Icon name="Minus" size={14} />
                  </button>
                  <span className="w-8 text-center font-display font-bold">{item.qty}</span>
                  <button onClick={() => changeQty(item.product.id, 1)} className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/60 hover:border-purple-500/50 hover:text-white transition-all">
                    <Icon name="Plus" size={14} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="card-glass rounded-2xl p-6 border border-white/8 h-fit">
            <h3 className="font-display text-xl font-bold mb-6">Итого</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm font-body">
                <span className="text-white/50">Товары ({cartCount})</span>
                <span>{cartTotal.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-white/50">Доставка</span>
                <span className="text-green-400">Бесплатно</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-display font-bold text-xl">
                <span>Всего</span>
                <span className="gradient-text">{cartTotal.toLocaleString()} ₽</span>
              </div>
            </div>
            <button className="btn-primary w-full py-3 rounded-xl font-semibold font-body text-sm">
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
