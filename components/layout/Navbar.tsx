"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Scissors,
  X,
  UserRound,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { signOut } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();

  const { data: session, isPending } = useAuth();

  const user = session?.user;
  const role = user?.role;

  const dashboardLink =
    role === "admin" ? "/admin" : "/customer";

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      const { error } = await signOut();

      if (error) {
        throw new Error(error.message || "Sign Out failed.");
      }

      setIsProfileOpen(false);
      setIsMenuOpen(false);

      toast.success("Signed out successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getInitials = (name?: string) => {
    return (
      name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Scissors size={21} />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            Salon<span className="text-primary">Book</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">

          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="relative">

              {/* Profile Button */}
              <button
                type="button"
                onClick={() =>
                  setIsProfileOpen(!isProfileOpen)
                }
                aria-expanded={isProfileOpen}
                className="flex items-center gap-2 rounded-full border px-3 py-2 transition-colors hover:bg-muted"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Profile"}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {getInitials(user.name)}
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-medium">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${isProfileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 rounded-xl border bg-background p-2 shadow-lg">

                  <div className="border-b px-3 py-3">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={() => setIsProfileOpen(false)}
                    className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    disabled={isSigningOut}
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <LogOut size={17} />
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex h-8 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-md p-2 transition-colors hover:bg-muted md:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t bg-background px-4 py-5 md:hidden">
          <div className="flex flex-col gap-4">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {link.name}
              </Link>
            ))}

            {!isPending && (
              <div className="flex flex-col gap-2 border-t pt-4">

                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "Profile"}
                          width={40}
                          height={40}
                          unoptimized
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {getInitials(user.name)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={dashboardLink}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex h-9 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <Button
                      variant="destructive"
                      disabled={isSigningOut}
                      onClick={handleSignOut}
                    >
                      <LogOut size={17} />
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className="flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-muted"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      className="flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;