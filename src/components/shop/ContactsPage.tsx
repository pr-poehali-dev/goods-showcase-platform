import Icon from "@/components/ui/icon";

export default function ContactsPage() {
  return (
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
  );
}
