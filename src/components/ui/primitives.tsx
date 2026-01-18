import React, { forwardRef } from "react";

const STYLES = {
  input: {
    display: "flex !important",
    boxSizing: "border-box !important",
    height: "36px !important",
    width: "100% !important",
    borderRadius: "6px !important",
    border: "1px solid #3f3f46 !important", // zinc-700
    backgroundColor: "rgba(24, 24, 27, 0.5) !important", // zinc-950/50
    padding: "4px 12px !important",
    fontSize: "14px !important",
    lineHeight: "20px !important",
    color: "#e4e4e7 !important", // zinc-200
    outline: "none !important",
    fontFamily: "ui-sans-serif, system-ui, sans-serif !important",
    margin: "0 !important",
  },
  button: {
    base: {
      display: "inline-flex !important",
      boxSizing: "border-box !important",
      alignItems: "center !important",
      justifyContent: "center !important",
      whiteSpace: "nowrap !important",
      borderRadius: "6px !important",
      fontSize: "14px !important",
      lineHeight: "20px !important",
      fontWeight: "500 !important",
      height: "36px !important",
      padding: "0 16px !important",
      cursor: "pointer !important",
      transition: "all 0.2s !important",
      outline: "none !important",
      fontFamily: "ui-sans-serif, system-ui, sans-serif !important",
      margin: "0 !important",
      textTransform: "none !important",
    },
    default: {
      backgroundColor: "#fafafa !important", // zinc-50
      color: "#18181b !important", // zinc-900
      border: "none !important",
    },
    outline: {
      backgroundColor: "transparent !important",
      border: "1px solid #3f3f46 !important",
      color: "#e4e4e7 !important",
    },
    ghost: {
      backgroundColor: "transparent !important",
      border: "none !important",
      color: "#e4e4e7 !important",
    },
    icon: {
      height: "36px !important",
      width: "36px !important",
      padding: "0 !important",
    },
  },
  label: {
    fontSize: "14px !important",
    lineHeight: "20px !important",
    fontWeight: "500 !important",
    color: "#e4e4e7 !important",
    marginBottom: "4px !important",
    display: "block !important",
    fontFamily: "ui-sans-serif, system-ui, sans-serif !important",
  },
} as const;

export const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, style, ...props }, ref) => (
  <label
    ref={ref}
    // @ts-ignore
    style={{ ...STYLES.label, ...style }}
    className={className}
    {...props}
  />
));
Label.displayName = "Label";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, style, ...props }, ref) => {
  return (
    <input
      // @ts-ignore
      style={{ ...STYLES.input, ...style }}
      className={className}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost" | "icon";
  }
>(({ className, variant = "default", style, ...props }, ref) => {
  const variantStyles =
    variant === "icon"
      ? { ...STYLES.button.base, ...STYLES.button.ghost, ...STYLES.button.icon }
      : { ...STYLES.button.base, ...STYLES.button[variant] };

  return (
    <button
      ref={ref}
      // @ts-ignore
      style={{ ...variantStyles, ...style }}
      className={className}
      {...props}
    />
  );
});
Button.displayName = "Button";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, style, ...props }, ref) => {
  return (
    <select
      ref={ref}
      // @ts-ignore
      style={{ ...STYLES.input, cursor: "pointer", ...style }}
      className={className}
      {...props}
    />
  );
});
Select.displayName = "Select";
