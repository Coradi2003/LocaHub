import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, LogOut } from "lucide-react";
import { toast } from "sonner";

const PainelPage = () => {
  const navigate = useNavigate();
  const [locador, setLocador] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preCadastros, setPreCadastros] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: loc } = await supabase.from("locadores").select("*").eq("user_id", user.id).maybeSingle();
      if (!loc) {
        navigate("/cadastro-locador");
        return;
      }

      setLocador(loc);

      const { data: prods } = await supabase.from("produtos").select("*").eq("locador_id", loc.id).order("created_at", { ascending: false });
      setProdutos(prods || []);

      // Fetch pre-cadastros for this locador's products
      if (prods && prods.length > 0) {
        const prodIds = prods.map((p: any) => p.id);
        const { data: pcs } = await supabase
          .from("pre_cadastros")
          .select("*")
          .in("produto_id", prodIds)
          .order("created_at", { ascending: false });
        setPreCadastros(pcs || []);
      }

      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleDelete = async (produtoId: string) => {
    if (!confirm("Deseja excluir este produto?")) return;
    const { error } = await supabase.from("produtos").delete().eq("id", produtoId);
    if (error) {
      toast.error("Erro ao excluir.");
    } else {
      setProdutos((prev) => prev.filter((p) => p.id !== produtoId));
      toast.success("Produto excluído.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto section-padding py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-40 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto section-padding py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meu Painel</h1>
          <p className="text-sm text-muted-foreground">Olá, {locador?.nome}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/novo-produto">
            <Button variant="accent" size="sm" className="gap-2">
              <Plus size={16} /> Novo produto
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut size={16} /> Sair
          </Button>
        </div>
      </div>

      {/* Products */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">Meus anúncios ({produtos.length})</h2>
        {produtos.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground mb-4">Você ainda não tem anúncios.</p>
            <Link to="/novo-produto">
              <Button variant="accent">Criar primeiro anúncio</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {produtos.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                  {p.imagem_url ? (
                    <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">—</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{p.nome}</h3>
                  <p className="text-xs text-muted-foreground">{p.categoria} • {p.cidade} • {p.preco || "Sob consulta"}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/produto/${p.id}`}>
                    <Button variant="ghost" size="icon"><Eye size={16} /></Button>
                  </Link>
                  <Link to={`/editar-produto/${p.id}`}>
                    <Button variant="ghost" size="icon"><Pencil size={16} /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interessados */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Interessados ({preCadastros.length})</h2>
        {preCadastros.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">Nenhum interessado nos seus produtos ainda.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Nome</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Produto</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {preCadastros.map((pc) => (
                    <tr key={pc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-foreground">{pc.nome_completo}</td>
                      <td className="px-4 py-3 text-muted-foreground">{pc.produto_nome}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(pc.created_at).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PainelPage;
