import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Heart, Briefcase, Star, CreditCard, Bell, Settings, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: User, label: "Account", path: "/dashboard/account" },
  { icon: Heart, label: "Favorites", path: "/dashboard/favorites" },
  { icon: Briefcase, label: "Casting Applications", path: "/dashboard/castingapp" },
  { icon: Star, label: "Premium", path: "/dashboard/premium" },
  { icon: CreditCard, label: "Payouts", path: "/dashboard/payouts" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Settings, label: "Subscription", path: "/dashboard/subscription" },
];

const stats = [
  { label: "Profile Views", value: "1,247" },
  { label: "Favorites", value: "86" },
  { label: "Applications", value: "12" },
  { label: "Bookings", value: "3" },
];

const DashboardPage = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="magazine-border p-6 mb-6">
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl text-center">Model Name</h3>
                <p className="text-muted-foreground text-xs font-body text-center">model@email.com</p>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 text-xs font-body tracking-[0.1em] uppercase transition-colors ${
                      location.pathname === item.path ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <main>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-display text-4xl mb-6">Welcome Back</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat) => (
                    <div key={stat.label} className="magazine-border p-4 text-center">
                      <p className="font-display text-3xl text-gradient-red">{stat.value}</p>
                      <p className="text-muted-foreground text-xs font-body mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="magazine-border p-6">
                    <h3 className="font-display text-xl mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-body">
                        <div className="w-2 h-2 bg-primary flex-shrink-0" />
                        <span className="text-muted-foreground">Your profile was viewed 23 times today</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-body">
                        <div className="w-2 h-2 bg-primary flex-shrink-0" />
                        <span className="text-muted-foreground">New casting match: Summer Campaign</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-body">
                        <div className="w-2 h-2 bg-border flex-shrink-0" />
                        <span className="text-muted-foreground">Booking confirmed for Mar 15</span>
                      </div>
                    </div>
                  </div>

                  <div className="magazine-border p-6">
                    <h3 className="font-display text-xl mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link to="/dashboard/account" className="flex items-center justify-between text-sm font-body text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-secondary">
                        Update Profile <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link to="/casting" className="flex items-center justify-between text-sm font-body text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-secondary">
                        Browse Castings <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link to="/dashboard/premium" className="flex items-center justify-between text-sm font-body text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-secondary">
                        Go Premium <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
