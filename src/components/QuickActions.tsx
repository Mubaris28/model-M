import { Sparkles, Star, Camera, Palette, Shirt, Brush, Link2, Rocket, ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";

const PATH_IMAGES = "/images/Find%20-your-Path";

const actions = [
  { icon: Sparkles, label: "I'm New to the Spotlight", link: "/discover-path/im-new-to-the-spotlight", description: "Start your modeling journey", image: `${PATH_IMAGES}/new-to-spot-light.webp` },
  { icon: Star, label: "I'm a Full-Time Model", link: "/discover-path/im-a-full-time-model", description: "Explore opportunities", image: `${PATH_IMAGES}/portrait-d-une-belle-fille-tenant-un-rouge-a-levres-sur-fond-blanc.jpg` },
  { icon: Palette, label: "I'm an Influencer with a passion for creating", link: "/discover-path/im-an-influencer-with-a-passion-for-creating", description: "Content creation & influence", image: `${PATH_IMAGES}/INFLUENCER_PICTURE_shuffle.jpg` },
  { icon: Camera, label: "I'm a Creative Photographer", link: "/discover-path/im-a-creative-photographer", description: "Connect with talent", image: `${PATH_IMAGES}/photographer_picture_banner_inside.jpg` },
  { icon: Shirt, label: "I'm a Stylist", link: "/discover-path/im-a-stylist", description: "Fashion & styling", image: `${PATH_IMAGES}/5._stylist_shuffle_2.jpg` },
  { icon: Brush, label: "I'm a Talent Artist", link: "/discover-path/im-a-talent-artist", description: "Creative collaborations", image: `${PATH_IMAGES}/6._ARTIST_INSIDE_BANNER.jpg` },
  { icon: Link2, label: "Connect Now", link: "/discover-path/were-more-than-a-brand", description: "We're more than a brand", image: `${PATH_IMAGES}/connect-now.jpg` },
  { icon: Rocket, label: "Get Started", link: "/discover-path/we-are-your-go-to-agency", description: "We are your go-to agency", image: `${PATH_IMAGES}/8._AGENCY_shuffle.jpg` },
];

const QuickActions = () => {
  return (
    <section className="py-12 md:py-14 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Get Started</p>
          <h2 className="font-display text-4xl md:text-5xl line-accent text-primary">Find Your Path</h2>
        </div>
        <div className="mobile-slider gap-4">
          {actions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to={action.link}
                className="group flex flex-col magazine-border hover:border-primary/40 transition-all duration-300 overflow-hidden h-full bg-card"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={action.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 w-10 h-10 bg-primary/90 flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex flex-col items-center text-center p-5">
                  <h3 className="font-display text-base md:text-lg text-foreground group-hover:text-primary transition-colors mb-1">{action.label}</h3>
                  <p className="text-muted-foreground text-xs font-body mb-3 line-clamp-2">{action.description}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
