import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Link } from "@/lib/router-next";

const Footer = () => {
  return (
    <footer className="dark-section border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-red flex items-center justify-center">
                <span className="font-display text-primary-foreground text-lg leading-none">É</span>
              </div>
              <span className="font-display text-xl tracking-[0.15em] text-white">ÉLITE</span>
            </Link>
            <p className="text-white/40 text-xs font-body leading-relaxed max-w-xs">
              The world's premier platform for model management, casting, and talent discovery.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Company", links: [{ label: "About Us", path: "/about" }, { label: "Careers", path: "/about" }, { label: "Blog", path: "/about" }] },
            { title: "Help", links: [{ label: "How It Works", path: "/about" }, { label: "Safety & Trust", path: "/about" }, { label: "Contact", path: "/contact" }, { label: "Report Issue", path: "/contact" }] },
            { title: "Legal", links: [{ label: "Privacy Policy", path: "#" }, { label: "Terms of Service", path: "#" }, { label: "Company Details", path: "#" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-lg tracking-wider text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-white/40 text-xs font-body hover:text-primary transition-colors tracking-wider">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-[10px] font-body tracking-wider">© 2026 ÉLITE Models. All rights reserved.</p>
          <p className="text-white/30 text-[10px] font-body tracking-wider">18+ Content • Viewer Discretion Advised</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
