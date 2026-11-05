"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Eye,
  Filter,
  ImageIcon,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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


const isFutureEvent = (event) => {
  if (!event?.date) return false;
  try {
    const timeStr = event.time ? event.time : "23:59:59";
    const eventDateTime = new Date(`${event.date}T${timeStr}`);
    if (isNaN(eventDateTime.getTime())) {

      const eventDate = new Date(`${event.date}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }
    return eventDateTime >= new Date();
  } catch {
    return false;
  }
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
        <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-muted/90 to-muted/40 p-4 text-center text-muted-foreground">
          <ImageIcon className="size-8 opacity-40" />
          <span className="text-xs font-semibold text-foreground/80">
            {src ? "Cover unavailable" : "No cover photo"}
          </span>
          {src && (
            <span className="max-w-[220px] truncate text-[10px] text-muted-foreground/60 font-mono">
              {src}
            </span>
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

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

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("date-asc");


  const fetchAllEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/all-events`
      );

      if (!res.ok) {
        throw new Error(`Failed to load events (${res.status} ${res.statusText})`);
      }

      const data = await res.json();
      const allEvents = Array.isArray(data) ? data : [];


      const futureOnly = allEvents.filter(isFutureEvent);

      setEvents(futureOnly);
    } catch (err) {
      console.error("Error fetching all upcoming events:", err);
      setError(err?.message || "Could not retrieve upcoming events from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);


  const filterTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.type).filter(Boolean));
    return ["All", ...Array.from(types)];
  }, [events]);


  const displayedEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = events.filter((evt) => {
      const titleMatch = evt.title?.toLowerCase().includes(query) ?? false;
      const locMatch = evt.location?.toLowerCase().includes(query) ?? false;
      const descMatch = evt.description?.toLowerCase().includes(query) ?? false;
      const typeMatch = selectedType === "All" || evt.type === selectedType;

      return (titleMatch || locMatch || descMatch) && typeMatch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "volunteers-desc") {
        return (Number(b.volunteersNeeded) || 0) - (Number(a.volunteersNeeded) || 0);
      }

      const dateA = new Date(`${a.date || ""}T${a.time || "00:00"}`).getTime();
      const dateB = new Date(`${b.date || ""}T${b.time || "00:00"}`).getTime();
      return (dateA || 0) - (dateB || 0);
    });
  }, [events, searchQuery, selectedType, sortBy]);

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground md:px-12 md:py-14">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Community Initiatives
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Upcoming Events
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Discover and join scheduled social service drives, cleanups, tree plantations,
              and volunteer opportunities happening across the city.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchAllEvents}
              disabled={loading}
              title="Refresh upcoming events"
              className="h-11 w-11 rounded-full"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Link href="/create_event">
              <Button className="h-11 rounded-full px-6 font-semibold shadow-md">
                Host an Event
              </Button>
            </Link>
          </div>
        </div>


        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search upcoming events by title, area, or description..."
              className="h-10 rounded-xl bg-background/80 pl-10 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="mr-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Filter className="size-3" /> Type:
              </span>
              {filterTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border-l border-border/70 pl-2">
              <ArrowUpDown className="size-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 rounded-lg border border-border/80 bg-background px-2 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="date-asc">Date: Nearest first</option>
                <option value="volunteers-desc">Most volunteers needed</option>
              </select>
            </div>
          </div>
        </div>


        {loading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card
                key={n}
                className="overflow-hidden rounded-2xl border-border/60 bg-card animate-pulse"
              >
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


        {!loading && error && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-destructive/30 bg-destructive/5 p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
              <AlertTriangle className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold">Failed to load upcoming events</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={fetchAllEvents}
              className="mt-5 rounded-full"
              variant="outline"
            >
              <RefreshCw className="mr-2 size-4" /> Try Again
            </Button>
          </div>
        )}


        {!loading && !error && displayedEvents.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Layers className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold">No upcoming events</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {searchQuery || selectedType !== "All"
                ? "No future events match your current filter criteria."
                : "There are currently no future events scheduled. Be the first to organize one!"}
            </p>
            <Link href="/create_event" className="mt-5">
              <Button className="rounded-full">Create an Event</Button>
            </Link>
          </div>
        )}


        {!loading && !error && displayedEvents.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedEvents.map((event) => {
              const eventId = event._id || event.id;
              const toneClass =
                TYPE_TONES[event.type] || "bg-muted text-foreground border-border";

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

                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground/90">
                        <CalendarDays className="size-3.5 text-primary" />
                        {formatDate(event.date)}
                      </span>
                      {event.time && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock3 className="size-3.5 text-primary" />
                            {event.time}
                          </span>
                        </>
                      )}
                    </div>

                    <CardTitle className="mt-2 line-clamp-1 text-lg font-bold">
                      {event.title}
                    </CardTitle>

                    <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2 p-5 pt-0 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 shrink-0 text-primary" />
                      <span className="line-clamp-1 font-medium text-foreground/80">
                        {event.location || "Location to be announced"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Users className="size-3.5 text-primary" />
                        {event.volunteersNeeded
                          ? `${event.volunteersNeeded} Volunteers Needed`
                          : "Volunteers Welcomed"}
                      </span>
                    </div>

                    {event.organizerName && (
                      <div className="mt-2 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                        Organized by:{" "}
                        <strong className="text-foreground">{event.organizerName}</strong>
                      </div>
                    )}
                  </CardContent>


                  <CardFooter className="mt-auto border-t border-border/60 bg-muted/15 p-3.5">
                    <Link
                      href={`/view/${eventId}`}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
                    >
                      View Event
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
