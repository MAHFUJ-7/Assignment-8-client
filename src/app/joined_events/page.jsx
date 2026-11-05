"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Eye,
  MapPin,
  Users,
  Image as ImageIcon,
  Mail,
  Star,
  CheckCircle2,
  AlertTriangle,
  Layers,
  RefreshCw,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { authHeaders } from "@/lib/auth-jwt";
import { SERVER_BASE_URL } from "@/lib/server-url";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const TYPE_TONES = {
  Cleanup: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Plantation: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  Donation: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Education: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
  "Health Camp": "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
  "Winter Relief": "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  "Food Drive": "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Date TBD";
  const parsed = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00`);
  return isNaN(parsed.getTime())
    ? dateStr
    : parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

function EventThumbnail({ src, alt, type, toneClass }) {
  const [loadError, setLoadError] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted/70">
      {src && !loadError ? (

        <img
          src={src}
          alt={alt || "Event cover"}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setLoadError(true)}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-linear-to-br from-muted/90 to-muted/40 p-4 text-center text-muted-foreground">
          <ImageIcon className="size-8 opacity-40" />
          <span className="text-xs font-semibold text-foreground/80">
            {src ? "Cover unavailable" : "No cover photo"}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

      {type && (
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-sm ${toneClass}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {type}
        </span>
      )}
    </div>
  );
}

export default function JoinedEvents() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!email) return setLoading(false);

    (async () => {
      try {
        const res = await fetch(
          `${SERVER_BASE_URL}/user-events?email=${encodeURIComponent(email)}`,
          { headers: await authHeaders(email) }
        );
        const data = await res.json();
        setJoinedEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Could not load your joined events.");
      } finally {
        setLoading(false);
      }
    })();
  }, [email, isPending]);


  const sortedEvents = [...joinedEvents].sort((a, b) => {
    const timeA = new Date(`${a.date || ""}T${a.time || "00:00"}`).getTime();
    const timeB = new Date(`${b.date || ""}T${b.time || "00:00"}`).getTime();
    return (timeA || 0) - (timeB || 0);
  });

  const filteredEvents = sortedEvents.filter((event) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (event.title || "").toLowerCase().includes(q) ||
      (event.location || "").toLowerCase().includes(q) ||
      (event.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground md:px-12 md:py-14">
      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Star className="size-3.5" />
              Your commitments
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
              My Joined Events
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every social service event you have signed up for, sorted by date so you never
              miss a commitment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.location.reload()}
              disabled={loading}
              title="Refresh joined events"
              className="h-11 w-11 rounded-full"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Link href="/upcomming-events">
              <Button className="h-11 rounded-full px-6 font-semibold shadow-md">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>


        {!loading && !error && email && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="text-2xl font-bold">{joinedEvents.length}</div>
                <div className="mt-1 text-xs text-muted-foreground">Total Joined</div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="text-2xl font-bold text-emerald-500">
                  {joinedEvents.filter((e) => {
                    if (!e.date) return false;
                    const d = new Date(`${e.date}T${e.time || "00:00"}`);
                    return !isNaN(d.getTime()) && d >= new Date();
                  }).length}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Upcoming</div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="text-2xl font-bold text-amber-500">
                  {joinedEvents.filter((e) => {
                    if (!e.date) return false;
                    const d = new Date(`${e.date}T${e.time || "23:59"}`);
                    return !isNaN(d.getTime()) && d < new Date();
                  }).length}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="text-2xl font-bold text-sky-500">
                  {new Set(joinedEvents.map((e) => e.type).filter(Boolean)).size}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Categories</div>
              </CardContent>
            </Card>
          </div>
        )}


        {!loading && !error && email && joinedEvents.length > 0 && (
          <div className="mt-8 rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-sm">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your joined events by title, area, or description..."
                className="h-10 rounded-xl bg-background/80 pl-4 text-sm"
              />
            </div>
          </div>
        )}


        {loading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <Card key={n} className="overflow-hidden rounded-2xl border-border/60 bg-card animate-pulse">
                <div className="aspect-video w-full bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="mt-4 h-10 w-full rounded-xl bg-muted" />
                </div>
              </Card>
            ))}
          </div>
        )}


        {!loading && !email && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Layers className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold">Sign in to view your events</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Please log in to see the events you have joined.
            </p>
            <Link href="/sign-in" className="mt-5">
              <Button className="rounded-full">Sign In</Button>
            </Link>
          </div>
        )}


        {!loading && error && email && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-destructive/30 bg-destructive/5 p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
              <AlertTriangle className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold">Failed to load your joined events</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full"
              variant="outline"
            >
              <RefreshCw className="mr-2 size-4" /> Try Again
            </Button>
          </div>
        )}


        {!loading && !error && email && joinedEvents.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <CheckCircle2 className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold">No joined events yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              You have not joined any events yet. Browse upcoming events and sign up for one!
            </p>
            <Link href="/upcomming-events" className="mt-5">
              <Button className="rounded-full">Browse Upcoming Events</Button>
            </Link>
          </div>
        )}


        {!loading && !error && email && joinedEvents.length > 0 && filteredEvents.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Layers className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold">No matching events</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              No joined events match your search.
            </p>
          </div>
        )}


        {!loading && !error && email && filteredEvents.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {filteredEvents.map((event) => {
              const eventId = event._id || event.id;
              const toneClass =
                TYPE_TONES[event.type] || "bg-muted text-foreground border-border";
              const eventDate = new Date(`${event.date || ""}T${event.time || "00:00"}`);
              const isUpcoming = !isNaN(eventDate.getTime()) && eventDate >= new Date();

              return (
                <Card
                  key={eventId}
                  className="group flex flex-col overflow-hidden rounded-2xl border-border/70 bg-card transition duration-200 hover:border-primary/40 hover:shadow-xl"
                >

                  <EventThumbnail
                    src={event.thumbnail}
                    alt={event.title}
                    type={event.type}
                    toneClass={toneClass}
                  />


                  <div className="flex items-center justify-between px-5 pt-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        isUpcoming
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {isUpcoming ? "Upcoming" : "Completed"}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Joined
                    </span>
                  </div>


                  <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground/90">
                        <CalendarDays className="size-3.5 text-primary" />
                        {formatDate(event.date)}
                      </span>
                      {event.time && (
                        <>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1">
                            <Clock3 className="size-3.5 text-primary" />
                            {event.time}
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="mt-2 line-clamp-1 text-lg font-bold">{event.title}</h2>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>

                    <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 shrink-0 text-primary" />
                        <span className="line-clamp-1 font-medium text-foreground/80">
                          {event.location || "Location to be announced"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <Users className="size-3.5 text-primary" />
                          {event.volunteersNeeded
                            ? `${event.volunteersNeeded} Volunteers Needed`
                            : "Open Registration"}
                        </span>
                      </div>

                      {event.organizerName && (
                        <div className="flex items-center gap-1.5 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                          <Mail className="size-3" />
                          Organized by{" "}
                          <strong className="text-foreground">{event.organizerName}</strong>
                        </div>
                      )}
                    </div>


                    <div className="mt-auto pt-4">
                      <Link
                        href={`/view/${eventId}`}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
                      >
                        <Eye className="size-4" />
                        View Event
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
