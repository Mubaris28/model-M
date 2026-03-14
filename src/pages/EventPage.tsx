import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";

const EVENT_IMAGE = "/images/events/15250.jpg";

const EventPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Magazine masthead */}
      <header className="pt-24 pb-6 md:pt-28 md:pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <BackButton className="mb-8" />
            <p className="font-display text-primary text-sm md:text-base tracking-[0.35em] uppercase mb-3">
              Event
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] uppercase tracking-tight line-accent max-w-3xl">
              Official Model Casting in Mauritius
            </h1>
          </div>
        </div>
      </header>

      {/* Editorial content column */}
      <article className="container mx-auto px-4 md:px-6 pb-20 md:pb-28">
        <div className="max-w-2xl mx-auto">
          {/* Lead image */}
          <figure className="mb-12 md:mb-16">
            <img
              src={imgSrc(EVENT_IMAGE)}
              alt="Official Model Casting in Mauritius"
              className="w-full aspect-[16/10] md:aspect-[2/1] object-cover"
            />
          </figure>

          {/* Lead paragraph */}
          <p className="font-body text-foreground text-lg md:text-xl leading-[1.7] tracking-[0.02em] mb-12 md:mb-14 text-muted-foreground">
            We are thrilled to announce that modelmanagement.mu is now officially in Mauritius! To celebrate, we invite all aspiring models, new faces, and talent to join us for an exclusive casting session.
          </p>

          {/* Details */}
          <section className="mb-12 md:mb-14">
            <h2 className="font-display text-foreground text-sm md:text-base tracking-[0.25em] uppercase mb-4 line-accent inline-block">
              Details
            </h2>
            <p className="font-body text-muted-foreground text-base md:text-lg leading-[1.7]">
              Location: Labourdonnais Waterfront Hotel<br />
              Date &amp; Time: 18 April 2026, from 10:00 AM to 1:00 PM
            </p>
          </section>

          {/* What to bring */}
          <section className="mb-12 md:mb-14">
            <h2 className="font-display text-foreground text-sm md:text-base tracking-[0.25em] uppercase mb-4 line-accent inline-block">
              What to Bring
            </h2>
            <ul className="font-body text-muted-foreground text-base md:text-lg leading-[1.7] space-y-2 list-disc list-outside pl-6">
              <li>Your best photos (professional or high-quality snapshots)</li>
              <li>A valid ID</li>
              <li>Confidence and a big smile!</li>
            </ul>
          </section>

          {/* How to register */}
          <section className="mb-14 md:mb-16">
            <h2 className="font-display text-foreground text-sm md:text-base tracking-[0.25em] uppercase mb-4 line-accent inline-block">
              How to Register
            </h2>
            <p className="font-body text-muted-foreground text-base md:text-lg leading-[1.7]">
              Our help desk will be available to assist you in creating your profile and answering any questions.
            </p>
          </section>

          {/* End matter */}
          <hr className="border-border mb-8" />
          <Link to="/" className="font-body text-primary text-xs tracking-[0.2em] uppercase hover:underline">
            ← Back to Home
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default EventPage;
