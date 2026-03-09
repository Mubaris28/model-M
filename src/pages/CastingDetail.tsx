import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { castings } from "@/components/CastingCalls";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const CastingDetail = () => {
  const { id } = useParams();
  const casting = castings.find((c) => c.id === id);

  if (!casting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-6xl text-foreground">Casting Not Found</h1>
          <Link to="/casting" className="text-primary font-body text-sm mt-4 inline-block">← Back to Castings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link to="/casting" className="inline-flex items-center gap-2 text-muted-foreground text-xs font-body tracking-wider uppercase hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-3 h-3" /> Back to Castings
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              {casting.urgent && (
                <span className="bg-primary/10 text-primary text-[10px] font-body font-medium px-3 py-1 tracking-[0.2em] uppercase">Urgent</span>
              )}
              {casting.categories.map((cat) => (
                <span key={cat} className="bg-secondary text-secondary-foreground text-[10px] font-body px-3 py-1 tracking-[0.15em] uppercase">{cat}</span>
              ))}
            </div>

            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-2">{casting.title}</h1>
            <p className="text-primary font-body text-sm tracking-wider mb-8">{casting.brand}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Calendar, label: "Date", value: casting.date },
                { icon: MapPin, label: "Location", value: casting.location },
                { icon: Users, label: "Open Slots", value: `${casting.slots} positions` },
              ].map((item) => (
                <div key={item.label} className="bg-card magazine-border p-5 text-center">
                  <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground text-[10px] font-body tracking-[0.2em] uppercase mb-1">{item.label}</p>
                  <p className="font-display text-xl text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-10">
              <h3 className="font-display text-2xl text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">{casting.description}</p>
              <p className="text-muted-foreground text-sm font-body leading-relaxed mt-4">
                This is a professional casting opportunity. All models must be 18+ and have a professional portfolio. 
                Travel and accommodation may be provided depending on the location. Compensation details will be 
                discussed during the callback process.
              </p>
            </div>

            <div className="mb-10">
              <h3 className="font-display text-2xl text-foreground mb-3">Requirements</h3>
              <ul className="space-y-2">
                {["Professional portfolio required", "Must be 18+ years old", "Available for the full shoot duration", "Comfortable with the category requirements", "Valid identification required"].map((req) => (
                  <li key={req} className="flex items-center gap-3 text-muted-foreground text-sm font-body">
                    <div className="w-1.5 h-1.5 bg-primary flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button className="bg-gradient-red text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity">
                Apply Now
              </button>
              <button className="border border-border text-foreground p-3 hover:border-primary transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CastingDetail;
