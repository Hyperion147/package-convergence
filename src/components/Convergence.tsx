"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { ConvergenceEngine } from "../index";
import { ThemeConfig, ThemeKey, OklchColor } from "../types";
import { DARK_THEME, PRESETS } from "../defaults";
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
  ],
  serif: [
    'Georgia, Cambria, "Times New Roman", Times, serif',
    "Merriweather, serif",
    '"Playfair Display", serif',
    "Garamond, serif",
  ],
  mono: [
    'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    '"JetBrains Mono", monospace',
    '"Fira Code", monospace',
    "Courier, monospace",
  ],
};

interface TypographyConfig {
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  letterSpacing: string;
}

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
    borderLeft: "1px solid #27272a", // zinc-800
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
    borderBottom: "1px solid #27272a", // zinc-800
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
    border: "1px solid rgba(255,255,255,0.1)",
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
    border: "1px solid #27272a", // zinc-800
    padding: "4px 0",
    gap: "8px",
    height: "36px",
  },
  section: {
    backgroundColor: "#09090b", // zinc-900
    border: "1px solid #27272a", // zinc-800
    borderRadius: "8px",
    overflow: "hidden",
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
    borderRadius: "6px",
    border: "1px solid #27272a",
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
    border: "1px solid #3f3f46",
    borderRadius: "6px",
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
    border: "1px solid #27272a",
    borderRadius: "6px",
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
  const [selectedPreset, setSelectedPreset] =
    useState<string>("Select a preset");
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [activeTab, setActiveTab] = useState<"colors" | "typography">("colors");
  const [typography, setTypography] = useState<TypographyConfig>({
    fontSans: "Inter, sans-serif",
    fontSerif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    fontMono:
      'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    letterSpacing: "normal",
  });

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
      "Merriweather",
      "Playfair Display",
      "JetBrains Mono",
      "Fira Code",
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
    const cssLines = (Object.entries(theme) as [ThemeKey, OklchColor][]).map(
      ([key, value]) => {
        if (!value) return "";
        return `  --${key}: oklch(${value.l.toFixed(4)} ${value.c.toFixed(
          4,
        )} ${value.h.toFixed(3)});`;
      },
    );

    const typographyLines = Object.entries(typography).map(([key, value]) => {
      const cssVar =
        key === "fontSans"
          ? "--font-sans"
          : key === "fontSerif"
            ? "--font-serif"
            : key === "fontMono"
              ? "--font-mono"
              : "--letter-spacing";
      return `  ${cssVar}: ${value};`;
    });

    const cssOutput = `:root {\n${[
      ...cssLines.filter(Boolean),
      ...typographyLines,
    ].join("\n")}\n}`;
    navigator.clipboard.writeText(cssOutput).then(() => {
      alert("Copied to clipboard!");
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
            Theme Generator
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
          <Button
            style={COMPONENT_STYLES.buttonClass}
            variant="outline"
            onClick={handleExport}
          >
            <Copy size={16} /> Copy CSS Variables
          </Button>

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
              style={COMPONENT_STYLES.selectTrigger}
              onClick={() => setPresetsOpen(!presetsOpen)}
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
                  style={{ position: "fixed", inset: 0, zIndex: 9 }}
                  onClick={() => setPresetsOpen(false)}
                />
                <div style={COMPONENT_STYLES.selectDropdown}>
                  {Object.entries(PRESETS).map(([name, config]) => (
                    <button
                      key={name}
                      onClick={() => {
                        updateTheme(config);
                        setSelectedPreset(name);
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
