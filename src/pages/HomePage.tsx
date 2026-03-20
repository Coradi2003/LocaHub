import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Gamepad2,
  Music,
  UtensilsCrossed,
  Wind,
  Snowflake,
  PartyPopper,
  MapPin,
  Star,
  Sparkles,
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
        style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background)) 100%)" }}
      >
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="w-full h-full object-cover opacity-[0.09]"
          />
          <div className="absolute inset-0 bg-background/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
        </div>

        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-20 left-[8%] h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-[10%] h-52 w-52 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto section-padding pt-14 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 xl:gap-14 items-center">
            <div className="max-w-3xl">
              <div
                className={`inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur-md px-4 py-2 text-sm text-foreground/80 shadow-sm ${
                  heroVis ? "reveal-up" : "opacity-0"
                }`}
              >
                <ShieldCheck size={16} className="text-accent" />
                Plataforma de locação com visual profissional
              </div>

              <h1
                className={`mt-6 text-4xl sm:text-5xl xl:text-6xl font-bold text-foreground leading-[1.02] tracking-tight ${
                  heroVis ? "reveal-up-delay-1" : "opacity-0"
                }`}
              >
                Alugue itens para
                <span className="block text-accent"> festas e eventos </span>
                de forma simples, bonita e confiável
              </h1>

              <p
                className={`mt-5 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed ${
                  heroVis ? "reveal-up-delay-2" : "opacity-0"
                }`}
              >
                Explore um catálogo moderno com produtos para locação, encontre
                o que precisa mais rápido e transmita confiança já na primeira
                impressão.
              </p>

              <div
                className={`mt-8 rounded-[30px] border border-border bg-card/95 backdrop-blur-xl p-3 md:p-4 shadow-[0_20px_80px_rgba(0,0,0,0.10)] ${
                  heroVis ? "reveal-up-delay-3" : "opacity-0"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Buscar produto, categoria ou cidade..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-12 md:h-14 rounded-2xl border border-border bg-background pl-11 pr-4 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <Link
                    to={`/produtos${search ? `?q=${encodeURIComponent(search)}` : ""}`}
                    className="w-full md:w-auto"
                  >
                    <Button
                      variant="accent"
                      size="lg"
                      className="h-12 md:h-14 w-full md:px-8 rounded-2xl"
                    >
                      Buscar agora
                    </Button>
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("Todos")}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-xs md:text-sm border transition-all ${
                      selectedCategory === "Todos"
                        ? "bg-accent text-accent-foreground border-accent shadow-sm"
                        : "bg-background text-foreground border-border hover:border-accent/40 hover:bg-accent/5"
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
                          ? "bg-accent text-accent-foreground border-accent shadow-sm"
                          : "bg-background text-foreground border-border hover:border-accent/40 hover:bg-accent/5"
                      }`}
                    >
                      <cat.icon size={14} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`mt-6 flex flex-wrap items-center gap-3 ${
                  heroVis ? "reveal-up-delay-4" : "opacity-0"
                }`}
              >
                <Link to="/produtos">
                  <Button size="lg" className="rounded-2xl px-7 h-12 md:h-13">
                    Explorar catálogo <ArrowRight size={16} />
                  </Button>
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground">
                  <Sparkles size={15} className="text-accent" />
                  Layout premium para aumentar o interesse do cliente
                </div>
              </div>
            </div>

            <div
              className={`${heroVis ? "reveal-up-delay-4" : "opacity-0"}`}
            >
              <div className="relative rounded-[32px] border border-border bg-card/90 backdrop-blur-xl p-4 md:p-5 shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 rounded-[24px] border border-border bg-background p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Destaque da plataforma
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-foreground leading-tight">
                      Visual de vitrine premium para locação
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Um site mais bonito, mais limpo e com cara de catálogo
                      profissional.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-border bg-background p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Busca rápida
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground leading-snug">
                      Cliente encontra com facilidade o que deseja alugar
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-border bg-background p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Catálogo forte
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground leading-snug">
                      Produtos aparecem com mais destaque logo na home
                    </p>
                  </div>

                  <div className="col-span-2 rounded-[24px] border border-accent/20 bg-accent/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-accent">
                      Experiência
                    </p>
                    <p className="mt-2 text-base md:text-lg font-semibold text-foreground">
                      Mais confiança, mais desejo de navegação e mais chance do
                      cliente clicar para ver o produto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section ref={productsRef} className="relative py-14 md:py-20">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8 md:mb-10">
            <div className="max-w-2xl">
              <p
                className={`text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-2 ${
                  productsVis ? "reveal-up" : "opacity-0"
                }`}
              >
                Catálogo em destaque
              </p>
              <h2
                className={`text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-foreground leading-tight ${
                  productsVis ? "reveal-up-delay-1" : "opacity-0"
                }`}
              >
                Produtos que chamam atenção logo na entrada
              </h2>
              <p
                className={`mt-3 text-muted-foreground text-base md:text-lg ${
                  productsVis ? "reveal-up-delay-2" : "opacity-0"
                }`}
              >
                Uma home mais bonita, organizada e pensada para fazer o visitante
                continuar navegando e querer alugar.
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

          <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("Todos")}
              className={`shrink-0 rounded-full px-4 py-2 text-sm border transition-all ${
                selectedCategory === "Todos"
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card text-foreground border-border hover:border-accent/40 hover:bg-accent/5"
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
                    : "bg-card text-foreground border-border hover:border-accent/40 hover:bg-accent/5"
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
                  className="overflow-hidden rounded-[28px] border border-border bg-card animate-pulse"
                >
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 rounded bg-muted" />
                    <div className="h-6 rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                    <div className="h-10 rounded bg-muted" />
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
                  className={`group overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 transition-all duration-300 ${
                    productsVis ? "reveal-up" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: productsVis ? `${i * 0.05}s` : undefined,
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {p.imagem_url ? (
                      <img
                        src={p.imagem_url}
                        alt={p.nome}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        Sem imagem
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {p.destaque && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                          <Star size={12} />
                          Destaque
                        </span>
                      )}

                      {p.categoria && (
                        <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {p.categoria}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="min-h-[3.2rem] text-base md:text-lg font-semibold text-foreground line-clamp-2">
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

                      <span className="inline-flex items-center justify-center rounded-2xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors group-hover:border-accent group-hover:text-accent">
                        Ver mais
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-border bg-card p-10 text-center">
              <h3 className="text-xl font-semibold text-foreground">
                Nenhum produto encontrado
              </h3>
              <p className="mt-2 text-muted-foreground">
                Tente mudar a busca ou selecionar outra categoria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Todos");
                }}
                className="mt-4 font-medium text-accent"
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