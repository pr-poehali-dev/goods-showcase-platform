import Icon from "@/components/ui/icon";
import { Product } from "@/types/shop";

interface Props {
  product: Product;
  onAdd: (p: Product) => void;
}

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="card-glass card-hover rounded-2xl border border-white/8 overflow-hidden group">
      <div className="aspect-square relative overflow-hidden border-b border-white/5">
        {(product.image_url || product.image) ? (
          <img
            src={(product.image_url || product.image)!}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full gradient-bg-subtle flex items-center justify-center text-5xl">
            <span className="group-hover:scale-110 transition-transform duration-300 inline-block">{product.emoji ?? "📦"}</span>
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
            {(product.old_price || product.oldPrice) && (
              <div className="text-white/30 text-xs line-through font-body">{(product.old_price || product.oldPrice)!.toLocaleString()} ₽</div>
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
