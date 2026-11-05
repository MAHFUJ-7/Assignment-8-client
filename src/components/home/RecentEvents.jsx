"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Image as ImageIcon,
  MapPin,
  Users,
} from "lucide-react";

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

function EventMeta({ icon, children }) {
  return (
    <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
      <span className="text-primary/70 [&>svg]:size-3.5">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  );
}

/* Single recent-event card (mirrors the Browse Events design language) */
function RecentCard({ event }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-video w-full overflow-hidden bg-muted/70">
        {event.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.thumbnail}
            alt={event.title || "Event cover"}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted/90 to-muted/40 text-muted-foreground">
            <ImageIcon className="size-8 opacity-40" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {event.type && (
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md ${
              TYPE_TONES[event.type] || "bg-muted text-foreground border-border"
            }`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {event.type}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-1 text-[15px] font-bold text-foreground">
          {event.title}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        <div className="grid gap-1.5">
          <EventMeta icon={<CalendarDays />}>{formatDate(event.date)}</EventMeta>
          {event.time && <EventMeta icon={<Clock />}>{event.time}</EventMeta>}
          <EventMeta icon={<MapPin />}>{event.location || "Location TBD"}</EventMeta>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
            <Users className="size-3.5 text-primary/70" />
            {Number(event.volunteersNeeded) || 0} spots left
          </div>
          <Link
            href={`/view/${event._id}`}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary transition hover:gap-2"
          >
            Details <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-video w-full bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="mt-2 grid gap-2">
          <div className="h-3 w-1/2 rounded bg-muted" />
          <div className="h-3 w-2/5 rounded bg-muted" />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-3 w-14 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

/**
 * "Recent Upcoming Events" - 6 soonest future events straight from MongoDB
 * (server route /recent-events uses .sort(date).limit(6)).
 */
export default function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/recent-events`
        );
        if (!res.ok) {
          throw new Error(`Failed to load events (${res.status} ${res.statusText})`);
        }
        const data = await res.json();
        if (alive) setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        if (alive) setError(err?.message || "Could not load upcoming events.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="bg-background px-4 py-14 text-foreground md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Fresh from the community
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
              Upcoming events, updated live
            </h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
              The six soonest gatherings pulled straight from the database -
              cleanups, plantations, drives and camps you can join today.
            </p>
          </div>
          <Link
            href="/upcomming-events"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[13.5px] font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            Browse all events <ArrowRight className="size-4" />
          </Link>
        </div>

        {error && (
          <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13.5px] text-destructive">
            {error} -{" "}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-semibold underline underline-offset-2"
            >
              retry
            </button>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : events.map((event) => <RecentCard key={event._id} event={event} />)}
        </div>

        {!loading && !error && events.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <p className="text-[15px] font-semibold text-foreground">No upcoming events yet</p>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              Be the first to create one and rally volunteers around your cause.
            </p>
            <Link
              href="/create_event"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Create an event <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
