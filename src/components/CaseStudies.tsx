import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { motion } from "framer-motion";
import model1 from "@/assets/model-1.jpg";
import model2 from "@/assets/model-2.jpg";
import model3 from "@/assets/model-3.jpg";

const caseStudies = [
  {
    id: "from-struggles-to-success",
    title: "From Struggles to Success",
    description: "How model management empowers every model",
    image: model1,
  },
  {
    id: "why-we-created-modelmanagement-mauritius",
    title: "Why Modelmanagement.mu in Mauritius",
    description: "Bridging the gap between local talent and global opportunities",
    image: model2,
  },
  {
    id: "all-faces-all-backgrounds",
    title: "All Faces. All Backgrounds. One Platform.",
    description: "Where Passion Matters More Than Perfection",
    image: model3,
  },
];

const CaseStudies = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Stories</p>
          <h2 className="font-display text-5xl md:text-6xl line-accent text-primary">Case Studies</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={`/case-studies/${study.id}`} className="group block">
                <div className="relative w-full aspect-[4/3] min-h-[320px] md:min-h-[400px] overflow-hidden magazine-border mb-4">
                  <img src={imgSrc(study.image)} alt={study.title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 cinematic-overlay" />
                </div>
                <h3 className="font-display text-2xl text-primary group-hover:text-red-light transition-colors mb-2">{study.title}</h3>
                <p className="text-muted-foreground text-xs font-body leading-relaxed mb-3">{study.description}</p>
                <span className="text-primary text-xs font-body tracking-[0.15em] uppercase inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  View Project <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
