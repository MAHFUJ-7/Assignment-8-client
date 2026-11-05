"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, User as UserIcon, X } from "lucide-react";
import { CiCircleCheck, CiCirclePlus, CiSettings } from "react-icons/ci";
import { signOut } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client"
import { clearToken } from "@/lib/auth-jwt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const MEMBER_LINKS = [
  { href: "/create_event", label: "Create Event", icon: CiCirclePlus },
  { href: "/manage_event", label: "Manage Events", icon: CiSettings },
  { href: "/joined_events", label: "Joined Events", icon: CiCircleCheck },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/upcomming-events", label: "Upcoming Events" },
];

export default function Navbar() {
  const { data: session } = authClient.useSession()
  const user = session?.user ?? null;

  // Theme: <html> already carries the right class (no-flash script in
  // layout.js); mirror it into state on mount so the icon matches.
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("sevaconnect-theme", next ? "dark" : "light");
    } catch {
      /* private mode � theme just won't persist */
    }
  };

  const handleSignOut = () => {
    clearToken();
    signOut();
    setMobileOpen(false);
  };

  const linkClass =
    "text-[15px] font-medium text-foreground/80 transition hover:text-foreground";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="relative flex h-16 items-center justify-between px-5 md:h-[78px] md:px-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-green-500 text-[17px] font-black text-[#07120a]">
            S
          </span>
          <span className="text-[19px] font-bold text-foreground">SevaConnect</span>
        </Link>

        {/* Center links (desktop, always available) */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side � theme toggle always visible; auth states beside it */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-muted/60 text-foreground transition hover:bg-muted hover:text-primary"
          >
            {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
          {user ? (
            <Popover>
              <PopoverTrigger className="flex h-10 items-center gap-2 rounded-full border border-border bg-muted/60 py-1 pl-1 pr-3 transition hover:bg-muted">
                <Avatar className="size-8">
                  {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                  <AvatarFallback className="bg-primary/15 text-[13px] font-bold text-primary">
                    {(user.name ?? "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-[13px] font-semibold text-foreground md:block">
                  {user.name?.split(" ")[0] ?? "Account"}
                </span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 p-0">
                <PopoverHeader className="border-b border-border px-4 py-3">
                  <PopoverTitle className="text-[14px] font-semibold text-foreground">
                    {user.name}
                  </PopoverTitle>
                  <PopoverDescription className="text-[12px] text-muted-foreground">
                    {user.email}
                  </PopoverDescription>
                </PopoverHeader>
                <div className="p-2">
                  {MEMBER_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-foreground/85 transition hover:bg-muted hover:text-foreground"
                    >
                      <link.icon className="size-[17px] text-primary" />
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border p-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-md px-2.5 py-2 text-left text-[13px] font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    Log Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="flex h-10 items-center rounded-full border border-border px-4 text-[14px] font-semibold text-foreground transition hover:bg-muted"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="flex h-10 items-center rounded-full bg-primary px-4 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-muted/60 text-foreground transition hover:bg-muted lg:hidden"
          >
            {mobileOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-2.5 text-[15px] font-medium text-foreground/85 transition hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {user &&
              MEMBER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-[15px] font-medium text-foreground/85 transition hover:bg-muted hover:text-foreground"
                >
                  <link.icon className="size-[17px] text-primary" />
                  {link.label}
                </Link>
              ))}
            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-1 rounded-md px-2 py-2.5 text-left text-[15px] font-medium text-destructive transition hover:bg-destructive/10"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
