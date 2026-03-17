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

  // Horizontal editorial ad banner — red bg, high-contrast white content
  return (
    <div className="relative overflow-hidden bg-primary">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-white/50" aria-hidden />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 px-6 sm:px-10 py-8">
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex w-14 h-14 rounded-sm bg-white/25 items-center justify-center flex-shrink-0 shadow-sm">
            <span className="font-display text-2xl text-white drop-shadow-sm">★</span>
          </div>
          <div>
            <p className="text-[10px] text-white font-body tracking-[0.45em] uppercase mb-1.5 font-medium">Premium Opportunity</p>
            <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight tracking-tight">Casting calls for top brands</h3>
            <p className="text-white/95 text-sm font-body mt-2 max-w-md">Register your profile and get discovered by leading agencies in Mauritius.</p>
          </div>
        </div>
        <Link
          to="/casting"
          className="shrink-0 bg-white text-primary px-8 py-3.5 text-xs font-body font-semibold tracking-[0.2em] uppercase hover:bg-white/95 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
        >
          View Castings →
        </Link>
      </div>
    </div>
  );
};

export default AdBanner;
