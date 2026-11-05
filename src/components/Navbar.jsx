"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, User as UserIcon, X } from "lucide-react";
import { CiCircleCheck, CiCirclePlus, CiSettings } from "react-icons/ci";
import { signOut, authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/auth-jwt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("sevaconnect-theme", next ? "dark" : "light");
  };

  const handleSignOut = async () => {
    clearToken();
    await signOut();
    setMobileOpen(false);
  };

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-[#f7fbf8]/90 shadow-[0_8px_30px_-20px_rgba(16,90,58,0.5)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0b120e]/90 dark:shadow-black/20">
      <nav className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-emerald-500 to-teal-700 text-[17px] font-black text-white shadow-lg shadow-emerald-600/20 transition group-hover:rotate-3">
            S
            <span className="absolute -right-2 -top-2 size-5 rounded-full bg-amber-400/80 blur-[5px]" />
          </span>
          <span className="text-[18px] font-extrabold tracking-[-0.02em] text-slate-800 dark:text-white">
            Seva<span className="text-emerald-600 dark:text-emerald-400">Connect</span>
          </span>
        </Link>

        <div className="hidden items-center rounded-full border border-emerald-900/10 bg-white/70 p-1 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.04] lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-5 py-2 text-[13px] font-semibold transition ${
                isActive(link.href)
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 dark:bg-emerald-400 dark:text-emerald-950"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-white/65 dark:hover:bg-white/[0.08] dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex size-10 items-center justify-center rounded-full border border-emerald-900/10 bg-white/75 text-slate-700 transition hover:border-amber-400/60 hover:bg-amber-50 hover:text-amber-600 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white/80 dark:hover:bg-amber-400/10 dark:hover:text-amber-300"
          >
            {dark ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
          </button>

          {user ? (
            <Popover>
              <PopoverTrigger className="flex h-10 items-center gap-2 rounded-full border border-emerald-900/10 bg-white/75 py-1 pl-1 pr-3 transition hover:border-emerald-400/50 hover:bg-emerald-50 dark:border-white/[0.1] dark:bg-white/[0.05] dark:hover:bg-white/[0.09]">
                <Avatar className="size-8 ring-2 ring-emerald-500/20">
                  {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                  <AvatarFallback className="bg-emerald-100 text-[13px] font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                    {(user.name ?? "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-24 truncate text-[13px] font-bold text-slate-700 dark:text-white md:block">
                  {user.name?.split(" ")[0] ?? "Account"}
                </span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 overflow-hidden rounded-2xl border-emerald-900/10 p-0 shadow-xl dark:border-white/[0.1]">
                <PopoverHeader className="border-b border-emerald-900/10 bg-emerald-50/70 px-4 py-3 dark:border-white/[0.08] dark:bg-emerald-400/[0.06]">
                  <PopoverTitle className="text-[14px] font-bold text-foreground">{user.name}</PopoverTitle>
                  <PopoverDescription className="truncate text-[12px] text-muted-foreground">{user.email}</PopoverDescription>
                </PopoverHeader>
                <div className="p-2">
                  {MEMBER_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[13px] font-semibold text-foreground/85 transition hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-white/[0.07] dark:hover:text-emerald-300">
                      <link.icon className="size-[18px] text-emerald-600 dark:text-emerald-400" />
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border p-2">
                  <button type="button" onClick={handleSignOut} className="w-full rounded-xl px-2.5 py-2.5 text-left text-[13px] font-semibold text-destructive transition hover:bg-destructive/10">
                    Log Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link href="/sign-in" className="hidden h-10 items-center rounded-full px-4 text-[13px] font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 dark:text-white/80 dark:hover:bg-white/[0.08] sm:flex">
                Sign In
              </Link>
              <Link href="/sign-up" className="flex h-10 items-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-[13px] font-bold text-white shadow-md shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:shadow-lg dark:from-emerald-400 dark:to-teal-400 dark:text-emerald-950">
                Get Started
              </Link>
            </>
          )}

          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation menu" className="flex size-10 items-center justify-center rounded-full border border-emerald-900/10 bg-white/75 text-slate-700 transition hover:bg-emerald-50 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white lg:hidden">
            {mobileOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-emerald-900/10 bg-[#f7fbf8] px-4 py-4 dark:border-white/[0.08] dark:bg-[#0b120e] lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
            {[...NAV_LINKS, ...(user ? MEMBER_LINKS : [])].map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2.5 rounded-xl px-3 py-3 text-[14px] font-semibold transition ${isActive(link.href) ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300" : "text-slate-700 hover:bg-emerald-50 dark:text-white/80 dark:hover:bg-white/[0.07]"}`}>
                {link.icon ? <link.icon className="size-[18px] text-emerald-600 dark:text-emerald-400" /> : null}
                {link.label}
              </Link>
            ))}
            {!user && <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 text-[14px] font-semibold text-slate-700 hover:bg-emerald-50 dark:text-white/80 dark:hover:bg-white/[0.07]">Sign In</Link>}
            {user && <button type="button" onClick={handleSignOut} className="mt-1 rounded-xl px-3 py-3 text-left text-[14px] font-semibold text-destructive hover:bg-destructive/10">Log Out</button>}
          </div>
        </div>
      )}
    </header>
  );
}
