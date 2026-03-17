"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { Briefcase, UserCheck } from "lucide-react";
import { applicationApi, bookingApi, type Application, type ApplicationStatus } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { imgSrc } from "@/lib/utils";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pending Review",
  suggested: "Suggested to Professional",
  booked: "Booked",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  suggested: "bg-green-100 text-green-700",
  booked: "bg-primary/10 text-primary",
  rejected: "bg-red-100 text-red-700",
};

// ─── MODEL: sees own applications ────────────────────────────────────────────
function ModelApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    applicationApi
      .mine()
      .then(setApps)
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground font-body">Loading...</p>;
  if (error) return <p className="text-red-500 font-body text-sm">{error}</p>;
  if (apps.length === 0)
    return (
      <div className="magazine-border p-12 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body mb-2">No applications yet</p>
        <p className="text-muted-foreground text-sm font-body">Apply to castings from the Casting page to see them here.</p>
        <Link to="/casting" className="inline-block mt-6 text-primary font-body text-sm tracking-wider uppercase hover:underline">
          Browse Castings
        </Link>
      </div>
    );

  return (
    <div className="space-y-4">
      {apps.map((app) => {
        const casting = typeof app.castingId === "object" ? app.castingId : null;
        return (
          <div key={app._id} className="border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-base text-foreground">{casting?.title || "Casting"}</p>
                {casting?.brand && <p className="text-muted-foreground text-xs font-body mt-0.5">{casting.brand}</p>}
                {casting?.location && <p className="text-muted-foreground text-xs font-body">{casting.location}</p>}
                {casting?.date && (
                  <p className="text-muted-foreground text-xs font-body">{new Date(casting.date).toLocaleDateString()}</p>
                )}
                {app.message && (
                  <p className="text-muted-foreground text-xs font-body mt-2 italic">"{app.message}"</p>
                )}
              </div>
              <span className={`text-[10px] font-body font-bold tracking-[0.15em] uppercase px-2 py-1 shrink-0 ${STATUS_COLORS[app.status]}`}>
                {STATUS_LABELS[app.status]}
              </span>
            </div>
            <p className="text-muted-foreground text-[11px] font-body mt-3">
              Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── PROFESSIONAL: sees models suggested by admin ─────────────────────────────
function ProfessionalSuggestedModels() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [booked, setBooked] = useState<Set<string>>(new Set());

  useEffect(() => {
    applicationApi
      .suggested()
      .then(setApps)
      .catch(() => setError("Failed to load suggested models."))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = async (applicationId: string) => {
    setBookingLoading(applicationId);
    try {
      await bookingApi.create({ applicationId });
      setBooked((prev) => new Set([...prev, applicationId]));
    } catch (e: unknown) {
      alert((e as Error).message || "Failed to book model.");
    } finally {
      setBookingLoading(null);
    }
  };

  if (loading) return <p className="text-muted-foreground font-body">Loading...</p>;
  if (error) return <p className="text-red-500 font-body text-sm">{error}</p>;

  if (apps.length === 0)
    return (
      <div className="magazine-border p-12 text-center">
        <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body mb-2">No suggested models yet</p>
        <p className="text-muted-foreground text-xs font-body">
          Once models apply to your castings, the admin will review their profiles and suggest suitable ones to you here.
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {apps.map((app) => {
        const model = typeof app.modelId === "object" ? app.modelId : null;
        const casting = typeof app.castingId === "object" ? app.castingId : null;
        const isBooked = booked.has(app._id) || app.status === "booked";
        return (
          <div key={app._id} className="border border-border bg-card p-5">
            <div className="flex items-start gap-4">
              {model?.profilePhoto && (
                <img
                  src={imgSrc(model.profilePhoto)}
                  alt={model.username || "Model"}
                  className="w-16 h-16 object-cover border border-border shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-display text-base text-foreground">
                      {model?.username || "Model"}
                    </p>
                    {model?.city && model?.country && (
                      <p className="text-muted-foreground text-xs font-body">{model.city}, {model.country}</p>
                    )}
                    {model?.height && (
                      <p className="text-muted-foreground text-xs font-body">
                        Height: {model.height}{model?.dressSize ? ` · Dress: ${model.dressSize}` : ""}
                      </p>
                    )}
                    {model?.gender && (
                      <p className="text-muted-foreground text-xs font-body capitalize">{model.gender}</p>
                    )}
                    {casting?.title && (
                      <p className="text-muted-foreground text-xs font-body mt-1">
                        Casting: <span className="text-foreground">{casting.title}</span>
                      </p>
                    )}
                    {casting?.date && (
                      <p className="text-muted-foreground text-xs font-body">
                        Date: {new Date(casting.date).toLocaleDateString()}
                      </p>
                    )}
                    {casting?.price && (
                      <p className="text-muted-foreground text-xs font-body">Rate: {casting.price}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-body font-bold tracking-[0.15em] uppercase px-2 py-1 bg-green-100 text-green-700 shrink-0">
                    Suggested
                  </span>
                </div>
                {isBooked ? (
                  <span className="mt-3 inline-block text-xs font-body text-primary uppercase tracking-wider">✓ Booking Confirmed</span>
                ) : (
                  <button
                    onClick={() => handleBook(app._id)}
                    disabled={bookingLoading === app._id}
                    className="mt-3 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-body uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50"
                  >
                    {bookingLoading === app._id ? "Confirming..." : "Confirm Booking"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const DashboardCastingAppPage = () => {
  const { user } = useAuth();
  const isProfessional = user?.role === "professional";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <BackButton label="Back to Dashboard" className="mb-8" />
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">
            {isProfessional ? "Suggested Models" : "Casting Applications"}
          </h1>
          <p className="text-muted-foreground font-body text-sm mb-8">
            {isProfessional
              ? "Models suggested by the admin for your castings; confirm bookings here"
              : "Track your casting applications and their status"}
          </p>
          {isProfessional ? <ProfessionalSuggestedModels /> : <ModelApplications />}
        </div>
      </div>
    </div>
  );
};

export default DashboardCastingAppPage;
