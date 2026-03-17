"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { Calendar, MapPin, Tag } from "lucide-react";
import { bookingApi, type Booking } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { imgSrc } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-red-100 text-red-700",
};

const DashboardBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    bookingApi
      .mine()
      .then(setBookings)
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <BackButton label="Back to Dashboard" className="mb-8" />
          <h1 className="font-display text-4xl text-primary mb-2">Bookings</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">Your active and past bookings.</p>

          {loading ? (
            <p className="text-muted-foreground font-body">Loading...</p>
          ) : error ? (
            <p className="text-red-500 font-body text-sm">{error}</p>
          ) : bookings.length === 0 ? (
            <div className="magazine-border p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-body text-sm mb-4">No bookings yet.</p>
              <Link to="/casting" className="text-primary font-body text-sm hover:underline">
                Browse castings
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((b) => {
                const casting = typeof b.castingId === "object" ? b.castingId : null;
                const model = typeof b.modelId === "object" ? b.modelId : null;
                const professional = typeof b.professionalId === "object" ? b.professionalId : null;
                const isModel = user?.role === "model";

                return (
                  <div key={b._id} className="border border-border bg-card p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                      <div>
                        <p className="font-display text-lg text-foreground">{casting?.title || "Booking"}</p>
                        {casting?.brand && (
                          <p className="text-muted-foreground text-xs font-body">{casting.brand}</p>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-body font-bold tracking-[0.15em] uppercase px-2 py-1 ${
                          STATUS_COLORS[b.status] || "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    {/* Casting details */}
                    <div className="flex flex-wrap gap-4 mb-3">
                      {casting?.location && (
                        <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          {casting.location}
                        </div>
                      )}
                      {casting?.date && (
                        <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          {new Date(casting.date).toLocaleDateString()}
                        </div>
                      )}
                      {casting?.price && (
                        <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                          <Tag className="w-3.5 h-3.5 shrink-0" />
                          {casting.price}
                        </div>
                      )}
                    </div>

                    {/* Counterpart info */}
                    {isModel && professional && (
                      <div className="border-t border-border pt-3 mt-3">
                        <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-1">
                          Booked by
                        </p>
                        <p className="font-body text-sm text-foreground">
                          {(professional as { fullName?: string }).fullName || "Professional"}
                        </p>
                        {(professional as { company?: string }).company && (
                          <p className="text-muted-foreground text-xs font-body">
                            {(professional as { company?: string }).company}
                          </p>
                        )}
                      </div>
                    )}

                    {!isModel && model && (
                      <div className="border-t border-border pt-3 mt-3 flex items-center gap-3">
                        {model.profilePhoto && (
                          <img
                            src={imgSrc(model.profilePhoto)}
                            alt={model.username || "Model"}
                            className="w-10 h-10 object-cover border border-border shrink-0"
                          />
                        )}
                        <div>
                          <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-0.5">
                            Model
                          </p>
                          <p className="font-body text-sm text-foreground">
                            {model.username || "Model"}
                          </p>
                        </div>
                      </div>
                    )}

                    {b.notes && (
                      <p className="text-xs font-body text-muted-foreground mt-3 italic border-t border-border pt-3">
                        Notes: {b.notes}
                      </p>
                    )}

                    <p className="text-[11px] font-body text-muted-foreground mt-2">
                      Booked on {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardBookingsPage;
