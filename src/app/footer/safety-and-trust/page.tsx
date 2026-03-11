import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function SafetyAndTrustPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent">Safety and Trust</h1>
          <p className="text-muted-foreground font-body text-sm mt-6 leading-relaxed">
            ModelManagement.mu is a safe and reliable community for the modeling industry. We are constantly improving our tools to make sure both models and professionals can work together in a secure and transparent environment.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { to: "/footer/safety-and-trust/what-you-should-know", title: "The Essentials to Know", desc: "Model Agreements, reservations, reviews, secure chats, and verification." },
              { to: "/footer/safety-and-trust/avoid-scammers", title: "Safety Guidelines", desc: "Practical tips to stay safe when talking to photographers, agencies, or agents." },
              { to: "/footer/safety-and-trust/scamming-examples", title: "Scamming Examples", desc: "Recognize common red flags and respond the right way." },
              { to: "/footer/safety-and-trust/code-of-conduct", title: "Our Values", desc: "Community rules for models, talent, and professionals." },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="group bg-card magazine-border p-8 block hover:border-primary/30 transition-colors">
                <h2 className="font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">{item.title}</h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
