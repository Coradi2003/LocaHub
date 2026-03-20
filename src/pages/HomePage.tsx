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

            {/* BOTÃO REMOVIDO AQUI */}
            <div className={`flex flex-wrap gap-4 pt-2 ${heroVis ? "reveal-up-delay-4" : "opacity-0"}`}>
              <Link to="/produtos">
                <Button variant="hero" size="lg">
                  Quero alugar <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* resto do código continua igual... */}
    </div>
  );
};

export default HomePage;