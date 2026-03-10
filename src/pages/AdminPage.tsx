import { Link } from "@/lib/router-next";
import { Users, Briefcase, ShoppingBag, CreditCard, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const adminSections = [
  { icon: Users, label: "Users & Models", description: "Approve, reject, or review model applications", path: "/admin", count: "24 pending" },
  { icon: Briefcase, label: "Castings", description: "Manage and moderate casting posts", path: "/admin", count: "8 active" },
  { icon: ShoppingBag, label: "Marketplace", description: "Approve marketplace offers", path: "/admin/marketplace", count: "5 pending" },
  { icon: CreditCard, label: "Premium Users", description: "Manage premium subscriptions", path: "/admin/premium-users", count: "142 active" },
];

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="dark-section py-6">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-red flex items-center justify-center">
              <span className="font-display text-primary-foreground text-lg leading-none">É</span>
            </div>
            <span className="font-display text-xl tracking-[0.15em] text-white">ADMIN</span>
          </Link>
          <Link to="/" className="text-white/60 text-xs font-body hover:text-primary transition-colors tracking-[0.15em] uppercase">
            Back to Site
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-5xl mb-2">Admin Panel</h1>
          <p className="text-muted-foreground text-sm font-body mb-8">Manage users, models, castings, and marketplace</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminSections.map((section, i) => (
              <Link
                key={section.label}
                to={section.path}
                className="group magazine-border p-6 hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <section.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl group-hover:text-primary transition-colors">{section.label}</h3>
                      <p className="text-muted-foreground text-xs font-body mt-1">{section.description}</p>
                      <span className="text-primary text-[10px] font-body tracking-[0.2em] uppercase mt-2 inline-block">{section.count}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
