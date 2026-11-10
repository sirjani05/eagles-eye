"use client";

import * as React from "react";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  valueLabel?: (value: number) => string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, min = 0, max = 100, step = 1, showValue = false, valueLabel, id, ...props }, ref) => {
    const sliderId = id || React.useId();
    const [value, setValue] = React.useState(props.defaultValue || min);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setValue(newValue);
      props.onChange?.(e);
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={sliderId} className="text-sm font-medium text-foreground">
              {label}
            </label>
            {showValue && (
              <span className="text-sm font-mono text-primary">
                {valueLabel ? valueLabel(value) : value}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            id={sliderId}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className={`
              appearance-none w-full h-2 bg-surface rounded-full cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
              disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `}
            style={{
              background: `linear-gradient(to right, var(--color-primary) ${percentage}%, var(--color-surface) ${percentage}%)`,
            }}
            {...props}
          />
          <div
            className="absolute -top-1.5 left-0 w-full h-5 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute top-1/2 h-3 w-3 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
              style={{ left: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-foreground-subtle">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };