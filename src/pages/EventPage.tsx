"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { contactApi, uploadPublicFile } from "@/lib/api";
import { Calendar, MapPin, FileImage, IdCard, Smile, Upload, Smartphone } from "lucide-react";

const EVENT_IMAGE = "/images/events/15250.jpg";

const EventPage = () => {
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [nationality, setNationality] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      if (!photoFile) {
        throw new Error("Please upload a photo before submitting.");
      }

      const photoUrl = await uploadPublicFile(photoFile, "event");

      await contactApi.send({
        name,
        email,
        message: [
          "[EVENT REGISTRATION]",
          `Tel: ${tel}`,
          `Nationality: ${nationality}`,
          `Age: ${age}`,
          `Occupation: ${occupation}`,
          `Photo: ${photoFile.name}`,
          `Photo URL: ${photoUrl}`,
        ].join("\n"),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError((err as Error).message || "Failed to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero: content above on mobile, image side-by-side on desktop */}
      <section className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] lg:min-h-[85vh]">
        {/* Content side (first on mobile, right on desktop) */}
        <div className="relative order-1 lg:order-2 flex flex-col bg-foreground text-white px-4 md:px-6 lg:px-10 xl:px-14 py-10 md:py-14 lg:py-16 justify-center">
          <BackButton className="mb-6 md:mb-8 text-white border-white/40 hover:border-white hover:bg-white/10" />
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3 md:mb-4">
            Upcoming Event
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-[80px] leading-[0.95] text-white uppercase tracking-tight">
            <span className="block">Official Model</span>
            <span className="block">Casting</span>
          </h1>
          <p className="font-body text-white/90 text-base md:text-lg lg:text-xl tracking-wide mt-4 md:mt-5">
            Mauritius
          </p>
          <p className="font-body text-white/70 text-sm md:text-base mt-4 max-w-md leading-relaxed">
            Join our exclusive casting session. Meet industry professionals and take the next step in your career.
          </p>
        </div>
        {/* Image side (below on mobile, left on desktop) */}
        <div className="relative order-2 lg:order-1 min-h-[40vh] lg:min-h-0 overflow-hidden">
          <img
            src={imgSrc(EVENT_IMAGE)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </section>

      <article className="container mx-auto px-4 md:px-6 pb-20 md:pb-28 pt-12 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-start">
          {/* Left column: intro, event details, what to bring */}
          <div>
            <div className="mb-10 md:mb-12">
              <p className="font-body text-foreground text-xl md:text-2xl leading-[1.65] tracking-[0.01em] font-medium">
                We are thrilled to announce that Model Management is now officially in Mauritius.
              </p>
              <p className="font-body text-muted-foreground text-lg md:text-xl leading-[1.75] tracking-[0.02em] mt-6">
                To celebrate, we invite all aspiring models, new faces, and talent to join us for an exclusive casting session. Meet industry professionals, get discovered, and take the next step in your career.
              </p>
            </div>

            <section className="mb-10 md:mb-12">
              <h2 className="font-display text-foreground text-xl md:text-2xl tracking-[0.12em] uppercase mb-6">
                Event details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Date & time</p>
                    <p className="font-display text-lg text-foreground">18 April 2026</p>
                    <p className="font-body text-muted-foreground">10:00 AM – 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Venue</p>
                    <p className="font-display text-lg text-foreground">Labourdonnais Waterfront Hotel</p>
                    <p className="font-body text-muted-foreground">Port Louis, Mauritius</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-foreground text-xl md:text-2xl tracking-[0.12em] uppercase mb-6">
                What to bring
              </h2>
              <ul className="space-y-3">
                {[
                  { icon: FileImage, title: "Your best photos", desc: "Professional or high-quality snapshots" },
                  { icon: Smartphone, title: "Your digital photos", desc: "We want to see your digital portfolio: bring your device (phone or tablet) or a USB drive with your best digital photos so we can review your work on the spot." },
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
          </div>

          {/* Right column: register form + back link */}
          <div className="lg:sticky lg:top-24">
            <section className="mb-10">
              <h2 className="font-display text-foreground text-xl md:text-2xl tracking-[0.12em] uppercase mb-6">
                Register your interest
              </h2>
              {submitted ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <p className="font-display text-xl text-foreground mb-2">Thank you for registering.</p>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    We have received your details. We shall confirm your registration within 48 hours. You will receive an email or call from our team with next steps. We look forward to seeing you at the casting.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <p className="text-destructive text-sm font-body">{submitError}</p>
                  )}
                  <div>
                    <label htmlFor="event-name" className="form-label">Name</label>
                    <input
                      id="event-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="event-tel" className="form-label">Tel</label>
                    <input
                      id="event-tel"
                      type="tel"
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                      className="form-input"
                      placeholder="+230..."
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
                    <label htmlFor="event-nationality" className="form-label">Nationality</label>
                    <input
                      id="event-nationality"
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="form-input"
                      placeholder="e.g. Mauritian"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="event-age" className="form-label">Age</label>
                    <input
                      id="event-age"
                      type="number"
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="form-input"
                      placeholder="e.g. 25"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="event-occupation" className="form-label">Occupation</label>
                    <input
                      id="event-occupation"
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="form-input"
                      placeholder="e.g. Student, Photographer"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="event-photo" className="form-label">1 photo</label>
                    <input
                      id="event-photo"
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                      required
                    />
                    <label
                      htmlFor="event-photo"
                      className="flex items-center gap-3 border-2 border-dashed border-border p-4 cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground shrink-0" />
                      <span className="font-body text-sm text-muted-foreground">
                        {photoFile ? photoFile.name : "Upload one photo (JPG, PNG, WebP)"}
                      </span>
                    </label>
                  </div>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}
            </section>

            <hr className="border-border mb-6" />
            <Link to="/" className="inline-flex items-center gap-2 font-body text-primary text-xs tracking-[0.2em] uppercase hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default EventPage;
