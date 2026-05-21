"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  FolderOpen,
  Layers,
  Palette,
  RotateCcw,
  RotateCw,
  Save,
  ShieldCheck,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import {
  AccessibilityReport,
  ConvergenceExportFormat,
  LayoutConfig,
  OklchColor,
  ShadowConfig,
  ThemeConfig,
  ThemeDefinition,
  ThemeKey,
  TypographyConfig,
} from "../types";
import { DEFAULT_THEME_DEFINITION, PRESETS, PRESET_SHADOWS } from "../defaults";
import { ConvergenceEngine } from "../core/engine";
import { scoreThemeAccessibility } from "../core/accessibility";
import { importThemeDefinition } from "../core/exporters";
import { SHADOW_KEYS } from "../core/constants";
import { convertHexToOklch, convertOklchToHex } from "../utils/color";
import { ConvergenceMark } from "./ConvergenceMark";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "./ui/primitives";

interface ConvergenceProps {
  initialConfig?: ThemeConfig;
  initialDefinition?: ThemeDefinition;
  className?: string;
  syncStart?: boolean;
}

const GROUPS: Array<{
  name: string;
  description: string;
  keys: ThemeKey[];
}> = [
  {
    name: "Brand",
    description: "Primary, secondary, and accent actions.",
    keys: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
    ],
  },
  {
    name: "Base",
    description: "Canvas and text tokens.",
    keys: ["background", "foreground", "muted", "muted-foreground"],
  },
  {
    name: "Surface",
    description: "Cards, forms, borders, rings, and alerts.",
    keys: [
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
  },
  {
    name: "Product",
    description: "Charts and sidebar surfaces.",
    keys: [
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
  },
];

const FONT_OPTIONS = {
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
    "Lora, serif",
    "Garamond, serif",
  ],
  mono: [
    'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    '"JetBrains Mono", monospace',
    '"Fira Code", monospace',
    '"Source Code Pro", monospace',
    '"Cascadia Code", monospace',
  ],
};

const EXPORT_OPTIONS: Array<{ label: string; value: ConvergenceExportFormat }> = [
  { label: "Tailwind v4", value: "tailwind-v4" },
  { label: "JSON", value: "json" },
];

const TABS = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Type", icon: Type },
  { id: "layout", label: "Layout", icon: Layers },
  { id: "accessibility", label: "QA", icon: ShieldCheck },
  { id: "import", label: "Import", icon: Upload },
  { id: "saved", label: "Saved", icon: FolderOpen },
] as const;

type Tab = (typeof TABS)[number]["id"];

type SavedWorkspace = {
  id: string;
  name: string;
  definition: ThemeDefinition;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "convergence-ui.workspaces.v1";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const readSavedWorkspaces = (): SavedWorkspace[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedWorkspace[]) : [];
  } catch {
    return [];
  }
};

const writeSavedWorkspaces = (workspaces: SavedWorkspace[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
};

const buildInitialDefinition = (
  initialDefinition?: ThemeDefinition,
  initialConfig?: ThemeConfig,
): ThemeDefinition => {
  if (initialDefinition) {
    return clone(initialDefinition);
  }

  const next = clone(DEFAULT_THEME_DEFINITION);
  if (initialConfig) {
    next.themes.light = clone(initialConfig);
  }
  return next;
};

const parseOklchString = (input: string): OklchColor | null => {
  const match = input.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/i);
  if (!match) {
    return null;
  }

  return {
    l: Number.parseFloat(match[1]),
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
  };
};

const oklch = (color: OklchColor) =>
  `oklch(${color.l.toFixed(4)} ${color.c.toFixed(4)} ${color.h.toFixed(3)})`;

const loadGoogleFont = (value: string) => {
  if (typeof document === "undefined") {
    return;
  }

  const fontName = value.split(",")[0].replace(/['"]/g, "").trim();
  const knownFonts = new Set([
    "Inter",
    "Poppins",
    "Roboto",
    "Open Sans",
    "Nunito",
    "Lato",
    "Merriweather",
    "Playfair Display",
    "Lora",
    "JetBrains Mono",
    "Fira Code",
    "Source Code Pro",
    "Cascadia Code",
  ]);

  if (!knownFonts.has(fontName)) {
    return;
  }

  const linkId = `convergence-font-${fontName.toLowerCase().replace(/\s+/g, "-")}`;
  if (document.getElementById(linkId)) {
    return;
  }

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
};

const ensureGlobalBridgeStyles = () => {
  if (typeof document === "undefined") {
    return;
  }

  const styleId = "convergence-global-bridge";
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.innerHTML = `
    * { letter-spacing: var(--letter-spacing, 0px); }
    body, button, input, select, textarea { font-family: var(--font-sans) !important; }
    code, pre, kbd, samp { font-family: var(--font-mono) !important; }
    .convergence-scroll-area {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .convergence-scroll-area::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }
    .border { border-width: var(--border-width, 1px) !important; border-style: var(--border-style, solid) !important; }
    .rounded-sm { border-radius: calc(var(--radius, 0.75rem) - 4px) !important; }
    .rounded, .rounded-md { border-radius: calc(var(--radius, 0.75rem) - 2px) !important; }
    .rounded-lg { border-radius: var(--radius, 0.75rem) !important; }
    .rounded-xl { border-radius: calc(var(--radius, 0.75rem) + 4px) !important; }
    .rounded-2xl { border-radius: calc(var(--radius, 0.75rem) + 8px) !important; }
  `;
};

function ColorRow({
  themeKey,
  color,
  onHexChange,
  onOklchChange,
}: {
  themeKey: ThemeKey;
  color: OklchColor;
  onHexChange: (hex: string) => void;
  onOklchChange: (value: string) => void;
}) {
  const hexValue = convertOklchToHex(color);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#fafafa" }}>
          {themeKey.replace(/-/g, " ")}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#a1a1aa" }}>{hexValue}</span>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <div
          style={{
            width: "42px",
            height: "36px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.10)",
            backgroundColor: hexValue,
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <input
            type="color"
            value={hexValue}
            onChange={(event) => onHexChange(event.target.value)}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </div>
        <Input
          value={`oklch(${color.l.toFixed(2)} ${color.c.toFixed(2)} ${color.h.toFixed(2)})`}
          onChange={(event) => onOklchChange(event.target.value)}
          style={{ fontFamily: "monospace", fontSize: "12px" }}
        />
      </div>
    </div>
  );
}

function AccessibilityPanel({ report }: { report: AccessibilityReport }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {[
          ["Score", String(report.overallScore)],
          ["AA pairs", String(report.passingPairs)],
          ["Min ratio", report.minimumContrast.toFixed(2)],
        ].map(([label, value]) => (
          <Card key={label} style={{ backgroundColor: "#111114" }}>
            <CardContent style={{ padding: "12px" }}>
              <div style={{ fontSize: "12px", color: "#a1a1aa" }}>{label}</div>
              <div style={{ fontSize: "24px", fontWeight: 700 }}>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {report.pairs.map((pair) => {
        const passing = pair.passesAA;
        return (
          <Card
            key={pair.pair}
            style={{
              backgroundColor: passing ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
              borderColor: passing ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.16)",
            }}
          >
            <CardContent
              style={{
                padding: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>{pair.pair}</div>
                <div style={{ fontSize: "12px", color: "#a1a1aa" }}>
                  {pair.passesAAA ? "AAA ready" : pair.passesAA ? "Passes AA" : "Below AA"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {passing && <Check size={14} color="#86efac" />}
                <span style={{ fontFamily: "monospace", fontSize: "13px" }}>{pair.ratio.toFixed(2)}:1</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function Convergence({
  initialConfig,
  initialDefinition,
  className,
  syncStart = true,
}: ConvergenceProps) {
  const resolvedInitialDefinition = useMemo(
    () => buildInitialDefinition(initialDefinition, initialConfig),
    [initialDefinition, initialConfig],
  );
  const engine = useMemo(
    () => new ConvergenceEngine(resolvedInitialDefinition, { autoApply: false }),
    [resolvedInitialDefinition],
  );

  const [definition, setDefinition] = useState<ThemeDefinition>(resolvedInitialDefinition);
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("colors");
  const [copied, setCopied] = useState(false);
  const [openColorGroups, setOpenColorGroups] = useState<Record<string, boolean>>({});
  const [historyPast, setHistoryPast] = useState<ThemeDefinition[]>([]);
  const [historyFuture, setHistoryFuture] = useState<ThemeDefinition[]>([]);
  const [savedWorkspaces, setSavedWorkspaces] = useState<SavedWorkspace[]>([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [importSource, setImportSource] = useState("");
  const [importError, setImportError] = useState("");
  const [activeExportFormat, setActiveExportFormat] = useState<ConvergenceExportFormat>("tailwind-v4");
  const mode = "light" as const;

  useEffect(() => {
    ensureGlobalBridgeStyles();
  }, []);

  useEffect(() => {
    setSavedWorkspaces(readSavedWorkspaces());
  }, []);

  useEffect(() => {
    if (syncStart) {
      const synced = engine.syncDefinitionFromDom();
      engine.setAutoApply(true);
      engine.applyDefinition();
      setDefinition(synced);
      return;
    }

    engine.setAutoApply(true);
    engine.applyDefinition();
    setDefinition(engine.getDefinition());
  }, [engine, syncStart]);

  useEffect(() => {
    loadGoogleFont(definition.typography.fontSans);
    loadGoogleFont(definition.typography.fontSerif);
    loadGoogleFont(definition.typography.fontMono);
  }, [definition.typography]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const resolvedTheme = useMemo(() => definition.themes[mode], [definition, mode]);

  const accessibilityReport = useMemo(
    () => scoreThemeAccessibility(resolvedTheme),
    [resolvedTheme],
  );

  const commit = (previousDefinition = definition) => {
    const nextDefinition = engine.getDefinition();
    setHistoryPast((current) => [...current.slice(-39), clone(previousDefinition)]);
    setHistoryFuture([]);
    setDefinition(nextDefinition);
  };

  const applyDefinition = (nextDefinition: ThemeDefinition, recordHistory = true) => {
    if (recordHistory) {
      setHistoryPast((current) => [...current.slice(-39), clone(definition)]);
      setHistoryFuture([]);
    }
    engine.setDefinition(nextDefinition);
    setDefinition(engine.getDefinition());
  };

  const undo = () => {
    const previous = historyPast[historyPast.length - 1];
    if (!previous) {
      return;
    }

    setHistoryPast((current) => current.slice(0, -1));
    setHistoryFuture((current) => [clone(definition), ...current.slice(0, 39)]);
    engine.setDefinition(previous);
    setDefinition(engine.getDefinition());
  };

  const redo = () => {
    const next = historyFuture[0];
    if (!next) {
      return;
    }

    setHistoryFuture((current) => current.slice(1));
    setHistoryPast((current) => [...current.slice(-39), clone(definition)]);
    engine.setDefinition(next);
    setDefinition(engine.getDefinition());
  };

  const updateColor = (themeKey: ThemeKey, nextColor: OklchColor) => {
    const previousDefinition = engine.getDefinition();
    engine.setOklch(themeKey, nextColor, { mode });
    commit(previousDefinition);
  };

  const setPreset = (presetName: string) => {
    const previousDefinition = engine.getDefinition();
    engine.setTheme(mode, clone(PRESETS[presetName]));
    engine.setShadow("shadow-color", clone(PRESET_SHADOWS[presetName]["shadow-color"]));
    for (const key of SHADOW_KEYS) {
      if (key !== "shadow-color") {
        engine.setShadow(key, PRESET_SHADOWS[presetName][key]);
      }
    }
    commit(previousDefinition);
  };

  const updateTypography = (patch: Partial<TypographyConfig>) => {
    const previousDefinition = engine.getDefinition();
    engine.setTypography(patch);
    commit(previousDefinition);
  };

  const updateLayout = (patch: Partial<LayoutConfig>) => {
    const previousDefinition = engine.getDefinition();
    engine.setLayout(patch);
    commit(previousDefinition);
  };

  const updateShadow = <T extends keyof ShadowConfig>(key: T, value: ShadowConfig[T]) => {
    const previousDefinition = engine.getDefinition();
    engine.setShadow(key, value);
    commit(previousDefinition);
  };

  const copyExport = async () => {
    const content = engine.export(activeExportFormat);
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const importTheme = (type: "css" | "json") => {
    setImportError("");
    try {
      const imported = importThemeDefinition(importSource, type, definition);
      applyDefinition(imported);
      setImportSource("");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Could not import that theme.");
    }
  };

  const saveWorkspace = () => {
    const name = workspaceName.trim();
    if (!name) {
      return;
    }

    const now = new Date().toISOString();
    const existing = savedWorkspaces.find((workspace) => workspace.name.toLowerCase() === name.toLowerCase());
    const nextWorkspace: SavedWorkspace = {
      id: existing?.id ?? createId(),
      name,
      definition: clone(definition),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    const nextWorkspaces = existing
      ? savedWorkspaces.map((workspace) => (workspace.id === existing.id ? nextWorkspace : workspace))
      : [nextWorkspace, ...savedWorkspaces];

    setSavedWorkspaces(nextWorkspaces);
    writeSavedWorkspaces(nextWorkspaces);
    setWorkspaceName("");
  };

  const loadWorkspace = (workspace: SavedWorkspace) => {
    applyDefinition(clone(workspace.definition));
  };

  const deleteWorkspace = (workspaceId: string) => {
    const nextWorkspaces = savedWorkspaces.filter((workspace) => workspace.id !== workspaceId);
    setSavedWorkspaces(nextWorkspaces);
    writeSavedWorkspaces(nextWorkspaces);
  };

  const toggleColorGroup = (groupName: string) => {
    setOpenColorGroups((current) => ({
      ...current,
      [groupName]: !current[groupName],
    }));
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        aria-label="Open theme editor"
        className={className}
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 9999,
          width: "50px",
          height: "50px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.12)",
          backgroundColor: "#09090b",
          color: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(true)}
      >
        <ConvergenceMark size={24} />
      </button>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.18)",
        overflow: "hidden",
        overscrollBehavior: "contain",
      }}
    >
      <div style={{ flex: 1 }} onClick={() => setIsOpen(false)} />
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          height: "100dvh",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#08090a",
          color: "#f4f4f5",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "-24px 0 64px rgba(0,0,0,0.36)",
        }}
      >
        <div style={{ padding: "14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "#101214",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ConvergenceMark size={22} />
              </div>
              <div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>Theme Studio</div>
              <div style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "4px" }}>
                Edit tokens, check QA, import, save, and export.
              </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </Button>
          </div>
        </div>

        <div
          className="convergence-scroll-area"
          style={{
            padding: "14px",
            overflowY: "auto",
            minHeight: 0,
            flex: 1,
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            backgroundColor: "#08090a",
          }}
        >
          <Card
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(255,255,255,0.035) 42%, rgba(255,255,255,0.02))",
            }}
          >
            <CardHeader style={{ paddingBottom: "10px" }}>
              <CardTitle>Control Deck</CardTitle>
              <CardDescription>
                Format, presets, history, and copy actions.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "8px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <Label>Export</Label>
                  <Select
                    value={activeExportFormat}
                    onValueChange={(value) => setActiveExportFormat(value as ConvergenceExportFormat)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <Label>Preset</Label>
                  <Select onValueChange={setPreset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Apply preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PRESETS).map((presetName) => (
                        <SelectItem key={presetName} value={presetName}>
                          {presetName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>

              <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={undo}
                  disabled={historyPast.length === 0}
                >
                  <RotateCcw size={14} />
                  Undo
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={redo}
                  disabled={historyFuture.length === 0}
                >
                  <RotateCw size={14} />
                  Redo
                </Button>
              </div>
              <Button onClick={copyExport} size="sm" style={{ gridColumn: "span 2", width: "100%" }}>
                  <Copy size={14} />
                  {copied ? "Copied" : "Copy export"}
                </Button>

              <div
                style={{
                  gridColumn: "span 4",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "8px",
                }}
              >
                {[
                  ["QA", `${accessibilityReport.overallScore}/100`],
                  ["Tokens", String(Object.keys(resolvedTheme).length)],
                  ["Saved", String(savedWorkspaces.length)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.07)",
                      backgroundColor: "rgba(0,0,0,0.16)",
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "#a1a1aa" }}>{label}</div>
                    <div style={{ marginTop: "4px", fontSize: "15px", fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
            {TABS.map((tabOption) => {
              const Icon = tabOption.icon;
              return (
                <Button
                  key={tabOption.id}
                  variant={tab === tabOption.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setTab(tabOption.id)}
                  style={{
                    width: "100%",
                    minHeight: "58px",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "6px",
                    backgroundColor: tab === tabOption.id ? "#fafafa" : "#101114",
                  }}
                >
                  <Icon size={14} />
                  {tabOption.label}
                </Button>
              );
            })}
          </div>

          {tab === "colors" && (
            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              {GROUPS.map((group) => (
                <Card
                  key={group.name}
                  style={{
                    backgroundColor: openColorGroups[group.name] ? "#101114" : "#0f1012",
                    gridColumn: openColorGroups[group.name] ? "1 / -1" : undefined,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleColorGroup(group.name)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <CardHeader
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        paddingBottom: openColorGroups[group.name] ? "10px" : "14px",
                      }}
                    >
                      <div>
                        <CardTitle>{group.name}</CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", width: "auto" }}>
                        <Badge>{group.keys.length} tokens</Badge>
                        <ChevronDown
                          size={16}
                          style={{
                            color: "#a1a1aa",
                            transform: openColorGroups[group.name] ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 160ms ease",
                          }}
                        />
                      </div>
                    </CardHeader>
                  </button>
                  {openColorGroups[group.name] && (
                    <CardContent
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "10px",
                      }}
                    >
                      {group.keys.map((themeKey) => (
                        <ColorRow
                          key={themeKey}
                          themeKey={themeKey}
                          color={resolvedTheme[themeKey]}
                          onHexChange={(hex) => updateColor(themeKey, convertHexToOklch(hex))}
                          onOklchChange={(raw) => {
                            const parsed = parseOklchString(raw);
                            if (parsed) {
                              updateColor(themeKey, parsed);
                            }
                          }}
                        />
                      ))}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {tab === "typography" && (
            <Card style={{ backgroundColor: "#101114" }}>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>
                  Update fonts and spacing for the current theme.
                </CardDescription>
              </CardHeader>
              <CardContent style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", gridColumn: "span 2" }}>
                  <div>
                    <Label>Sans</Label>
                    <Select
                      value={definition.typography.fontSans}
                      onValueChange={(value) => updateTypography({ fontSans: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.sans.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.split(",")[0].replace(/['"]/g, "")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Serif</Label>
                    <Select
                      value={definition.typography.fontSerif}
                      onValueChange={(value) => updateTypography({ fontSerif: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.serif.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.split(",")[0].replace(/['"]/g, "")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Monospace</Label>
                  <Select
                    value={definition.typography.fontMono}
                    onValueChange={(value) => updateTypography({ fontMono: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.mono.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.split(",")[0].replace(/['"]/g, "")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <Label>Letter spacing</Label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Input
                      type="range"
                      min="-2"
                      max="10"
                      step="0.1"
                      value={Number.parseFloat(definition.typography.letterSpacing) || 0}
                      onChange={(event) => updateTypography({ letterSpacing: `${event.target.value}px` })}
                      style={{ padding: 0, backgroundColor: "transparent", border: "none" }}
                    />
                    <Input
                      value={Number.parseFloat(definition.typography.letterSpacing) || 0}
                      onChange={(event) => updateTypography({ letterSpacing: `${event.target.value}px` })}
                      style={{ width: "72px" }}
                    />
                  </div>
                </div>

                <Separator style={{ gridColumn: "span 2" }} />

                <div
                  style={{
                    gridColumn: "span 2",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backgroundColor: "rgba(255,255,255,0.035)",
                  }}
                >
                  <div style={{ fontSize: "18px", fontWeight: 700 }}>Readable, quiet, and adaptable.</div>
                  <div style={{ fontSize: "13px", color: "#a1a1aa" }}>
                    Use the host app itself to judge hierarchy and rhythm while you edit.
                  </div>
                  <code
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backgroundColor: "rgba(255,255,255,0.03)",
                      fontSize: "12px",
                    }}
                  >
                    export theme --format {activeExportFormat}
                  </code>
                </div>
              </CardContent>
            </Card>
          )}

          {tab === "layout" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
              <Card style={{ backgroundColor: "#101114" }}>
                <CardHeader>
                  <CardTitle>Layout tokens</CardTitle>
                  <CardDescription>Radius and borders should stay stable across common UI surfaces.</CardDescription>
                </CardHeader>
                <CardContent style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <Label>Radius</Label>
                      <Input
                        value={definition.layout.radius}
                        onChange={(event) => updateLayout({ radius: event.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Border width</Label>
                      <Input
                        value={definition.layout.borderWidth}
                        onChange={(event) => updateLayout({ borderWidth: event.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Border style</Label>
                    <Select
                      value={definition.layout.borderStyle}
                      onValueChange={(value) => updateLayout({ borderStyle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">solid</SelectItem>
                        <SelectItem value="dashed">dashed</SelectItem>
                        <SelectItem value="dotted">dotted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        style={{
                          height: "72px",
                          borderRadius: definition.layout.radius,
                          border: `${definition.layout.borderWidth} ${definition.layout.borderStyle} ${oklch(resolvedTheme.border)}`,
                          backgroundColor: index === 1 ? oklch(resolvedTheme.card) : "rgba(255,255,255,0.03)",
                          boxShadow: index === 2 ? definition.shadows["shadow-md"] : definition.shadows["shadow-xs"],
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: "#101114" }}>
                <CardHeader>
                  <CardTitle>Shadows</CardTitle>
                  <CardDescription>Adjust the tint, then tune each token if you need more control.</CardDescription>
                </CardHeader>
                <CardContent style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <Label>Shadow tint</Label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div
                        style={{
                          width: "42px",
                          height: "36px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.10)",
                          backgroundColor: convertOklchToHex(definition.shadows["shadow-color"]),
                          position: "relative",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="color"
                          value={convertOklchToHex(definition.shadows["shadow-color"])}
                          onChange={(event) => {
                            const base = convertHexToOklch(event.target.value);
                            updateShadow("shadow-color", {
                              ...base,
                              a: definition.shadows["shadow-color"].a,
                            });
                          }}
                          style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0,
                            width: "100%",
                            height: "100%",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "12px", color: "#a1a1aa" }}>
                        Keep shadows neutral or give them a slight brand tint.
                      </div>
                    </div>
                  </div>

                  {SHADOW_KEYS.filter((key) => key !== "shadow-color").map((shadowKey) => (
                    <div key={shadowKey}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", gap: "8px" }}>
                        <Label style={{ marginBottom: 0 }}>{shadowKey}</Label>
                        <div
                          style={{
                            width: "40px",
                            height: "24px",
                            borderRadius: "6px",
                            backgroundColor: "#f4f4f5",
                            boxShadow: definition.shadows[shadowKey],
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        />
                      </div>
                      <Input
                        value={definition.shadows[shadowKey]}
                        onChange={(event) => updateShadow(shadowKey, event.target.value)}
                        style={{ fontFamily: "monospace", fontSize: "11px" }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "accessibility" && (
            <Card style={{ backgroundColor: "#101114" }}>
              <CardHeader>
                <CardTitle>Accessibility QA</CardTitle>
                <CardDescription>Contrast is calculated from the currently edited theme.</CardDescription>
              </CardHeader>
              <CardContent>
                <AccessibilityPanel report={accessibilityReport} />
              </CardContent>
            </Card>
          )}

          {tab === "import" && (
            <Card style={{ backgroundColor: "#101114" }}>
              <CardHeader>
                <CardTitle>Import Theme</CardTitle>
                <CardDescription>
                  Paste existing CSS variables or a Convergence JSON theme definition.
                </CardDescription>
              </CardHeader>
              <CardContent style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Textarea
                  value={importSource}
                  onChange={(event) => {
                    setImportSource(event.target.value);
                    setImportError("");
                  }}
                  placeholder={`:root {\n  --background: oklch(0.99 0 0);\n  --foreground: oklch(0.12 0.01 260);\n}\n\n.dark {\n  --background: oklch(0.12 0 0);\n}`}
                  style={{ minHeight: "220px", fontFamily: "monospace", fontSize: "12px" }}
                />
                {importError && (
                  <div style={{ fontSize: "12px", color: "#fca5a5" }}>
                    {importError}
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <Button
                    size="sm"
                    onClick={() => importTheme("css")}
                    disabled={!importSource.trim()}
                  >
                    <Upload size={14} />
                    Import CSS
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => importTheme("json")}
                    disabled={!importSource.trim()}
                  >
                    Import JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {tab === "saved" && (
            <Card style={{ backgroundColor: "#101114" }}>
              <CardHeader>
                <CardTitle>Saved Workspaces</CardTitle>
                <CardDescription>
                  Save named themes locally in this browser and load them later.
                </CardDescription>
              </CardHeader>
              <CardContent style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Input
                    value={workspaceName}
                    onChange={(event) => setWorkspaceName(event.target.value)}
                    placeholder="Theme name"
                  />
                  <Button onClick={saveWorkspace} disabled={!workspaceName.trim()}>
                    <Save size={14} />
                    Save
                  </Button>
                </div>

                <Separator />

                {savedWorkspaces.length === 0 ? (
                  <div style={{ fontSize: "13px", color: "#a1a1aa" }}>
                    No saved themes yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {savedWorkspaces.map((workspace) => (
                      <div
                        key={workspace.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          alignItems: "center",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          backgroundColor: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#fafafa" }}>
                            {workspace.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#a1a1aa" }}>
                            Updated {new Date(workspace.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => loadWorkspace(workspace)}
                          >
                            <FolderOpen size={14} />
                            Load
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteWorkspace(workspace.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
