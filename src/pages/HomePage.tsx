import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-party.jpg";

const categories = [
  { icon: Gamepad2, name: "Jogos" },
  { icon: Wind, name: "Infláveis" },
  { icon: UtensilsCrossed, name: "Alimentação" },
  { icon: Music, name: "Som e Iluminação" },
  { icon: Snowflake, name: "Refrigeração" },
  { icon: PartyPopper, name: "Decoração" },
];

const HomePage = () => {
  const { ref: heroRef, isVisible: heroVis } = useScrollReveal();
  const { ref: productsRef, isVisible: productsVis } = useScrollReveal();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);

      const { data, error } = await supabase
        .from("produtos")
        .select("id, nome, categoria, preco, cidade, imagem_url, created_at, destaque, locadores(nome)")
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(12);

      if (!error && data) {
        setProducts(data);
      } else {
        setProducts([]);
      }

      setLoadingProducts(false);
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "Todos") {
      result = result.filter((item) => item.categoria === selectedCategory);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.nome?.toLowerCase().includes(term) ||
          item.categoria?.toLowerCase().includes(term) ||
          item.cidade?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [products, selectedCategory, search]);

  return (
    <div className="bg-background">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ background: "var(--hero-gradient)" }}
      >
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="w-full h-full object-cover opacity-[0.10]"
          />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/50 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto section-padding pt-16 pb-14 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md ${
                heroVis ? "reveal-up" : "opacity-0"
              }`}
            >
              <Shield size={16} className="text-accent" />
              Locação prática, segura e profissional
            </div>

            <h1
              className={`mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight ${
                heroVis ? "reveal-up-delay-1" : "opacity-0"
              }`}
            >
              Tudo para sua festa ou evento em um só lugar
            </h1>

            <p
              className={`mt-5 max-w-2xl mx-auto text-base md:text-lg text-white/72 leading-relaxed ${
                heroVis ? "reveal-up-delay-2" : "opacity-0"
              }`}
            >
              Encontre produtos para locação com um visual bonito, navegação
              simples e uma experiência que passa confiança desde o primeiro
              clique.
            </p>

            <div
              className={`mt-8 rounded-[28px] border border-white/10 bg-white/95 p-3 md:p-4 shadow-2xl max-w-4xl mx-auto ${
                heroVis ? "reveal-up-delay-3" : "opacity-0"
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Buscar produto, categoria ou cidade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-12 md:h-14 pl-11 pr-4 rounded-2xl border border-border bg-background text-foreground text-sm md:text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <Link
                  to={`/produtos${search ? `?q=${encodeURIComponent(search)}` : ""}`}
                  className="w-full lg:w-auto"
                >
                  <Button
                    variant="accent"
                    size="lg"
                    className="h-12 md:h-14 w-full lg:px-8 rounded-2xl"
                  >
                    Buscar agora
                  </Button>
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("Todos")}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-xs md:text-sm border transition-all ${
                    selectedCategory === "Todos"
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-background text-foreground border-border hover:border-accent/50"
                  }`}
                >
                  Ver todos
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm border transition-all ${
                      selectedCategory === cat.name
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-background text-foreground border-border hover:border-accent/50"
                    }`}
                  >
                    <cat.icon size={14} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`mt-6 flex flex-wrap items-center justify-center gap-3 ${
                heroVis ? "reveal-up-delay-4" : "opacity-0"
              }`}
            >
              <Link to="/produtos">
                <Button variant="hero" size="lg" className="rounded-2xl px-7">
                  Explorar produtos <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            <div
              className={`mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 ${
                heroVis ? "reveal-up-delay-4" : "opacity-0"
              }`}
            >
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white backdrop-blur-md text-left">
                <p className="text-xs uppercase tracking-wide text-white/55">
                  Navegação intuitiva
                </p>
                <p className="mt-1 text-sm md:text-base font-semibold">
                  O cliente encontra rápido o que quer alugar
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white backdrop-blur-md text-left">
                <p className="text-xs uppercase tracking-wide text-white/55">
                  Visual profissional
                </p>
                <p className="mt-1 text-sm md:text-base font-semibold">
                  Cara de vitrine premium para locação
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white backdrop-blur-md text-left">
                <p className="text-xs uppercase tracking-wide text-white/55">
                  Mais segurança
                </p>
                <p className="mt-1 text-sm md:text-base font-semibold">
                  Pré-cadastro para uma experiência confiável
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section ref={productsRef} className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p
                className={`text-sm font-semibold text-accent uppercase tracking-widest mb-2 ${
                  productsVis ? "reveal-up" : "opacity-0"
                }`}
              >
                Catálogo em destaque
              </p>
              <h2
                className={`text-3xl md:text-4xl font-bold text-foreground ${
                  productsVis ? "reveal-up-delay-1" : "opacity-0"
                }`}
              >
                Escolha o produto ideal para o seu evento
              </h2>
              <p
                className={`text-muted-foreground mt-2 max-w-2xl ${
                  productsVis ? "reveal-up-delay-2" : "opacity-0"
                }`}
              >
                Um catálogo organizado para despertar vontade de alugar logo na
                entrada do site.
              </p>
            </div>

            <Link to="/produtos">
              <Button
                variant="outline"
                size="lg"
                className={`rounded-2xl ${
                  productsVis ? "reveal-up-delay-2" : "opacity-0"
                }`}
              >
                Ver catálogo completo <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-7">
            <button
              type="button"
              onClick={() => setSelectedCategory("Todos")}
              className={`shrink-0 rounded-full px-4 py-2 text-sm border transition-all ${
                selectedCategory === "Todos"
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-background text-foreground border-border hover:border-accent/50"
              }`}
            >
              Todos
            </button>

            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm border transition-all ${
                  selectedCategory === cat.name
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-background text-foreground border-border hover:border-accent/50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-border bg-card overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/produto/${p.id}`}
                  className={`group rounded-3xl border border-border/70 bg-card overflow-hidden shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1.5 transition-all duration-300 ${
                    productsVis ? "reveal-up" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: productsVis ? `${i * 0.05}s` : undefined,
                  }}
                >
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {p.imagem_url ? (
                      <img
                        src={p.imagem_url}
                        alt={p.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Sem imagem
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {p.destaque && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground text-xs font-medium px-3 py-1">
                          <Star size={12} />
                          Destaque
                        </span>
                      )}

                      {p.categoria && (
                        <span className="rounded-full bg-black/60 text-white text-xs font-medium px-3 py-1 backdrop-blur-sm">
                          {p.categoria}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 md:p-5">
                    <h3 className="text-base md:text-lg font-semibold text-foreground line-clamp-2 min-h-[3.2rem]">
                      {p.nome}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      <span className="line-clamp-1">
                        {p.cidade || "Cidade não informada"}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-muted-foreground line-clamp-1">
                      Locador: {(p.locadores as any)?.nome || "Não informado"}
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Valor de locação
                        </p>
                        <p className="text-lg md:text-xl font-bold text-foreground">
                          {p.preco || "Sob consulta"}
                        </p>
                      </div>

                      <span className="inline-flex items-center justify-center rounded-2xl border border-border px-3 py-2 text-sm font-medium text-foreground group-hover:border-accent group-hover:text-accent transition-colors">
                        Ver mais
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
              <h3 className="text-xl font-semibold text-foreground">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground mt-2">
                Tente mudar a busca ou selecionar outra categoria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Todos");
                }}
                className="mt-4 text-accent font-medium"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;