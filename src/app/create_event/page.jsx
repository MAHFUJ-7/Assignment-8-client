"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ImageIcon,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { authHeaders } from "@/lib/auth-jwt";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EVENT_TYPES = [
  { value: "Cleanup", icon: "🧹", tone: "green" },
  { value: "Plantation", icon: "🌳", tone: "green" },
  { value: "Donation", icon: "🤲", tone: "amber" },
  { value: "Education", icon: "📚", tone: "amber" },
  { value: "Health Camp", icon: "🩺", tone: "green" },
  { value: "Winter Relief", icon: "🧣", tone: "blue" },
  { value: "Food Drive", icon: "🍲", tone: "orange" },
];

const TITLE_MAX = 80;
const DESCRIPTION_MAX = 600;
const INITIAL_VALUES = {
  title: "",
  description: "",
  type: "",
  date: "",
  time: "",
  thumbnail: "",
  location: "",
  volunteersNeeded: "",
  contactPhone: "",
};

const INPUT_CLASS =
  "h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10";

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

function validate(values) {
  const errors = {};

  if (!values.title.trim()) errors.title = "Add an event title.";
  else if (values.title.trim().length < 6) errors.title = "Use at least 6 characters.";

  if (!values.description.trim()) errors.description = "Tell volunteers what they will do.";
  else if (values.description.trim().length < 30) {
    errors.description = "Use at least 30 characters.";
  }

  if (!values.type) errors.type = "Choose an event type.";
  if (!values.date) errors.date = "Pick an event date.";
  else if (new Date(`${values.date}T00:00`) <= new Date(new Date().toDateString())) {
    errors.date = "Date must be in the future.";
  }
  if (!values.time) errors.time = "Set a start time.";

  if (!values.thumbnail.trim()) errors.thumbnail = "Add a thumbnail image URL.";
  else if (!/^https?:\/\/.+\..+/i.test(values.thumbnail.trim())) {
    errors.thumbnail = "Enter a valid http:// or https:// link.";
  }

  if (!values.location.trim()) errors.location = "Add where the event happens.";
  if (values.volunteersNeeded && Number(values.volunteersNeeded) < 1) {
    errors.volunteersNeeded = "Enter 1 or more volunteers.";
  }
  if (values.contactPhone && !/^[+\d][\d\s-]{6,}$/.test(values.contactPhone.trim())) {
    errors.contactPhone = "Enter a valid phone number.";
  }

  return errors;
}

function Field({ label, required, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      <Label className="mb-2 text-sm text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-amber-500">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function IconInput({ icon: Icon, error, className = "", ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...props}
        aria-invalid={Boolean(error)}
        className={`${INPUT_CLASS} pl-10 ${error ? "border-destructive" : "border-input"} ${className}`}
      />
    </div>
  );
}

function SectionTitle({ number, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {number}
      </span>
      <div>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function CreateEventForm({
  user,
  onSubmit,
  onCancel: cancelEvent,
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const currentUser = user ?? (session?.user
    ? {
      displayName: session.user.name,
      email: session.user.email,
    }
    : null);
  const onCancel = cancelEvent ?? (() => router.back());

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  const progress = useMemo(() => {
    const required = ["title", "description", "type", "date", "time", "thumbnail", "location"];
    const complete = required.filter((key) => String(values[key]).trim()).length;
    return Math.round((complete / required.length) * 100);
  }, [values]);

  const updateValue = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (name === "thumbnail") setImageLoaded(true);
    if (touched[name]) setErrors(validate(next));
  };

  const markTouched = (name) => {
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors(validate(values));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser?.email) {
      toast.error("Please sign in before creating an event.");
      router.push("/sign-in");
      return;
    }

    const foundErrors = validate(values);
    setErrors(foundErrors);
    setTouched(Object.fromEntries(Object.keys(INITIAL_VALUES).map((key) => [key, true])));

    if (Object.keys(foundErrors).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const payload = {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
      thumbnail: values.thumbnail.trim(),
      volunteersNeeded: values.volunteersNeeded ? Number(values.volunteersNeeded) : null,
      organizerEmail: currentUser.email,
      organizerName: currentUser.displayName,
      createdAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/create-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeaders(currentUser.email)),
        },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        throw new Error("Could not create the event.");
      }

      toast.success("Event created successfully!");
      router.push("/upcomming-events");
    } catch (error) {
      toast.error(error?.message || "Could not create the event right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const error = (name) => (touched[name] ? errors[name] : undefined);
  const previewDate = values.date
    ? new Date(`${values.date}T00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Date";

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Checking your account...</p>
      </main>
    );
  }

  if (!currentUser?.email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold">Sign in to create an event</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Event creation is available to registered SevaConnect members.
            </p>
            <Button className="mt-6" onClick={() => router.push("/sign-in")}>
              Go to sign in
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 max-w-2xl">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            <span className="size-2 rounded-full bg-primary" />
            Organizer mode
          </Badge>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            Create an event
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            Share a cleanup, plantation, donation drive, or health camp with volunteers nearby.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <div className="h-1.5 bg-muted">
              <div
                className="h-full rounded-r-full bg-gradient-to-r from-primary to-amber-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="space-y-10 p-6 md:p-9">
                <section>
                  <SectionTitle
                    number="1"
                    title="What is happening?"
                    description="A clear title and description help people decide to join."
                  />
                  <div className="space-y-5">
                    <Field label="Event title" required error={error("title")}>
                      <Input
                        value={values.title}
                        maxLength={TITLE_MAX}
                        onChange={(event) => updateValue("title", event.target.value)}
                        onBlur={() => markTouched("title")}
                        placeholder="Blanket distribution for the needy"
                        aria-invalid={Boolean(error("title"))}
                        className={`${INPUT_CLASS} ${error("title") ? "border-destructive" : "border-input"}`}
                      />
                      <p className="mt-1 text-right text-xs text-muted-foreground">
                        {values.title.length}/{TITLE_MAX}
                      </p>
                    </Field>

                    <Field label="Description" required error={error("description")}>
                      <Textarea
                        rows={5}
                        value={values.description}
                        maxLength={DESCRIPTION_MAX}
                        onChange={(event) => updateValue("description", event.target.value)}
                        onBlur={() => markTouched("description")}
                        placeholder="What will volunteers do? Who benefits? What should they bring?"
                        aria-invalid={Boolean(error("description"))}
                        className={`${INPUT_CLASS} h-auto resize-none leading-relaxed ${error("description") ? "border-destructive" : "border-input"
                          }`}
                      />
                      <p className="mt-1 text-right text-xs text-muted-foreground">
                        {values.description.length}/{DESCRIPTION_MAX}
                      </p>
                    </Field>

                    <Field label="Event type" required error={error("type")}>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {EVENT_TYPES.map((type) => {
                          const active = values.type === type.value;
                          const amber = type.tone === "amber";
                          const blue = type.tone === "blue";
                          const orange = type.tone === "orange";
                          return (
                            <Button
                              key={type.value}
                              type="button"
                              variant="outline"
                              aria-pressed={active}
                              onClick={() => {
                                updateValue("type", type.value);
                                setTouched((current) => ({ ...current, type: true }));
                              }}
                              className={`h-auto min-h-24 flex-col gap-2 rounded-xl px-2 py-3 text-xs ${active
                                  ? amber
                                    ? "border-amber-500 bg-amber-500/10 text-amber-600"
                                    : blue
                                      ? "border-sky-500 bg-sky-500/10 text-sky-600"
                                      : orange
                                        ? "border-orange-500 bg-orange-500/10 text-orange-600"
                                        : "border-primary bg-primary/10 text-primary"
                                  : ""
                                }`}
                            >
                              <span className="text-xl" aria-hidden="true">{type.icon}</span>
                              {type.value}
                            </Button>
                          );
                        })}
                      </div>
                    </Field>
                  </div>
                </section>

                <section>
                  <SectionTitle
                    number="2"
                    title="When and where?"
                    description="Only future dates are accepted."
                  />
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Event date" required error={error("date")}>
                      <IconInput
                        icon={CalendarDays}
                        type="date"
                        min={tomorrow()}
                        value={values.date}
                        error={error("date")}
                        onChange={(event) => updateValue("date", event.target.value)}
                        onBlur={() => markTouched("date")}
                      />
                    </Field>
                    <Field label="Start time" required error={error("time")}>
                      <IconInput
                        icon={Clock3}
                        type="time"
                        value={values.time}
                        error={error("time")}
                        onChange={(event) => updateValue("time", event.target.value)}
                        onBlur={() => markTouched("time")}
                      />
                    </Field>
                    <Field label="Location" required error={error("location")} className="md:col-span-2">
                      <IconInput
                        icon={MapPin}
                        value={values.location}
                        error={error("location")}
                        onChange={(event) => updateValue("location", event.target.value)}
                        onBlur={() => markTouched("location")}
                        placeholder="Mohammadpur, Dhaka"
                      />
                    </Field>
                  </div>
                </section>

                <section>
                  <SectionTitle
                    number="3"
                    title="Add a cover photo"
                    description="A real photo helps attract more volunteers."
                  />
                  <Field
                    label="Thumbnail image URL"
                    required
                    error={error("thumbnail")}
                    hint="Paste a direct link to a JPG or PNG image."
                  >
                    <IconInput
                      icon={ImageIcon}
                      type="url"
                      value={values.thumbnail}
                      error={error("thumbnail")}
                      onChange={(event) => updateValue("thumbnail", event.target.value)}
                      onBlur={() => markTouched("thumbnail")}
                      placeholder="https://example.com/banner.jpg"
                    />
                  </Field>
                </section>

                <section>
                  <SectionTitle
                    number="4"
                    title="Extra details"
                    description="Optional details make coordination easier."
                  />
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Volunteers needed" error={error("volunteersNeeded")}>
                      <IconInput
                        icon={Users}
                        type="number"
                        min="1"
                        value={values.volunteersNeeded}
                        error={error("volunteersNeeded")}
                        onChange={(event) => updateValue("volunteersNeeded", event.target.value)}
                        onBlur={() => markTouched("volunteersNeeded")}
                        placeholder="50"
                      />
                    </Field>
                    <Field label="Contact phone" error={error("contactPhone")}>
                      <IconInput
                        icon={Phone}
                        type="tel"
                        value={values.contactPhone}
                        error={error("contactPhone")}
                        onChange={(event) => updateValue("contactPhone", event.target.value)}
                        onBlur={() => markTouched("contactPhone")}
                        placeholder="+880 1XXX-XXXXXX"
                      />
                    </Field>
                    <Field
                      label="Organizer"
                      className="md:col-span-2"
                      hint="Taken from your account. Only you can manage this event."
                    >
                      <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-dashed bg-muted/40 px-4 py-3 text-sm">
                        <span className="flex items-center gap-2 font-semibold">
                          <LockKeyhole className="size-3.5 text-muted-foreground" />
                          {currentUser.displayName}
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="size-3.5" />
                          {currentUser.email}
                        </span>
                      </div>
                    </Field>
                  </div>
                </section>
              </CardContent>

              <CardFooter className="flex-col gap-4 sm:flex-row sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  <span className="text-amber-500">*</span> Required fields · {progress}% complete
                </p>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create event"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">
              Live preview · how volunteers will see it
            </p>
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {values.thumbnail && imageLoaded ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={values.thumbnail}
                    alt=""
                    onError={() => setImageLoaded(false)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageIcon className="size-7" />
                    <span className="text-xs">
                      {values.thumbnail ? "This link is not an image" : "Your cover photo appears here"}
                    </span>
                  </div>
                )}
                {values.type && (
                  <Badge className="absolute left-3 top-3 bg-background/90 text-foreground">
                    {values.type}
                  </Badge>
                )}
              </div>
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <CalendarDays className="size-3" />
                    {previewDate}
                  </Badge>
                  {values.volunteersNeeded && (
                    <Badge variant="secondary">
                      <Users className="size-3" />
                      {values.volunteersNeeded} needed
                    </Badge>
                  )}
                </div>
                <CardTitle>{values.title || "Your event title"}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {values.description || "Your description will show here."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {values.location || "Location"}
                  {values.time && <span>· {values.time}</span>}
                </p>
                <Button className="w-full" tabIndex={-1}>
                  View event
                </Button>
              </CardContent>
            </Card>

            <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
              {[
                "Your email is saved as the organizer automatically",
                "Events with past dates are never shown",
                "You can update or delete it later",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {text}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
