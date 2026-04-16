import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/4b307dc4-c917-4396-a915-36d6e40b4d2e";
const CATEGORIES = ["Электроника", "Аксессуары", "Дом", "Обувь", "Другое"];
const ADMIN_PASSWORD = "143414";
const AUTH_KEY = "nova_admin_auth";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  old_price?: number | null;
  badge?: string | null;
  category: string;
  image_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

const EMPTY: Product = {
  name: "",
  description: "",
  price: 0,
  old_price: null,
  badge: null,
  category: "Электроника",
  image_url: null,
  sort_order: 0,
  is_active: true,
};

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLogin() {
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
      setPwInput("");
    }
  }

  async function load() {
    setLoading(true);
    const res = await fetch(`${API}/all`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const method = editing.id ? "PUT" : "POST";
    await fetch(API, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: number) {
    await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleteId(null);
    load();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, filename: file.name }),
      });
      const data = await res.json();
      if (data.url) setEditing((prev) => prev ? { ...prev, image_url: data.url } : prev);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center p-4">
        <div
          className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)", zIndex: 0 }}
        />
        <div className="card-glass border border-white/10 rounded-3xl p-8 w-full max-w-sm relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-2xl font-bold font-display mx-auto mb-4">N</div>
            <h1 className="font-display text-2xl font-bold">Вход в админку</h1>
            <p className="text-white/40 font-body text-sm mt-1">Введите пароль для доступа</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Icon name="Lock" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                value={pwInput}
                onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Пароль"
                className={`w-full pl-11 pr-4 py-3 rounded-xl font-body text-sm text-white placeholder-white/25 outline-none border transition-colors ${
                  pwError ? "border-red-500/60 bg-red-500/5" : "border-white/10 focus:border-purple-500/50"
                }`}
                style={pwError ? {} : { background: "rgba(255,255,255,0.04)" }}
                autoFocus
              />
            </div>
            {pwError && (
              <p className="text-red-400 text-xs font-body text-center animate-fade-in">Неверный пароль</p>
            )}
            <button
              onClick={handleLogin}
              className="btn-primary w-full py-3 rounded-xl font-body text-sm font-semibold"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div
        className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)", zIndex: 0 }}
      />

      <header className="sticky top-0 z-50 border-b border-white/8" style={{ background: "rgba(8,8,16,0.9)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-sm font-bold font-display">N</a>
            <span className="font-display text-lg font-bold text-white/60">/ Админ-панель</span>
          </div>
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-body"
          >
            <Icon name="Plus" size={16} />
            Добавить товар
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {loading ? (
          <div className="text-center py-20 text-white/30 font-body">Загрузка...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-white/40 font-body mb-6">Товаров пока нет</p>
            <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm font-body">
              Добавить первый товар
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="card-glass rounded-2xl border border-white/8 p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-bg-subtle flex items-center justify-center text-white/20">
                      <Icon name="Image" size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold truncate">{p.name}</span>
                    {p.badge && (
                      <span className={p.badge === "hot" ? "badge-hot" : "badge-new"}>
                        {p.badge === "hot" ? "Хит" : "Новинка"}
                      </span>
                    )}
                    {!p.is_active && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-white/30 font-body">скрыт</span>
                    )}
                  </div>
                  <div className="text-xs text-white/40 font-body mt-0.5">{p.category}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="gradient-text font-display font-bold">{p.price.toLocaleString()} ₽</span>
                    {p.old_price && <span className="text-white/30 text-xs line-through font-body">{p.old_price.toLocaleString()} ₽</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing({ ...p })}
                    className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-purple-500/50 transition-all"
                  >
                    <Icon name="Pencil" size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id!)}
                    className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="card-glass border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="p-6 border-b border-white/8 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{editing.id ? "Редактировать" : "Новый товар"}</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg text-white/40 hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Photo */}
              <div>
                <label className="text-xs text-white/40 font-body mb-2 block">Фото товара</label>
                <div
                  className="aspect-video rounded-2xl border-2 border-dashed border-white/15 overflow-hidden relative cursor-pointer hover:border-purple-500/50 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  {editing.image_url ? (
                    <img src={editing.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/30">
                      <Icon name="Upload" size={28} />
                      <span className="text-sm font-body">Нажмите чтобы загрузить</span>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(8,8,16,0.7)" }}>
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                {editing.image_url && (
                  <button onClick={() => setEditing((p) => p ? { ...p, image_url: null } : p)} className="mt-2 text-xs text-red-400 hover:text-red-300 font-body">
                    Удалить фото
                  </button>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="text-xs text-white/40 font-body mb-1.5 block">Название *</label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl font-body text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                  placeholder="Название товара"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-white/40 font-body mb-1.5 block">Описание</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl font-body text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 transition-colors resize-none"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                  placeholder="Описание товара"
                />
              </div>

              {/* Price + Old price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 font-body mb-1.5 block">Цена (₽) *</label>
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl font-body text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 font-body mb-1.5 block">Старая цена (₽)</label>
                  <input
                    type="number"
                    value={editing.old_price ?? ""}
                    onChange={(e) => setEditing({ ...editing, old_price: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-4 py-3 rounded-xl font-body text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    placeholder="Необязательно"
                  />
                </div>
              </div>

              {/* Category + Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 font-body mb-1.5 block">Категория</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl font-body text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                    style={{ background: "#0f0f1a" }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 font-body mb-1.5 block">Метка</label>
                  <select
                    value={editing.badge ?? ""}
                    onChange={(e) => setEditing({ ...editing, badge: e.target.value || null })}
                    className="w-full px-4 py-3 rounded-xl font-body text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                    style={{ background: "#0f0f1a" }}
                  >
                    <option value="">Без метки</option>
                    <option value="hot">Хит</option>
                    <option value="new">Новинка</option>
                  </select>
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditing({ ...editing, is_active: !editing.is_active })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${editing.is_active ? "gradient-bg" : "bg-white/10"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${editing.is_active ? "translate-x-5" : "translate-x-1"}`} />
                </button>
                <span className="text-sm font-body text-white/60">Показывать в каталоге</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border border-white/15 text-white/50 hover:text-white font-body text-sm font-semibold transition-all">
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editing.name || !editing.price}
                  className="flex-1 btn-primary py-3 rounded-xl font-body text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? "Сохраняю..." : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="card-glass border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-display text-xl font-bold mb-2">Удалить товар?</h3>
            <p className="text-white/40 font-body text-sm mb-6">Это действие нельзя отменить</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/50 hover:text-white font-body text-sm transition-all">
                Отмена
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-body text-sm font-semibold transition-all">
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}