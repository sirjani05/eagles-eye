"use client";

import * as React from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`
              peer h-4 w-4 shrink-0 rounded-md border border-border bg-surface text-primary
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
              disabled:cursor-not-allowed disabled:opacity-50
              checked:bg-primary checked:border-primary
              ${className}
            `}
            aria-describedby={description ? `${checkboxId}-description` : undefined}
            {...props}
          />
          <Check
            className={`
              absolute h-3.5 w-3.5 text-primary-foreground opacity-0 scale-50
              transition-all duration-200
              peer-checked:opacity-100 peer-checked:scale-100
            `}
            strokeWidth={3}
            aria-hidden="true"
          />
        </div>
        {(label || description) && (
          <div className="space-y-0.5 leading-normal">
            {label && (
              <label htmlFor={checkboxId} className="text-sm font-medium text-foreground peer-disabled:opacity-50">
                {label}
              </label>
            )}
            {description && (
              <p id={`${checkboxId}-description`} className="text-sm text-foreground-subtle">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };