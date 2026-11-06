"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t mt-auto pt-8 pb-12 text-xs text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <span>Eagle's Eye. Education discovery platform.</span>
        <p className="text-center md:text-right">
          {year ? `© ${year} Eagle's Eye. All rights reserved.` : null}
        </p>
      </div>
    </footer>
  );
}
