"use client";

export function Footer() {
  return (
    <footer className="border-t mt-auto pt-8 pb-12 text-xs text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <span>Eagle&apos;s Eye. Education discovery platform.</span>
        <p className="text-center md:text-right">
          &copy; {new Date().getFullYear()} Eagle&apos;s Eye. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
