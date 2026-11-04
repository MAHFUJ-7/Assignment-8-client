"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  AlertTriangle,
  UserPlus,
  UserMinus,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TYPE_CONFIG = {
  Cleanup: {
    color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    gradient: "from-emerald-500/20 via-transparent to-transparent",
    emoji: "🧹",
  },
  Plantation: {
    color: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
    gradient: "from-green-500/20 via-transparent to-transparent",
    emoji: "🌳",
  },
  Donation: {
    color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    gradient: "from-amber-500/20 via-transparent to-transparent",
    emoji: "🤲",
  },
  Education: {
    color: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    gradient: "from-sky-500/20 via-transparent to-transparent",
    emoji: "📚",
  },
  "Health Camp": {
    color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    gradient: "from-rose-500/20 via-transparent to-transparent",
    emoji: "🩺",
  },
  "Winter Relief": {
    color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    gradient: "from-indigo-500/20 via-transparent to-transparent",
    emoji: "🧣",
  },
  "Food Drive": {
    color: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    gradient: "from-orange-500/20 via-transparent to-transparent",
    emoji: "🍲",
  },
};

export default function EventViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Single Function: Join & Leave Event State
  const [isJoined, setIsJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  /* ───────── Fetch Single Event by ID ───────── */
  const fetchEvent = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/event/${id}`
      );

      if (!res.ok) {
        throw new Error(`Event not found (${res.status} ${res.statusText})`);
      }

      const data = await res.json();
      if (!data) {
        throw new Error("No event data returned from server.");
      }
      setEvent(data);
    } catch (err) {
      console.error("Error fetching event:", err);
      setError(err?.message || "Failed to load event details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  /* ───────── Single Function: Join the Event / Leave the Event ───────── */
  const handleToggleJoin = async () => {
    try {
      setSubmitting(true);

      // TODO: Connect with backend manually:
      if (!isJoined) {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/events/${id}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: id, userEmail: session?.user?.email }), 
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/events/${id}/leave`, {
          method: "DELETE",
        });
      }

      const nextState = !isJoined;
      setIsJoined(nextState);
      showNotice(
        nextState ? "You have joined the event!" : "You have left the event."
      );
    } catch (err) {
      console.error("Error updating participation:", err);
      showNotice("Could not update participation. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const showNotice = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const typeConfig = TYPE_CONFIG[event?.type] || {
    color: "bg-primary/15 text-primary border-primary/20",
    gradient: "from-primary/20 via-transparent to-transparent",
    emoji: "🌱",
  };

  const formattedDate = event?.date
    ? new Date(
        event.date.includes("T") ? event.date : `${event.date}T00:00:00`
      ).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date to be announced";

  const postedDate = event?.createdAt
    ? new Date(event.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Toast Notification */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-card/95 px-5 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="size-4 text-emerald-500" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ───────────────── TOP NAV ───────────────── */}
      <div className="border-b border-border/60 bg-card/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />
            Back
          </button>

          <Link href="/upcomming-events">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-full text-xs text-muted-foreground hover:text-foreground"
            >
              All Events
            </Button>
          </Link>
        </div>
      </div>

      {/* ───────────────── LOADING STATE ───────────────── */}
      {loading && (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
          <div className="space-y-6 animate-pulse">
            <div className="aspect-[21/9] w-full rounded-3xl bg-muted" />
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                <div className="h-6 w-32 rounded-full bg-muted" />
                <div className="h-10 w-3/4 rounded-xl bg-muted" />
                <div className="h-28 w-full rounded-2xl bg-muted" />
                <div className="h-40 w-full rounded-2xl bg-muted" />
              </div>
              <div className="h-80 w-full rounded-3xl bg-muted" />
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── ERROR STATE ───────────────── */}
      {!loading && error && (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold">Event Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={fetchEvent} variant="outline" className="rounded-full">
              <RefreshCw className="mr-2 size-3.5" /> Try Again
            </Button>
            <Link href="/upcomming-events">
              <Button className="rounded-full">Browse Upcoming Events</Button>
            </Link>
          </div>
        </div>
      )}

      {/* ───────────────── MAIN EVENT DETAILS ───────────────── */}
      {!loading && !error && event && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 md:py-12">
          {/* Hero Banner with Safe Image Fallback */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl">
            {event.thumbnail && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.thumbnail}
                alt={event.title || "Event cover"}
                className="size-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/90 via-muted/50 to-background p-6 text-center text-muted-foreground">
                <ImageIcon className="size-10 opacity-40" />
                <span className="text-sm font-semibold text-foreground">
                  {event.thumbnail ? "Cover image unavailable" : "No cover photo"}
                </span>
                {event.thumbnail && (
                  <span className="max-w-md truncate text-xs text-muted-foreground/60 font-mono">
                    {event.thumbnail}
                  </span>
                )}
              </div>
            )}

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${typeConfig.gradient} opacity-40`}
            />

            {/* Badges on Hero */}
            <div className="absolute left-6 top-6 flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold backdrop-blur-md shadow-lg ${typeConfig.color}`}
              >
                <span>{typeConfig.emoji}</span>
                {event.type}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                Verified Drive
              </span>
            </div>

            {/* Bottom Info on Banner */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl">
                  {event.title}
                </h1>
                <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-medium text-white/90 drop-shadow sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4 text-emerald-400" />
                    {formattedDate}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="size-4 text-emerald-400" />
                      {event.time}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-emerald-400" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── CONTENT GRID ───────────────── */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* LEFT COLUMN: Main Information */}
            <div className="space-y-8">
              {/* Event Overview Section */}
              <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
                <div className="flex items-center gap-2.5 text-primary">
                  <Sparkles className="size-5" />
                  <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    About this Initiative
                  </h2>
                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {event.description}
                </p>
              </section>

              {/* Event Schedule & Details Grid */}
              <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
                <h3 className="text-base font-bold text-foreground">
                  Schedule & Requirements
                </h3>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CalendarDays className="size-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Date & Timing
                      </div>
                      <div className="mt-0.5 text-sm font-bold text-foreground">
                        {event.date}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Starts at {event.time || "TBD"}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Location / Venue
                      </div>
                      <div className="mt-0.5 text-sm font-bold text-foreground">
                        {event.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Meeting point on-site
                      </div>
                    </div>
                  </div>

                  {/* Volunteers Quota */}
                  <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Users className="size-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Volunteers Needed
                      </div>
                      <div className="mt-0.5 text-sm font-bold text-foreground">
                        {event.volunteersNeeded
                          ? `${event.volunteersNeeded} people`
                          : "Open Registration"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Open to all community members
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Contact Phone
                      </div>
                      <div className="mt-0.5 text-sm font-bold text-foreground">
                        {event.contactPhone || "Not provided"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Organizer hotline
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Guidelines Checklist */}
              <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
                <h3 className="text-base font-bold text-foreground">
                  Volunteer Preparation & Guidelines
                </h3>
                <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground sm:text-sm">
                  {[
                    "Please arrive 15 minutes prior to the scheduled start time.",
                    "Wear comfortable clothes and suitable footwear for community service.",
                    "All essential equipment, sanitizers, and water will be coordinated on site.",
                    "Participation certificate provided upon completion of service.",
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* RIGHT COLUMN: Action & Organizer Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              {/* Single Action: Join / Leave Event Card */}
              <Card className="overflow-hidden rounded-3xl border-border/80 bg-card shadow-xl">
                <div className="border-b border-border/60 bg-muted/20 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </span>
                    <Badge
                      className={
                        isJoined
                          ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15"
                          : "bg-primary/10 text-primary hover:bg-primary/10"
                      }
                    >
                      {isJoined ? "You are Registered" : "Open for Registration"}
                    </Badge>
                  </div>
                  <div className="mt-3 text-2xl font-extrabold text-foreground">
                    {event.volunteersNeeded
                      ? `${event.volunteersNeeded} Volunteers Needed`
                      : "Open Event"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Free to join • No registration fee
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* The Only Action Function */}
                  <Button
                    onClick={handleToggleJoin}
                    disabled={submitting}
                    className={`h-12 w-full gap-2 rounded-2xl text-sm font-bold shadow-md transition-all ${
                      isJoined
                        ? "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive hover:text-white"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : isJoined ? (
                      <>
                        <UserMinus className="size-4" />
                        Leave the Event
                      </>
                    ) : (
                      <>
                        <UserPlus className="size-4" />
                        Join the Event
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Organizer Profile Card */}
              <Card className="rounded-3xl border-border/80 bg-card p-6 shadow-md">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Organizer Details
                </div>

                <div className="mt-4 flex items-center gap-3.5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 font-bold text-white shadow-md">
                    {(event.organizerName || "O").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {event.organizerName || "Organizer"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Verified Host on SevaConnect
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-primary" />
                    <span className="text-foreground">{event.organizerEmail}</span>
                  </div>

                  {event.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-primary" />
                      <span className="text-foreground">{event.contactPhone}</span>
                    </div>
                  )}

                  {postedDate && (
                    <div className="pt-2 text-[11px] text-muted-foreground/70">
                      Created on {postedDate}
                    </div>
                  )}
                </div>
              </Card>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
