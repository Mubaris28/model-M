import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useParams, Link } from "@/lib/router-next";
import { motion } from "framer-motion";

type CaseStudy = {
  category: string;
  title: string;
  subtitle: string;
  challenge: string;
  stats: { value: string; label: string }[];
  solution: string;
  impact: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  ctaPath: string;
};

const caseStudiesData: Record<string, CaseStudy> = {
  "from-struggles-to-success": {
    category: "Case Study 1",
    title: "From Struggles to Success: How model management empowers every model",
    subtitle: "Empowering models through transparency, technology, and fair practices",
    challenge:
      "The modelling industry may appear glamorous from the outside, but many models face real challenges behind the scenes. Unstable income, inconsistent job opportunities, and the constant pressure to maintain a perfect image often lead to stress and insecurity. Many aspiring talents struggle to find the right guidance, face unfair working conditions, and experience difficulties managing travel, schedules, and finances. Additionally, short career spans and limited access to transparent contracts make it even harder for models to build long-term, sustainable careers.",
    stats: [
      { value: "100%", label: "Verified Professionals" },
      { value: "Secure", label: "Smart Contracts" },
      { value: "Transparent", label: "Fair Practices" },
    ],
    solution:
      "At Modelmanagement.mu, we aim to change this reality by creating a safer, smarter, and more empowering environment for models. Our platform connects models directly with verified professionals, ensuring transparency and trust in every collaboration. Through our smart contract system, all agreements are clear and secure, protecting the rights of both models and professionals. We also provide resources, training opportunities, and visibility tools that help models showcase their talent and build a personal brand beyond traditional agencies.",
    impact:
      "By combining technology, education, and fair practices, Modelmanagement.mu bridges the gap between models and the industry. We help talents take control of their careers, access more opportunities, and work confidently with local and international brands. Our goal is simple: to make the modelling journey not only successful but also safe, transparent, and sustainable for every model who joins our platform.",
    ctaTitle: "Ready to take control of your modelling career?",
    ctaText: "Join Modelmanagement.mu and experience a safer, smarter, and more empowering modelling journey",
    ctaButton: "Join Now",
    ctaPath: "/signup",
  },
  "why-we-created-modelmanagement-mauritius": {
    category: "Case Study 3",
    title: "Why We Created Modelmanagement in Mauritius",
    subtitle: "Bridging the gap between local talent and global opportunities",
    challenge:
      "The modelling world has evolved faster than ever before. Around the globe, digital platforms and social media have transformed the way models are discovered and hired. Today, opportunities no longer depend only on physical agencies or location: talented individuals can build successful careers from anywhere in the world. However, in Mauritius, this global momentum has yet to be fully embraced. Despite the island's growing creative energy, talented people often lack the visibility, guidance, and structure needed to reach international standards.",
    stats: [
      { value: "Global", label: "Reach" },
      { value: "Local", label: "Talent" },
      { value: "Rising", label: "Hub" },
    ],
    solution:
      "That is where Modelmanagement.mu was born: out of a vision to bridge this gap. We saw that Mauritius is full of potential: diverse faces, unique stories, and ambitious individuals ready to shine. What was missing was a platform to connect them to real opportunities, protect their rights, and empower them to grow professionally. Modelmanagement.mu was created to give local talent the same tools and exposure enjoyed by models in larger markets.",
    impact:
      "We aim to position Mauritius as a rising hub in the modelling and creative industries: a place where passion meets professionalism. By embracing diversity, technology, and ethical practices, we're not just building a platform; we're building a movement that puts Mauritian talent on the global stage.",
    ctaTitle: "Ready to put Mauritian talent on the global stage?",
    ctaText: "Join Modelmanagement.mu and be part of the movement",
    ctaButton: "Join Now",
    ctaPath: "/signup",
  },
  "all-faces-all-backgrounds": {
    category: "Case Study 2",
    title: "All Faces. All Backgrounds. One Platform.",
    subtitle: "Where Passion Matters More Than Perfection",
    challenge:
      "The modelling industry has long been seen as glamorous: full of lights, cameras, and international fame. But behind the spotlight lies a reality many aspiring models know too well: uncertainty, competition, and pressure to fit into narrow beauty standards. Many talented individuals are overlooked simply because they don't fit a \"typical\" mold; whether it's due to their skin color, body shape, or cultural background. Others face unstable income, lack of professional guidance, or fear of exploitation in an industry that often values looks over integrity.",
    stats: [
      { value: "All", label: "Faces Welcome" },
      { value: "Passion", label: "Over Perfection" },
      { value: "Fair", label: "Opportunities" },
    ],
    solution:
      "At Modelmanagement.mu, we believe it's time to redefine what it means to be a model. Our mission is to create a platform where talent, motivation, and professionalism matter more than perfection. Whether you're tall or petite, dark-skinned or fair, curvy or slim: if you are passionate, hardworking, and ready to grow, we are here to help you build your career. Our system is designed to make modelling accessible, transparent, and fair. Through verified professional listings and secure smart contracts, models can collaborate confidently with brands, photographers, and agencies. Every partnership is protected, ensuring fair pay, clear agreements, and mutual respect. We also help models develop professional portfolios, improve their visibility through digital tools, and gain access to training resources that enhance their confidence and skills.",
    impact:
      "But Modelmanagement.mu is more than a platform: it's a community. We celebrate individuality and diversity, giving every model a chance to shine in their own unique way. Our approach is to guide, not gatekeep; to empower, not exploit. By combining technology, mentorship, and inclusive values, we're helping models transform challenges into opportunities. In a world where trends change daily, true impact comes from authenticity. At Modelmanagement.mu, we're building the next generation of models: confident, diverse, and fearless, ready to represent the beauty of real people everywhere.",
    ctaTitle: "Ready to showcase your unique talent?",
    ctaText: "Join a platform where passion matters more than perfection",
    ctaButton: "Join Now",
    ctaPath: "/signup",
  },
};

const CaseStudyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const study = id ? caseStudiesData[id] : null;

  if (!study) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6">
          <p className="text-muted-foreground">Case study not found.</p>
          <BackButton label="Back to Homepage" className="mt-4 text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <BackButton label="Back to Homepage" className="mb-8 text-xs tracking-[0.15em] uppercase" />
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <header>
              <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">{study.category}</p>
              <h1 className="font-display text-4xl md:text-6xl line-accent mb-4">{study.title}</h1>
              <p className="text-muted-foreground font-body text-lg leading-relaxed">{study.subtitle}</p>
            </header>

            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">The Challenge</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{study.challenge}</p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {study.stats.map((stat) => (
                <div key={stat.label} className="bg-card magazine-border p-6 text-center">
                  <p className="font-display text-3xl text-primary mb-1">{stat.value}</p>
                  <p className="text-muted-foreground text-xs font-body tracking-wider uppercase">{stat.label}</p>
                </div>
              ))}
            </section>

            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Our Solution</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{study.solution}</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">The Impact</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{study.impact}</p>
            </section>

            <section className="bg-card magazine-border p-8">
              <h2 className="font-display text-2xl text-foreground mb-2">{study.ctaTitle}</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">{study.ctaText}</p>
              <Link to={study.ctaPath} className="btn-primary inline-flex">
                {study.ctaButton}
              </Link>
            </section>
          </motion.article>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CaseStudyDetail;
