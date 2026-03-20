import { Link } from "react-router-dom";

const PlatformFooter = () => (
  <footer className="bg-primary text-white/60 py-12">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid sm:grid-cols-3 gap-8 mb-8">
        <div>
          <Link to="/" className="text-xl font-bold text-white tracking-tight">
            Loca<span className="text-accent">Hub</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed">
            Conectando clientes e locadores com segurança.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Plataforma</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/produtos" className="hover:text-white transition-colors">Produtos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Contato</h4>
          <ul className="space-y-2 text-sm">
            <li>contato@locahub.com.br</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-6 text-xs text-center">
        © 2026 LocaHub. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default PlatformFooter;
