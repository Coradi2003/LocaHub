import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

const CadastroLocadorPage = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [tipo, setTipo] = useState<"pessoa_fisica" | "empresa">("pessoa_fisica");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Você precisa estar logado.");
      navigate("/login");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("locadores").insert({
      nome: nome.trim(),
      telefone: telefone.trim(),
      cidade: cidade.trim(),
      tipo,
      user_id: user.id,
    });
    setLoading(false);

    if (error) {
      toast.error("Erro ao cadastrar. Tente novamente.");
    } else {
      toast.success("Locador cadastrado com sucesso!");
      navigate("/painel");
    }
  };

  if (isAdmin === null) {
    return <div className="flex items-center justify-center py-32 text-muted-foreground">Carregando...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto section-padding py-24 text-center space-y-4">
        <ShieldAlert size={48} className="mx-auto text-destructive" />
        <h1 className="text-2xl font-bold text-foreground">Acesso restrito</h1>
        <p className="text-muted-foreground">Somente o administrador da plataforma pode cadastrar locadores.</p>
        <Button variant="outline" onClick={() => navigate("/")}>Voltar ao início</Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto section-padding py-16">
      <h1 className="text-2xl font-bold text-foreground mb-2">Cadastro de Locador</h1>
      <p className="text-muted-foreground mb-8">Cadastre um novo locador na plataforma.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Nome / Razão social *</label>
          <input type="text" required maxLength={100} value={nome} onChange={(e) => setNome(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Telefone *</label>
          <input type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="(11) 99999-0000" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Cidade *</label>
          <input type="text" required maxLength={100} value={cidade} onChange={(e) => setCidade(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Tipo</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="radio" name="tipo" checked={tipo === "pessoa_fisica"} onChange={() => setTipo("pessoa_fisica")} className="accent-accent" />
              Pessoa Física
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="radio" name="tipo" checked={tipo === "empresa"} onChange={() => setTipo("empresa")} className="accent-accent" />
              Empresa
            </label>
          </div>
        </div>

        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar locador"}
        </Button>
      </form>
    </div>
  );
};

export default CadastroLocadorPage;
