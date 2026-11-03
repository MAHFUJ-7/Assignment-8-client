import Image from "next/image";

const HERO_STATS = [
  { value: "120", label: "Events hosted" },
  { value: "4.8k", label: "Volunteers" },
  { value: "32", label: "Areas covered" },
];

const HERO_EVENT_CARDS = [
  {
    title: "Blanket Distribution",
    meta: "Mohammadpur · Sat 9 AM",
    emoji: "🧣",
    emojiBg: "bg-rose-500/20",
    position: "top-[184px] right-14",
  },
  {
    title: "Riverside Cleanup",
    meta: "Buriganga · 56 joined 🔥",
    emoji: "🌊",
    emojiBg: "bg-sky-500/20",
    position: "top-[377px] right-[190px]",
  },
  {
    title: "Winter Clothes Drive",
    meta: "Mirpur 10 · starts soon",
    emoji: "🧥",
    emojiBg: "bg-amber-700/50",
    position: "top-[564px] right-20",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[754px] overflow-hidden">
        {/* Hero background — public/images/heroui-background.avif */}
        <Image
          src="/images/heroui-background.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Green wash + left dark gradient so text stays readable (matches the design) */}
        <div className="absolute inset-0 bg-green-950/35" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#081009]/90 via-[#0b130c]/40 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 px-5 pb-16 pt-24 md:px-16 lg:pt-[144px]">
          {/* Badge */}
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[15px] font-medium text-white/90 backdrop-blur-sm">
            <span aria-hidden="true">🌱</span>
            Community · Service · Impact
          </span>

          {/* Heading */}
          <h1 className="mt-8 text-[44px] font-bold leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[64px]">
            Small acts,
            <br />
            big change.
            <br />
            <span className="text-[#f5a623]">Serve your city.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-9 max-w-[560px] text-base leading-relaxed text-white/80 md:text-lg">
            Create, join and track social service events near you — cleanups, plantations, blanket
            drives and more across Dhaka.
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex h-[54px] items-center rounded-full bg-[#f5a623] px-8 text-[15px] font-bold text-[#161616] transition hover:bg-[#ffb238]"
            >
              Explore Events
            </button>
            <button
              type="button"
              className="inline-flex h-[54px] items-center rounded-full border border-white/40 bg-white/5 px-8 text-[15px] font-medium text-white transition hover:bg-white/10"
            >
              Create an Event
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-10">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-[34px] font-bold leading-none text-white">{stat.value}</div>
                <div className="mt-2 text-[15px] text-white/65">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating event cards (desktop) */}
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
    </div>
  );
}
