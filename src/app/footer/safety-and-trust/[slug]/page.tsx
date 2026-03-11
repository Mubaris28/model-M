"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useParams } from "@/lib/router-next";

const titles: Record<string, string> = {
  "what-you-should-know": "The Essentials to Know",
  "avoid-scammers": "Safety Guidelines",
  "scamming-examples": "Scamming Examples",
  "code-of-conduct": "Our Values — Code of Conduct",
};

export default function SafetySubPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const title = titles[slug] || "Safety & Trust";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/safety-and-trust" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Safety & Trust</Link>
          <h1 className="font-display text-6xl md:text-8xl line-accent">{title}</h1>
          <p className="text-muted-foreground font-body text-sm mt-8 leading-relaxed">
            Content for this section is available here. ModelManagement.mu is committed to keeping our community safe and transparent. For specific guidelines or to report an issue, contact info@modelmanagement.mu or use the Report page.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
