import Link from "next/link";
import {
    Scissors,
    MapPin,
    Phone,
    Mail,
    Clock,
} from "lucide-react";

const Facebook = ({ size = 17 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const Instagram = ({ size = 17 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const Twitter = ({ size = 17 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);

const Footer = () => {
    return (
        <footer className="border-t bg-secondary/30">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="mb-4 flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <Scissors size={21} />
                            </div>
                            <span className="text-2xl font-bold">
                                Salon<span className="text-primary">Book</span>
                            </span>
                        </Link>

                        <p className="max-w-xs text-sm leading-7 text-muted-foreground">
                            Discover exceptional salon experiences and book your next
                            beauty appointment with ease.
                        </p>

                        <div className="mt-5 flex gap-3">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Twitter, href: "#" },
                            ].map(({ icon: Icon, href }, index) => (
                                <Link
                                    key={index}
                                    href={href}
                                    aria-label="Social media"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                                >
                                    <Icon size={17} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-5 font-semibold">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/" className="hover:text-primary">Home</Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-primary">
                                    Browse Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/sign-in" className="hover:text-primary">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link href="/sign-up" className="hover:text-primary">
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-5 font-semibold">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex gap-3">
                                <MapPin size={18} className="shrink-0 text-primary" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex gap-3">
                                <Phone size={18} className="shrink-0 text-primary" />
                                <span>+880 1XXXXXXXXX</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail size={18} className="shrink-0 text-primary" />
                                <span>hello@salonbook.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h3 className="mb-5 font-semibold">Opening Hours</h3>
                        <div className="flex gap-3 text-sm text-muted-foreground">
                            <Clock size={18} className="shrink-0 text-primary" />
                            <div className="space-y-2">
                                <p>Saturday – Thursday</p>
                                <p>10:00 AM – 9:00 PM</p>
                                <p>Friday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SalonBook. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;