"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
  CheckCircle2,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
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
import { authHeaders } from "@/lib/auth-jwt";

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


function validateEdit(values, originalDate) {
  const errors = {};

  if (!values.title?.trim()) errors.title = "Add an event title.";
  else if (values.title.trim().length < 6) errors.title = "Use at least 6 characters.";

  if (!values.description?.trim()) errors.description = "Tell volunteers what they will do.";
  else if (values.description.trim().length < 30) {
    errors.description = "Use at least 30 characters.";
  }

  if (!values.date) errors.date = "Pick an event date.";
  else if (
    values.date !== originalDate &&
    new Date(`${values.date}T00:00`) <= new Date(new Date().toDateString())
  ) {
    errors.date = "Date must be in the future.";
  }

  if (!values.time) errors.time = "Set a start time.";

  if (!values.thumbnail?.trim()) errors.thumbnail = "Add a thumbnail image URL.";
  else if (!/^https?:\/\/.+\..+/i.test(values.thumbnail.trim())) {
    errors.thumbnail = "Enter a valid http:// or https:// link.";
  }

  if (!values.location?.trim()) errors.location = "Add where the event happens.";
  if (values.volunteersNeeded && Number(values.volunteersNeeded) < 1) {
    errors.volunteersNeeded = "Enter 1 or more volunteers.";
  }
  if (values.contactPhone && !/^[+\d][\d\s-]{6,}$/.test(String(values.contactPhone).trim())) {
    errors.contactPhone = "Enter a valid phone number.";
  }

  return errors;
}


function EventThumbnail({ src, alt, type, toneClass }) {
  const [loadError, setLoadError] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted/60">
      {src && !loadError ? (

        <img
          src={src}
          alt={alt || "Event cover"}
          className="size-full object-cover transition duration-300 group-hover:scale-105"
          onError={() => setLoadError(true)}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-muted/80 to-muted/40 p-4 text-center text-muted-foreground">
          <ImageIcon className="size-8 opacity-50" />
          <span className="text-xs font-semibold text-foreground/80">
            {src ? "Cover image unavailable" : "No image provided"}
          </span>
          {src && (
            <span className="max-w-[240px] truncate text-[10px] text-muted-foreground/70 font-mono">
              {src}
            </span>
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {type && (
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${toneClass}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {type}
        </span>
      )}
    </div>
  );
}

export default function ManageEventsPage() {
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");


  const [editingEvent, setEditingEvent] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [originalEditDate, setOriginalEditDate] = useState("");
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const currentUser = {
    displayName: session?.user?.name || "MD MAHFUJ",
    email: session?.user?.email || "crazymahfuj1@gmail.com",
  };


  const fetchEvents = useCallback(async () => {
    if (!userEmail) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/events?email=${encodeURIComponent(userEmail)}`,
        { headers: await authHeaders(userEmail) }
      );

      if (!res.ok) {
        throw new Error(`Failed to load events (${res.status})`);
      }

      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err?.message || "Could not retrieve events from the server.");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);


  const userEvents = useMemo(() => {
    const userEmail = session?.user?.email?.toLowerCase() || currentUser.email.toLowerCase();
    const mine = events.filter(
      (e) => e.organizerEmail?.toLowerCase() === userEmail
    );

    return mine.length > 0 ? mine : events;
  }, [events, session, currentUser.email]);


  const filterTypes = useMemo(() => {
    const types = new Set(userEvents.map((e) => e.type).filter(Boolean));
    return ["All", ...Array.from(types)];
  }, [userEvents]);


  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return userEvents.filter((evt) => {
      const titleMatch = evt.title?.toLowerCase().includes(query) ?? false;
      const locMatch = evt.location?.toLowerCase().includes(query) ?? false;
      const descMatch = evt.description?.toLowerCase().includes(query) ?? false;
      const typeMatch = selectedType === "All" || evt.type === selectedType;

      return (titleMatch || locMatch || descMatch) && typeMatch;
    });
  }, [userEvents, searchQuery, selectedType]);


  const totalVolunteers = useMemo(() => {
    return userEvents.reduce((sum, e) => sum + (Number(e.volunteersNeeded) || 0), 0);
  }, [userEvents]);



  const handleEdit = (event) => {
    setEditingEvent({ ...event });
    setEditErrors({});
    setOriginalEditDate(event.date || "");
  };


  const patchEditing = (name, value) => {
    const next = { ...editingEvent, [name]: value };
    setEditingEvent(next);
    if (Object.keys(editErrors).length > 0) {
      setEditErrors(validateEdit(next, originalEditDate));
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    const nextErrors = validateEdit(editingEvent, originalEditDate);
    if (Object.keys(nextErrors).length > 0) {
      setEditErrors(nextErrors);
      return;
    }

    const editId = editingEvent._id || editingEvent.id;



    console.log("Editing event payload:", editingEvent);

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/events/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(await authHeaders(session?.user?.email || currentUser?.email)),
      },
      body: JSON.stringify(editingEvent),
    });

    setEvents((prev) =>
      prev.map((item) =>
        (item._id || item.id) === editId ? editingEvent : item
      )
    );
    showNotice(`Event "${editingEvent.title}" updated successfully!`);
    setEditingEvent(null);
    setEditErrors({});
  };

  const confirmDelete = async () => {
    if (!deletingEventId) return;

    const deleted = events.find(
      (e) => (e._id || e.id) === deletingEventId
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/events/${deletingEventId}`,
        {
          method: "DELETE",
          headers: await authHeaders(session?.user?.email || currentUser?.email),
        }
      );

      if (!response.ok) {
        throw new Error("Could not delete the event.");
      }

      setEvents((prev) =>
        prev.filter((item) => (item._id || item.id) !== deletingEventId)
      );
      showNotice(`Event "${deleted?.title || "Event"}" has been deleted.`);
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingEventId(null);
    }
  };

  const showNotice = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground md:px-12 md:py-12">
      <div className="mx-auto max-w-7xl">

        {statusMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/90 px-5 py-3.5 text-sm font-medium text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="size-5 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}


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
              Showing events organized by{" "}
              <span className="font-semibold text-foreground">
                {currentUser.displayName}
              </span>{" "}
              ({currentUser.email}).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchEvents}
              disabled={loading}
              title="Refresh events"
              className="h-11 w-11 rounded-full"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Link href="/create_event">
              <Button className="h-11 gap-2 rounded-full px-6 font-semibold shadow-md">
                <Plus className="size-4" />
                Create New Event
              </Button>
            </Link>
          </div>
        </div>


        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-2xl font-bold">{userEvents.length}</div>
              <div className="mt-1 text-xs text-muted-foreground">Total Events</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-2xl font-bold text-emerald-500">{userEvents.length}</div>
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
              <div className="text-2xl font-bold text-sky-500">
                {filterTypes.length > 1 ? filterTypes.length - 1 : 0}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Event Categories</div>
            </CardContent>
          </Card>
        </div>


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
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${selectedType === type
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>


        {loading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="overflow-hidden rounded-2xl border-border/60 bg-card animate-pulse">
                <div className="aspect-video w-full bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="mt-4 flex gap-2 pt-2">
                    <div className="h-9 flex-1 rounded-xl bg-muted" />
                    <div className="h-9 flex-1 rounded-xl bg-muted" />
                    <div className="h-9 flex-1 rounded-xl bg-muted" />
                  </div>
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
            <h3 className="mt-4 text-lg font-bold">Failed to load events</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchEvents} className="mt-5 rounded-full" variant="outline">
              <RefreshCw className="mr-2 size-4" /> Try Again
            </Button>
          </div>
        )}


        {!loading && !error && filteredEvents.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Layers className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold">No events found</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              {searchQuery || selectedType !== "All"
                ? "Try adjusting your search query or category filter."
                : "No events are recorded for your account yet. Create your first event!"}
            </p>
            <Link href="/create_event" className="mt-5">
              <Button className="rounded-full">Create an Event</Button>
            </Link>
          </div>
        )}


        {!loading && !error && filteredEvents.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
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
                      <span className="flex items-center gap-1">
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
                      <span className="line-clamp-1">
                        {event.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Users className="size-3.5 text-primary" />
                        {event.volunteersNeeded
                          ? `${event.volunteersNeeded} Volunteers Needed`
                          : "Open Volunteers"}
                      </span>
                      {event.contactPhone ? (
                        <span className="flex items-center gap-1 text-[11px]">
                          <Phone className="size-3" />
                          {event.contactPhone}
                        </span>
                      ) : null}
                    </div>

                    {(event.organizerName || event.organizerEmail) && (
                      <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
                        <span>
                          By: <strong className="text-foreground">{event.organizerName}</strong>
                        </span>
                        <span className="truncate max-w-[150px]">{event.organizerEmail}</span>
                      </div>
                    )}
                  </CardContent>


                  <CardFooter className="mt-auto grid grid-cols-3 gap-2 border-t border-border/60 bg-muted/20 p-3">

                    <Link href={`/view/${eventId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 rounded-xl text-xs hover:border-primary/50"
                      >
                        <Eye className="size-3.5 text-sky-500" />
                        View
                      </Button>
                    </Link>


                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event)}
                      className="h-9 gap-1.5 rounded-xl text-xs hover:border-amber-500/50"
                    >
                      <Edit3 className="size-3.5 text-amber-500" />
                      Edit
                    </Button>


                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingEventId(eventId)}
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
                Update details for this event.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold">Event Title</label>
                <Input
                  value={editingEvent.title || ""}
                  onChange={(e) => patchEditing("title", e.target.value)}
                  aria-invalid={Boolean(editErrors.title)}
                  required
                  className={`rounded-xl ${editErrors.title ? "border-destructive" : ""}`}
                />
                {editErrors.title && (
                  <p className="mt-1 text-xs font-medium text-destructive">{editErrors.title}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold">Description</label>
                <textarea
                  rows={4}
                  value={editingEvent.description || ""}
                  onChange={(e) => patchEditing("description", e.target.value)}
                  aria-invalid={Boolean(editErrors.description)}
                  required
                  className={`w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
                    editErrors.description ? "border-destructive" : "border-input"
                  }`}
                />
                {editErrors.description && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {editErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Date</label>
                  <Input
                    type="date"
                    value={editingEvent.date || ""}
                    onChange={(e) => patchEditing("date", e.target.value)}
                    aria-invalid={Boolean(editErrors.date)}
                    required
                    className={`rounded-xl ${editErrors.date ? "border-destructive" : ""}`}
                  />
                  {editErrors.date && (
                    <p className="mt-1 text-xs font-medium text-destructive">{editErrors.date}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Time</label>
                  <Input
                    type="time"
                    value={editingEvent.time || ""}
                    onChange={(e) => patchEditing("time", e.target.value)}
                    aria-invalid={Boolean(editErrors.time)}
                    required
                    className={`rounded-xl ${editErrors.time ? "border-destructive" : ""}`}
                  />
                  {editErrors.time && (
                    <p className="mt-1 text-xs font-medium text-destructive">{editErrors.time}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold">Location</label>
                <Input
                  value={editingEvent.location || ""}
                  onChange={(e) => patchEditing("location", e.target.value)}
                  aria-invalid={Boolean(editErrors.location)}
                  required
                  className={`rounded-xl ${editErrors.location ? "border-destructive" : ""}`}
                />
                {editErrors.location && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {editErrors.location}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Volunteers Needed
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={editingEvent.volunteersNeeded || ""}
                    onChange={(e) => patchEditing("volunteersNeeded", Number(e.target.value))}
                    aria-invalid={Boolean(editErrors.volunteersNeeded)}
                    className={`rounded-xl ${editErrors.volunteersNeeded ? "border-destructive" : ""}`}
                  />
                  {editErrors.volunteersNeeded && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                      {editErrors.volunteersNeeded}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Contact Phone</label>
                  <Input
                    value={editingEvent.contactPhone || ""}
                    onChange={(e) => patchEditing("contactPhone", e.target.value)}
                    aria-invalid={Boolean(editErrors.contactPhone)}
                    className={`rounded-xl ${editErrors.contactPhone ? "border-destructive" : ""}`}
                  />
                  {editErrors.contactPhone && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                      {editErrors.contactPhone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold">Thumbnail URL</label>
                <Input
                  value={editingEvent.thumbnail || ""}
                  onChange={(e) => patchEditing("thumbnail", e.target.value)}
                  aria-invalid={Boolean(editErrors.thumbnail)}
                  required
                  className={`rounded-xl ${editErrors.thumbnail ? "border-destructive" : ""}`}
                />
                {editErrors.thumbnail && (
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {editErrors.thumbnail}
                  </p>
                )}
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
                onClick={() => setDeletingEventId(eventId)}
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
