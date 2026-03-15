"use client";

import { Link, useLocation } from "@/lib/router-next";
import {
  LayoutDashboard, User, Heart, Briefcase, Star, CreditCard, Bell, ArrowRight,
  Megaphone, Calendar, Store, ImagePlus, Crown, List, Plus, Menu, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { publicApi, type PublicCasting } from "@/lib/api";
import { useState, useEffect } from "react";
import { imgSrc } from "@/lib/utils";

const MODEL_MENU = [
  { icon: Crown, label: "Premium", path: "/dashboard/premium" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: User, label: "Account", path: "/dashboard/account" },
  { icon: Heart, label: "Favorites", path: "/dashboard/favorites" },
  { icon: Briefcase, label: "Casting Applications", path: "/dashboard/castingapp" },
  { icon: Calendar, label: "Bookings", path: "/dashboard/bookings" },
  { icon: Star, label: "Reviews", path: "/dashboard/reviews" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: CreditCard, label: "Payouts", path: "/dashboard/payouts" },
  { icon: Store, label: "My Marketplace", path: "/dashboard/mymarketplace" },
  { icon: ImagePlus, label: "Update Portfolio", path: "/dashboard/update-portfolio" },
  { icon: CreditCard, label: "Subscription", path: "/dashboard/subscription" },
];

const PROFESSIONAL_MENU = [
  { icon: Crown, label: "Premium", path: "/dashboard/premium" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: User, label: "Account", path: "/dashboard/account" },
  { icon: Heart, label: "Favorites", path: "/dashboard/favorites" },
  { icon: List, label: "My Castings", path: "/dashboard/my-castings" },
  { icon: Plus, label: "Post a Casting", path: "/dashboard/post-casting" },
  { icon: Calendar, label: "Bookings", path: "/dashboard/bookings" },
  { icon: Star, label: "Reviews", path: "/dashboard/reviews" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Store, label: "Marketplace", path: "/dashboard/mymarketplace" },
  { icon: CreditCard, label: "Subscription", path: "/dashboard/subscription" },
];

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  changes_requested: "bg-orange-100 text-orange-700",
};

const DashboardPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isProfessional = user?.role === "professional";
  const isModel = user?.role === "model";
  const displayName = user?.fullName || user?.email?.split("@")[0] || "User";
  const menuItems = isProfessional ? PROFESSIONAL_MENU : MODEL_MENU;
  const [recentCastings, setRecentCastings] = useState<PublicCasting[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    publicApi.castings().then((list) => {
      if (list?.length) setRecentCastings(list.slice(0, 3));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (mobileSidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileSidebarOpen]);

  const roleLabel = isModel ? "Model" : isProfessional ? "Professional" : "User";
  const statusLabel = user?.status || "pending";

  const sidebarContent = (
    <>
      <div className="magazine-border p-5 mb-4">
        <div className="flex items-center gap-3 mb-3">
          {user?.profilePhoto ? (
            <img src={imgSrc(user.profilePhoto)} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display text-base truncate">{displayName}</p>
            <p className="text-muted-foreground text-xs font-body truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-body font-medium tracking-[0.2em] uppercase bg-primary/10 text-primary px-2 py-0.5">
            {roleLabel}
          </span>
          <span className={`text-[10px] font-body font-medium tracking-[0.15em] uppercase px-2 py-0.5 ${STATUS_COLORS[statusLabel] || "bg-secondary text-secondary-foreground"}`}>
            {statusLabel}
          </span>
        </div>
      </div>
      <nav className="space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setMobileSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-body tracking-[0.1em] uppercase transition-colors ${
              location.pathname === item.path
                ? "bg-primary/10 text-primary border-l-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 md:px-6 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-[260px] shrink-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              {sidebarContent}
            </aside>

            {/* Mobile: Menu button + slide-in sidebar */}
            <div className="lg:hidden flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 magazine-border text-sm font-body tracking-[0.1em] uppercase text-foreground hover:border-primary/50 transition-colors"
                aria-label="Open dashboard menu"
              >
                <Menu className="w-5 h-5 text-primary" />
                Menu
              </button>
              <span className="text-muted-foreground font-body text-sm">Dashboard</span>
            </div>

            <AnimatePresence>
              {mobileSidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-hidden="true"
                  />
                  <motion.aside
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                    className="fixed inset-y-0 left-0 z-50 w-[min(280px,85vw)] max-w-[280px] bg-background border-r border-border flex flex-col shadow-xl lg:hidden pt-20 px-3 pb-6"
                  >
                    <div className="flex items-center justify-between mb-4 px-1">
                      <span className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground">Dashboard</span>
                      <button
                        type="button"
                        onClick={() => setMobileSidebarOpen(false)}
                        className="p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        aria-label="Close menu"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto -mx-3 px-3">
                      {sidebarContent}
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Main content */}
            <main className="min-w-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                {/* Welcome header */}
                <div className="mb-6">
                  <h1 className="font-display text-3xl sm:text-4xl mb-1">Welcome back, {displayName.split(" ")[0]}</h1>
                  <p className="text-muted-foreground font-body text-sm">
                    {isProfessional
                      ? "Manage your castings, discover talent, and grow your projects."
                      : "Discover new opportunities and showcase your talent."}
                  </p>
                </div>

                {/* Status notice if not approved */}
                {user?.status && user.status !== "approved" && (
                  <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 flex items-start gap-3">
                    <div className="w-5 h-5 bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="font-body text-sm text-yellow-800 font-medium">
                        {user.status === "pending" ? "Your account is under review" :
                         user.status === "changes_requested" ? "Changes requested on your profile" :
                         user.status === "rejected" ? "Your application was not approved" :
                         "Account update pending review"}
                      </p>
                      {user.rejectionReason && (
                        <p className="font-body text-xs text-yellow-700 mt-1">{user.rejectionReason}</p>
                      )}
                      {user.status === "changes_requested" && (
                        <Link to="/dashboard/account" className="text-primary font-body text-xs mt-2 inline-flex items-center gap-1 hover:underline">
                          Update your profile <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Castings */}
                <div className="magazine-border p-5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl text-foreground">Recent Casting Calls</h2>
                    <Link to="/casting" className="text-primary text-xs font-body tracking-wider uppercase hover:underline">
                      View all →
                    </Link>
                  </div>
                  {recentCastings.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground font-body text-sm">No castings available yet.</p>
                      <Link to="/casting" className="text-primary font-body text-xs mt-2 inline-flex items-center gap-1 hover:underline">
                        Browse all castings <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentCastings.map((c) => (
                        <Link
                          key={c._id}
                          to={`/casting/${c._id}`}
                          className="flex items-center justify-between gap-3 p-3 bg-secondary/40 hover:bg-secondary transition-colors group"
                        >
                          <div className="min-w-0">
                            <p className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {c.title}
                            </p>
                            <p className="text-muted-foreground text-xs font-body">
                              {c.brand || "—"} · {c.location || "—"}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions grid */}
                <div className="magazine-border p-5 mb-4">
                  <h2 className="font-display text-xl mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {isProfessional ? (
                      <>
                        <Link to="/dashboard/post-casting" className="flex flex-col items-center gap-2 p-4 bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-center">
                          <Plus className="w-5 h-5" />
                          <span className="text-xs font-body tracking-wider uppercase">Post Casting</span>
                        </Link>
                        <Link to="/dashboard/my-castings" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <List className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">My Castings</span>
                        </Link>
                        <Link to="/models" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <User className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">Browse Models</span>
                        </Link>
                        <Link to="/dashboard/bookings" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">Bookings</span>
                        </Link>
                        <Link to="/dashboard/mymarketplace" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <Store className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">Marketplace</span>
                        </Link>
                        <Link to="/dashboard/account" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <User className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">Profile</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/casting" className="flex flex-col items-center gap-2 p-4 bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-center">
                          <Briefcase className="w-5 h-5" />
                          <span className="text-xs font-body tracking-wider uppercase">Browse Castings</span>
                        </Link>
                        <Link to="/dashboard/update-portfolio" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <ImagePlus className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">Portfolio</span>
                        </Link>
                        <Link to="/dashboard/bookings" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">Bookings</span>
                        </Link>
                        <Link to="/dashboard/castingapp" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <Megaphone className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">Applications</span>
                        </Link>
                        <Link to="/dashboard/favorites" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <Heart className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">Favorites</span>
                        </Link>
                        <Link to="/dashboard/account" className="flex flex-col items-center gap-2 p-4 bg-secondary hover:bg-secondary/80 transition-colors text-center">
                          <User className="w-5 h-5 text-primary" />
                          <span className="text-xs font-body tracking-wider uppercase text-foreground">Profile</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                {/* Bookings & Reviews placeholders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="magazine-border p-5">
                    <h3 className="font-display text-lg mb-2">Latest Booking</h3>
                    <p className="text-muted-foreground font-body text-sm">You haven&apos;t had any bookings yet.</p>
                    <Link to="/dashboard/bookings" className="text-primary font-body text-xs mt-3 inline-flex items-center gap-1 hover:underline">
                      View bookings <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="magazine-border p-5">
                    <h3 className="font-display text-lg mb-2">Messages</h3>
                    <p className="text-muted-foreground font-body text-sm">You don&apos;t have any messages yet.</p>
                    <Link to="/dashboard/premium" className="text-primary font-body text-xs mt-3 inline-flex items-center gap-1 hover:underline">
                      Go Premium for messaging <ArrowRight className="w-3 h-3" />
                    </Link>
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
