"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArrowRight, BadgeCheck, CircleUserRound, Loader2, LogOut } from "lucide-react";
import { authClient, signOut, updateUser, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/auth-jwt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FIELD =
  "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>;
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [seeded, setSeeded] = useState(false);

  // Seed the form once real user data arrives.
  useEffect(() => {
    if (user && !seeded) {
      setName(user.name ?? "");
      setImage(user.image ?? "");
      setSeeded(true);
    }
  }, [user, seeded]);

  const startEditing = () => {
    setName(user?.name ?? "");
    setImage(user?.image ?? "");
    setEditing(true);
    setErrors({});
  };

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Name is required.";
    else if (name.trim().length < 3) next.name = "Use at least 3 characters.";
    if (image.trim() && !/^https?:\/\/.+/i.test(image.trim())) {
      next.image = "Enter a valid http(s) image URL, or leave it empty.";
    }
    return next;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setSaving(true);
      await updateUser({ name: name.trim(), image: image.trim() || null });
      setEditing(false);
      setErrors({});
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err?.message || "Could not update the profile right now.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutHere = async () => {
    clearToken();
    await signOut();
  };

  const displayName = user?.name || "SevaConnect User";

  /* --------- Loading (session check) --------- */
  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    );
  }

  /* --------- Not signed in --------- */
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-10 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <CircleUserRound className="size-7" />
          </span>
          <h1 className="mt-5 text-xl font-bold">Your profile lives here</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Sign in to view and update your name, photo and membership details.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Sign in <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  /* --------- Signed in: profile view + update --------- */
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <BadgeCheck className="size-4" />
            Member profile
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            Your identity on SevaConnect
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            This is how event organizers and participants see you across the platform.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Identity card */}
          <Card>
            <CardContent className="flex flex-col items-center p-8 text-center">
              <Avatar className="size-24 border-2 border-primary/25">
                {user.image ? <AvatarImage src={user.image} alt={displayName} /> : null}
                <AvatarFallback className="bg-primary/15 text-2xl font-black text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-lg font-bold">{displayName}</h2>
              <p className="mt-1 break-all text-[13px] text-muted-foreground">{user.email}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-current" />
                Active volunteer
              </span>
              <Button
                variant="outline"
                onClick={handleSignOutHere}
                className="mt-6 w-full gap-2 rounded-full font-semibold text-destructive hover:text-destructive"
              >
                <LogOut className="size-4" /> Sign out
              </Button>
            </CardContent>
          </Card>

          {/* Edit card */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Public details</h3>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Update the name and photo other volunteers will see.
                  </p>
                </div>
                {!editing && (
                  <Button onClick={startEditing} className="rounded-full px-5 font-semibold">
                    Edit profile
                  </Button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSave} noValidate className="mt-6 space-y-4">
                  <div>
                    <Label className="mb-2 text-[12.5px] text-muted-foreground">Full name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setErrors((cur) => ({ ...cur, name: undefined }))}
                      aria-invalid={Boolean(errors.name)}
                      placeholder="e.g. Mahfuj Hasan"
                      className={`${FIELD} ${errors.name ? "border-destructive" : ""}`}
                    />
                    <FieldError message={errors.name} />
                  </div>

                  <div>
                    <Label className="mb-2 text-[12.5px] text-muted-foreground">
                      Photo URL
                    </Label>
                    <Input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      aria-invalid={Boolean(errors.image)}
                      placeholder="https://example.com/photo.jpg"
                      className={`${FIELD} ${errors.image ? "border-destructive" : ""}`}
                    />
                    <FieldError message={errors.image} />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Paste a public image link. Leave it empty to remove the photo.
                    </p>
                  </div>

                  {image.trim() && !errors.image && (
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-3">
                      <Avatar className="size-12">
                        <AvatarImage src={image.trim()} alt="Preview" />
                        <AvatarFallback className="bg-primary/15 font-bold text-primary">
                          {(name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-muted-foreground">
                        Preview of your new photo
                      </span>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setErrors({});
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="size-4 animate-spin" />}
                      Save changes
                    </Button>
                  </div>
                </form>
              ) : (
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <dt className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Name
                    </dt>
                    <dd className="mt-1.5 text-[15px] font-semibold">{displayName}</dd>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <dt className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1.5 break-all text-[15px] font-semibold">{user.email}</dd>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/30 p-4 sm:col-span-2">
                    <dt className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Photo
                    </dt>
                    <dd className="mt-1.5 truncate text-[13px] text-muted-foreground">
                      {user.image ? (
                        <a href={user.image} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">
                          {user.image}
                        </a>
                      ) : (
                        "No photo set yet - press Edit profile to add one."
                      )}
                    </dd>
                  </div>
                </dl>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
