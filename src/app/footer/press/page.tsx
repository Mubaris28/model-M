import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent">Press</h1>
          <p className="text-muted-foreground font-body text-sm mt-6 leading-relaxed">Find our latest press releases, media coverage, and news about Model Management Mauritius.</p>
          <div className="mt-10 space-y-4">
            <p className="font-body text-sm text-foreground font-medium">Recent News</p>
            <ul className="list-disc list-inside text-muted-foreground text-sm font-body space-y-2">
              <li>2025: Model Management Mauritius launches new AI-powered talent matching.</li>
              <li>2024: Featured in &quot;Top 10 Modeling Platforms&quot; by FashionTech Magazine.</li>
              <li>2023: Partnership with Global Talent Network announced.</li>
            </ul>
            <p className="font-body text-sm pt-6"><span className="text-foreground font-medium">Media Contact:</span> Email: info@modelmanagement.mu</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
