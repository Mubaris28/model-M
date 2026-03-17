import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function HowItWorksModelsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/how-it-works" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to How It Works</Link>
          <h1 className="font-display text-6xl md:text-8xl line-accent">How It Works</h1>
          <p className="font-body text-lg text-muted-foreground mt-4">A new way to experience modeling in Mauritius</p>
          <div className="mt-12 space-y-10">
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              ModelManagement.mu brings a modern, safe, and transparent approach to modeling. Whether you are just starting out or already experienced, our platform connects real people with real opportunities, from photoshoots and brand campaigns to creative collaborations.
            </p>
            {[
              { step: "Step 1: Create your profile", body: "Join for free and build your profile with your photos, videos, and basic information. Show your personality and what makes you unique; because here, everyone has potential. Our team reviews every profile to keep the community professional and safe." },
              { step: "Step 2: Get Approved!", body: "Once your profile is uploaded and viewed, we'll send you an update, so you can start exploring. You will have access to online tools and advice to help you understand the modeling world and progress gradually, with confidence." },
              { step: "Step 3: Get Noticed", body: "Brands, photographers, and agencies regularly look for new faces in Mauritius and abroad. Once they discover your profile, they can contact you directly or send you a secure job offer through the platform: no middleman, no confusion." },
              { step: "Step 4: Build Your Reputation", body: "After every collaboration, both models and professionals can share feedback and reviews. This helps create trust and ensures fair, respectful experiences for everyone." },
            ].map((item) => (
              <div key={item.step}>
                <h2 className="font-display text-xl text-foreground mb-2">{item.step}</h2>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
            <div className="bg-card magazine-border p-8">
              <h2 className="font-display text-2xl text-foreground mb-2">Start Your Journey Today</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">No experience? No problem. Modeling is no longer just for a few; it is for everyone who wants to express themselves, gain confidence, and work with great people. Join ModelManagement.mu today and be part of a new modeling community in Mauritius.</p>
              <Link to="/become-model" className="btn-primary inline-flex">Become a Model</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
