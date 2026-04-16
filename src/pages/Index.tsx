import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "catalog" | "cart" | "contacts";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: "hot" | "new";
  category: string;
  emoji: string;
  image?: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Смарт-часы Nova X", description: "Умные часы с AMOLED экраном, мониторингом здоровья и 7 днями автономной работы", price: 12900, oldPrice: 16900, badge: "hot", category: "Электроника", emoji: "⌚", image: "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/89ed97b9-6b6b-4fb6-8479-a1172104c54d.jpg" },
  { id: 2, name: "Наушники Air Pro", description: "Беспроводные наушники с активным шумоподавлением и Hi-Fi звуком 24 бит", price: 8490, badge: "new", category: "Электроника", emoji: "🎧", image: "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/77712b2f-b09a-412f-ac03-9805065e9320.jpg" },
  { id: 3, name: "Рюкзак Urban Drift", description: "Городской рюкзак из водонепроницаемой ткани с USB-портом и отделением для ноутбука", price: 4990, oldPrice: 6500, category: "Аксессуары", emoji: "🎒", image: "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/7c18050d-4b0a-4b7b-88f0-213e0b69ccaa.jpg" },
  { id: 4, name: "Лампа Ambient Glow", description: "Умная RGB лампа с 16 млн оттенков, управлением со смартфона и режимами освещения", price: 2990, badge: "new", category: "Дом", emoji: "💡", image: "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/9c63f169-80a8-4313-af7e-3aefc784d556.jpg" },
  { id: 5, name: "Кроссовки FlexRun", description: "Лёгкие кроссовки с технологией амортизации и дышащей мембраной для городского бега", price: 9800, oldPrice: 12000, badge: "hot", category: "Обувь", emoji: "👟", image: "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/f1ae1c4d-d26e-473b-a12c-66b6c6f5909f.jpg" },
  { id: 6, name: "Термокружка MagKeep", description: "Термокружка из нержавеющей стали, удерживает температуру 24 часа, крышка-непроливайка", price: 1890, category: "Дом", emoji: "☕", image: "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/71563e46-da5d-4809-8b0e-4e8e1f296644.jpg" },
  { id: 7, name: "Клавиатура Mech RGB", description: "Механическая клавиатура с RGB подсветкой, тихими переключателями и алюминиевым корпусом", price: 7200, badge: "new", category: "Электроника", emoji: "⌨️", image: "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/81878b2b-248a-414d-adfa-f9eca3acb884.jpg" },
  { id: 8, name: "Сумка Leather Edit", description: "Кожаная сумка ручной работы с отделением для документов и съёмным плечевым ремнём", price: 5600, category: "Аксессуары", emoji: "👜", image: "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/4c202f3c-145b-45f0-8846-04e5b0914879.jpg" },
];

const CATEGORIES = ["Все", "Электроника", "Аксессуары", "Дом", "Обувь"];

const HERO_IMG = "https://cdn.poehali.dev/projects/fb00ab1f-e88b-4e54-b75e-fb3bb24680f6/files/b66a8b4c-dc69-41cc-b407-f306235b660a.jpg";

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [searchFocused, setSearchFocused] = useState(false);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "Все" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  }

  function changeQty(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "catalog", label: "Каталог", icon: "Grid3X3" },
    { id: "cart", label: "Корзина", icon: "ShoppingCart" },
    { id: "contacts", label: "Контакты", icon: "Phone" },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-white relative">
      {/* Ambient orbs */}
      <div
        className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)", zIndex: 0 }}
      />
      <div
        className="fixed bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)", zIndex: 0 }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/8" style={{ background: "rgba(8,8,16,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setPage("home")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-sm font-bold font-display">N</div>
            <span className="font-display text-xl font-bold tracking-wide gradient-text">NОВА</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium font-body transition-all duration-200 relative ${
                  page === item.id ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {page === item.id && (
                  <span className="absolute inset-0 gradient-bg-subtle rounded-lg border border-purple-500/30" />
                )}
                <span className="relative">{item.label}</span>
                {item.id === "cart" && cartCount > 0 && (
                  <span className="ml-1 relative inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold gradient-bg rounded-full text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <button onClick={() => setPage("cart")} className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Icon name="ShoppingCart" size={22} className="text-white/70" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 gradient-bg rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex border-t border-white/5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
                page === item.id ? "text-purple-400" : "text-white/40"
              }`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="relative z-10">
        {/* HOME PAGE */}
        {page === "home" && (
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
                {PRODUCTS.filter((p) => p.badge).map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* CATALOG PAGE */}
        {page === "catalog" && (
          <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h1 className="font-display text-4xl font-bold">КАТАЛОГ</h1>
              <div className="relative max-w-md w-full">
                <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Поиск по названию и описанию..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/30 outline-none transition-all duration-300 border ${
                    searchFocused ? "search-active" : "border-white/10"
                  }`}
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium font-body transition-all duration-200 ${
                    activeCategory === cat
                      ? "gradient-bg text-white"
                      : "border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-white/40 font-body">Ничего не найдено. Попробуй другой запрос.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product, i) => (
                  <div key={product.id} style={{ animationDelay: `${i * 0.05}s` }} className="animate-fade-in">
                    <ProductCard product={product} onAdd={addToCart} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CART PAGE */}
        {page === "cart" && (
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
        )}

        {/* CONTACTS PAGE */}
        {page === "contacts" && (
          <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
            <h1 className="font-display text-4xl font-bold mb-2">КОНТАКТЫ</h1>
            <p className="text-white/50 font-body mb-10">Свяжитесь с нами — ответим в течение часа</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатно по России" },
                  { icon: "Mail", label: "Email", value: "hello@nova-shop.ru", sub: "Ответим в течение часа" },
                  { icon: "MapPin", label: "Адрес", value: "Москва, ул. Тверская, 1", sub: "Пн-Вс, 10:00–21:00" },
                  { icon: "MessageCircle", label: "Телеграм", value: "@nova_shop", sub: "Чат поддержки 24/7" },
                ].map((c) => (
                  <div key={c.label} className="card-glass card-hover rounded-2xl p-5 border border-white/8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-bg-subtle border border-purple-500/25 flex items-center justify-center shrink-0">
                      <Icon name={c.icon} size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40 font-body mb-0.5">{c.label}</div>
                      <div className="font-display font-semibold">{c.value}</div>
                      <div className="text-xs text-white/40 font-body">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-glass rounded-2xl p-6 border border-white/8">
                <h3 className="font-display text-xl font-bold mb-5">Написать нам</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 font-body mb-1.5 block">Ваше имя</label>
                    <input
                      type="text"
                      placeholder="Иван Иванов"
                      className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/25 outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 font-body mb-1.5 block">Email или телефон</label>
                    <input
                      type="text"
                      placeholder="ivan@mail.ru"
                      className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/25 outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 font-body mb-1.5 block">Сообщение</label>
                    <textarea
                      placeholder="Ваш вопрос или предложение..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/25 outline-none border border-white/10 focus:border-purple-500/50 transition-colors resize-none"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    />
                  </div>
                  <button className="btn-primary w-full py-3 rounded-xl font-semibold font-body text-sm">
                    Отправить сообщение
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-sm font-bold font-display">N</div>
            <span className="font-display font-bold gradient-text">NОВА</span>
          </div>
          <p className="text-white/25 text-xs font-body">© 2026 NОВА. Все права защищены.</p>
          <div className="flex gap-4 text-xs text-white/30 font-body">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Политика конфиденциальности</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Условия использования</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  return (
    <div className="card-glass card-hover rounded-2xl border border-white/8 overflow-hidden group">
      <div className="aspect-square relative overflow-hidden border-b border-white/5">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full gradient-bg-subtle flex items-center justify-center text-5xl">
            <span className="group-hover:scale-110 transition-transform duration-300 inline-block">{product.emoji}</span>
          </div>
        )}
        {product.badge && (
          <span className={`absolute top-3 left-3 ${product.badge === "hot" ? "badge-hot" : "badge-new"}`}>
            {product.badge === "hot" ? "Хит" : "Новинка"}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-[10px] text-white/35 font-body mb-1 uppercase tracking-wide">{product.category}</div>
        <h3 className="font-display font-semibold text-sm leading-tight mb-2">{product.name}</h3>
        <p className="text-white/40 text-xs font-body leading-relaxed mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-display font-bold text-lg gradient-text">{product.price.toLocaleString()} ₽</div>
            {product.oldPrice && (
              <div className="text-white/30 text-xs line-through font-body">{product.oldPrice.toLocaleString()} ₽</div>
            )}
          </div>
          <button
            onClick={() => onAdd(product)}
            className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all duration-150 shadow-lg"
          >
            <Icon name="Plus" size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}