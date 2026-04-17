import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import { Product, CATEGORIES } from "@/types/shop";
import ProductCard from "./ProductCard";

interface Props {
  allProducts: Product[];
  addToCart: (p: Product) => void;
}

export default function CatalogPage({ allProducts, addToCart }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "Все" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, allProducts]);

  return (
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
  );
}
