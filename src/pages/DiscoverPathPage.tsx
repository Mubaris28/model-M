"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useParams } from "@/lib/router-next";
import { motion } from "framer-motion";

type Section = { title: string; body: string; bullets?: string[]; ctaLabel?: string; ctaLink?: string };

const PATH_IMAGES = "/images/Find%20-your-Path";

const pathImages: Record<string, string> = {
  "im-new-to-the-spotlight": `${PATH_IMAGES}/new-to-spot-light.webp`,
  "im-a-full-time-model": `${PATH_IMAGES}/portrait-d-une-belle-fille-tenant-un-rouge-a-levres-sur-fond-blanc.jpg`,
  "im-an-influencer-with-a-passion-for-creating": `${PATH_IMAGES}/INFLUENCER_PICTURE_shuffle.jpg`,
  "im-a-creative-photographer": `${PATH_IMAGES}/photographer_picture_banner_inside.jpg`,
  "im-a-stylist": `${PATH_IMAGES}/5._stylist_shuffle_2.jpg`,
  "im-a-talent-artist": `${PATH_IMAGES}/6._ARTIST_INSIDE_BANNER.jpg`,
  "were-more-than-a-brand": `${PATH_IMAGES}/connect-now.jpg`,
  "we-are-your-go-to-agency": `${PATH_IMAGES}/8._AGENCY_shuffle.jpg`,
};

const discoverPaths: Record<string, { title: string; subtitle: string; sections: Section[]; footerCta?: string }> = {
  "im-new-to-the-spotlight": {
    title: "Where new faces begin their modeling careers",
    subtitle: "New to modeling? Your journey starts here!",
    sections: [
      { title: "Your Modeling Journey Starts Here", body: "Modeling isn't just for a select few. Our agency celebrates diversity and inclusivity, welcoming aspiring models of all ages, sizes, backgrounds, and experiences. Whether you're just starting out or exploring your potential, there's a place for your unique beauty in the modeling world.", ctaLabel: "Get Started", ctaLink: "/signup" },
      { title: "New to Modeling? There's a Place for You", body: "You don't need prior experience. We welcome newcomers of all shapes, sizes, and backgrounds. Explore: Fashion Modeling, Brand Modeling, Fitness Modeling, Plus-Size Modeling.", ctaLabel: "Start Application", ctaLink: "/signup" },
      { title: "Defining Talent", body: "In modeling, \"talent\" isn't just about looks. We value personality, confidence, and ability to bring energy.", bullets: ["Confidence: Trust yourself and embrace your natural qualities", "Personality: Let your true self shine in front of the camera", "Versatility: Be open to different styles, poses, and concepts", "Professionalism: Show up prepared, reliable, and ready to grow"], ctaLabel: "Find Your Type", ctaLink: "/signup" },
      { title: "How to create profile", body: "01 Set Up Your Profile: Sign up and create your modeling profile. 02 Showcase Your Photos: Upload your best shots. 03 Get Noticed: Be discovered by agencies or apply to opportunities. 04 Start Your Journey: Land your first gigs and build your career.", ctaLabel: "Get Started", ctaLink: "/signup" },
    ],
    footerCta: "Ready to Start Your Modeling Journey? Create your free profile today.",
  },
  "im-a-full-time-model": {
    title: "Advance Your Full-Time Modeling Career",
    subtitle: "Take your modeling journey further with premium tools, exclusive casting opportunities, and direct connections with industry professionals.",
    sections: [
      { title: "For Full-Time Models", body: "You've already built your experience and proven your talent. Now it's time to access advanced tools, exclusive opportunities, and industry connections that will take your career to the next level.", ctaLabel: "Get Started", ctaLink: "/signup" },
      { title: "Advanced Professional Tools", body: "Unlock powerful features: Exclusive Casting Access, Performance Analytics, Portfolio Management, Global Opportunities.", ctaLabel: "Explore Pro Features", ctaLink: "/signup" },
      { title: "Pro Benefits That Accelerate Your Career", body: "Priority Placement, Direct Brand Access, Advanced Analytics, Exclusive Events.", ctaLabel: "Upgrade to Pro", ctaLink: "/signup" },
    ],
    footerCta: "Ready to Elevate Your Career? Join thousands of professional models.",
  },
  "im-an-influencer-with-a-passion-for-creating": {
    title: "Content Creation & Influence",
    subtitle: "Transform your creativity into a thriving career. Connect with brands, build your audience, and monetize your content.",
    sections: [
      { title: "Build Your Digital Empire", body: "Whether you're a seasoned influencer or just starting, our platform provides the tools, connections, and opportunities you need to turn your passion into a profitable career.", ctaLabel: "Get Started", ctaLink: "/signup" },
      { title: "Diverse Content Creation Opportunities", body: "Social Media Content, Video Production, Photography Shoots, Live Streaming.", ctaLabel: "Explore Opportunities", ctaLink: "/signup" },
      { title: "Monetize Your Content", body: "Brand Partnerships, Affiliate Marketing, Content Licensing.", ctaLabel: "Start Earning", ctaLink: "/signup" },
    ],
    footerCta: "Ready to Build Your Influence? Start Creating.",
  },
  "im-a-creative-photographer": {
    title: "Connect with exceptional talent for your creative vision",
    subtitle: "Find the perfect models and subjects for your photography projects. Bring your creative vision to life with our diverse network of professional talent.",
    sections: [
      { title: "Photography & Creative Arts", body: "Whether you're a fashion photographer, portrait artist, or commercial photographer, our platform connects you with exceptional models who understand your creative vision.", ctaLabel: "Get Started", ctaLink: "/signup" },
      { title: "Creative Services We Support", body: "Fashion Photography, Portrait Sessions, Commercial Projects, Creative Collaborations.", ctaLabel: "Start Your Project", ctaLink: "/signup" },
      { title: "How It Works", body: "01 Create Your Profile. 02 Browse Models. 03 Connect & Collaborate. 04 Create Amazing Work.", ctaLabel: "Get Started", ctaLink: "/signup" },
    ],
    footerCta: "Ready to Create Amazing Photography? Join as Photographer.",
  },
  "im-a-stylist": {
    title: "I'm a Stylist",
    subtitle: "Transform your passion for fashion into a thriving styling career. Connect with models, photographers, and brands to create stunning fashion content.",
    sections: [
      { title: "How It Works", body: "01 Create Your Stylist Profile: Sign up and showcase your styling expertise and portfolio. 02 Upload Your Portfolio: Add your best styling work. 03 Connect with Models & Brands: Network with models, photographers, and brands. 04 Land Styling Opportunities: Secure fashion shoots, editorial work, and brand collaborations.", ctaLabel: "Join Network", ctaLink: "/signup" },
      { title: "Why Choose Model Management for Styling?", body: "Portfolio Showcase, Network Building, Job Opportunities, Career Growth.", ctaLabel: "Learn More", ctaLink: "/contact" },
    ],
  },
  "im-a-talent-artist": {
    title: "I'm a Talent Artist",
    subtitle: "Transform your artistic vision into stunning collaborations. Connect with models, photographers, and brands to create extraordinary creative content.",
    sections: [
      { title: "How It Works", body: "01 Create Your Artist Profile: Showcase your artistic talent and creative vision. 02 Upload Your Portfolio: Add your best artistic work. 03 Connect with Models & Brands: Network with those looking for talented artists. 04 Land Creative Opportunities: Secure artistic collaborations and brand partnerships.", ctaLabel: "Showcase Talent", ctaLink: "/signup" },
      { title: "Why Choose Model Management for Artists?", body: "Portfolio Showcase, Creative Network, Artistic Opportunities, Career Growth.", ctaLabel: "Learn More", ctaLink: "/contact" },
    ],
  },
  "were-more-than-a-brand": {
    title: "Elevate Your Modeling Career from Day One",
    subtitle: "Are you an aspiring model or a seasoned professional looking to refine your image and maximize your opportunities? We're here to help!",
    sections: [
      { title: "Model Management Content", body: "At Model Management Mauritius, we specialize in comprehensive Model Management: building your unique image, managing your career, and securing those essential bookings." },
      { title: "Our Service Offerings", body: "Personal Brand Development: We craft a compelling image tailored to your strengths. Booking & Shoot Coordination: We handle photoshoots, schedules, and the right team. Ongoing Career Management: We manage bookings, negotiate contracts, and provide career advice. Portfolio Building: We help you develop a high-quality portfolio." },
      { title: "Why Choose Us?", body: "Dedicated Support from Day 1, Industry Expertise, Personalized Approach, Success-Driven.", ctaLabel: "Get Started Today", ctaLink: "/contact" },
    ],
    footerCta: "Ready to Start Your Modeling Journey? Start for free.",
  },
  "we-are-your-go-to-agency": {
    title: "Full-Service Campaign Management",
    subtitle: "Elevate Your Brand with Expert Campaign Solutions",
    sections: [
      { title: "Campaign Management", body: "At Model Management, we specialize in delivering comprehensive campaign management services, from talent selection to execution, with precision, creativity, and professionalism." },
      { title: "Why Choose Our Campaign Management Service?", body: "Expert Talent Acquisition, Strategic Planning, Creative Direction, Logistics & Coordination, Media & Content Management, Performance Monitoring." },
      { title: "Our Process", body: "1. Initial Consultation. 2. Talent Casting. 3. Concept Development. 4. Execution. 5. Post-Campaign Analysis.", ctaLabel: "Get Started Today", ctaLink: "/contact" },
    ],
    footerCta: "Ready to Build Powerful Brand Partnerships? Partner with Us.",
  },
};

const DiscoverPathPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const path = slug ? discoverPaths[slug] : null;

  if (!path) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6">
          <p className="text-muted-foreground">Page not found.</p>
          <Link to="/" className="text-primary text-sm font-body mt-4 inline-block">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cardImage = slug ? pathImages[slug] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10 md:space-y-14"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {cardImage && (
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <div className="aspect-[4/3] w-full max-w-md mx-auto lg:max-w-none overflow-hidden rounded-lg border border-border bg-muted">
                    <img src={cardImage} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}
              <div className={cardImage ? "lg:col-span-2 order-1 lg:order-2" : ""}>
                <header>
                  <Link to="/" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-6 inline-block">← Back to Home</Link>
                  <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Discover</p>
                  <h1 className="font-display text-4xl md:text-6xl line-accent mb-4">{path.title}</h1>
                  <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8">{path.subtitle}</p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/signup" className="bg-gradient-red text-primary-foreground px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-opacity">
                      Sign Up Now
                    </Link>
                    <Link to="/contact" className="border border-border px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:border-primary hover:text-primary transition-colors">
                      Get in Touch
                    </Link>
                  </div>
                </header>
              </div>
            </div>

            <div className="max-w-3xl space-y-14">
              {path.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="font-display text-2xl text-foreground mb-4">{section.title}</h2>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">{section.body}</p>
                  {section.bullets && (
                    <ul className="list-disc list-inside text-muted-foreground font-body text-sm space-y-2 mb-4">
                      {section.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {section.ctaLabel && section.ctaLink && (
                    <Link to={section.ctaLink} className="btn-primary inline-flex mt-2">{section.ctaLabel}</Link>
                  )}
                </section>
              ))}
            </div>

            {path.footerCta && (
              <div className="max-w-3xl bg-card magazine-border p-8">
                <p className="text-muted-foreground font-body text-sm mb-6">{path.footerCta}</p>
                <Link to="/signup" className="btn-primary inline-flex">Start for free</Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DiscoverPathPage;
