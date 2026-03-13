"use client";
import { useState, useEffect } from "react";
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "@/lib/router-next";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHome = location.pathname === "/";
  const isLoggedIn = !!user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Models", path: "/models" },
    { label: "Categories", path: "/categories" },
    { label: "Casting", path: "/casting" },
    { label: "New Faces", path: "/new-faces" },
    { label: "Premium", path: "/directory" },
    { label: "Marketplace", path: "/marketplace" },
    { label: "Partners", path: "/sponsor" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isTransparent = isHome && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? "bg-transparent" : "glass-dark shadow-[0_1px_0_0_hsla(0,0%,0%,0.06)]"}`}>
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="shrink-0" aria-hidden="true" />

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`hover:text-primary transition-colors duration-300 text-xs font-body tracking-[0.15em] uppercase ${isTransparent ? "text-white/80" : "text-muted-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className={`flex items-center gap-2 hover:text-primary transition-colors p-2 rounded ${isTransparent ? "text-white/90" : "text-muted-foreground"}`}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <User className="w-4 h-4" />
                <span className="text-xs font-body uppercase tracking-wider truncate max-w-[100px]">{user?.fullName || user?.email?.split("@")[0]}</span>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 top-full mt-1 py-2 w-48 bg-card border border-border shadow-lg z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-foreground hover:bg-secondary"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => { logout(); setUserMenuOpen(false); navigate("/"); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-body text-foreground hover:bg-secondary text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={`hover:text-primary transition-colors p-2 ${isTransparent ? "text-white/80" : "text-muted-foreground"}`}>
                <User className="w-4 h-4" />
              </Link>
              <Link to="/signup" className="bg-gradient-red text-primary-foreground px-5 py-2 text-xs font-body font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity">
                Join Us
              </Link>
            </>
          )}
        </div>

        <button className={`lg:hidden p-2 ${isTransparent ? "text-white" : "text-foreground"}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in">
          <div className="px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-body tracking-[0.15em] uppercase"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="border border-border text-foreground px-5 py-2.5 text-xs font-body font-medium tracking-[0.15em] uppercase flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setIsOpen(false); navigate("/"); }}
                    className="border border-primary text-primary px-5 py-2.5 text-xs font-body font-medium tracking-[0.15em] uppercase flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="border border-border text-foreground px-5 py-2.5 text-xs font-body font-medium tracking-[0.15em] uppercase" onClick={() => setIsOpen(false)}>
                    Log In
                  </Link>
                  <Link to="/signup" className="bg-gradient-red text-primary-foreground px-5 py-2.5 text-xs font-body font-medium tracking-[0.15em] uppercase" onClick={() => setIsOpen(false)}>
                    Join Us
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
