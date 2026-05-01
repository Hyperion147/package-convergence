"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { ConvergenceEngine } from "../index";
import { ThemeConfig, ThemeKey, OklchColor, ShadowConfig } from "../types";
import { DARK_THEME, DARK_SHADOWS, PRESETS, PRESET_SHADOWS } from "../defaults";
import { convertHexToOklch, convertOklchToHex } from "../utils/color";
import { Input, Label, Button, Select } from "./ui/primitives";
import { Copy, X, ChevronDown } from "lucide-react";

interface ConvergenceProps {
  initialConfig?: ThemeConfig;
  className?: string;
  syncStart?: boolean;
}

const GROUPS = {
  "Brand Colors": [
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "accent",
    "accent-foreground",
  ],
  "Base Colors": ["background", "foreground", "muted", "muted-foreground"],
  "UI Colors": [
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
    "border",
    "input",
    "ring",
    "destructive",
    "destructive-foreground",
  ],
  "Charts & Sidebar": [
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
    "sidebar",
    "sidebar-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
  ],
};

const FONTS = {
  sans: [
    "Inter, sans-serif",
    "Poppins, sans-serif",
    "Roboto, sans-serif",
    "Open Sans, sans-serif",
    "Nunito, sans-serif",
    "Lato, sans-serif",
  ],
  serif: [
    'Georgia, Cambria, "Times New Roman", Times, serif',
    "Merriweather, serif",
    '"Playfair Display", serif',
    "Garamond, serif",
    "Lora, serif",
    '"Cormorant Garamond", serif',
  ],
  mono: [
    'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    '"JetBrains Mono", monospace',
    '"Fira Code", monospace',
    "Courier, monospace",
    '"Source Code Pro", monospace',
    '"Cascadia Code", monospace',
  ],
};

interface TypographyConfig {
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  letterSpacing: string;
}

interface LayoutConfig {
  radius: string;
  borderWidth: string;
  borderStyle: string;
}

/** Shadow token keys in display order */
const SHADOW_KEYS: (keyof ShadowConfig)[] = [
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
];

const COMPONENT_STYLES: Record<string, React.CSSProperties> = {
  wrapperOpen: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    justifyContent: "flex-end",
    pointerEvents: "none",
  },
  panel: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    height: "100dvh",
    backgroundColor: "#18181b", // zinc-950
    borderLeft: "var(--border-width, 1px) var(--border-style, solid) #27272a", // zinc-800
    boxShadow: "-10px 0 40px -15px rgba(0,0,0,0.3)",
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    color: "#f4f4f5", // zinc-100
    boxSizing: "border-box",
  },
  header: {
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "var(--border-width, 1px) var(--border-style, solid) #27272a", // zinc-800
    backgroundColor: "#09090b", // zinc-950
    boxSizing: "border-box",
  },
  content: {
    padding: "20px",
    overflowY: "auto",
    flex: 1,
    backgroundColor: "rgba(9, 9, 11, 0.5)", // zinc-950/50
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxSizing: "border-box",
  },
  triggerButton: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    backgroundColor: "white",
    height: "40px",

    borderRadius: "9999px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "var(--border-width, 1px) var(--border-style, solid) rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s",
    boxSizing: "border-box",
    padding: 0,
    margin: 0,
  },
  buttonClass: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "var(--border-width, 1px) var(--border-style, solid) #27272a", // zinc-800
    borderRadius: "calc(var(--radius, 8px) - 2px)",
    padding: "4px 0",
    gap: "8px",
    height: "36px",
  },
  section: {
    backgroundColor: "#09090b", // zinc-900
    border: "var(--border-width, 1px) var(--border-style, solid) #27272a", // zinc-800
    borderRadius: "var(--radius, 8px)",
    boxSizing: "border-box",
  },
  sectionHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "rgba(24, 24, 27, 0.5)",
    cursor: "pointer",
    border: "none",
    color: "#f4f4f5",
    transition: "background-color 0.2s",
    outline: "none",
    boxSizing: "border-box",
    margin: 0,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px",
  },
  colorPreview: {
    position: "relative",
    width: "40px",
    height: "36px",
    borderRadius: "calc(var(--radius, 8px) - 2px)",
    border: "var(--border-width, 1px) var(--border-style, solid) #27272a",
    overflow: "hidden",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    flexShrink: 0,
    boxSizing: "border-box",
  },
  colorInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    padding: 0,
    margin: 0,
    border: "none",
  },
  selectTrigger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "rgba(24, 24, 27, 0.5)",
    border: "var(--border-width, 1px) var(--border-style, solid) #3f3f46",
    borderRadius: "calc(var(--radius, 8px) - 2px)",
    color: "#e4e4e7",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  selectDropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    backgroundColor: "#18181b",
    border: "var(--border-width, 1px) var(--border-style, solid) #27272a",
    borderRadius: "calc(var(--radius, 8px) - 2px)",
    overflow: "hidden",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
  },
  selectItem: {
    display: "block",
    width: "100%",
    padding: "8px 12px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
    color: "#e4e4e7",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

const getRadiusClass = (rem: number) => {
  if (rem === 0) return "rounded-none";
  if (rem < 0.25) return "rounded-sm";
  if (rem === 0.25) return "rounded";
  if (rem < 0.5) return "rounded-md";
  if (rem === 0.5) return "rounded-lg";
  if (rem <= 0.75) return "rounded-xl";
  if (rem <= 1) return "rounded-2xl";
  if (rem <= 1.5) return "rounded-3xl";
  return "rounded-full";
};

const getBorderWidthClass = (px: number) => {
  if (px === 0) return "border-0";
  if (px === 1) return "border";
  if (px === 2) return "border-2";
  if (px === 4) return "border-4";
  if (px === 8) return "border-8";
  return `border-[${px}px]`;
};

const CustomSelect = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const displayValue = value.split(",")[0].replace(/['"]/g, "");

  const handleOpen = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        ...COMPONENT_STYLES.selectDropdown,
        zIndex: 2147483647,
        maxHeight: "240px",
        overflowY: "auto",
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        style={COMPONENT_STYLES.selectTrigger}
        onClick={handleOpen}
      >
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {displayValue}
        </span>
        <ChevronDown
          size={14}
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        />
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2147483646,
              cursor: "default",
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={dropdownStyle}>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                style={COMPONENT_STYLES.selectItem}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {option.split(",")[0].replace(/['"]/g, "")}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export function Convergence({
  initialConfig = DARK_THEME,
  className,
  syncStart = true,
}: ConvergenceProps) {
  const [theme, setTheme] = useState<ThemeConfig>(initialConfig);
  const [isOpen, setIsOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const presetsTriggerRef = useRef<HTMLButtonElement>(null);
  const [presetsDropdownStyle, setPresetsDropdownStyle] = useState<React.CSSProperties>({});
  const [selectedPreset, setSelectedPreset] =
    useState<string>("Select a preset");
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "layout">("colors");
  const [copied, setCopied] = useState(false);
  const [typography, setTypography] = useState<TypographyConfig>({
    fontSans: "Inter, sans-serif",
    fontSerif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    fontMono:
      'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    letterSpacing: "normal",
  });
  const [layout, setLayout] = useState<LayoutConfig>({
    radius: "0rem",
    borderWidth: "2px",
    borderStyle: "dashed",
  });
  const [shadows, setShadows] = useState<ShadowConfig>(DARK_SHADOWS);

  const engine = useMemo(() => {
    if (typeof window !== "undefined") {
      // If syncing from start, do not auto-apply the default theme overwrites
      return new ConvergenceEngine(initialConfig, { autoApply: !syncStart });
    }
    return null;
  }, [initialConfig, syncStart]);

  useEffect(() => {
    if (syncStart && engine) {
      // Read current CSS variables from the DOM
      const currentTheme = engine.syncFromDom();
      setTheme(currentTheme);

      if (typeof document !== "undefined") {
        const computed = getComputedStyle(document.documentElement);
        setTypography({
          fontSans: computed.getPropertyValue("--font-sans") || FONTS.sans[0],
          fontSerif:
            computed.getPropertyValue("--font-serif") || FONTS.serif[0],
          fontMono: computed.getPropertyValue("--font-mono") || FONTS.mono[0],
          letterSpacing:
            computed.getPropertyValue("--letter-spacing") || "normal",
        });
        setLayout({
          radius: computed.getPropertyValue("--radius") || "0rem",
          borderWidth: computed.getPropertyValue("--border-width") || "2px",
          borderStyle: computed.getPropertyValue("--border-style") || "dashed",
        });

        // Sync shadow tokens from DOM
        const domShadows: Partial<ShadowConfig> = {};
        SHADOW_KEYS.forEach((key) => {
          const val = computed.getPropertyValue(`--${key}`).trim();
          if (val) (domShadows as Record<string, string>)[key] = val;
        });
        if (Object.keys(domShadows).length > 0) {
          setShadows((prev) => ({ ...prev, ...domShadows }));
        }
      }
    }
  }, [engine, syncStart]);

  // Inject global styles for letter spacing force
  useEffect(() => {
    if (typeof document === "undefined") return;

    const styleId = "convergence-global-typography";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      * {
        letter-spacing: var(--letter-spacing) !important;
      }
      body, button, input, select, textarea {
        font-family: var(--font-sans) !important;
      }
      code, pre, kbd, samp, code * {
        font-family: var(--font-mono) !important;
      }

      /* Global Layout Integrations for standard tailwind components */
      .border { border-width: var(--border-width, 2px) !important; border-style: var(--border-style, dashed) !important; }
      .rounded-lg { border-radius: var(--radius, 0rem) !important; }
      .rounded-md, .rounded { border-radius: calc(var(--radius, 0rem) - 2px) !important; }
      .rounded-sm { border-radius: calc(var(--radius, 0rem) - 4px) !important; }
      .rounded-xl { border-radius: calc(var(--radius, 0rem) + 4px) !important; }
      .rounded-2xl { border-radius: calc(var(--radius, 0rem) + 8px) !important; }
      .rounded-3xl { border-radius: calc(var(--radius, 0rem) + 12px) !important; }
    `;
  }, []); // Run once on mount to ensure tag exists, but the var updates naturally

  const loadGoogleFont = (value: string) => {
    if (typeof document === "undefined") return;

    // Extract font name from string like "Poppins, sans-serif" -> "Poppins"
    const fontName = value.split(",")[0].replace(/['"]/g, "").trim();

    // List of known Google Fonts
    const googleFonts = [
      "Inter",
      "Poppins",
      "Roboto",
      "Open Sans",
      "Nunito",
      "Lato",
      "Merriweather",
      "Playfair Display",
      "Lora",
      "Cormorant Garamond",
      "JetBrains Mono",
      "Fira Code",
      "Source Code Pro",
      "Cascadia Code",
    ];

    if (!googleFonts.includes(fontName)) return;

    const linkId = `google-font-${fontName.toLowerCase().replace(/\s+/g, "-")}`;
    if (document.getElementById(linkId)) return;

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      /\s+/g,
      "+",
    )}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  };

  const updateLayout = (key: keyof LayoutConfig, value: string) => {
    setLayout((prev) => ({ ...prev, [key]: value }));
    if (typeof document !== "undefined") {
      const cssVar =
        key === "radius"
          ? "--radius"
          : key === "borderWidth"
            ? "--border-width"
            : "--border-style";
      document.documentElement.style.setProperty(cssVar, value);
    }
  };

  const applyShadowsToDom = (cfg: ShadowConfig) => {
    if (typeof document === "undefined") return;
    SHADOW_KEYS.forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, cfg[key] as string);
    });
  };

  const updateShadow = (key: keyof ShadowConfig, value: string) => {
    setShadows((prev) => {
      const next = { ...prev, [key]: value };
      applyShadowsToDom(next);
      return next;
    });
  };

  const updateTypography = (key: keyof TypographyConfig, value: string) => {
    setTypography((prev) => ({ ...prev, [key]: value }));
    if (typeof document !== "undefined") {
      const cssVar =
        key === "fontSans"
          ? "--font-sans"
          : key === "fontSerif"
            ? "--font-serif"
            : key === "fontMono"
              ? "--font-mono"
              : "--letter-spacing";
      document.documentElement.style.setProperty(cssVar, value);

      if (key !== "letterSpacing") {
        loadGoogleFont(value);
      }
    }
  };

  const updateTheme = useCallback(
    (newTheme: ThemeConfig) => {
      setTheme(newTheme);
      (Object.keys(newTheme) as ThemeKey[]).forEach((key) => {
        engine?.setOklch(key, newTheme[key]);
      });
    },
    [engine],
  );

  const updateColorFromHex = (key: ThemeKey, hex: string) => {
    const oklch = convertHexToOklch(hex);
    const newTheme = { ...theme, [key]: oklch };
    updateTheme(newTheme);
  };

  const updateColorFromOklchString = (key: ThemeKey, str: string) => {
    // Expected format "oklch(L C H)"
    const match = str.match(/oklch\(([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\)/);
    if (match) {
      const [_, l, c, h] = match;
      const newColor = { l: parseFloat(l), c: parseFloat(c), h: parseFloat(h) };
      const newTheme = { ...theme, [key]: newColor };
      updateTheme(newTheme);
    }
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleExport = () => {
    // ── :root color tokens ──────────────────────────────────────────────────
    const colorLines = (Object.entries(theme) as [ThemeKey, OklchColor][])
      .filter(([, v]) => !!v)
      .map(([key, value]) =>
        `--${key}: oklch(${value.l.toFixed(2)} ${value.c.toFixed(2)} ${value.h.toFixed(2)});`
      );

    // ── typography ──────────────────────────────────────────────────────────
    const typographyLines = [
      `--font-sans: ${typography.fontSans};`,
      `--font-serif: ${typography.fontSerif};`,
      `--font-mono: ${typography.fontMono};`,
      `--letter-spacing: ${typography.letterSpacing};`,
    ];

    // ── layout ──────────────────────────────────────────────────────────────
    const layoutLines = [
      `--radius: ${layout.radius};`,
      `--border-width: ${layout.borderWidth};`,
      `--border-style: ${layout.borderStyle};`,
    ];

    // ── shadows ─────────────────────────────────────────────────────────────
    const shadowLines = SHADOW_KEYS.map(
      (key) => `--${key}: ${shadows[key]};`
    );

    // ── @theme inline mapping ────────────────────────────────────────────────
    const themeInlineLines = [
      // colors
      ...colorLines.map((l) => {
        const key = l.split(":")[0].replace("--", "").trim();
        return `--color-${key}: var(--${key});`;
      }),
      // fonts
      "--font-sans: var(--font-sans);",
      "--font-mono: var(--font-mono);",
      "--font-serif: var(--font-serif);",
      // radius scale
      "--radius-sm: calc(var(--radius) - 4px);",
      "--radius-md: calc(var(--radius) - 2px);",
      "--radius-lg: var(--radius);",
      "--radius-xl: calc(var(--radius) + 4px);",
      // shadows
      ...SHADOW_KEYS.map((key) => `--${key}: var(--${key});`),
    ];

    const indent = (lines: string[]) => lines.map((l) => `  ${l}`).join("\n");

    const cssOutput = [
      `:root {`,
      indent([...colorLines, ...typographyLines, ...layoutLines, ...shadowLines]),
      `}`,
      ``,
      `@theme inline {`,
      indent(themeInlineLines),
      `}`,
    ].join("\n");

    navigator.clipboard.writeText(cssOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={COMPONENT_STYLES.triggerButton}
        title="Open Theme Generator"
        className="group hover:scale-105 active:scale-95"
      >
        <span style={{ fontSize: "12px", lineHeight: 1 }}>
          <svg
            fill="#18181b"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            version="1.1"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g id="Paint_Roller">
              <g id="XMLID_244_">
                <path
                  d="M249,297.82c0-31.312-23.952-56.82-55.265-56.82h-57.783C108.485,241,85,218.686,85,191.22v-79.701    c0-26.645,19.797-48.565,45.404-50.647c0.327,0.143,0.596,0.267,0.596,0.375V69h24V34h-24v6.859    c-16,0.755-33.499,8.113-46.028,20.93C71.851,75.211,65,92.872,65,111.519v79.701C65,229.673,97.499,261,135.952,261h57.783    C214.061,261,229,277.494,229,297.82V338h-11v52h45v-52h-14V297.82z"
                  id="XMLID_268_"
                />
                <rect height="99" id="XMLID_275_" width="141" x="240" y="2" />
                <path
                  d="M194.467,101H220V2h-25.533C184.512,2,175,10.029,175,19.985v4.31v53.879v4.31    C175,92.44,184.512,101,194.467,101z"
                  id="XMLID_331_"
                />
                <path
                  d="M429.381,2H400v99h29.381C439.337,101,446,92.44,446,82.485v-62.5C446,10.029,439.337,2,429.381,2z"
                  id="XMLID_355_"
                />
                <path
                  d="M387.628,121H304v59.545c0,9.361,8.256,16.977,17.595,16.977c9.339,0,17.266-7.616,17.266-16.977    c0-5.502,4.068-9.963,9.57-9.963c5.502,0,9.57,4.46,9.57,9.963v32.328c0,9.361,7.161,16.977,16.5,16.977s16.5-7.616,16.5-16.977    v-91.442c0,0.033,0.334,0.318-0.002,0.318C389.43,121.749,388.948,122,387.628,121z"
                  id="XMLID_356_"
                />
                <path
                  d="M218,487.658c0,12.333,10.168,22.365,22.499,22.365c12.333,0,22.501-10.033,22.501-22.365V410h-45    V487.658z"
                  id="XMLID_357_"
                />
              </g>
            </g>
          </svg>
        </span>
      </button>
    );
  }

  return (
    <div style={COMPONENT_STYLES.wrapperOpen} className={className || ""}>
      <div onClick={() => setIsOpen(false)} />
      <div style={COMPONENT_STYLES.panel}>
        {/* Header */}
        <div style={COMPONENT_STYLES.header}>
          <span
            style={{
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "-0.01em",
            }}
          >
            Convergence UI
          </span>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              color: "#a1a1aa",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X />
          </button>
        </div>

        {/* Actions Area */}
        <div style={COMPONENT_STYLES.content}>
          <div style={{ position: "relative" }}>
            <Button
              style={COMPONENT_STYLES.buttonClass}
              variant="outline"
              onClick={handleExport}
            >
              <Copy size={16} /> Copy CSS Variables
            </Button>
            {copied && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: "90%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#27272a",
                  color: "#f4f4f5",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 500,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  zIndex: 20,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Copied 🎉
              </div>
            )}
          </div>

          {/* Presets */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              position: "relative",
            }}
          >
            <Label>Presets</Label>

            <button
              ref={presetsTriggerRef}
              style={COMPONENT_STYLES.selectTrigger}
              onClick={() => {
                if (!presetsOpen && presetsTriggerRef.current) {
                  const rect = presetsTriggerRef.current.getBoundingClientRect();
                  setPresetsDropdownStyle({
                    position: "fixed",
                    top: `${rect.bottom + 4}px`,
                    left: `${rect.left}px`,
                    width: `${rect.width}px`,
                    backgroundColor: "#18181b",
                    border: "var(--border-width, 1px) var(--border-style, solid) #27272a",
                    borderRadius: "calc(var(--radius, 8px) - 2px)",
                    overflow: "hidden",
                    zIndex: 2147483647,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    maxHeight: "240px",
                    overflowY: "auto",
                  });
                }
                setPresetsOpen(!presetsOpen);
              }}
            >
              <span>{selectedPreset}</span>
              <ChevronDown
                size={14}
                style={{
                  transform: presetsOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {presetsOpen && (
              <>
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 2147483646 }}
                  onClick={() => setPresetsOpen(false)}
                />
                <div style={presetsDropdownStyle}>
                  {Object.entries(PRESETS).map(([name, config]) => (
                    <button
                      key={name}
                      onClick={() => {
                        updateTheme(config);
                        setSelectedPreset(name);
                        // Apply matching shadow preset
                        const presetShadow = PRESET_SHADOWS[name];
                        if (presetShadow) {
                          setShadows(presetShadow);
                          applyShadowsToDom(presetShadow);
                        }
                        setPresetsOpen(false);
                      }}
                      style={COMPONENT_STYLES.selectItem}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              padding: "4px",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              gap: "4px",
            }}
          >
            <button
              onClick={() => setActiveTab("colors")}
              style={{
                flex: 1,
                padding: "4px 0",
                fontSize: "12px",
                fontWeight: 500,
                backgroundColor:
                  activeTab === "colors" ? "#09090b" : "transparent",
                borderRadius: "6px",
                color: activeTab === "colors" ? "#f4f4f5" : "#a1a1aa",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Colors
            </button>
            <button
              onClick={() => setActiveTab("typography")}
              style={{
                flex: 1,
                padding: "4px 0",
                fontSize: "12px",
                fontWeight: 500,
                backgroundColor:
                  activeTab === "typography" ? "#09090b" : "transparent",
                borderRadius: "6px",
                color: activeTab === "typography" ? "#f4f4f5" : "#a1a1aa",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Typography
            </button>
            <button
              onClick={() => setActiveTab("layout")}
              style={{
                flex: 1,
                padding: "4px 0",
                fontSize: "12px",
                fontWeight: 500,
                backgroundColor:
                  activeTab === "layout" ? "#09090b" : "transparent",
                borderRadius: "6px",
                color: activeTab === "layout" ? "#f4f4f5" : "#a1a1aa",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Layout
            </button>
          </div>

          {/* Typography Content */}
          {activeTab === "typography" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={COMPONENT_STYLES.section}>
                <div style={COMPONENT_STYLES.sectionHeader}>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    Fonts & Spacing
                  </span>
                </div>
                <div
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <Label>Sans-Serif Font</Label>
                    <CustomSelect
                      value={typography.fontSans}
                      options={FONTS.sans}
                      onChange={(val) => updateTypography("fontSans", val)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Serif Font</Label>
                    <CustomSelect
                      value={typography.fontSerif}
                      options={FONTS.serif}
                      onChange={(val) => updateTypography("fontSerif", val)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Monospace Font</Label>
                    <CustomSelect
                      value={typography.fontMono}
                      options={FONTS.mono}
                      onChange={(val) => updateTypography("fontMono", val)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Label>Letter Spacing</Label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center", // Fixed alignment
                          gap: "8px",
                        }}
                      >
                        <Input
                          value={
                            typography.letterSpacing === "normal"
                              ? "0"
                              : parseFloat(typography.letterSpacing).toString()
                          }
                          onChange={(e) =>
                            updateTypography(
                              "letterSpacing",
                              `${e.target.value}px`,
                            )
                          }
                          style={{
                            width: "60px",
                            height: "28px",
                            padding: "0 8px",
                          }}
                        />
                        <span style={{ fontSize: "12px", color: "#a1a1aa" }}>
                          px
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="-2"
                      max="10"
                      step="0.1"
                      value={
                        typography.letterSpacing === "normal"
                          ? 0
                          : parseFloat(typography.letterSpacing) || 0
                      }
                      onChange={(e) =>
                        updateTypography("letterSpacing", `${e.target.value}px`)
                      }
                      style={{
                        width: "100%",
                        accentColor: "white",
                        height: "4px", // Slightly thicker for better visibility
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layout Content */}
          {activeTab === "layout" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={COMPONENT_STYLES.section}>
                <div style={COMPONENT_STYLES.sectionHeader}>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    Borders & Spacing
                  </span>
                </div>                <div
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Label>Border Radius</Label>
                        <span
                          style={{
                            fontSize: "10px",
                            backgroundColor: "#27272a",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            color: "#a1a1aa",
                            fontFamily: "monospace"
                          }}
                        >
                          {getRadiusClass(parseFloat(layout.radius) || 0)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Input
                          value={parseFloat(layout.radius) || 0}
                          onChange={(e) =>
                            updateLayout("radius", `${e.target.value}rem`)
                          }
                          style={{
                            width: "60px",
                            height: "28px",
                            padding: "0 8px",
                          }}
                        />
                        <span style={{ fontSize: "12px", color: "#a1a1aa" }}>
                          rem
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={parseFloat(layout.radius) || 0}
                      onChange={(e) =>
                        updateLayout("radius", `${e.target.value}rem`)
                      }
                      style={{
                        width: "100%",
                        accentColor: "white",
                        height: "4px",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Label>Border Width</Label>
                        <span
                          style={{
                            fontSize: "10px",
                            backgroundColor: "#27272a",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            color: "#a1a1aa",
                            fontFamily: "monospace"
                          }}
                        >
                          {getBorderWidthClass(parseFloat(layout.borderWidth) || 0)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Input
                          value={parseFloat(layout.borderWidth) || 0}
                          onChange={(e) =>
                            updateLayout("borderWidth", `${e.target.value}px`)
                          }
                          style={{
                            width: "60px",
                            height: "28px",
                            padding: "0 8px",
                          }}
                        />
                        <span style={{ fontSize: "12px", color: "#a1a1aa" }}>
                          px
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={parseFloat(layout.borderWidth) || 0}
                      onChange={(e) =>
                        updateLayout("borderWidth", `${e.target.value}px`)
                      }
                      style={{
                        width: "100%",
                        accentColor: "white",
                        height: "4px",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Label>Border Style</Label>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        padding: "4px",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: "8px",
                        gap: "4px",
                      }}
                    >
                      {["solid", "dashed", "dotted"].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateLayout("borderStyle", style)}
                          style={{
                            flex: 1,
                            padding: "6px 0",
                            fontSize: "12px",
                            fontWeight: 500,
                            backgroundColor:
                              layout.borderStyle === style ? "#09090b" : "transparent",
                            borderRadius: "6px",
                            color: layout.borderStyle === style ? "#f4f4f5" : "#a1a1aa",
                            border: layout.borderStyle === style ? "1px solid #27272a" : "1px solid transparent",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            textTransform: "capitalize"
                          }}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shadows */}
              <div style={COMPONENT_STYLES.section}>
                <div style={COMPONENT_STYLES.sectionHeader}>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    Shadows
                  </span>
                </div>
                <div
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {/* Shadow color picker */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Label>Shadow Color</Label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div
                        style={{
                          ...COMPONENT_STYLES.colorPreview,
                          background: `oklch(${shadows["shadow-color"].l} ${shadows["shadow-color"].c} ${shadows["shadow-color"].h})`,
                        }}
                      >
                        <input
                          type="color"
                          value={convertOklchToHex(shadows["shadow-color"])}
                          onChange={(e) => {
                            const oklch = convertHexToOklch(e.target.value);
                            const sc = { ...oklch, a: shadows["shadow-color"].a };
                            const sv = (a: number) =>
                              `oklch(${sc.l.toFixed(2)} ${sc.c.toFixed(2)} ${sc.h.toFixed(2)} / ${a})`;
                            const next: ShadowConfig = {
                              "shadow-color": sc,
                              "shadow-2xs": `0 1px 3px 0px ${sv(0.05)}`,
                              "shadow-xs":  `0 1px 3px 0px ${sv(0.05)}`,
                              "shadow-sm":  `0 1px 3px 0px ${sv(0.10)}, 0 1px 2px -1px ${sv(0.10)}`,
                              "shadow":     `0 1px 3px 0px ${sv(0.10)}, 0 1px 2px -1px ${sv(0.10)}`,
                              "shadow-md":  `0 1px 3px 0px ${sv(0.10)}, 0 2px 4px -1px ${sv(0.10)}`,
                              "shadow-lg":  `0 1px 3px 0px ${sv(0.10)}, 0 4px 6px -1px ${sv(0.10)}`,
                              "shadow-xl":  `0 1px 3px 0px ${sv(0.10)}, 0 8px 10px -1px ${sv(0.10)}`,
                              "shadow-2xl": `0 1px 3px 0px ${sv(0.25)}`,
                            };
                            setShadows(next);
                            applyShadowsToDom(next);
                          }}
                          style={COMPONENT_STYLES.colorInput}
                        />
                      </div>
                      <span style={{ fontSize: "12px", color: "#a1a1aa" }}>
                        Regenerates all shadow tokens
                      </span>
                    </div>
                  </div>

                  {/* Individual shadow token editors */}
                  {SHADOW_KEYS.map((key) => (
                    <div key={key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Label style={{ marginBottom: 0 }}>
                          <code style={{ fontFamily: "monospace", fontSize: "12px" }}>--{key}</code>
                        </Label>
                        {/* Live shadow preview swatch */}
                        <div
                          style={{
                            width: "32px",
                            height: "20px",
                            borderRadius: "4px",
                            backgroundColor: "#f4f4f5",
                            boxShadow: shadows[key] as string,
                            border: "1px solid #3f3f46",
                            flexShrink: 0,
                          }}
                        />
                      </div>
                      <Input
                        value={shadows[key] as string}
                        onChange={(e) => updateShadow(key, e.target.value)}
                        style={{
                          fontFamily: "monospace",
                          fontSize: "11px",
                          height: "32px",
                          backgroundColor: "rgba(9, 9, 11, 0.5)",
                          color: "#a1a1aa",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Colors List */}
          {activeTab === "colors" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {Object.entries(GROUPS).map(([groupName, keys]) => {
                const isCollapsed = collapsedGroups[groupName];
                return (
                  <div key={groupName} style={COMPONENT_STYLES.section}>
                    <button
                      onClick={() => toggleGroup(groupName)}
                      style={COMPONENT_STYLES.sectionHeader}
                    >
                      <span style={{ fontWeight: 600, fontSize: "14px" }}>
                        {groupName}
                      </span>
                      <span
                        style={{
                          transition: "transform 0.2s",
                          transform: isCollapsed
                            ? "rotate(0deg)"
                            : "rotate(180deg)",
                          color: "#a1a1aa",
                          display: "flex",
                        }}
                      >
                        <ChevronDown />
                      </span>
                    </button>

                    {!isCollapsed && (
                      <div
                        style={{
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "24px",
                        }}
                      >
                        {keys.map((key) => {
                          const themeKey = key as ThemeKey;
                          const color = theme[themeKey];
                          if (!color) return null;
                          const hexValue = convertOklchToHex(color);
                          const oklchString = `oklch(${color.l.toFixed(
                            2,
                          )} ${color.c.toFixed(2)} ${color.h.toFixed(2)})`;

                          return (
                            <div
                              key={key}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              <div style={COMPONENT_STYLES.row}>
                                <span
                                  style={{
                                    fontWeight: 500,
                                    textTransform: "capitalize",
                                    color: "#e4e4e7",
                                  }}
                                >
                                  {key.replace(/-/g, " ")}
                                </span>
                                <span
                                  style={{
                                    fontFamily: "monospace",
                                    color: "#a1a1aa",
                                  }}
                                >
                                  {hexValue}
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <div style={COMPONENT_STYLES.colorPreview}>
                                  <div
                                    style={{
                                      position: "absolute",
                                      inset: 0,
                                      backgroundColor: hexValue,
                                    }}
                                  />
                                  <input
                                    type="color"
                                    value={hexValue}
                                    onChange={(e) =>
                                      updateColorFromHex(
                                        themeKey,
                                        e.target.value,
                                      )
                                    }
                                    style={COMPONENT_STYLES.colorInput}
                                  />
                                </div>
                                <Input
                                  value={oklchString}
                                  onChange={(e) =>
                                    updateColorFromOklchString(
                                      themeKey,
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    fontFamily: "monospace",
                                    fontSize: "12px",
                                    height: "36px",
                                    backgroundColor: "rgba(9, 9, 11, 0.5)",
                                    color: "#a1a1aa",
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
