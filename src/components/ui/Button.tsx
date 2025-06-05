// Button.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

// Simple SVG Spinner
const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={twMerge("animate-spin h-5 w-5", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// ChevronDown Icon for Dropdown variant
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={twMerge("h-5 w-5", className)}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

type ButtonVariant =
  | "primaryHorizontalGradient" // Purple L-R gradient (Fetch Data, Performance Metrics)
  | "primarySolid" // Solid Purple (Save Changes)
  | "secondary" // White bg, purple text/border (View Complaints)
  | "successHoriZontalGradient" // Green T-B gradient ( Track)
  | "successSolidGradient" // Solid Green (Edit, Active Riders)
  | "successSolid" //Resolved
  | "dangerSolid" // Solid Red (Reject)
  | "infoSolid" // Solid Blue (Re-Assign)
  | "ghost" // Transparent, themed text (Preview)
  | "customLocation" // Special light green bg, purple text (Location)
  | "dropdown"; // Purple L-R gradient, text left, chevron right (Select Category)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right"; // For dropdown, icon is always right.
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primaryHorizontalGradient",
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  loadingText = "Loading...",
  className = "",
  disabled,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-poppins font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-px";

  // Default shadow for most prominent buttons
  const defaultShadow =
    "shadow-[0_2px_4px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),0_2px_3px_rgba(0,0,0,0.08)] active:shadow-[0_1px_2px_rgba(0,0,0,0.1)]";
  // Lighter shadow for secondary/customLocation
  const lighterShadow = "shadow-sm hover:shadow-md";

  const variantStyles: Record<ButtonVariant, string> = {
    primaryHorizontalGradient: `text-white bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)]  hover:from-[var(--gradient-purple-hover-start)] hover:to-[var(--gradient-purple-hover-end)] focus:ring-0  ${defaultShadow} justify-center`,
    primarySolid: `bg-primary text-white hover:bg-[linear-gradient(92.43deg,#862874_2.04%,#20091C_148.13%)] focus:ring-primary ${defaultShadow} justify-center`,
    secondary: `bg-white text-[var(--button-secondary-text)] border hover:bg-[#FEF4FC] [border:linear-gradient(92.19deg,#5D034C_27.59%,#D003AB_134.39%)_1] focus:ring-primary ${lighterShadow} justify-center`,
    successHoriZontalGradient: `bg-gradient-to-r from-[var(--gradient-green-start)] to-[var(--gradient-green-end)] text-success-foreground hover:from-[var(--gradient-green-hover-start)] hover:to-[var(--gradient-green-hover-end)] focus:ring-success ${defaultShadow} justify-center`,
    successSolidGradient: `bg-gradient-to-l from-[var(--gradient-green-start)] to-[var(--gradient-green-end)] text-success-foreground hover:from-[var(--gradient-green-hover-start)] hover:to-[var(--gradient-green-hover-end)] focus:ring-success ${defaultShadow} justify-center`,
    dangerSolid: `bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive ${defaultShadow} justify-center`,
    infoSolid: `bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 ${defaultShadow} justify-center`,
    ghost: `bg-primary/20 text-primary hover:bg-primary/10 focus:ring-primary shadow-none active:translate-y-0 justify-center`,
    customLocation: `bg-green-100 text-primary hover:bg-green-200 focus:ring-primary font-semibold ${lighterShadow} justify-center`,
    dropdown: `bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] text-primary-foreground hover:from-[var(--gradient-purple-hover-start)] hover:to-[var(--gradient-purple-hover-end)] focus:ring-primary ${defaultShadow} justify-between w-full`,
    successSolid: `bg-green-700 text-white hover:bg-blue-700 focus:ring-blue-500 ${defaultShadow} justify-center`,
  };

  const widthStyles = fullWidth && variant !== "dropdown" ? "w-full" : ""; // Dropdown handles its own fullWidth
  const actualDisabled = disabled || isLoading;

  const mergedClassName = twMerge(
    baseStyles,
    variantStyles[variant],
    widthStyles,
    isLoading && "cursor-wait opacity-75",
    className
  );

  const finalIcon = variant === "dropdown" ? <ChevronDownIcon /> : icon;
  const finalIconPosition = variant === "dropdown" ? "right" : iconPosition;

  const content = (
    <>
      {finalIcon && finalIconPosition === "left" && (
        <span className={children ? "mr-2" : ""}>{finalIcon}</span>
      )}
      {children}
      {finalIcon && finalIconPosition === "right" && (
        <span className={children ? "ml-2" : ""}>{finalIcon}</span>
      )}
    </>
  );

  return (
    <button
      type={type}
      className={mergedClassName}
      disabled={actualDisabled}
      aria-busy={isLoading || undefined}
      aria-haspopup={variant === "dropdown" ? "listbox" : undefined} // For accessibility of dropdown
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2" />
          {loadingText}
        </>
      ) : (
        content
      )}
    </button>
  );
};

export default Button;
