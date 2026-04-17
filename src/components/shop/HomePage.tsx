import Icon from "@/components/ui/icon";
import { Product, Page, HERO_IMG } from "@/types/shop";
import ProductCard from "./ProductCard";

interface Props {
  allProducts: Product[];
  setPage: (p: Page) => void;
  addToCart: (p: Product) => void;
}

export default function HomePage({ allProducts, setPage, addToCart }: Props) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Новая коллекция 2026
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              СТИЛЬ<br />
              <span className="gradient-text">НОВОГО</span><br />
              ВРЕМЕНИ
            </h1>
            <p className="text-white/55 text-lg font-body leading-relaxed max-w-md">
              Премиальные товары для современного образа жизни. Технологии, стиль и качество в одном месте.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setPage("catalog")}
                className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm font-body"
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => setPage("contacts")}
                className="px-6 py-3 rounded-xl font-semibold text-sm font-body border border-white/15 text-white/70 hover:border-white/30 hover:text-white transition-all"
              >
                Связаться
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 gradient-bg opacity-20 rounded-3xl blur-2xl scale-110" />
            <img
              src={HERO_IMG}
              alt="Магазин NОВА"
              className="relative rounded-3xl w-full object-cover shadow-2xl border border-white/10 animate-float"
              style={{ aspectRatio: "1/1" }}
            />
            <div className="absolute -bottom-4 -left-4 card-glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-white/50 font-body">Товаров</div>
              <div className="font-display text-2xl font-bold gradient-text">500+</div>
            </div>
            <div className="absolute -top-4 -right-4 card-glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-white/50 font-body">Покупателей</div>
              <div className="font-display text-2xl font-bold gradient-text">12K</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "Truck", title: "Быстрая доставка", desc: "Доставим за 1-2 дня по всей России", color: "#7C3AED" },
            { icon: "Shield", title: "Гарантия качества", desc: "Официальная гарантия от 1 года на все товары", color: "#2563EB" },
            { icon: "RefreshCw", title: "Лёгкий возврат", desc: "30 дней на возврат без вопросов", color: "#06B6D4" },
          ].map((f) => (
            <div key={f.title} className="card-glass card-hover rounded-2xl p-6 border border-white/8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}22`, border: `1px solid ${f.color}44` }}
              >
                <Icon name={f.icon} size={22} style={{ color: f.color }} />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm font-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold">ХИТЫ ПРОДАЖ</h2>
          <button onClick={() => setPage("catalog")} className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors flex items-center gap-1">
            Все товары <Icon name="ArrowRight" size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allProducts.filter((p) => p.badge).map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </section>
    </div>
  );
}
