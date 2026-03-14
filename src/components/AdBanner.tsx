import { Link } from "@/lib/router-next";

const AdBanner = ({ variant = "horizontal" }: { variant?: "horizontal" | "cosmetics" }) => {
  if (variant === "cosmetics") {
    return (
      <section className="w-full overflow-hidden">
        {/* Mobile */}
        <a href="https://bodyography.com" target="_blank" rel="noopener noreferrer" className="block md:hidden">
          <img
            src="/images/ad/Bodyography-Mobile-ADS.png"
            alt="Bodyography Professional Cosmetics — exclusive offer for ModelManagement.mu members"
            className="w-full h-auto object-contain block"
          />
        </a>
        {/* Desktop */}
        <a href="https://bodyography.com" target="_blank" rel="noopener noreferrer" className="hidden md:block">
          <img
            src="/images/ad/Bodyography-Web-ADS.png"
            alt="Bodyography Professional Cosmetics — exclusive offer for ModelManagement.mu members"
            className="w-full h-auto object-contain"
          />
        </a>
      </section>
    );
  }

  // Horizontal editorial ad banner
  return (
    <div className="relative overflow-hidden bg-foreground">
      {/* Decorative accent line */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-red" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 px-6 sm:px-10 py-7">
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex w-12 h-12 bg-gradient-red items-center justify-center flex-shrink-0">
            <span className="font-display text-xl text-white">★</span>
          </div>
          <div>
            <p className="text-[10px] text-primary font-body tracking-[0.4em] uppercase mb-1">Premium Opportunity</p>
            <h3 className="font-display text-2xl text-white leading-tight">Casting calls for top brands</h3>
            <p className="text-white/50 text-xs font-body mt-1">Register your profile and get discovered by leading agencies in Mauritius.</p>
          </div>
        </div>
        <Link
          to="/casting"
          className="shrink-0 bg-gradient-red text-white px-7 py-3 text-xs font-body font-medium tracking-[0.2em] uppercase hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          View Castings →
        </Link>
      </div>
    </div>
  );
};

export default AdBanner;
