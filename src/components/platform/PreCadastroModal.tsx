import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produtoId: string;
  produtoNome: string;
}

const formatCpf = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const PreCadastroModal = ({ open, onOpenChange, produtoId, produtoNome }: Props) => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfDigits = cpf.replace(/\D/g, "");
    if (!nome.trim() || cpfDigits.length !== 11 || !endereco.trim()) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("pre_cadastros").insert({
      nome_completo: nome.trim(),
      cpf: cpfDigits,
      endereco: endereco.trim(),
      produto_id: produtoId,
      produto_nome: produtoNome,
    });

    setLoading(false);
    if (error) {
      toast.error("Erro ao enviar. Tente novamente.");
    } else {
      setSuccess(true);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSuccess(false);
      setNome("");
      setCpf("");
      setEndereco("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="mx-auto text-accent mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Pré-cadastro enviado!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Seus dados foram registrados. Agora você pode entrar em contato com o locador pelo WhatsApp.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/5541999995443?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${produtoNome}. Meu nome é ${nome}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="accent" className="w-full gap-2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Falar no WhatsApp
                </Button>
              </a>
              <Button variant="outline" onClick={handleClose}>Fechar</Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield size={20} className="text-accent" />
                Pré-cadastro obrigatório
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground mb-1">
              Produto: <strong className="text-foreground">{produtoNome}</strong>
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Para sua segurança e do locador, preencha seus dados antes de entrar em contato.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nome completo *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">CPF *</label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Endereço *</label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <Button type="submit" variant="accent" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar pré-cadastro"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreCadastroModal;
