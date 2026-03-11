import model1 from "@/assets/model-1.jpg";
import model2 from "@/assets/model-2.jpg";
import model3 from "@/assets/model-3.jpg";
import model4 from "@/assets/model-4.jpg";
import { motion } from "framer-motion";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { publicApi, type PublicModel } from "@/lib/api";

const fallbackFaces = [
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

type FaceCard = {
  id: string;
  name: string;
  image: string | { src: string };
  age: number;
  location: string;
  country: string;
};

function toFaceCard(m: PublicModel): FaceCard {
  const photo = m.profilePhoto || m.portfolio?.[0] || "";
  const age = m.dateOfBirth ? new Date().getFullYear() - new Date(m.dateOfBirth).getFullYear() : 0;
  return {
    id: m._id,
    name: m.fullName || "Model",
    image: photo,
    age: age || 20,
    location: m.city || "",
    country: m.country || "—",
  };
}

type NewFacesProps = {
  /** On home page: show 6 cards in 2 rows (3 columns). Omit on dedicated new-faces page. */
  homePreview?: boolean;
};

const NewFaces = ({ homePreview }: NewFacesProps) => {
  const [activeCountry, setActiveCountry] = useState("All");
  const [faces, setFaces] = useState<FaceCard[]>(fallbackFaces.map((f) => ({ ...f, image: f.image as { src: string } })));

  useEffect(() => {
    publicApi
      .models()
      .then((list) => {
        if (list?.length) setFaces(list.map(toFaceCard));
      })
      .catch(() => {});
  }, []);

  const filtered = activeCountry === "All" ? faces : faces.filter((m) => m.country === activeCountry);
  const displayList = homePreview ? filtered.slice(0, 6) : filtered;

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Fresh Talent</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent text-primary">New Faces</h2>
          </div>
          <Link to="/new-faces" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors whitespace-nowrap">
            View All →
          </Link>
        </div>

        {/* Country tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`px-4 py-2 text-xs font-body tracking-[0.15em] uppercase whitespace-nowrap transition-all ${
                activeCountry === country
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6"
        >
          {displayList.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to={`/model/${model.id}`} className="group block">
                <div className="relative aspect-[3/4] min-h-[220px] sm:min-h-[260px] overflow-hidden magazine-border mb-4">
                  <img
                    src={imgSrc(model.image)}
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
                  {model.age ? `${model.age} yrs • ` : ""}{model.location}{model.country && model.country !== "—" ? `, ${model.country}` : ""}
                </p>
              </Link>
            </motion.div>
          ))}
          {displayList.length === 0 && (
            <p className="text-muted-foreground text-sm font-body py-8">No models found for this country yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewFaces;
