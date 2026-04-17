import { useState, useEffect } from "react";
import { Page, Product, CartItem, API } from "@/types/shop";
import Header from "@/components/shop/Header";
import HomePage from "@/components/shop/HomePage";
import CatalogPage from "@/components/shop/CatalogPage";
import CartPage from "@/components/shop/CartPage";
import ContactsPage from "@/components/shop/ContactsPage";

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        if (d.products && d.products.length > 0) setDbProducts(d.products);
      })
      .catch(() => {});
  }, []);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);

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

      <Header page={page} setPage={setPage} cartCount={cartCount} />

      <main className="relative z-10">
        {page === "home" && (
          <HomePage allProducts={dbProducts} setPage={setPage} addToCart={addToCart} />
        )}
        {page === "catalog" && (
          <CatalogPage allProducts={dbProducts} addToCart={addToCart} />
        )}
        {page === "cart" && (
          <CartPage
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartTotal}
            setPage={setPage}
            removeFromCart={removeFromCart}
            changeQty={changeQty}
          />
        )}
        {page === "contacts" && <ContactsPage />}
      </main>

      <footer className="border-t border-white/8 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-sm font-bold font-display">I</div>
            <span className="font-display font-bold gradient-text">Ilyashop</span>
          </div>
          <p className="text-white/25 text-xs font-body">© 2026 Ilyashop. Все права защищены.</p>
          <div className="flex gap-4 text-xs text-white/30 font-body">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Политика конфиденциальности</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Условия использования</span>
          </div>
        </div>
      </footer>
    </div>
  );
}