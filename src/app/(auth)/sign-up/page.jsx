"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
    toast,
} from "@heroui/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Gift, Image, Lock, Mail, TreePine, User, Waves } from "lucide-react";

const INPUT =
    "h-11 w-full rounded-xl border border-white/[0.08] bg-[#0b100d] pl-10 pr-4 text-[14px] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] placeholder:text-white/25 transition-colors duration-200 hover:border-white/[0.14] focus:border-emerald-400/35 focus:bg-[#0d130f] focus:outline-none";

const LABEL = "text-[13px] font-medium text-white/60";
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

const validatePassword = (value) => {
    if (value.length < 6) return "Password must be at least 6 characters.";
    if (!/[a-z]/.test(value)) return "Password must include a lowercase letter.";
    if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter.";
    return null;
};

const EVENT_CARDS = [
    {
        icon: Gift,
        tint: "bg-rose-500/20 text-rose-300",
        title: "Blanket Distribution",
        meta: "Mohammadpur · Sat 9 AM",
    },
    {
        icon: Waves,
        tint: "bg-sky-500/20 text-sky-300",
        title: "Riverside Cleanup",
        meta: "Buriganga · 56 joined",
    },
    {
        icon: TreePine,
        tint: "bg-amber-500/20 text-amber-300",
        title: "Tree Plantation Drive",
        meta: "Mirpur 10 · starts soon",
    },
];

const IMPACT_STATS = [
    { value: "120+", label: "Events hosted" },
    { value: "4.8k", label: "Volunteers" },
    { value: "32", label: "Areas covered" },
];

export default function SignUpPage() {
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const passwordValue = String(data.password);
        const confirmPasswordValue = String(data.confirmPassword);

        if (!PASSWORD_RULE.test(passwordValue)) {
            toast.error("Password must be at least 6 characters and include uppercase and lowercase letters.");
            return;
        }

        if (passwordValue !== confirmPasswordValue) {
            toast.error("Passwords don't match.");
            return;
        }

        const { error } = await signUp.email({
            name: String(data.name),
            email: String(data.email),
            password: passwordValue,
            image: String(data.image || ""),
        });
        if (error) {
            toast.error(error.message || "Couldn't create your account. Try again.");
            return;
        }
        toast.success("Account created. Please sign in.");
    };

    const handleSignUpGoogle = async () => {
        const { error } = await signIn.social({
            provider: "google",
            callbackURL: "/",
        });
        if (error) toast.error(error.message || "Couldn't sign up with Google. Try again.");
    };

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <main className="relative flex-1 overflow-hidden bg-[#090d0a]">
            {/* Ambient background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(520px 320px at 78% 28%, rgba(16,185,129,0.06), transparent 65%)," +
                        "radial-gradient(560px 380px at 96% 102%, rgba(245,166,35,0.05), transparent 60%)," +
                        "linear-gradient(175deg, #0a0f0b 0%, #090d0a 55%, #080b09 100%)",
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.045]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
                        "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                    maskImage: "radial-gradient(60% 60% at 45% 42%, black 25%, transparent 78%)",
                    WebkitMaskImage:
                        "radial-gradient(60% 60% at 45% 42%, black 25%, transparent 78%)",
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
                    backgroundSize: "180px 180px",
                }}
            />

            <div className="relative z-10 grid min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-78px)] lg:grid-cols-2">
                {/* Left half — product story */}
                <aside className="relative hidden overflow-hidden border-r border-white/[0.06] px-12 py-10 lg:flex lg:flex-col lg:justify-center xl:px-20">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(560px 400px at 16% 10%, rgba(16,185,129,0.13), transparent 62%)," +
                                "radial-gradient(480px 360px at 88% 100%, rgba(245,166,35,0.09), transparent 60%)",
                        }}
                    />
                    <div className="relative z-10 flex w-full max-w-[470px] flex-col gap-7">
                        <div>
                            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f5a623]/85">
                                <span aria-hidden="true" className="h-px w-8 bg-[#f5a623]/50" />
                                Why volunteers sign up
                            </p>
                            <h2 className="mt-4 text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-white xl:text-[42px]">
                                Turn small acts
                                <br />
                                into
                                <br />
                                <span className="text-[#f5a623]">real impact.</span>
                            </h2>
                            <p className="mt-4 text-[14px] leading-relaxed text-white/50">
                                Create events, join causes, track your hours.
                            </p>
                        </div>

                        <ul className="flex flex-col gap-3">
                            {EVENT_CARDS.map((card, i) => (
                                <li
                                    key={card.title}
                                    className="flex w-fit items-center gap-3.5 rounded-xl border border-white/[0.08] bg-white/[0.045] p-3 pr-7 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.7)] backdrop-blur-md"
                                    style={{
                                        marginLeft: `${i * 26}px`,
                                        transform: `rotate(${[0.35, -0.4, 0.3][i % 3]}deg)`,
                                    }}
                                >
                                    <span
                                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${card.tint}`}
                                    >
                                        <card.icon className="size-[18px]" strokeWidth={1.75} />
                                    </span>
                                    <span>
                                        <span className="block text-[13px] font-semibold text-white">
                                            {card.title}
                                        </span>
                                        <span className="mt-0.5 block text-[11px] text-white/45">
                                            {card.meta}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-10 border-t border-white/[0.07] pt-6">
                            {IMPACT_STATS.map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-[24px] font-semibold leading-none tracking-tight text-white">
                                        {stat.value}
                                    </div>
                                    <div className="mt-1.5 text-[11px] font-medium text-white/40">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Right half — form */}
                <section className="relative flex flex-col justify-center px-5 py-10 sm:px-10">
                    <div className="mx-auto w-full max-w-[400px]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f5a623]/80">
                            Create account
                        </p>
                        <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[32px]">
                            Create your account
                        </h1>
                        <p className="mt-1.5 text-[14px] text-white/45">
                            Free forever — 4.8k+ volunteers already in.
                        </p>

                        <div className="mt-0 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:p-6">
                            <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                                <TextField isRequired name="name" type="text" autoComplete="name">
                                    <Label className={LABEL}>Full name</Label>
                                    <div className="relative mt-1.5">
                                        <User
                                            aria-hidden="true"
                                            strokeWidth={1.5}
                                            className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-white/30"
                                        />
                                        <Input placeholder="Your full name" className={INPUT} />
                                    </div>
                                    <FieldError className="mt-1.5 text-[11px] text-red-400" />
                                </TextField>

                                <TextField
                                    isRequired
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    validate={(value) => {
                                        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                            return "Please enter a valid email address.";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label className={LABEL}>Email</Label>
                                    <div className="relative mt-1.5">
                                        <Mail
                                            aria-hidden="true"
                                            strokeWidth={1.5}
                                            className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-white/30"
                                        />
                                        <Input placeholder="you@example.com" className={INPUT} />
                                    </div>
                                    <FieldError className="mt-1.5 text-[11px] text-red-400" />
                                </TextField>

                                <TextField
                                    name="image"
                                    type="url"
                                    autoComplete="url"
                                    validate={(value) => {
                                        if (value && !/^https?:\/\/\S+$/i.test(value)) {
                                            return "Please enter a valid photo URL.";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label className={LABEL}>Photo URL</Label>
                                    <div className="relative mt-1.5">
                                        <Image
                                            aria-hidden="true"
                                            strokeWidth={1.5}
                                            className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-white/30"
                                        />
                                        <Input placeholder="https://example.com/photo.jpg" className={INPUT} />
                                    </div>
                                    <FieldError className="mt-1.5 text-[11px] text-red-400" />
                                </TextField>

                                <TextField
                                    isRequired
                                    name="password"
                                    minLength={6}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={setPassword}
                                    validate={validatePassword}
                                >
                                    <Label className={LABEL}>Password</Label>
                                    <div className="relative mt-1.5">
                                        <Lock
                                            aria-hidden="true"
                                            strokeWidth={1.5}
                                            className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-white/30"
                                        />
                                        <Input placeholder="Min. 6 characters, upper & lowercase" className={`${INPUT} pr-10`} />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-white/30 transition hover:text-white/80"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" strokeWidth={1.5} />
                                            ) : (
                                                <Eye className="size-4" strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </div>
                                    <FieldError className="mt-1.5 text-[11px] text-red-400" />
                                </TextField>

                                <TextField
                                    isRequired
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    validate={(value) => {
                                        if (value && value !== password) {
                                            return "Passwords don't match.";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label className={LABEL}>Confirm password</Label>
                                    <div className="relative mt-1.5">
                                        <Lock
                                            aria-hidden="true"
                                            strokeWidth={1.5}
                                            className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-white/30"
                                        />
                                        <Input placeholder="Re-enter password" className={`${INPUT} pr-10`} />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((v) => !v)}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-white/30 transition hover:text-white/80"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="size-4" strokeWidth={1.5} />
                                            ) : (
                                                <Eye className="size-4" strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </div>
                                    <FieldError className="mt-1.5 text-[11px] text-red-400" />
                                </TextField>

                                <Button
                                    type="submit"
                                    className="mt-1 h-11 w-full rounded-xl bg-[#f5a623] text-[14px] font-semibold text-[#1f1402] transition hover:bg-[#ffb238] active:scale-[0.99]"
                                >
                                    Create account
                                </Button>
                            </Form>

                            <div aria-hidden="true" className="my-4 flex items-center gap-3.5">
                                <span className="h-px flex-1 bg-white/[0.07]" />
                                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                                    or
                                </span>
                                <span className="h-px flex-1 bg-white/[0.07]" />
                            </div>

                            <Button
                                type="button"
                                onClick={handleSignUpGoogle}
                                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[14px] font-medium text-white/80 transition hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white"
                            >
                                <FcGoogle size={16} />
                                Continue with Google
                            </Button>
                        </div>

                        <p className="mt-5 text-center text-[13px] text-white/45">
                            Already have an account?{" "}
                            <Link
                                href="/sign-in"
                                className="font-medium text-[#f5a623] transition hover:text-[#ffc95e]"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
