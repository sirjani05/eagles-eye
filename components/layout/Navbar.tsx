"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/programmes", label: "Programmes" },
];

const LEARNER_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/saved", label: "Saved Programmes" },
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

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="w-24 h-6 bg-muted rounded animate-pulse" />
          <div className="w-40 h-6 bg-muted rounded animate-pulse" />
        </div>
      </nav>
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

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-primary">Eagle&apos;s</span> <span>Eye</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 transition-colors ${
                pathname === link.href ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {roleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 transition-colors ${
                pathname === link.href ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3 text-sm text-foreground/70">
              <span>{user.full_name || user.email}</span>
              <span className="px-2 py-0.5 rounded-md text-xs border border-input">{user.role}</span>
              <button
                onClick={() => void logout()}
                className="text-sm text-destructive hover:text-destructive/90 underline-offset-4 hover:underline"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground">
                Sign in
              </Link>
              <Link href="/register" className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
