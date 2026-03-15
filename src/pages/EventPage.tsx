"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { Calendar, MapPin, FileImage, IdCard, Smile } from "lucide-react";

const EVENT_IMAGE = "/images/events/15250.jpg";

const EventPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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

      <article className="container mx-auto px-4 md:px-6 pb-20 md:pb-28">
        <div className="max-w-2xl mx-auto">
          <figure className="mb-12 md:mb-16">
            <img
              src={imgSrc(EVENT_IMAGE)}
              alt="Official Model Casting in Mauritius"
              className="w-full aspect-[16/10] md:aspect-[2/1] object-cover"
            />
          </figure>

          <div className="mb-12 md:mb-16">
            <p className="font-body text-foreground text-xl md:text-2xl leading-[1.65] tracking-[0.01em] font-medium">
              We are thrilled to announce that Model Management is now officially in Mauritius.
            </p>
            <p className="font-body text-muted-foreground text-lg md:text-xl leading-[1.75] tracking-[0.02em] mt-6">
              To celebrate, we invite all aspiring models, new faces, and talent to join us for an exclusive casting session. Meet industry professionals, get discovered, and take the next step in your career.
            </p>
          </div>

          <section className="mb-12 md:mb-14">
            <h2 className="font-display text-foreground text-xl md:text-2xl tracking-[0.12em] uppercase mb-6">
              Event details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">Date & time</p>
                  <p className="font-display text-lg text-foreground">18 April 2026</p>
                  <p className="font-body text-muted-foreground">10:00 AM – 1:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">Venue</p>
                  <p className="font-display text-lg text-foreground">Labourdonnais Waterfront Hotel</p>
                  <p className="font-body text-muted-foreground">Port Louis, Mauritius</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12 md:mb-14">
            <h2 className="font-display text-foreground text-xl md:text-2xl tracking-[0.12em] uppercase mb-6">
              What to bring
            </h2>
            <ul className="space-y-3">
              {[
                { icon: FileImage, title: "Your best photos", desc: "Professional or high-quality snapshots" },
                { icon: IdCard, title: "Valid ID", desc: "Passport or national ID" },
                { icon: Smile, title: "Confidence", desc: "And a big smile!" },
              ].map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-display text-base text-foreground">{title}</p>
                    <p className="font-body text-sm text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-16 md:mb-20">
            <h2 className="font-display text-foreground text-xl md:text-2xl tracking-[0.12em] uppercase mb-6">
              Register your interest
            </h2>
            {submitted ? (
              <p className="font-body text-foreground">
                Thank you. We&apos;ve received your details and will be in touch.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <label htmlFor="event-name" className="form-label">Name</label>
                  <input
                    id="event-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="event-email" className="form-label">Email</label>
                  <input
                    id="event-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="event-phone" className="form-label">Phone (optional)</label>
                  <input
                    id="event-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    placeholder="+230..."
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Submit
                </button>
              </form>
            )}
          </section>

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
