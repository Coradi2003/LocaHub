import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Shield, Gamepad2, Music, UtensilsCrossed, Wind, Snowflake, PartyPopper, MapPin } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-party.jpg";

const categories = [
  { icon: Gamepad2, name: "Jogos", color: "from-emerald-500/10 to-emerald-500/5" },
  { icon: Wind, name: "Infláveis", color: "from-sky-500/10 to-sky-500/5" },
  { icon: UtensilsCrossed, name: "Alimentação", color: "from-amber-500/10 to-amber-500/5" },
  { icon: Music, name: "Som e Iluminação", color: "from-rose-500/10 to-rose-500/5" },
  { icon: Snowflake, name: "Refrigeração", color: "from-cyan-500/10 to-cyan-500/5" },
  { icon: PartyPopper, name: "Decoração", color: "from-fuchsia-500/10 to-fuchsia-500/5" },
];

const steps = [
  { step: "01", title: "Busque", desc: "Encontre o produto ideal por categoria ou região." },
  { step: "02", title: "Pré-cadastre-se", desc: "Preencha Nome, CPF e Endereço para segurança." },
  { step: "03", title: "Negocie", desc: "Contato liberado após verificação. Feche o negócio!" },
];

const HomePage = () => {
  const { ref: heroRef, isVisible: heroVis } = useScrollReveal();
  const { ref: catRef, isVisible: catVis } = useScrollReveal();
  const { ref: stepsRef, isVisible: stepsVis } = useScrollReveal();
  const { ref: featRef, isVisible: featVis } = useScrollReveal();

  const [search, setSearch] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("produtos")
      .select("*, locadores(nome, cidade)")
      .eq("destaque", true)
      .limit(6)
      .then(({ data }) => {
        if (data) setFeaturedProducts(data);
      });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover opacity-10" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto section-padding py-24 md:py-36">
          <div className="max-w-2xl space-y-6">
            <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 text-sm text-white/80 ${heroVis ? "reveal-up" : "opacity-0"}`}>
              <Shield size={16} className="text-accent" />
              Pré-cadastro obrigatório para sua segurança
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight text-balance ${heroVis ? "reveal-up-delay-1" : "opacity-0"}`}>
              Alugue itens para <span className="text-accent">festas e eventos</span> com segurança
            </h1>

            <p className={`text-lg text-white/60 max-w-lg text-pretty ${heroVis ? "reveal-up-delay-2" : "opacity-0"}`}>
              Encontre locadores confiáveis por região. Tudo organizado em uma plataforma profissional.
            </p>

            {/* Search bar */}
            <div className={`flex gap-2 max-w-lg ${heroVis ? "reveal-up-delay-3" : "opacity-0"}`}>
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar produto, ex: cama elástica..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-lg bg-white text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <Link to={`/produtos${search ? `?q=${encodeURIComponent(search)}` : ""}`}>
                <Button variant="accent" size="lg" className="h-12">
                  Buscar
                </Button>
              </Link>
            </div>

            <div className={`flex flex-wrap gap-4 pt-2 ${heroVis ? "reveal-up-delay-4" : "opacity-0"}`}>
              <Link to="/produtos">
                <Button variant="hero" size="lg">
                  Quero alugar <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/cadastro-locador">
                <Button variant="heroOutline" size="lg">
                  Quero anunciar meus produtos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section ref={catRef} className="py-20 bg-card">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-12">
            <p className={`text-sm font-semibold text-accent uppercase tracking-widest mb-2 ${catVis ? "reveal-up" : "opacity-0"}`}>Categorias</p>
            <h2 className={`text-3xl font-bold text-foreground ${catVis ? "reveal-up-delay-1" : "opacity-0"}`}>Encontre por tipo de produto</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/produtos?categoria=${encodeURIComponent(cat.name)}`}
                className={`group rounded-xl p-5 bg-background shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1 transition-all duration-300 text-center ${catVis ? "reveal-up" : "opacity-0"}`}
                style={{ animationDelay: catVis ? `${i * 0.06}s` : undefined }}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon size={22} className="text-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section ref={stepsRef} className="py-20">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-12">
            <p className={`text-sm font-semibold text-accent uppercase tracking-widest mb-2 ${stepsVis ? "reveal-up" : "opacity-0"}`}>Como funciona</p>
            <h2 className={`text-3xl font-bold text-foreground ${stepsVis ? "reveal-up-delay-1" : "opacity-0"}`}>Simples e seguro</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className={`text-center ${stepsVis ? "reveal-up" : "opacity-0"}`} style={{ animationDelay: stepsVis ? `${(i + 1) * 0.1}s` : undefined }}>
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-accent">{s.step}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section ref={featRef} className="py-20 bg-card">
          <div className="max-w-7xl mx-auto section-padding">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className={`text-sm font-semibold text-accent uppercase tracking-widest mb-2 ${featVis ? "reveal-up" : "opacity-0"}`}>Destaques</p>
                <h2 className={`text-3xl font-bold text-foreground ${featVis ? "reveal-up-delay-1" : "opacity-0"}`}>Produtos em destaque</h2>
              </div>
              <Link to="/produtos">
                <Button variant="outline" size="sm" className={featVis ? "reveal-up-delay-1" : "opacity-0"}>
                  Ver todos <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((p: any, i: number) => (
                <Link
                  key={p.id}
                  to={`/produto/${p.id}`}
                  className={`group rounded-xl overflow-hidden bg-background shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 ${featVis ? "reveal-up" : "opacity-0"}`}
                  style={{ animationDelay: featVis ? `${i * 0.08}s` : undefined }}
                >
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    {p.imagem_url ? (
                      <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem imagem</div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">{p.categoria}</span>
                    <h3 className="text-lg font-semibold text-foreground mt-1">{p.nome}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      {p.cidade}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-semibold text-foreground">{p.preco || "Sob consulta"}</span>
                      <span className="text-xs text-muted-foreground">{(p.locadores as any)?.nome}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
