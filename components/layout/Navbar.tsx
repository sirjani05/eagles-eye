"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/programmes", label: "Programmes" },
  { href: "/providers", label: "Providers" },
  { href: "/compare", label: "Compare" },
];

const LEARNER_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/saved", label: "Saved" },
  { href: "/applications", label: "Applications" },
];

const PROVIDER_LINKS = [
  { href: "/provider/dashboard", label: "Provider Dashboard" },
  { href: "/provider/programmes/new", label: "Add Programme" },
];

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Admin Dashboard" },
  { href: "/admin/programmes/review", label: "Review Programmes" },
];

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="h-8 w-24 bg-surface rounded animate-pulse" />
          <div className="hidden md:flex items-center gap-6">
            <div className="h-8 w-16 bg-surface rounded animate-pulse" />
            <div className="h-8 w-16 bg-surface rounded animate-pulse" />
            <div className="h-8 w-16 bg-surface rounded animate-pulse" />
          </div>
          <div className="h-8 w-24 bg-surface rounded animate-pulse" />
        </div>
      </header>
    );
  }

  const roleLinks =
    user?.role === "administrator"
      ? ADMIN_LINKS
      : user?.role === "provider"
      ? PROVIDER_LINKS
      : user
      ? LEARNER_LINKS
      : [];

  const allLinks = [...NAV_LINKS, ...roleLinks];

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground"
          aria-label="Eagle's Eye - Home"
        >
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>Eagle's Eye</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-foreground/70 hover:text-foreground hover:bg-surface"}
              `}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1" aria-label="Toggle currency">
              <span className="text-sm font-medium">GBP</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {user.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block">{user.full_name || user.email}</span>
                  <ChevronDown className={`
                    h-3.5 w-3.5 text-foreground-subtle transition-transform
                    ${userMenuOpen ? "rotate-180" : ""}
                  `} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-strong rounded-xl border border-border py-2 shadow-lg animate-scale-in" role="menu">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{user.full_name || user.email}</p>
                      <p className="text-xs text-foreground-muted capitalize">{user.role}</p>
                    </div>
                    {roleLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-surface rounded-none"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="border-t border-border pt-2">
                      <button
                        onClick={() => void logout()}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-destructive hover:bg-surface rounded-none"
                        role="menuitem"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden rounded-lg p-2 text-foreground/70 hover:text-foreground hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="Menu"
        side="right"
        size="lg"
      >
        <div className="space-y-4">
          <div className="border-b border-border pb-4">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  block px-4 py-3 rounded-lg text-base font-medium transition-colors
                  ${pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-surface"}
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="px-4 text-sm font-medium text-foreground-muted">Account</p>
              {roleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-base text-foreground/70 hover:text-foreground hover:bg-surface transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { void logout(); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-base text-destructive hover:bg-surface transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-2 border-t border-border pt-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-start">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
}