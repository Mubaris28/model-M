import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function HowItWorksProfessionalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/how-it-works" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to How It Works</Link>
          <h1 className="font-display text-6xl md:text-8xl line-accent">How It Works — For Professionals</h1>
          <p className="font-body text-lg text-muted-foreground mt-4">Connecting with Real Talent Has Never Been Easier</p>
          <div className="mt-12 space-y-10">
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              ModelManagement.mu helps brands, photographers, and creative professionals in Mauritius discover and collaborate with talented models safely, quickly, and transparently. Whether you are organizing a photoshoot, a campaign, or a small creative project, our platform makes finding the right people simple and reliable.
            </p>
            {[
              { step: "Step 1 — Create Your Professional Profile", body: "Start by signing up for free and creating your professional account. Add your company name, area of expertise, and what type of talent you are looking for—whether it's fashion, commercial, or lifestyle models. A verified profile builds trust and attracts the right people to your projects." },
              { step: "Step 2 — Post a Casting or Project", body: "Once registered, you can post a casting call describing your project, the look you're searching for, the location, and other details. You decide who can apply, giving you full control and visibility over the selection process." },
              { step: "Step 3 — Discover and Connect", body: "Browse through hundreds of local and international model profiles. Each model has verified photos, measurements, and information to help you find the perfect match. You can contact them directly through our secure messaging system to discuss ideas, availability, and rates." },
              { step: "Step 4 — Manage Applications Easily", body: "All your casting applications appear in one place. You can shortlist and confirm bookings directly from your dashboard. The platform helps you save time and stay organized while keeping everything professional." },
            ].map((item) => (
              <div key={item.step}>
                <h2 className="font-display text-xl text-foreground mb-2">{item.step}</h2>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
            <div className="bg-card magazine-border p-8">
              <h2 className="font-display text-2xl text-foreground mb-2">Start Today</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">Join ModelManagement.mu and discover a new way to connect with models in Mauritius. No agencies, no complicated processes—just a smart, safe, and simple way to find talent that fits your vision.</p>
              <Link to="/register" className="btn-primary inline-flex">Join as Professional</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
