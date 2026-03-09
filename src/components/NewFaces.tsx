import model1 from "@/assets/model-1.jpg";
import model2 from "@/assets/model-2.jpg";
import model3 from "@/assets/model-3.jpg";
import model4 from "@/assets/model-4.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

const newFaces = [
  { name: "Sophia Laurent", image: model1, age: 19, location: "Paris", country: "France", id: "sophia-laurent" },
  { name: "Marco Rossi", image: model2, age: 21, location: "Milan", country: "Italy", id: "marco-rossi" },
  { name: "Zara Williams", image: model3, age: 20, location: "London", country: "UK", id: "zara-williams" },
  { name: "Mei Lin", image: model4, age: 18, location: "Tokyo", country: "Japan", id: "mei-lin" },
  { name: "Amara Diallo", image: model1, age: 22, location: "Dakar", country: "Senegal", id: "amara-diallo" },
  { name: "Luca Fernandez", image: model2, age: 20, location: "Madrid", country: "Spain", id: "luca-fernandez" },
  { name: "Aisha Khan", image: model3, age: 19, location: "Dubai", country: "UAE", id: "aisha-khan" },
  { name: "Emma Davis", image: model4, age: 21, location: "New York", country: "USA", id: "emma-davis" },
];

const countries = ["All", "France", "Italy", "UK", "Japan", "Senegal", "Spain", "UAE", "USA"];

const NewFaces = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeCountry, setActiveCountry] = useState("All");

  const filtered = activeCountry === "All" ? newFaces : newFaces.filter((m) => m.country === activeCountry);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  const scrollTabs = (dir: "left" | "right") => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: dir === "left" ? -150 : 150, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Fresh Talent</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent">New Faces</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll("left")} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all flex-shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all flex-shrink-0">
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link to="/new-faces" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors hidden md:inline-block ml-2 whitespace-nowrap">
              View All →
            </Link>
          </div>
        </div>

        {/* Country tabs */}
        <div className="relative mb-8">
          <button onClick={() => scrollTabs("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary md:hidden">
            <ChevronLeft className="w-3 h-3" />
          </button>
          <div ref={tabsRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-8 md:px-0">
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setActiveCountry(country)}
                className={`px-4 py-2 text-xs font-body tracking-[0.15em] uppercase whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCountry === country
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground border border-border hover:border-primary hover:text-primary"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTabs("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary md:hidden">
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {filtered.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex-shrink-0 w-[240px] md:w-[260px] snap-start"
            >
              <Link to={`/model/${model.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden magazine-border mb-4">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-2 py-0.5">New</span>
                  </div>
                  <div className="absolute bottom-3 right-3 w-10 h-10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">{model.name}</h3>
                <p className="text-muted-foreground text-xs font-body tracking-wider mt-1">
                  {model.age} yrs • {model.location}, {model.country}
                </p>
              </Link>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-sm font-body py-8">No models found for this country yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewFaces;
