"use client";

import * as React from "react";
import { X, type LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

type DrawerSide = "left" | "right";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: DrawerSide;
  size?: "sm" | "md" | "lg" | "full";
  showClose?: boolean;
}

const sizeClasses = {
  sm: "w-72 max-w-[85vw]",
  md: "w-96 max-w-[90vw]",
  lg: "w-[32rem] max-w-[95vw]",
  full: "w-full max-w-none",
};

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = "right",
  size = "md",
  showClose = true,
}: DrawerProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity
          ${side === "left" ? "ml-auto" : "mr-auto"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`
          relative flex flex-col ${sizeClasses[size]} border-y border-border bg-card
          shadow-xl animate-slide-in
          max-h-full overflow-hidden flex-col
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
        aria-describedby={description ? "drawer-description" : undefined}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between border-b border-border p-6">
            <div className={side === "left" ? "mr-4" : "ml-4"}>
              {title && (
                <h2 id="drawer-title" className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p id="drawer-description" className="mt-1 text-sm text-foreground-muted">
                  {description}
                </p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-lg p-1 text-foreground-subtle hover:text-foreground hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

const slideIn = `
  @keyframes slideInFromRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInFromLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

export function DrawerWithAnimations({ isOpen, onClose, title, description, children, side = "right", size = "md", showClose = true }: DrawerProps) {
  if (!isOpen) return null;

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = slideIn;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} description={description} children={children} side={side} size={size} showClose={showClose} />
  );
}