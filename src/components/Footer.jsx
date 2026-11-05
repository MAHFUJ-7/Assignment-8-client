import Link from "next/link";
import {
  ArrowUpRight,
  Globe2,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/upcomming-events", label: "Upcoming Events" },
  { href: "/sign-up", label: "Become a volunteer" },
];

const MEMBER_LINKS = [
  { href: "/create_event", label: "Create an event" },
  { href: "/joined_events", label: "Joined events" },
  { href: "/profile", label: "My profile" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-emerald-950/10 bg-[#edf7f0] text-slate-700 dark:border-white/[0.08] dark:bg-[#09110c] dark:text-white/75">
      <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 size-96 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-400/5" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-emerald-500 to-teal-700 text-[17px] font-black text-white shadow-lg shadow-emerald-600/20">
                S
              </span>
              <span className="text-[19px] font-extrabold tracking-[-0.02em] text-slate-800 dark:text-white">
                Seva<span className="text-emerald-600 dark:text-emerald-400">Connect</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-white/55">
              Helping neighbors turn small acts of kindness into lasting change
              through local social-service events.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-white/70 px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-sm dark:border-emerald-300/15 dark:bg-white/[0.05] dark:text-emerald-300">
              <HeartHandshake className="size-4" />
              Community powered
            </div>
          </div>

          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-800 dark:text-white">
              Explore
            </h2>
            <div className="mt-5 flex flex-col items-start gap-3">
              {EXPLORE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition hover:translate-x-1 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-800 dark:text-white">
              For members
            </h2>
            <div className="mt-5 flex flex-col items-start gap-3">
              {MEMBER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition hover:translate-x-1 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-800 dark:text-white">
              Let&apos;s connect
            </h2>
            <div className="mt-5 space-y-3 text-sm">
              <p className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                Dhaka, Bangladesh
              </p>
              <a className="flex items-center gap-2.5 transition hover:text-emerald-700 dark:hover:text-emerald-300" href="mailto:hello@sevaconnect.org">
                <Mail className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                hello@sevaconnect.org
              </a>
              <a className="flex items-center gap-2.5 transition hover:text-emerald-700 dark:hover:text-emerald-300" href="tel:+8801700000000">
                <Phone className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                +880 1700-000000
              </a>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <a href="#" aria-label="SevaConnect social community" className="flex size-9 items-center justify-center rounded-full border border-emerald-700/15 bg-white/70 transition hover:-translate-y-0.5 hover:bg-white hover:text-emerald-700 dark:border-white/[0.1] dark:bg-white/[0.05] dark:hover:bg-white/[0.1]">
                <Globe2 className="size-4" />
              </a>
              <Link href="/upcomming-events" aria-label="Browse events" className="flex h-9 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300">
                Browse events
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-emerald-900/10 pt-5 text-xs text-slate-500 dark:border-white/[0.08] dark:text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SevaConnect. Built for a kinder community.</p>
          <p>Serve locally. Make an impact.</p>
        </div>
      </div>
    </footer>
  );
}
