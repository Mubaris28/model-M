import { useState, useEffect } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

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
    { label: "Marketplace", path: "/marketplace" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isTransparent = isHome && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? "bg-transparent" : "glass-dark border-b border-border shadow-sm"}`}>
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-red flex items-center justify-center">
            <span className="font-display text-primary-foreground text-lg leading-none">É</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className={`font-display text-xl tracking-[0.15em] ${isTransparent ? "text-white" : "text-foreground"}`}>ÉLITE</span>
            <span className={`text-[8px] font-body font-light tracking-[0.4em] uppercase ${isTransparent ? "text-white/60" : "text-muted-foreground"}`}>Models Agency</span>
          </div>
        </Link>

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
          <button className={`hover:text-primary transition-colors p-2 ${isTransparent ? "text-white/80" : "text-muted-foreground"}`}>
            <Search className="w-4 h-4" />
          </button>
          <Link to="/login" className={`hover:text-primary transition-colors p-2 ${isTransparent ? "text-white/80" : "text-muted-foreground"}`}>
            <User className="w-4 h-4" />
          </Link>
          <Link to="/signup" className="bg-gradient-red text-primary-foreground px-5 py-2 text-xs font-body font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity">
            Join Us
          </Link>
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
            <div className="flex gap-3 mt-2">
              <Link to="/login" className="border border-border text-foreground px-5 py-2.5 text-xs font-body font-medium tracking-[0.15em] uppercase" onClick={() => setIsOpen(false)}>
                Log In
              </Link>
              <Link to="/signup" className="bg-gradient-red text-primary-foreground px-5 py-2.5 text-xs font-body font-medium tracking-[0.15em] uppercase" onClick={() => setIsOpen(false)}>
                Join Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
