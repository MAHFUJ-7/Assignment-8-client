"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Edit3,
  Eye,
  Filter,
  Layers,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  CheckCircle2,
  AlertTriangle,
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
import { authClient } from "@/lib/auth-client";

// Initial sample events matching the exact schema from create_event
const SAMPLE_EVENTS = [
  {
    id: "evt-1",
    title: "Blanket Distribution for the Needy",
    description:
      "Join our winter relief initiative distributing warm blankets and winter wear to underprivileged families and rough sleepers across Mohammadpur.",
    type: "Winter Relief",
    date: "2026-11-20",
    time: "09:00",
    thumbnail:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    location: "Mohammadpur Town Hall, Dhaka",
    volunteersNeeded: 50,
    contactPhone: "+880 1712-345678",
    organizerName: "Rahim Uddin",
    organizerEmail: "rahim@mail.com",
    createdAt: "2026-11-01T10:00:00.000Z",
  },
  {
    id: "evt-2",
    title: "Buriganga Riverside Mega Cleanup",
    description:
      "Help restore the natural beauty of the Buriganga riverbank. We will provide trash bags, gloves, safety gear, and refreshments for all volunteers.",
    type: "Cleanup",
    date: "2026-11-25",
    time: "08:00",
    thumbnail:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    location: "Sadarghat Launch Terminal, Dhaka",
    volunteersNeeded: 120,
    contactPhone: "+880 1819-876543",
    organizerName: "Rahim Uddin",
    organizerEmail: "rahim@mail.com",
    createdAt: "2026-11-02T14:30:00.000Z",
  },
  {
    id: "evt-3",
    title: "Urban Tree Plantation Campaign",
    description:
      "Planting 500 fruit and shade trees along school perimeters and public walkways to enhance greenery and combat urban heat islands.",
    type: "Plantation",
    date: "2026-12-05",
    time: "10:30",
    thumbnail:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    location: "Dhanmondi Lake Park, Dhaka",
    volunteersNeeded: 35,
    contactPhone: "+880 1911-223344",
    organizerName: "Rahim Uddin",
    organizerEmail: "rahim@mail.com",
    createdAt: "2026-11-03T09:15:00.000Z",
  },
  {
    id: "evt-4",
    title: "Free Community Health & Eye Camp",
    description:
      "Providing free primary healthcare checkups, blood sugar screenings, and eye examinations with certified medical practitioners.",
    type: "Health Camp",
    date: "2026-12-12",
    time: "09:00",
    thumbnail:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    location: "Mirpur 10 Community Center, Dhaka",
    volunteersNeeded: 25,
    contactPhone: "+880 1610-998877",
    organizerName: "Rahim Uddin",
    organizerEmail: "rahim@mail.com",
    createdAt: "2026-11-03T18:00:00.000Z",
  },
];

const TYPE_TONES = {
  Cleanup: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Plantation: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  Donation: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Education: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
  "Health Camp": "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
  "Winter Relief": "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  "Food Drive": "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

export default function ManageEventsPage() {
  const { data: session } = authClient.useSession();
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Modal states
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const currentUser = {
    displayName: session?.user?.name || "Organizer",
    email: session?.user?.email || "rahim@mail.com",
  };

  // Filter types list
  const filterTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.type));
    return ["All", ...Array.from(types)];
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === "All" || evt.type === selectedType;
      return matchSearch && matchType;
    });
  }, [events, searchQuery, selectedType]);

  // Total stats
  const totalVolunteers = useMemo(() => {
    return events.reduce((sum, e) => sum + (Number(e.volunteersNeeded) || 0), 0);
  }, [events]);

  /* ───────── Backend sample action handlers ───────── */

  // 1. Edit Event (Open editor)
  const handleEdit = (event) => {
    setEditingEvent({ ...event });
  };

  // Save Edit Handler
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    // TODO: Connect with backend manually:
    // await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${editingEvent.id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(editingEvent),
    // });

    setEvents((prev) =>
      prev.map((item) => (item.id === editingEvent.id ? editingEvent : item))
    );
    showNotice(`Event "${editingEvent.title}" updated successfully!`);
    setEditingEvent(null);
  };

  // 3. Delete Event
  const confirmDelete = async () => {
    if (!deletingEventId) return;

    // TODO: Connect with backend manually:
    // await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${deletingEventId}`, {
    //   method: "DELETE",
    // });

    const deleted = events.find((e) => e.id === deletingEventId);
    setEvents((prev) => prev.filter((item) => item.id !== deletingEventId));
    showNotice(`Event "${deleted?.title || "Event"}" has been deleted.`);
    setDeletingEventId(null);
  };

  const showNotice = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground md:px-12 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Toast / Notification Banner */}
        {statusMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/90 px-5 py-3.5 text-sm font-medium text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="size-5 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <span className="size-2 rounded-full bg-primary" />
              Organizer Workspace
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Manage Your Events
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Track, review, modify, or remove social service events organized by{" "}
              <span className="font-semibold text-foreground">{currentUser.displayName}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/create_event">
              <Button className="h-11 gap-2 rounded-full px-6 font-semibold shadow-md">
                <Plus className="size-4" />
                Create New Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-2xl font-bold">{events.length}</div>
              <div className="mt-1 text-xs text-muted-foreground">Total Events</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-2xl font-bold text-emerald-500">{events.length}</div>
              <div className="mt-1 text-xs text-muted-foreground">Active & Upcoming</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-2xl font-bold text-amber-500">{totalVolunteers}</div>
              <div className="mt-1 text-xs text-muted-foreground">Volunteers Needed</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-2xl font-bold text-sky-500">{filterTypes.length - 1}</div>
              <div className="mt-1 text-xs text-muted-foreground">Event Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, or keywords..."
              className="h-10 rounded-xl bg-background/80 pl-10 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="mr-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Filter className="size-3.5" /> Category:
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
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Layers className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold">No events found</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {searchQuery || selectedType !== "All"
                ? "Try adjusting your search criteria or filter to see more events."
                : "You haven't created any events yet. Get started by creating your first event!"}
            </p>
            <Link href="/create_event" className="mt-5">
              <Button className="rounded-full">Create an Event</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const toneClass =
                TYPE_TONES[event.type] || "bg-muted text-foreground border-border";

              return (
                <Card
                  key={event.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border-border/70 bg-card transition duration-200 hover:border-primary/40 hover:shadow-xl"
                >
                  {/* Thumbnail / Image with Type Badge */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.thumbnail}
                      alt={event.title}
                      className="size-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${toneClass}`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {event.type}
                    </span>
                  </div>

                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5 text-primary" />
                        {new Date(event.date + "T00:00").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock3 className="size-3.5 text-primary" />
                        {event.time}
                      </span>
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
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Users className="size-3.5 text-primary" />
                        {event.volunteersNeeded || "Open"} Volunteers Needed
                      </span>
                      {event.contactPhone && (
                        <span className="flex items-center gap-1 text-[11px]">
                          <Phone className="size-3" />
                          {event.contactPhone}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  {/* Actions Footer */}
                  <CardFooter className="mt-auto grid grid-cols-3 gap-2 border-t border-border/60 bg-muted/20 p-3">
                    {/* 1. View Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 rounded-xl text-xs hover:border-primary/50"
                    >
                      <Eye className="size-3.5 text-sky-500" />
                      View
                    </Button>

                    {/* 2. Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event)}
                      className="h-9 gap-1.5 rounded-xl text-xs hover:border-amber-500/50"
                    >
                      <Edit3 className="size-3.5 text-amber-500" />
                      Edit
                    </Button>

                    {/* 3. Delete Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingEventId(event.id)}
                      className="h-9 gap-1.5 rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ───────────────── VIEW EVENT MODAL ───────────────── */}
      {viewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setViewingEvent(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewingEvent.thumbnail}
                alt={viewingEvent.title}
                className="size-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                {viewingEvent.type}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{viewingEvent.title}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4 text-primary" />
                    {new Date(viewingEvent.date + "T00:00").toLocaleDateString("en-US", {
                      dateStyle: "long",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="size-4 text-primary" />
                    {viewingEvent.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-primary" />
                    {viewingEvent.location}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/30 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  About this Event
                </h4>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {viewingEvent.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border/70 p-3">
                  <span className="text-xs text-muted-foreground">Volunteers Needed</span>
                  <div className="mt-1 font-bold text-foreground">
                    {viewingEvent.volunteersNeeded} people
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 p-3">
                  <span className="text-xs text-muted-foreground">Organizer Contact</span>
                  <div className="mt-1 font-bold text-foreground">
                    {viewingEvent.contactPhone || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>Organizer: {viewingEvent.organizerName} ({viewingEvent.organizerEmail})</span>
                <Button variant="outline" size="sm" onClick={() => setViewingEvent(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────── EDIT EVENT MODAL ───────────────── */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setEditingEvent(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold">Edit Event</h2>
              <p className="text-xs text-muted-foreground">
                Update details for this event. Backend function sample is wired ready.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold">Event Title</label>
                <Input
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold">Description</label>
                <textarea
                  rows={4}
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, description: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Date</label>
                  <Input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, date: e.target.value })
                    }
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Time</label>
                  <Input
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, time: e.target.value })
                    }
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold">Location</label>
                <Input
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, location: e.target.value })
                  }
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Volunteers Needed
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={editingEvent.volunteersNeeded}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        volunteersNeeded: Number(e.target.value),
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Contact Phone</label>
                  <Input
                    value={editingEvent.contactPhone}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        contactPhone: e.target.value,
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold">Thumbnail URL</label>
                <Input
                  value={editingEvent.thumbnail}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, thumbnail: e.target.value })
                  }
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────── DELETE CONFIRMATION MODAL ───────────────── */}
      {deletingEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-destructive/30 bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/15">
                <AlertTriangle className="size-5" />
              </div>
              <h3 className="text-lg font-bold">Delete Event?</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to delete this event? This action cannot be undone once
              synchronized with the backend.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingEventId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
              >
                Yes, Delete Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
