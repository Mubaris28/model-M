import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent">Terms of Use</h1>
          <p className="text-muted-foreground font-body text-sm mt-6 leading-relaxed">Please click on one of the links below to see the terms which are relevant to you.</p>
          <ul className="mt-8 space-y-3">
            {[
              { to: "/footer/terms-of-service/models", label: "Models", desc: "Terms and conditions for models accessing MODELMANAGEMENT.MU" },
              { to: "/footer/terms-of-service/agencies", label: "Agencies", desc: "Terms and conditions for agencies accessing MODELMANAGEMENT.MU" },
              { to: "/footer/terms-of-service/agents", label: "Agents", desc: "Terms and conditions for agents accessing MODELMANAGEMENT.MU" },
              { to: "/footer/terms-of-service/professionals", label: "Other Industry Professionals", desc: "Terms and conditions for other industry professionals accessing MODELMANAGEMENT.MU" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="block bg-card magazine-border p-4 hover:border-primary/30 transition-colors group">
                  <span className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                  <p className="text-muted-foreground text-xs font-body mt-1">{item.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
