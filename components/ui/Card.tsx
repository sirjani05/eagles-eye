import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={["rounded-xl border bg-card text-card-foreground shadow-sm", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

Card.displayName = "Card";

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={["flex flex-col space-y-1.5 p-6", className].filter(Boolean).join(" ")} {...props} />
));
CardHeader.displayName = "CardHeader";

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={["text-2xl font-semibold leading-none tracking-tight", className].filter(Boolean).join(" ")} {...props} />
));
CardTitle.displayName = "CardTitle";

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={["p-6 pt-0", className].filter(Boolean).join(" ")} {...props} />
));
CardContent.displayName = "CardContent";

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={["flex items-center p-6 pt-0", className].filter(Boolean).join(" ")} {...props} />
));
CardFooter.displayName = "CardFooter";

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={["text-sm text-muted-foreground", className].filter(Boolean).join(" ")} {...props} />
));
CardDescription.displayName = "CardDescription";

export { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription };
