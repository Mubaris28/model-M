"use client";

import { useState, useEffect } from "react";
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "@/lib/router-next";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const SCROLL_THRESHOLD = 10;

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
    const updateScrolled = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Models", path: "/models" },
    { label: "Categories", path: "/categories" },
    { label: "Casting", path: "/casting" },
    { label: "New Faces", path: "/new-faces" },
    { label: "Event", path: "/event" },
    { label: "Premium", path: "/directory" },
    { label: "Marketplace", path: "/marketplace" },
    { label: "Partners", path: "/sponsor" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isTransparent = isHome && !scrolled;
  const navBg = isTransparent
    ? "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_hsla(0,0%,0%,0.06)]";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

        {/* ── Mobile bar ── */}
        <div className="flex lg:hidden items-center gap-2 w-full justify-end">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                aria-label="Dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-body font-medium tracking-wider uppercase ${isTransparent ? "text-white/90 hover:bg-white/10" : "text-foreground hover:bg-secondary"}`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className="sr-only sm:not-sr-only">Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={() => { logout(); navigate("/"); }}
                aria-label="Sign out"
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-body font-medium tracking-wider uppercase ${isTransparent ? "text-white/90 hover:bg-white/10" : "text-foreground hover:bg-secondary"}`}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="sr-only sm:not-sr-only">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-3 py-2 text-xs font-body font-medium tracking-[0.15em] uppercase ${isTransparent ? "text-white/90 hover:bg-white/10" : "text-muted-foreground hover:text-primary"}`}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-red text-primary-foreground px-3 py-2 text-xs font-body font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
              >
                Join Us
              </Link>
            </>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className={`p-2.5 -mr-1 ${isTransparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-secondary"} transition-colors`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── Desktop nav ── */}
        <div className="hidden lg:block shrink-0" aria-hidden="true" />
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
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                className={`flex items-center gap-2 hover:text-primary transition-colors p-2 rounded ${isTransparent ? "text-white/90" : "text-muted-foreground"}`}
              >
                <User className="w-4 h-4" />
                <span className="text-xs font-body uppercase tracking-wider truncate max-w-[100px]">
                  {user?.fullName || user?.email?.split("@")[0]}
                </span>
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
      </div>

      {/* ── Mobile slide-down menu ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden bg-foreground/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-x-0 top-0 z-50 lg:hidden bg-background border-b border-border shadow-xl"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="p-2.5 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="overflow-y-auto max-h-[calc(100dvh-140px)] px-4 py-6" aria-label="Mobile navigation">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="block py-3.5 text-base font-body tracking-[0.12em] uppercase text-foreground hover:text-primary transition-colors border-b border-border/50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-border">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 w-full py-3.5 px-4 border border-border text-foreground font-body text-sm tracking-[0.15em] uppercase hover:border-primary hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="w-5 h-5 shrink-0" /> Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={() => { logout(); setIsOpen(false); navigate("/"); }}
                        className="flex items-center gap-3 w-full py-3.5 px-4 border border-primary text-primary font-body text-sm tracking-[0.15em] uppercase hover:bg-primary/10 transition-colors text-left"
                      >
                        <LogOut className="w-5 h-5 shrink-0" /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-3 w-full py-3.5 px-4 border border-border text-foreground font-body text-sm tracking-[0.15em] uppercase hover:border-primary hover:text-primary transition-colors"
                      >
                        <User className="w-5 h-5 shrink-0" /> Log In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-4 px-4 bg-gradient-red text-primary-foreground font-body text-sm font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                      >
                        Join Us
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
