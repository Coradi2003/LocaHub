import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Users, Package } from "lucide-react";
import { toast } from "sonner";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preCadastros, setPreCadastros] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        toast.error("Acesso negado. Você não é administrador.");
        navigate("/");
        return;
      }

      setIsAdmin(true);

      const { data: pcs } = await supabase
        .from("pre_cadastros")
        .select("*")
        .order("created_at", { ascending: false });

      const all = pcs || [];
      setPreCadastros(all);

      const today = new Date().toISOString().split("T")[0];
      setStats({
        total: all.length,
        today: all.filter((pc) => pc.created_at.startsWith(today)).length,
      });

      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Verificando permissões...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="bg-primary text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto section-padding flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-accent" />
            <span className="font-bold text-lg">LocaHub <span className="text-accent">Admin</span></span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/70 hover:text-white hover:bg-white/10 gap-2">
            <LogOut size={16} /> Sair
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto section-padding py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Total de pré-cadastros</span>
            </div>
            <span className="text-3xl font-bold text-foreground tabular-nums">{stats.total}</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package size={20} className="text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Pré-cadastros hoje</span>
            </div>
            <span className="text-3xl font-bold text-foreground tabular-nums">{stats.today}</span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Pré-cadastros recebidos</h2>
          </div>
          {preCadastros.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              Nenhum pré-cadastro recebido ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left font-medium text-muted-foreground px-6 py-3">Nome completo</th>
                    <th className="text-left font-medium text-muted-foreground px-6 py-3">CPF</th>
                    <th className="text-left font-medium text-muted-foreground px-6 py-3">Endereço</th>
                    <th className="text-left font-medium text-muted-foreground px-6 py-3">Produto</th>
                    <th className="text-left font-medium text-muted-foreground px-6 py-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {preCadastros.map((pc) => (
                    <tr key={pc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-foreground font-medium">{pc.nome_completo}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                        {pc.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate">{pc.endereco}</td>
                      <td className="px-6 py-4 text-muted-foreground">{pc.produto_nome || "—"}</td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(pc.created_at).toLocaleDateString("pt-BR")} {new Date(pc.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
