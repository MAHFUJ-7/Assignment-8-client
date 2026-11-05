import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SevaConnect",
  description:
    "Create, join and track social service events near you — cleanups, plantations, blanket drives and more across Dhaka.",
};

/* Applies the stored theme before first paint so light/dark never flashes. */
const themeInitScript = `(function(){try{var t=localStorage.getItem("sevaconnect-theme");if(t==="light"){document.documentElement.classList.remove("dark")}else{localStorage.setItem("sevaconnect-theme","dark");document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Navbar />
        {children}
        <Footer />
        <ToastContainer />
        </body>
    </html>
  );
}
