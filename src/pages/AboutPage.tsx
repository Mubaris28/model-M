import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";
import { Globe, Users, Zap, Shield, Award, Heart } from "lucide-react";

const values = [
  { icon: Globe, title: "Inclusive Platform", text: "We welcome models of all backgrounds, ages, sizes, and experience levels. Diversity is our strength." },
  { icon: Zap, title: "Fast & Direct", text: "Connect directly with brands, photographers, and agencies. No middlemen, no delays." },
  { icon: Shield, title: "Verified & Safe", text: "All profiles are reviewed by our team. Every casting and brand is vetted for authenticity." },
  { icon: Heart, title: "Community First", text: "Built around the creative community. We grow together and support each other's careers." },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <BackButton className="mb-6" />
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Our Story</p>
          <h1 className="font-display text-6xl md:text-8xl line-accent">About Us</h1>
          <p className="font-body text-sm text-muted-foreground mt-4 max-w-xl">
            Transforming how models and talent connect with the world
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-foreground text-background py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-4">Our Mission</p>
            <h2 className="font-display text-5xl md:text-6xl text-background mb-6">
              One Platform.<br />Infinite Possibilities.
            </h2>
            <p className="font-body text-background/70 text-base md:text-lg leading-relaxed max-w-2xl">
              Model Management Mauritius is an innovative online platform dedicated to revolutionising the way models
              and talents connect with clients across the globe. We streamline the process of sourcing diverse talent
              for a wide range of projects from fashion editorials to commercial campaigns and everything in between.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content sections */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              label: "For Models & Talent",
              title: "Your Career Starts Here",
              text: "Whether you are a beginner, a professional model, an influencer, or simply exploring opportunities to showcase your unique look, we welcome you. We believe that diversity enriches the industry, and modeling is an opportunity accessible to all.",
              cta: "Join as a Model",
              link: "/signup",
            },
            {
              label: "For Clients & Professionals",
              title: "Find the Perfect Talent",
              text: "Photographers, brands, casting directors, agencies, and production companies can post paid jobs, collaboration shoots, or other projects. Get direct access to a carefully curated selection of talented and diverse models.",
              cta: "Post a Casting",
              link: "/dashboard",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card magazine-border p-8 md:p-10 flex flex-col"
            >
              <p className="text-primary font-body text-[10px] tracking-[0.4em] uppercase mb-3">{item.label}</p>
              <h3 className="font-display text-3xl text-foreground mb-4">{item.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed flex-1 mb-6">{item.text}</p>
              <Link to={item.link} className="btn-primary inline-flex self-start">{item.cta}</Link>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">What We Stand For</p>
          <h2 className="font-display text-5xl md:text-6xl line-accent mb-10">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-card magazine-border p-6"
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-foreground mb-1">{v.title}</h4>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{v.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Founder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-foreground text-background p-8 md:p-12 flex flex-col md:flex-row gap-8 md:items-center mb-16"
        >
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-primary/20 flex items-center justify-center">
              <Award className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div>
            <p className="text-primary font-body text-[10px] tracking-[0.4em] uppercase mb-2">Founded By</p>
            <h3 className="font-display text-3xl text-background mb-2">Basant Lallah</h3>
            <p className="text-background/60 font-body text-sm leading-relaxed">
              Managing Director of Flash Communications Ltd. He founded Model Management Mauritius to
              bring the global modeling industry closer to home creating a platform where local talent
              meets international opportunity.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="bg-card magazine-border p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl text-foreground mb-2">Full-Service Campaign Management</h2>
            <p className="text-muted-foreground font-body text-sm max-w-lg">
              Need end-to-end campaign support? Our experienced casting team is available to assist. Contact us to
              discuss your requirements.
            </p>
          </div>
          <Link to="/contact" className="btn-primary inline-flex flex-shrink-0">Contact Us</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
