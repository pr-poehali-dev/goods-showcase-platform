import Icon from "@/components/ui/icon";
import { Page } from "@/types/shop";

interface Props {
  page: Page;
  setPage: (p: Page) => void;
  cartCount: number;
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "catalog", label: "Каталог", icon: "Grid3X3" },
  { id: "cart", label: "Корзина", icon: "ShoppingCart" },
  { id: "contacts", label: "Контакты", icon: "Phone" },
];

export default function Header({ page, setPage, cartCount }: Props) {
  return (
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
  );
}
