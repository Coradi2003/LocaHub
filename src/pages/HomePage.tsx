import React, { useState, useEffect } from "react";
import { HashRouter as Router, useSearchParams } from "react-router-dom";
import { Search, MapPin, Sparkles, Zap, Package } from "lucide-react";

/**
 * Interface para os Produtos
 */
interface Produto {
  id: number;
  nome: string;
  categoria: string;
  cidade: string;
  preco: string;
  imagem_url: string;
  locador_nome: string;
}

const categorias = [
  "Todos", 
  "Mesas de Jogos", 
  "Brinquedos Infláveis", 
  "Alimentação", 
  "Som e Iluminação", 
  "Refrigeração", 
  "Camas Elásticas", 
  "Piscinas de Bolinha"
];

/**
 * HomepageContent Component
 * Contém a lógica que utiliza hooks do router.
 */
function HomepageContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoria, setCategoria] = useState(searchParams.get("categoria") || "Todos");

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        // Simulação de carregamento (Mock Data)
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const mockData: Produto[] = [
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
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [search, categoria]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setSearchParams({ q: val, categoria });
  };

  const handleCategoriaChange = (cat: string) => {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest mb-4">
          <Sparkles size={12} className="animate-pulse" /> LocaHub Produção
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-2 text-white tracking-tighter">
          Produtos para <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600 font-black">Locação</span>
        </h1>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-20">
        
        {/* Barra de Pesquisa */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="glass-panel p-1 rounded-full shadow-2xl flex items-center group transition-all duration-500 focus-within:ring-2 focus-within:ring-orange-500/30 border border-white/10">
            <div className="relative flex-grow">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-all" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="O que está a procurar?"
                className="w-full h-12 md:h-14 pl-14 pr-4 rounded-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Filtros Enquadrados */}
        <div className="w-full mb-10 overflow-hidden">
          <div className="flex items-center gap-3 glass-panel p-2 rounded-2xl shadow-xl border border-white/5">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 shrink-0">
              <Zap size={18} className="fill-orange-500/30" />
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Filtros</span>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 w-full items-center">
              {categorias.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoriaChange(c)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[11px] font-black transition-all duration-500 border flex-shrink-0 uppercase tracking-tight ${
                    categoria === c
                      ? "bg-orange-500 border-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listagem */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-[2.5rem] bg-slate-800/40 h-[300px] animate-pulse border border-white/5" />
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
              <div key={p.id} className="group relative flex flex-col h-full rounded-[2.5rem] overflow-hidden glass-panel border border-white/5 hover:border-orange-500/40 shadow-2xl transition-all duration-700 hover:-translate-y-2">
                <div className="aspect-video overflow-hidden">
                  <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-white mb-2">{p.nome}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                    <MapPin size={14} className="text-orange-500" />
                    {p.cidade}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xl font-black text-orange-500">{p.preco}</span>
                    <button className="px-4 py-2 bg-white/5 hover:bg-orange-500 rounded-xl text-[10px] font-black transition-all uppercase">Ver Detalhes</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Componente principal Homepage
 * Envolve o conteúdo em um Router para satisfazer o hook useSearchParams.
 */
export default function Homepage() {
  return (
    <Router>
      <HomepageContent />
    </Router>
  );
}