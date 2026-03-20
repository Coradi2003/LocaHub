
-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Locadores table
CREATE TABLE public.locadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cidade TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('pessoa_fisica', 'empresa')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.locadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locadores are viewable by everyone" ON public.locadores FOR SELECT USING (true);
CREATE POLICY "Locadores can insert own" ON public.locadores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Locadores can update own" ON public.locadores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Locadores can delete own" ON public.locadores FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_locadores_updated_at BEFORE UPDATE ON public.locadores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Produtos table
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  cidade TEXT NOT NULL,
  preco TEXT DEFAULT 'Sob consulta',
  imagem_url TEXT,
  locador_id UUID NOT NULL REFERENCES public.locadores(id) ON DELETE CASCADE,
  destaque BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produtos are viewable by everyone" ON public.produtos FOR SELECT USING (true);
CREATE POLICY "Locadores can insert produtos" ON public.produtos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.locadores WHERE id = locador_id AND user_id = auth.uid())
);
CREATE POLICY "Locadores can update own produtos" ON public.produtos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.locadores WHERE id = locador_id AND user_id = auth.uid())
);
CREATE POLICY "Locadores can delete own produtos" ON public.produtos FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.locadores WHERE id = locador_id AND user_id = auth.uid())
);

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pre-cadastros table
CREATE TABLE public.pre_cadastros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  cpf TEXT NOT NULL,
  endereco TEXT NOT NULL,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  produto_nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pre_cadastros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert pre_cadastros" ON public.pre_cadastros FOR INSERT WITH CHECK (true);

-- User roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admin can read pre_cadastros" ON public.pre_cadastros FOR SELECT USING (
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin can read user_roles" ON public.user_roles FOR SELECT USING (
  public.has_role(auth.uid(), 'admin')
);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('produtos', 'produtos', true);

CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'produtos');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'produtos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own product images" ON storage.objects FOR UPDATE USING (bucket_id = 'produtos' AND auth.role() = 'authenticated');
