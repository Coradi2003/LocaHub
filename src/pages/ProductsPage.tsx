import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const categorias = ["Todos", "Jogos", "Infláveis", "Alimentação", "Som e Iluminação", "Refrigeração", "Decoração", "Estruturas", "Eletrônicos"];

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoria, setCategoria] = useState(searchParams.get("categoria") || "Todos");

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      let query = supabase.from("produtos").select("*, locadores(nome, cidade)").order("created_at", { ascending: false });

      if (categoria !== "Todos") {
        query = query.eq("categoria", categoria);
      }
      if (search.trim()) {
        query = query.ilike("nome", `%${search.trim()}%`);
      }

      const { data } = await query;
      setProdutos(data || []);
      setLoading(false);
    };
    fetchProdutos();
  }, [search, categoria]);

  return (
    <div className="max-w-7xl mx-auto section-padding py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Produtos para locação</h1>
        <p className="text-muted-foreground">Encontre o item perfeito para seu evento.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full h-11 pl-11 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                categoria === c
                  ? "bg-accent text-accent-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl bg-card animate-pulse">
              <div className="aspect-[4/3] bg-muted rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-muted rounded w-20" />
                <div className="h-5 bg-muted rounded w-40" />
                <div className="h-3 bg-muted rounded w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : produtos.length === 0 ? (
        <div className="text-center py-20">
          <Filter size={48} className="mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground mb-6">Tente alterar os filtros ou buscar por outro termo.</p>
          <Link to="/cadastro-locador">
            <Button variant="accent">Anunciar um produto</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((p: any) => (
            <Link
              key={p.id}
              to={`/produto/${p.id}`}
              className="group rounded-xl overflow-hidden bg-card shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                {p.imagem_url ? (
                  <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sem imagem</div>
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
      )}
    </div>
  );
};

export default ProductsPage;
