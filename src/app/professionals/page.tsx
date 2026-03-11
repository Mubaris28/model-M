import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function ProfessionalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent mb-4">Simplify your model search</h1>
          <p className="font-body text-lg text-muted-foreground mb-4">Take charge of discovering models and talent with ease.</p>
          <Link to="/signup" className="btn-primary inline-flex mb-16">Sign Up</Link>

          <section className="mb-16">
            <h2 className="font-display text-3xl text-foreground mb-4">How can Model Management help you?</h2>
            <p className="text-muted-foreground font-body text-sm mb-8">Find the perfect talent for your projects with our comprehensive platform</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Browse our directory or create a casting call", text: "Submit your casting calls to access thousands of professional models." },
                { title: "Discover thousands of models", text: "Access a variety of verified and talented individuals." },
                { title: "Directly connect with models or book online", text: "Hire professional models for your projects with ease." },
              ].map((item) => (
                <div key={item.title} className="bg-card magazine-border p-6">
                  <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-body text-sm">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/dashboard/post-casting" className="btn-primary inline-flex">Create a Casting</Link>
              <Link to="/models" className="border border-border px-6 py-3 font-body text-sm uppercase hover:border-primary hover:text-primary">Discover More</Link>
              <Link to="/contact" className="border border-border px-6 py-3 font-body text-sm uppercase hover:border-primary hover:text-primary">Reach Out</Link>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display text-3xl text-foreground mb-6">Why Model Management Mauritius?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "All-in-One Platform", text: "User-friendly tools to manage everything from casting to bookings" },
                { title: "Cost-Effective", text: "Access talented models for free collaborations or at your desired rates" },
                { title: "1.5k+ Models in Mauritius", text: "Connect directly with over 1,500 active and diverse models in Mauritius" },
              ].map((item) => (
                <div key={item.title} className="bg-card magazine-border p-6">
                  <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-body text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card magazine-border p-8">
            <h2 className="font-display text-2xl text-foreground mb-2">The Fast Track to Top Talent</h2>
            <p className="text-muted-foreground font-body text-sm mb-6">Register for free and discover how effective our platform is!</p>
            <p className="text-muted-foreground font-body text-xs mb-6">Choose below to explore further: Photographer | Brand | Talent</p>
            <Link to="/signup" className="btn-primary inline-flex">Start Now</Link>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
