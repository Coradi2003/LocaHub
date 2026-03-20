import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PlatformLayout from "@/components/platform/PlatformLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import CadastroLocadorPage from "./pages/CadastroLocadorPage";
import PainelPage from "./pages/PainelPage";
import ProdutoFormPage from "./pages/ProdutoFormPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin - separate layout */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Platform layout */}
          <Route element={<PlatformLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/produto/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro-locador" element={<CadastroLocadorPage />} />
            <Route path="/painel" element={<PainelPage />} />
            <Route path="/novo-produto" element={<ProdutoFormPage />} />
            <Route path="/editar-produto/:id" element={<ProdutoFormPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
