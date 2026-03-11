"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useParams } from "@/lib/router-next";

export default function ModellingAdviceSubPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/modelling-advice" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Modelling Advice</Link>
          <h1 className="font-display text-6xl md:text-8xl line-accent">{title}</h1>
          <p className="text-muted-foreground font-body text-sm mt-8 leading-relaxed">
            Expert modelling tips and guidance to help you succeed in your career. Our full article content for this topic will be available here. In the meantime, explore other advice articles or contact us for personalised guidance.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
