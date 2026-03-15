import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { Calendar, MapPin, Clock, FileImage, IdCard, Smile, HelpCircle } from "lucide-react";

const EVENT_IMAGE = "/images/events/15250.jpg";

const EventPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Magazine masthead */}
      <header className="pt-24 pb-8 md:pt-28 md:pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <BackButton className="mb-8" />
            <p className="font-body text-primary text-xs tracking-[0.4em] uppercase mb-4">
              Upcoming Event
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] uppercase tracking-tight mb-4">
              Official Model Casting
            </h1>
            <p className="font-display text-2xl md:text-3xl text-muted-foreground tracking-wide">
              Mauritius
            </p>
          </div>
        </div>
      </header>

      {/* Editorial content */}
      <article className="container mx-auto px-4 md:px-6 pb-20 md:pb-28">
        <div className="max-w-2xl mx-auto">
          {/* Lead image */}
          <figure className="mb-14 md:mb-20 overflow-hidden magazine-border">
            <img
              src={imgSrc(EVENT_IMAGE)}
              alt="Official Model Casting in Mauritius"
              className="w-full aspect-[16/10] md:aspect-[2/1] object-cover"
            />
          </figure>

          {/* Lead paragraph — editorial style */}
          <div className="mb-16 md:mb-20">
            <p className="font-body text-foreground text-xl md:text-2xl leading-[1.65] tracking-[0.01em] font-medium">
              We are thrilled to announce that Model Management is now officially in Mauritius.
            </p>
            <p className="font-body text-muted-foreground text-lg md:text-xl leading-[1.75] tracking-[0.02em] mt-6">
              To celebrate, we invite all aspiring models, new faces, and talent to join us for an exclusive casting session. Meet industry professionals, get discovered, and take the next step in your career.
            </p>
          </div>

          {/* Event details — card style */}
          <section className="mb-14 md:mb-16">
            <h2 className="font-display text-foreground text-xl md:text-2xl tracking-[0.12em] uppercase mb-6">
              Event details
            </h2>
            <div className="magazine-border p-6 md:p-8 space-y-6 bg-card/50">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">Date & time</p>
                  <p className="font-display text-lg md:text-xl text-foreground">18 April 2026</p>
                  <p className="font-body text-muted-foreground">10:00 AM – 1:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">Venue</p>
                  <p className="font-display text-lg md:text-xl text-foreground">Labourdonnais Waterfront Hotel</p>
                  <p className="font-body text-muted-foreground">Port Louis, Mauritius</p>
                </div>
              </div>
            </div>
          </section>

          {/* What to bring */}
          <section className="mb-14 md:mb-16">
            <h2 className="font-display text-foreground text-xl md:text-2xl tracking-[0.12em] uppercase mb-6">
              What to bring
            </h2>
            <ul className="space-y-4">
              {[
                { icon: FileImage, title: "Your best photos", desc: "Professional or high-quality snapshots" },
                { icon: IdCard, title: "Valid ID", desc: "Passport or national ID" },
                { icon: Smile, title: "Confidence", desc: "And a big smile!" },
              ].map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4 magazine-border p-4 md:p-5 bg-card/30">
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-base md:text-lg text-foreground">{title}</p>
                    <p className="font-body text-sm md:text-base text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* How to register */}
          <section className="mb-16 md:mb-20">
            <h2 className="font-display text-foreground text-xl md:text-2xl tracking-[0.12em] uppercase mb-6">
              How to register
            </h2>
            <div className="flex items-start gap-4 magazine-border p-6 md:p-8 bg-primary/5 border-primary/20">
              <div className="w-11 h-11 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-body text-foreground text-base md:text-lg leading-[1.7]">
                  Our help desk will be available on the day to assist you in creating your profile and answering any questions. No pre-registration required — come along and we&apos;ll guide you through the process.
                </p>
              </div>
            </div>
          </section>

          {/* Back link */}
          <hr className="border-border mb-8" />
          <Link to="/" className="inline-flex items-center gap-2 font-body text-primary text-xs tracking-[0.2em] uppercase hover:underline">
            ← Back to Home
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default EventPage;
