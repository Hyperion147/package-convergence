import React, { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

const UI_FONT =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const mergeStyles = (
  ...styles: Array<React.CSSProperties | undefined>
): React.CSSProperties => Object.assign({}, ...styles);

const baseControl: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.10)",
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "#f4f4f5",
  fontFamily: UI_FONT,
  fontSize: "14px",
  lineHeight: "20px",
  outline: "none",
  transition: "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
};

export const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, style, ...props }, ref) => (
  <label
    ref={ref}
    className={className}
    style={mergeStyles(
      {
        display: "block",
        marginBottom: "6px",
        fontSize: "12px",
        lineHeight: "16px",
        fontWeight: 600,
        color: "#d4d4d8",
        fontFamily: UI_FONT,
      },
      style,
    )}
    {...props}
  />
));
Label.displayName = "Label";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, style, ...props }, ref) => (
  <input
    ref={ref}
    className={className}
    style={mergeStyles(
      baseControl,
      {
        height: "38px",
        padding: "0 12px",
      },
      style,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, style, ...props }, ref) => (
  <textarea
    ref={ref}
    className={["convergence-scroll-area", className].filter(Boolean).join(" ")}
    style={mergeStyles(
      baseControl,
      {
        minHeight: "132px",
        padding: "10px 12px",
        resize: "vertical",
      },
      style,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "default" | "icon";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>(({ className, variant = "default", size = "default", style, disabled, ...props }, ref) => {
  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    default: {
      backgroundColor: "#fafafa",
      color: "#09090b",
      border: "1px solid #fafafa",
    },
    secondary: {
      backgroundColor: "rgba(255,255,255,0.08)",
      color: "#f4f4f5",
      border: "1px solid rgba(255,255,255,0.08)",
    },
    outline: {
      backgroundColor: "transparent",
      color: "#f4f4f5",
      border: "1px solid rgba(255,255,255,0.10)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "#d4d4d8",
      border: "1px solid transparent",
    },
  };

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: {
      height: "32px",
      padding: "0 12px",
      fontSize: "12px",
    },
    default: {
      height: "38px",
      padding: "0 14px",
      fontSize: "13px",
    },
    icon: {
      width: "38px",
      height: "38px",
      padding: 0,
    },
  };

  return (
    <button
      ref={ref}
      className={className}
      style={mergeStyles(
        {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
          lineHeight: 1,
          fontFamily: UI_FONT,
          transition: "background-color 160ms ease, border-color 160ms ease, color 160ms ease",
          whiteSpace: "nowrap",
          opacity: disabled ? 0.45 : 1,
          pointerEvents: disabled ? "none" : undefined,
        },
        variantStyles[variant],
        sizeStyles[size],
        style,
      )}
      disabled={disabled}
      {...props}
    />
  );
});
Button.displayName = "Button";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef<
  HTMLButtonElement,
  SelectPrimitive.SelectTriggerProps & { style?: React.CSSProperties }
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    style={mergeStyles(
      baseControl,
      {
        height: "38px",
        padding: "0 12px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        cursor: "pointer",
      },
      style,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown size={16} color="#a1a1aa" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export function SelectContent({
  children,
  style,
  position = "popper",
  ...props
}: SelectPrimitive.SelectContentProps & { style?: React.CSSProperties }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={6}
        style={mergeStyles(
          {
            zIndex: 10000,
            minWidth: "var(--radix-select-trigger-width)",
            overflow: "hidden",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.10)",
            backgroundColor: "#09090b",
            color: "#f4f4f5",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          },
          style,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport style={{ padding: "6px" }}>
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export const SelectItem = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps & { style?: React.CSSProperties }
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    style={mergeStyles(
      {
        position: "relative",
        display: "flex",
        width: "100%",
        alignItems: "center",
        borderRadius: "6px",
        padding: "8px 10px 8px 34px",
        fontSize: "13px",
        lineHeight: "18px",
        color: "#f4f4f5",
        cursor: "pointer",
        userSelect: "none",
        outline: "none",
      },
      style,
    )}
    {...props}
  >
    <span
      style={{
        position: "absolute",
        left: "10px",
        display: "inline-flex",
        width: "16px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SelectPrimitive.ItemIndicator>
        <Check size={14} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={mergeStyles(
        {
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "#0f0f12",
          color: "#f4f4f5",
        },
        style,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <div style={mergeStyles({ padding: "14px 14px 0" }, style)}>{children}</div>;
}

export function CardTitle({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={mergeStyles(
        {
          fontSize: "14px",
          fontWeight: 700,
          color: "#fafafa",
          fontFamily: UI_FONT,
        },
        style,
      )}
    >
      {children}
    </div>
  );
}

export function CardDescription({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={mergeStyles(
        {
          marginTop: "4px",
          fontSize: "12px",
          lineHeight: 1.45,
          color: "#a1a1aa",
          fontFamily: UI_FONT,
        },
        style,
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <div style={mergeStyles({ padding: "14px" }, style)}>{children}</div>;
}

export function Badge({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={mergeStyles(
        {
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          minHeight: "22px",
          padding: "0 8px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "rgba(255,255,255,0.05)",
          color: "#d4d4d8",
          fontSize: "11px",
          fontWeight: 700,
          fontFamily: UI_FONT,
        },
        style,
      )}
    >
      {children}
    </span>
  );
}

export function Separator({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={mergeStyles(
        {
          width: "100%",
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.08)",
        },
        style,
      )}
    />
  );
}
