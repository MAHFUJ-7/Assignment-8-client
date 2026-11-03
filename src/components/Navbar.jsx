"use client";

import { CiCircleCheck, CiCirclePlus, CiSettings } from "react-icons/ci";
import Link from "next/link";
import { useState } from "react";
import { Contrast, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@base-ui/react";


export default function Navbar() {

  const { data: session } = authClient.useSession()

  const [dark, setDark] = useState(true);
  const user = session?.user ?? null;

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };
  console.log("User in Navbar:", user);

  const initial = (user?.name ?? "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0e0a]">
      <nav className="relative flex h-16 items-center justify-between px-5 md:h-[78px] md:px-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-green-500 text-[17px] font-black text-[#07120a]">
            S
          </span>
          <span className="text-[19px] font-bold text-white">SevaConnect</span>
        </Link>

        {/* Center links */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 text-[15px] font-medium lg:flex">
          <Link href="/" className="text-white/90 transition hover:text-white">
            Home
          </Link>
          <Link href="/#upcoming-events" className="text-white/70 transition hover:text-white">
            Upcoming Events
          </Link>
        </div>

        {/* Right side — auth states (seam above) */}
        {user ? (
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            >
              <Contrast className="size-5" />
            </button>

            {/* <Avatar size="lg">
              <AvatarImage src={user?.name} alt={user?.name} />
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar> */}

            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>
                <span className="text-[15px] font-medium text-white/90 transition hover:text-white">
                  {user?.name ?? "User"}
                </span>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle className="text-2xl font-bold text-white/90">
                    {user?.name ?? "User"}
                  </PopoverTitle>
                  <PopoverDescription>
                    <div className="text-[13px] text-white/80 m-1">
                    <p className=" text-white/80">
                      {user?.email ?? "No email available"}
                    </p>

                    <Link href="/create_event" className="text-xl flex items-center gap-2 text-green-500 hover:text-green-600 mt-2">
                      <CiCirclePlus />Create Event
                    </Link>

                    <Link href="/create_event" className="text-xl flex items-center gap-2 text-green-500 hover:text-green-600 mt-2">
                      <CiSettings />Manage Events
                    </Link>

                    <Link href="/create_event" className="text-xl flex items-center gap-2 text-green-500 hover:text-green-600 mt-2">
                      <CiCircleCheck />Joined Events
                    </Link>


                    <Button variant="destructive" onClick={() => signOut()} className="rounded-md text-xl mt-2 w-full bg-red-100 text-red-500 hover:bg-red-600 hover:text-white">
                      Logout
                    </Button>
                    </div>
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>

            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="text-[15px] font-medium text-white/90 transition hover:text-white">
              Sign In
            </Link>
            <Link href="/sign-up" className="rounded-full bg-green-500 px-6 py-2.5 text-[15px] font-semibold text-white transition hover:bg-green-600">
              Sign-Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
