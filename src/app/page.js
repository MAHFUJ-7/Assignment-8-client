import Image from "next/image";
import Link from "next/link";
import {
  BellRing,
  CalendarPlus,
  ClipboardList,
  MousePointerClick,
  ShieldCheck,
  Users,
} from "lucide-react";
import RecentEvents from "@/components/home/RecentEvents";

const HERO_STATS = [
  { value: "120", label: "Events hosted" },
  { value: "4.8k", label: "Volunteers" },
  { value: "32", label: "Areas covered" },
];

const HERO_EVENT_CARDS = [
  {
    title: "Blanket Distribution",
    meta: "Mohammadpur · Sat 9 AM",
    emoji: "??",
    emojiBg: "bg-rose-500/20",
    position: "top-[184px] right-14",
  },
  {
    title: "Riverside Cleanup",
    meta: "Buriganga · 56 joined ??",
    emoji: "??",
    emojiBg: "bg-sky-500/20",
    position: "top-[377px] right-[190px]",
  },
  {
    title: "Winter Clothes Drive",
    meta: "Mirpur 10 · starts soon",
    emoji: "??",
    emojiBg: "bg-amber-700/50",
    position: "top-[564px] right-20",
  },
];

const FEATURES = [
  {
    icon: CalendarPlus,
    title: "Create events in minutes",
    desc: "Post a cleanup, plantation or drive with date, time, location and volunteer count — live for every visitor instantly.",
  },
  {
    icon: MousePointerClick,
    title: "One-click joining",
    desc: "Volunteers claim a spot in a single click and leave just as easily. Double joins are blocked, both ways.",
  },
  {
    icon: ShieldCheck,
    title: "Secured with JWT",
    desc: "Creating, editing, deleting and joining are protected API actions, verified with signed JSON Web Tokens.",
  },
  {
    icon: ClipboardList,
    title: "Manage your events",
    desc: "Organizers keep their listings up to date — edit details, update volunteers and remove finished drives.",
  },
  {
    icon: BellRing,
    title: "Never miss a date",
    desc: "Upcoming and joined events are always sorted by date, so tomorrow's volunteering stays in clear view.",
  },
  {
    icon: Users,
    title: "Built for the community",
    desc: "Watch spots fill in real time as neighbors sign up, and track your own impact from the joined page.",
  },
];

const GALLERY = [
  { src: "/images/gallery-1.jpg", caption: "Riverside cleanup, Buriganga bank" },
  { src: "/images/gallery-2.jpg", caption: "Tree plantation at the city park" },
  { src: "/images/gallery-3.jpg", caption: "Winter blanket distribution, Mirpur" },
  { src: "/images/gallery-4.jpg", caption: "Health camp — free check-ups" },
  { src: "/images/gallery-5.jpg", caption: "Street food drive downtown" },
  { src: "/images/gallery-6.jpg", caption: "Community garden day" },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[754px] overflow-hidden">

        <Image
          src="/images/heroui-background.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />


        <div className="absolute inset-0 bg-green-950/35" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#081009]/90 via-[#0b130c]/40 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 px-5 pb-16 pt-24 md:px-16 lg:pt-[144px]">

          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[15px] font-medium text-white/90 backdrop-blur-sm">
            <span aria-hidden="true">??</span>
            Community · Service · Impact
          </span>


          <h1 className="mt-8 text-[44px] font-bold leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[64px]">
            Small acts,
            <br />
            big change.
            <br />
            <span className="text-[#f5a623]">Serve your city.</span>
          </h1>


          <p className="mt-9 max-w-[560px] text-base leading-relaxed text-white/80 md:text-lg">
            Create, join and track social service events near you — cleanups, plantations, blanket
            drives and more across Dhaka.
          </p>


          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/upcomming-events"
              className="inline-flex h-[54px] items-center rounded-full bg-[#f5a623] px-8 text-[15px] font-bold text-[#161616] transition hover:bg-[#ffb238]"
            >
              Explore Events
            </Link>
            <Link
              href="/create_event"
              className="inline-flex h-[54px] items-center rounded-full border border-white/40 bg-white/5 px-8 text-[15px] font-medium text-white transition hover:bg-white/10"
            >
              Create an Event
            </Link>
          </div>


          <div className="mt-12 flex flex-wrap gap-10">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-[34px] font-bold leading-none text-white">{stat.value}</div>
                <div className="mt-2 text-[15px] text-white/65">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>


        {HERO_EVENT_CARDS.map((card) => (
          <div
            key={card.title}
            className={`absolute hidden items-center gap-3.5 rounded-2xl border border-white/10 bg-[#1a1e18]/90 p-3.5 pr-6 shadow-2xl backdrop-blur-sm lg:flex ${card.position}`}
          >
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-xl ${card.emojiBg}`}
            >
              <span aria-hidden="true">{card.emoji}</span>
            </span>
            <span>
              <span className="block text-[15px] font-bold text-white">{card.title}</span>
              <span className="mt-0.5 block text-[13px] text-white/60">{card.meta}</span>
            </span>
          </div>
        ))}
      </section>


      <section className="border-t border-border bg-secondary/30 px-4 py-14 text-foreground md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Why SevaConnect
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-4xl">
              Everything a volunteer community needs
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
              From posting an event to filling every volunteer spot - organizers
              and helpers stay in sync on one platform.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary [&>svg]:size-5">
                  <feature.icon aria-hidden="true" />
                </span>
                <h3 className="text-[15.5px] font-bold text-foreground">{feature.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <RecentEvents />


      <section className="border-t border-border bg-secondary/30 px-4 py-14 text-foreground md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                Made of small gestures
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-4xl">
                Moments from past service days
              </h2>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
                Snapshots from the cleanups, plantations and drives that keep the
                community moving.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {GALLERY.map((shot) => (
              <figure
                key={shot.src}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border"
              >
                <Image
                  src={shot.src}
                  alt={shot.caption}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <figcaption className="absolute inset-x-3 bottom-3 text-[13px] font-semibold text-white">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-background px-4 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 text-center md:px-16 md:py-16">

            <div aria-hidden="true" className="absolute -left-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-28 -right-16 size-80 rounded-full bg-[#f5a623]/15 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                Stay in the loop
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Good news lands in tiny doses
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
                One email a month with the newest volunteering events near you -
                no spam, no noise, unsubscribe anytime.
              </p>

              <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="h-12 min-w-0 flex-1 rounded-full border border-input bg-background px-5 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  className="inline-flex h-12 shrink-0 items-center rounded-full bg-primary px-7 text-[14px] font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  Subscribe
                </button>
              </div>
              <p className="mt-3 text-[11.5px] text-muted-foreground">
                Design preview for this assignment - subscription is not wired up yet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
