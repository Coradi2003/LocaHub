import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const categorias = ["Mesas de Jogo", "Infláveis", "Alimentação", "Som e Iluminação", "Refrigeração", "Decoração", "Estruturas", "Eletrônicos"];

const ProdutoFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]);
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [preco, setPreco] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [locadorId, setLocadorId] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }

      const { data: loc } = await supabase.from("locadores").select("id").eq("user_id", user.id).maybeSingle();
      if (!loc) { navigate("/cadastro-locador"); return; }
      setLocadorId(loc.id);

      if (isEditing) {
        const { data: prod } = await supabase.from("produtos").select("*").eq("id", id).single();
        if (prod) {
          setNome(prod.nome);
          setCategoria(prod.categoria);
          setDescricao(prod.descricao || "");
          setCidade(prod.cidade);
          setPreco(prod.preco || "");
          setImagePreview(prod.imagem_url || "");
        }
      }
    };
    load();
  }, [id, isEditing, navigate]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("produtos").upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("produtos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !cidade.trim()) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);
    let imageUrl = imagePreview;

    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) imageUrl = url;
    }

    const payload = {
      nome: nome.trim(),
      categoria,
      descricao: descricao.trim() || null,
      cidade: cidade.trim(),
      preco: preco.trim() || "Sob consulta",
      imagem_url: imageUrl || null,
      locador_id: locadorId,
    };

    if (isEditing) {
      const { error } = await supabase.from("produtos").update(payload).eq("id", id);
      setLoading(false);
      if (error) toast.error("Erro ao atualizar.");
      else { toast.success("Produto atualizado!"); navigate("/painel"); }
    } else {
      const { error } = await supabase.from("produtos").insert(payload);
      setLoading(false);
      if (error) toast.error("Erro ao criar anúncio.");
      else { toast.success("Anúncio criado com sucesso!"); navigate("/painel"); }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-lg mx-auto section-padding py-16">
      <h1 className="text-2xl font-bold text-foreground mb-2">{isEditing ? "Editar produto" : "Novo produto"}</h1>
      <p className="text-muted-foreground mb-8">{isEditing ? "Atualize os dados do seu anúncio." : "Preencha os dados para criar seu anúncio."}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Nome do produto *</label>
          <input type="text" required maxLength={100} value={nome} onChange={(e) => setNome(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Categoria *</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} maxLength={500}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Cidade / Região *</label>
          <input type="text" required maxLength={100} value={cidade} onChange={(e) => setCidade(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Preço</label>
          <input type="text" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Ex: R$ 150,00 ou deixe vazio para 'Sob consulta'"
            className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Imagem</label>
          <input type="file" accept="image/*" onChange={handleFileChange}
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/90" />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-lg" />
          )}
        </div>

        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
          {loading ? "Salvando..." : isEditing ? "Atualizar produto" : "Salvar anúncio"}
        </Button>
      </form>
    </div>
  );
};

export default ProdutoFormPage;
