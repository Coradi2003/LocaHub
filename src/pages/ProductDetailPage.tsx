import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Tag, User, ShieldCheck } from "lucide-react";
import PreCadastroModal from "@/components/platform/PreCadastroModal";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("produtos")
      .select("*, locadores(nome, cidade, telefone)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProduto(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto section-padding py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-muted rounded w-32" />
          <div className="aspect-video bg-muted rounded-xl" />
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-4 bg-muted rounded w-48" />
        </div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="max-w-4xl mx-auto section-padding py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Produto não encontrado</h2>
        <Link to="/produtos"><Button variant="outline">Voltar aos produtos</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto section-padding py-10">
      <Link to="/produtos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={16} /> Voltar aos produtos
      </Link>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            {produto.imagem_url ? (
              <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem imagem</div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">{produto.categoria}</span>
            <h1 className="text-2xl font-bold text-foreground mt-1">{produto.nome}</h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            {produto.cidade}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={16} />
            {(produto.locadores as any)?.nome}
          </div>

          <div className="flex items-center gap-2">
            <Tag size={16} className="text-accent" />
            <span className="text-xl font-bold text-foreground">{produto.preco || "Sob consulta"}</span>
          </div>

          {produto.descricao && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Descrição</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{produto.descricao}</p>
            </div>
          )}

          <div className="rounded-xl bg-accent/5 border border-accent/20 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">Contato protegido</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Para sua segurança, é necessário preencher o pré-cadastro (Nome, CPF e Endereço) antes de acessar o contato do locador.
                </p>
              </div>
            </div>
          </div>

          <Button variant="accent" size="lg" className="w-full" onClick={() => setShowModal(true)}>
            Tenho interesse — Fazer pré-cadastro
          </Button>
        </div>
      </div>

      <PreCadastroModal
        open={showModal}
        onOpenChange={setShowModal}
        produtoId={produto.id}
        produtoNome={produto.nome}
      />
    </div>
  );
};

export default ProductDetailPage;
