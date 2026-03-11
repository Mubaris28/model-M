import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useParams } from "@/lib/router-next";

const slugs: Record<string, string> = {
  models: "Models",
  agencies: "Agencies",
  agents: "Agents",
  professionals: "Other Industry Professionals",
};

export default function TermsSubPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const title = slugs[slug] || "Terms";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/terms-of-service" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Terms of Use</Link>
          <h1 className="font-display text-6xl md:text-8xl line-accent">Terms of Service — {title}</h1>
          <p className="text-muted-foreground font-body text-sm mt-8 leading-relaxed">
            Terms and conditions for {title.toLowerCase()} accessing MODELMANAGEMENT.MU. Full legal text is available on request. For questions contact info@modelmanagement.mu.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
