import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

const PlatformNavbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SupaUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Início" },
    { to: "/produtos", label: "Produtos" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto section-padding flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-foreground tracking-tight">
          Loca<span className="text-accent">Hub</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${isActive(l.to) ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              {l.label}
            </Link>
          ))}

          {user && (
            <div className="flex items-center gap-3">
              <Link to="/painel">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User size={16} /> Meu Painel
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/cadastro-locador">
                  <Button variant="accent" size="sm">Cadastrar locador</Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-t border-border pb-4 section-padding space-y-2">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground py-2">
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <Link to="/painel" onClick={() => setOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground py-2">
                Meu Painel
              </Link>
              {isAdmin && (
                <Link to="/cadastro-locador" onClick={() => setOpen(false)}>
                  <Button variant="accent" size="sm" className="w-full mt-2">Cadastrar locador</Button>
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default PlatformNavbar;
