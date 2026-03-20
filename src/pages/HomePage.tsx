import React, { useState, useEffect } from "react";
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  useSearchParams 
} from "react-router-dom";
import { Search, MapPin, Sparkles, Zap, Package } from "lucide-react";

/**
 * ProductsPage Component
 * Design moderno com background animado, glassmorphism e filtros responsivos.
 * * NOTA DE PRODUÇÃO: 
 * Utilizamos o HashRouter para evitar o erro de "ecrã branco" em servidores 
 * que não suportam redirecionamento de rotas SPA (como GitHub Pages ou instâncias simples).
 */

const categorias = ["Todos", "Mesas de Jogos", "Brinquedos Infláveis", "Alimentação", "Som e Iluminação", "Refrigeração", "Camas Elásticas", "Piscinas de Bolinha"];

const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoria, setCategoria] = useState(searchParams.get("categoria") || "Todos");

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        /** * Lógica de Integração:
         * Para produção com Supabase, importa o cliente e remove os comentários abaixo.
         * import { supabase } from "@/integrations/supabase/client";
         * * let query = supabase.from("produtos").select("*");
         * if (search) query = query.ilike("nome", `%${search}%`);
         * if (categoria !== "Todos") query = query.eq("categoria", categoria);
         * const { data, error } = await query;
         * if (error) throw error;
         * setProdutos(data || []);
         */

        // Simulação de carregamento para visualização no Canvas
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData = [
          { id: 1, nome: "Mesa de Air Hockey Profissional", categoria: "Mesas de Jogos", cidade: "São Paulo", preco: "R$ 150,00", imagem_url: "https://images.unsplash.com/photo-1543569612-4f386341295b?auto=format&fit=crop&q=60&w=600", locador_nome: "Festa Total" },
          { id: 2, nome: "Castelo Inflável Colorido", categoria: "Brinquedos Infláveis", cidade: "Campinas", preco: "R$ 200,00", imagem_url: "https://images.unsplash.com/photo-1533777857419-370500bb218c?auto=format&fit=crop&q=60&w=600", locador_nome: "Kids Fun" },
          { id: 3, nome: "Máquina de Algodão Doce", categoria: "Alimentação", cidade: "Santo André", preco: "R$ 80,00", imagem_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=60&w=600", locador_nome: "Doce Evento" }
        ];

        const filtered = mockData.filter(p => {
          const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase());
          const matchCat = categoria === "Todos" || p.categoria === categoria;
          return matchSearch && matchCat;
        });
        
        setProdutos(filtered);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [search, categoria]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setSearchParams({ q: val, categoria });
  };

  const handleCategoriaChange = (cat) => {
    setCategoria(cat);
    setSearchParams({ q: search, categoria: cat });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-orange-500/30 overflow-x-hidden relative">
      
      {/* Background Animado */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#0f172a] to-[#020617] animate-gradient" />
      </div>

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 15s ease infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-panel {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-12 flex flex-col items-center justify-center z-10 text-center px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
          <Sparkles size={12} className="animate-pulse" /> LocaHub Digital
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-2 text-white tracking-tighter">
          Produtos para <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600 font-black">Locação</span>
        </h1>
        <p className="text-xs md:text-sm font-medium text-slate-400 max-w-md mx-auto opacity-70">
          Encontre o item perfeito para tornar o seu evento inesquecível.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-20">
        
        {/* Search Bar */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="glass-panel p-1 rounded-full shadow-2xl flex items-center group transition-all duration-500 focus-within:ring-2 focus-within:ring-orange-500/30 border border-white/10">
            <div className="relative flex-grow">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-all" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="O que está a procurar?"
                className="w-full h-12 md:h-14 pl-14 pr-4 rounded-full bg-transparent text-sm md:text-lg text-white placeholder:text-slate-500 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Filtros Enquadrados */}
        <div className="w-full mb-10 overflow-hidden">
          <div className="flex items-center gap-3 glass-panel p-2 rounded-2xl shadow-xl border border-white/5">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 shrink-0">
              <Zap size={18} className="fill-orange-500/30" />
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Premium</span>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 w-full items-center">
              {categorias.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoriaChange(c)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[11px] font-black transition-all duration-500 border flex-shrink-0 uppercase tracking-tight ${
                    categoria === c
                      ? "bg-orange-500 border-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-[1.03]"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-[2.5rem] bg-slate-800/40 h-[380px] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-[3rem] border border-white/5">
            <Package size={60} className="mx-auto text-orange-500/20 mb-6" />
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Nada encontrado</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm font-medium">Não encontramos produtos com esses filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {produtos.map((p) => (
              <div
                key={p.id}
                className="group relative flex flex-col h-full rounded-[2.5rem] overflow-hidden glass-panel border border-white/5 hover:border-orange-500/40 shadow-2xl transition-all duration-700 hover:-translate-y-3 cursor-pointer"
              >
                <div className="aspect-[11/10] overflow-hidden relative">
                  <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black bg-[#020617]/90 backdrop-blur-md text-orange-400 border border-orange-500/30 uppercase tracking-tighter">
                      {p.categoria}
                    </span>
                  </div>
                </div>

                <div className="p-7 flex flex-col flex-grow relative">
                  <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight tracking-tight">
                    {p.nome}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500 font-black uppercase tracking-widest">
                    <MapPin size={14} className="text-orange-500" />
                    {p.cidade || "Brasil"}
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">
                        {p.locador_nome || "Locador"}
                      </span>
                      <span className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors tracking-tighter">
                        {p.preco}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-orange-500 group-hover:border-orange-400 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-500">
                      <Zap size={20} className="fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="*" element={<ProductsList />} />
      </Routes>
    </Router>
  );
};

export default App;