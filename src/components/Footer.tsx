import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "@/lib/router-next";

const socialLinks = [
  { Icon: Instagram, href: "https://www.instagram.com/modelmanagement.mu", label: "Instagram" },
  { Icon: Facebook, href: "https://www.facebook.com/share/1ANVtr2N8x/", label: "Facebook" },
  { Icon: Linkedin, href: "https://www.linkedin.com/company/modelmanagementmu/", label: "LinkedIn" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="dark-section border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-red flex items-center justify-center">
                <span className="font-display text-primary-foreground text-lg leading-none">M</span>
              </div>
              <span className="font-display text-xl tracking-[0.15em] text-white">Model Management</span>
            </Link>
            <p className="text-white/40 text-xs font-body leading-relaxed max-w-xs">
              The world&apos;s premier platform for model management, casting, and talent discovery in Mauritius.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-colors" aria-label={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <a href="https://www.tiktok.com/@modelmanagement.mu" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-colors" aria-label="TikTok">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
          </div>

          {[
            { title: "Company", links: [{ label: "About Us", path: "/footer/about-us" }, { label: "Careers", path: "/footer/careers" }, { label: "Blog", path: "/footer/blog" }] },
            { title: "Help", links: [{ label: "How It Works", path: "/footer/how-it-works" }, { label: "Modelling Advice", path: "/footer/modelling-advice" }, { label: "Safety & Trust", path: "/footer/safety-and-trust" }, { label: "Contact", path: "/contact" }, { label: "Report Issue", path: "/report" }] },
            { title: "Legal", links: [{ label: "Privacy Policy", path: "/footer/privacy-policy" }, { label: "Terms of Service", path: "/footer/terms-of-service" }, { label: "Company Details", path: "/company-details" }] },
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
          <p className="text-white/30 text-[10px] font-body tracking-wider">© {year} Model Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
