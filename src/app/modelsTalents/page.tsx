import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function ModelsTalentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent mb-4">Dreamed of modeling? Now&apos;s your chance!</h1>
          <p className="font-body text-lg text-muted-foreground mb-8">Originality is what brands are falling in love with</p>
          <Link to="/casting" className="btn-primary inline-flex mb-16">Track casting openings</Link>

          <section className="mb-16">
            <h2 className="font-display text-3xl text-foreground mb-4">Where professionals find tomorrow&apos;s top models</h2>
            <p className="text-muted-foreground font-body text-sm mb-8">Casting calls made for everyone.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "A vast selection of casting calls", text: "Browse opportunities that match your profile." },
                { title: "Endless opportunities to get discovered", text: "Brands and photographers are looking for talent like you." },
                { title: "A constantly growing list of gigs", text: "New castings added regularly across fashion, commercial, and more." },
                { title: "Countless casting calls happening now", text: "Apply today and take the next step in your modeling journey." },
              ].map((item) => (
                <div key={item.title} className="bg-card magazine-border p-6">
                  <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-body text-sm">{item.text}</p>
                </div>
              ))}
            </div>
            <Link to="/signup" className="btn-primary inline-flex mt-8">Sign Up now</Link>
          </section>

          <section className="bg-card magazine-border p-8 md:p-10">
            <h2 className="font-display text-3xl text-foreground mb-2">Start Your Modeling Journey</h2>
            <p className="text-muted-foreground font-body text-sm mb-8">3 easy steps to kickstart your career in the modelling industry.</p>
            <div className="space-y-8">
              <div>
                <span className="text-primary font-body text-xs tracking-[0.2em] uppercase">Step 1</span>
                <h3 className="font-display text-xl text-foreground mt-1 mb-2">Build Your Profile</h3>
                <p className="text-muted-foreground font-body text-sm">Upload your top photos, info, and Instagram to get noticed by brands, photographers, and agencies.</p>
              </div>
              <div>
                <span className="text-primary font-body text-xs tracking-[0.2em] uppercase">Step 2</span>
                <h3 className="font-display text-xl text-foreground mt-1 mb-2">Get Discovered</h3>
                <p className="text-muted-foreground font-body text-sm">Appear in our directory and let casting directors and brands find you for their projects.</p>
              </div>
              <div>
                <span className="text-primary font-body text-xs tracking-[0.2em] uppercase">Step 3</span>
                <h3 className="font-display text-xl text-foreground mt-1 mb-2">Apply to Castings</h3>
                <p className="text-muted-foreground font-body text-sm">Browse open castings and apply to opportunities that match your look and experience.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/signup" className="btn-primary inline-flex">Get Started</Link>
              <Link to="/casting" className="border border-border px-6 py-3 font-body text-sm uppercase hover:border-primary hover:text-primary">View Castings</Link>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
