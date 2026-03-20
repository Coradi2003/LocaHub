import React, { useState, useEffect, useRef } from "react";
// Nota: Em ambientes de produção, estes seriam imports de bibliotecas externas
// Para garantir que o código compila aqui, simulamos as dependências ou usamos caminhos globais
import { 
  Search, 
  ArrowRight, 
  Shield, 
  Gamepad2, 
  Wind, 
  UtensilsCrossed, 
  Music, 
  Snowflake, 
  PartyPopper, 
  MapPin, 
  Star 
} from "lucide-react";

/**
 * Hook Simulado para Revelação no Scroll
 * Resolve o erro de importação de "@/hooks/useScrollReveal"
 */
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return { ref, isVisible };
};

/**
 * Componentes de UI Simulados
 * Resolve o erro de dependência de componentes locais
 */
const Button = ({ children, variant, size, className, ...props }) => {
  const variants = {
    accent: "bg-orange-500 text-white hover:bg-orange-600",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-100",
    hero: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg",
    heroOutline: "border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
  };
  
  const sizes = {
    sm: "h-9 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    xl: "h-16 px-10 text-lg"
  };

  return (
    <button 
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none disabled:opacity-50 ${variants[variant] || ""} ${sizes[size] || "h-10 px-4"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simulacro do Link (usa <a> para compatibilidade de preview)
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={`no-underline ${className}`} {...props}>{children}</a>
);

const categories = [
  { icon: Gamepad2, name: "Jogos", color: "from-emerald-500/10 to-emerald-500/5", textColor: "text-emerald-600" },
  { icon: Wind, name: "Infláveis", color: "from-sky-500/10 to-sky-500/5", textColor: "text-sky-600" },
  { icon: UtensilsCrossed, name: "Alimentação", color: "from-amber-500/10 to-amber-500/5", textColor: "text-amber-600" },
  { icon: Music, name: "Som e Iluminação", color: "from-rose-500/10 to-rose-500/5", textColor: "text-rose-600" },
  { icon: Snowflake, name: "Refrigeração", color: "from-cyan-500/10 to-cyan-500/5", textColor: "text-cyan-600" },
  { icon: PartyPopper, name: "Decoração", color: "from-fuchsia-500/10 to-fuchsia-500/5", textColor: "text-fuchsia-600" },
];

const steps = [
  { step: "01", title: "Busque", desc: "Encontre o produto ideal por categoria ou região próxima a você." },
  { step: "02", title: "Cadastre-se", desc: "Sua segurança em primeiro lugar. Validamos dados básicos para confiança." },
  { step: "03", title: "Reserve", desc: "Fale direto com o locador e garanta o sucesso do seu evento." },
];

const HomePage = () => {
  const { ref: heroRef, isVisible: heroVis } = useScrollReveal();
  const { ref: catRef, isVisible: catVis } = useScrollReveal();
  const { ref: stepsRef, isVisible: stepsVis } = useScrollReveal();
  const { ref: featRef, isVisible: featVis } = useScrollReveal();

  const [search, setSearch] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Dados mockados para evitar erro de conexão com Supabase no preview
    const mockData = [
      { id: 1, nome: "Cama Elástica Profissional", categoria: "Jogos", preco: "150,00", cidade: "Lisboa", imagem_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800", locadores: { nome: "Festas Inc" } },
      { id: 2, nome: "Castelo Inflável Gigante", categoria: "Infláveis", preco: "250,00", cidade: "Porto", imagem_url: "https://images.unsplash.com/photo-1533777857419-3774bd96ef5d?q=80&w=800", locadores: { nome: "Eventos PT" } },
      { id: 3, nome: "Sistema de Som 2000W", categoria: "Som e Iluminação", preco: "120,00", cidade: "Coimbra", imagem_url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800", locadores: { nome: "DJ Master" } }
    ];
    setFeaturedProducts(mockData);
  }, []);

  // Placeholder para a imagem do hero
  const heroImgUrl = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600";

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImgUrl} 
            alt="Festa e Eventos" 
            className="w-full h-full object-cover opacity-30 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-3xl space-y-8">
            <div className={`inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-xs sm:text-sm text-white/90 transition-all duration-1000 ${heroVis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              <Shield size={14} className="text-orange-500" />
              Ambiente 100% Seguro para Locatários e Locadores
            </div>

            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight transition-all duration-1000 delay-100 ${heroVis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              Transforme sua festa em um <span className="text-orange-500 relative inline-block">
                evento épico
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-orange-500/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" /></svg>
              </span>
            </h1>

            <p className={`text-lg sm:text-xl text-slate-400 max-w-xl transition-all duration-1000 delay-200 ${heroVis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              A maior rede de locação de itens para eventos da sua região. Praticidade na busca e segurança total na negociação.
            </p>

            <div className={`flex flex-col sm:flex-row gap-3 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl max-w-2xl transition-all duration-1000 delay-300 ${heroVis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="O que você precisa hoje?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-transparent text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>
              <Button variant="accent" size="lg" className="h-14 px-8 w-full font-bold shadow-lg shadow-orange-500/20">
                Explorar Agora
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section ref={catRef} className="py-24 bg-white relative z-20 -mt-10 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className={`text-orange-500 font-bold tracking-[0.2em] uppercase text-xs transition-all duration-500 ${catVis ? "opacity-100" : "opacity-0"}`}>Explorar Coleções</span>
              <h2 className={`text-3xl md:text-4xl font-bold transition-all duration-500 delay-100 ${catVis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>Categorias Populares</h2>
            </div>
            <Link to="/produtos" className="text-slate-500 hover:text-slate-900 transition-all flex items-center gap-2 text-sm font-medium">
              Ver catálogo completo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/produtos?categoria=${encodeURIComponent(cat.name)}`}
                className={`group relative p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 ${catVis ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <cat.icon size={28} className={cat.textColor} />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-orange-500 transition-colors tracking-tight">{cat.name}</h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity">Ver Itens</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section ref={stepsRef} className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className={`text-3xl md:text-4xl font-bold transition-all duration-700 ${stepsVis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>Aluguer sem complicações</h2>
            <p className={`text-slate-500 transition-all duration-700 delay-100 ${stepsVis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>Tudo o que precisa de fazer para garantir os melhores itens para a sua festa em poucos minutos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <div key={s.step} className={`relative z-10 group text-center space-y-4 transition-all duration-700 ${stepsVis ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`} style={{ transitionDelay: `${(i + 1) * 150}ms` }}>
                <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center mx-auto shadow-xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                  <span className="text-2xl font-black">{s.step}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-4">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      {featuredProducts.length > 0 && (
        <section ref={featRef} className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div className="text-center md:text-left">
                <h2 className={`text-3xl md:text-4xl font-bold transition-all duration-700 ${featVis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>O melhor para si</h2>
                <p className={`text-slate-500 mt-2 transition-all duration-700 delay-100 ${featVis ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>Os itens mais desejados e bem avaliados da plataforma.</p>
              </div>
              <Button variant="outline" className="rounded-full px-6 border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                Explorar catálogo completo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((p, i) => (
                <div
                  key={p.id}
                  className={`group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-orange-500/40 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 ${featVis ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star size={10} className="fill-amber-400 text-amber-400" /> 4.9
                      </span>
                    </div>
                    <img 
                      src={p.imagem_url} 
                      alt={p.nome} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="space-y-1">
                      <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">{p.categoria}</span>
                      <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-orange-500 transition-colors">{p.nome}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={14} className="text-orange-500/60" />
                      <span className="truncate">{p.cidade}</span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Preço médio</span>
                        <span className="text-lg font-black text-slate-900">
                          R$ {p.preco}
                        </span>
                      </div>
                      <span className="text-xs font-semibold bg-slate-100 px-3 py-1 rounded-full">
                        {p.locadores.nome}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Footer CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-orange-500 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black">Pronto para começar?</h2>
            <p className="text-white/80 max-w-lg mx-auto">Junte-se a centenas de locadores e locatários na plataforma mais segura da região.</p>
            <Button variant="outline" size="xl" className="bg-white text-orange-500 hover:bg-slate-100 border-none font-bold rounded-2xl">
              Criar minha conta grátis
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;