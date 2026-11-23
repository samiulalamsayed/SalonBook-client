import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastContainer } from "react-toastify";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "SalonBook | Book Your Beauty Experience",
    template: "%s | SalonBook",
  },
  description:
    "Discover premium salon services and book your next beauty appointment with SalonBook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />

            <main>{children}</main>

            <Footer />
          </AuthProvider>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}