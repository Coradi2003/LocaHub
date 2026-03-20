import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  Shield, 
  Gamepad2, 
  Music, 
  UtensilsCrossed, 
  Wind, 
  Snowflake, 
  PartyPopper, 
  MapPin,
  Star,
  CheckCircle2
} from "lucide-react";

// Mock do Supabase para garantir que o código corre sem erros de configuração
const supabaseMock = {
  from: () => ({
    select: () => ({
      eq: () => ({
        limit: () => Promise.resolve({ data: [], error: null })
      })
    })
  })
};

const categories = [
  { icon: Gamepad2, name: "Jogos", color: "bg-emerald-500/10" },
  { icon: Wind, name: "Infláveis", color: "bg-sky-500/10" },
  { icon: UtensilsCrossed, name: "Alimentação", color: "bg-amber-500/10" },
  { icon: Music, name: "Som e Iluminação", color: "bg-rose-500/10" },
  { icon: Snowflake, name: "Refrigeração", color: "bg-cyan-500/10" },
  { icon: PartyPopper, name: "Decoração", color: "bg-fuchsia-500/10" },
];

const steps = [
  { step: "01", title: "Busque", desc: "Encontre os melhores equipamentos para a sua festa perto de si." },
  { step: "02", title: "Reserve", desc: "Escolha a data e reserve online com total segurança e praticidade." },
  { step: "03", title: "Aproveite", desc: "Receba o equipamento, divirta-se e nós tratamos da recolha." },
];

const App = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Tentativa de carregar dados reais, caso o cliente esteja configurado
        const { data, error } = await supabaseMock.from('produtos').select('*').limit(4);
        if (data) setFeaturedProducts(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-slate-900">
      {/* Navegação Simples (Substituindo o Router) */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <PartyPopper size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Festa<span className="text-indigo-600">Fácil</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="hover:text-indigo-600 transition-colors">Produtos</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Como Funciona</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Anunciar</a>
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
            Entrar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Star size={14} fill="currentColor" />
              A maior plataforma de aluguer para festas
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Tudo o que precisa para a sua <span className="text-indigo-600">festa perfeita</span> está aqui.
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl">
              De insufláveis a sistemas de som profissionais. Alugue equipamentos de qualidade de fornecedores verificados na sua região.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="O que está a procurar?" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none shadow-lg shadow-slate-100 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                Procurar <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Elemento Decorativo no Background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/5 -skew-x-12 translate-x-1/2" />
      </header>

      {/* Categorias */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Explore por categoria</h2>
              <p className="text-slate-500 mt-2">Encontre exatamente o que precisa para o seu evento</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <button key={i} className="group p-6 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col items-center text-center gap-4 border border-transparent hover:border-slate-100">
                <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform`}>
                  <cat.icon size={32} />
                </div>
                <span className="font-semibold text-sm text-slate-700">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Alugar nunca foi tão simples</h2>
            <p className="text-slate-400">Três passos rápidos para garantir a diversão do seu próximo evento.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                <div className="text-8xl font-black text-white/5 absolute -top-8 -left-4 group-hover:text-indigo-500/10 transition-colors">{s.step}</div>
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="text-indigo-400" size={24} />
                    {s.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Destaques da semana</h2>
            <button className="text-indigo-600 font-semibold flex items-center gap-2 hover:underline">
              Ver todos <ArrowRight size={18} />
            </button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="animate-pulse">
                  <div className="bg-slate-200 aspect-square rounded-2xl mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-8">
              {/* Exemplo de Card de Produto (Mock) */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group cursor-pointer">
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      <Gamepad2 size={48} />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Premium
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Insufláveis</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">Castelo Mágico {item}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                    <MapPin size={14} /> Lisboa, Portugal
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-lg font-black text-slate-900">45€ <span className="text-xs font-normal text-slate-400">/dia</span></div>
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                      <Star size={14} fill="currentColor" /> 4.9
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 pt-20 pb-10 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <PartyPopper size={18} />
                </div>
                <span className="text-lg font-bold">FestaFácil</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Ajudamos a criar memórias inesquecíveis através do aluguer simplificado de equipamentos para festas e eventos.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Plataforma</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600">Como funciona</a></li>
                <li><a href="#" className="hover:text-indigo-600">Segurança</a></li>
                <li><a href="#" className="hover:text-indigo-600">Central de Ajuda</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Negócios</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600">Anunciar equipamento</a></li>
                <li><a href="#" className="hover:text-indigo-600">Regras da comunidade</a></li>
                <li><a href="#" className="hover:text-indigo-600">Taxas e Comissões</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Newsletter</h4>
              <p className="text-sm text-slate-600 mb-4">Receba dicas e promoções exclusivas.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Seu email" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 flex-1" />
                <button className="bg-indigo-600 text-white p-2 rounded-xl">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© 2024 FestaFácil. Todos os direitos reservados.</p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-slate-600">Privacidade</a>
              <a href="#" className="hover:text-slate-600">Termos</a>
              <a href="#" className="hover:text-slate-600">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;