"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ConvergenceEngine } from "../index";
import { ThemeConfig, ThemeKey, OklchColor } from "../types";
import { INITIAL_THEME } from "../defaults";
import { convertHexToOklch, convertOklchToHex } from "../utils/color";
import { Input, Label, Button } from "./ui/primitives";
import {
  Copy,
  X,
  Undo,
  Redo,
  RotateCcw,
  Sun,
  Moon,
  Download,
  ChevronDown,
} from "lucide-react";

interface ConvergenceProps {
  initialConfig?: ThemeConfig;
  className?: string;
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

const COMPONENT_STYLES: Record<string, React.CSSProperties> = {
  wrapperOpen: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    justifyContent: "flex-end",
    pointerEvents: "none",
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    pointerEvents: "auto",
    transition: "opacity 300ms",
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
    width: "56px",
    height: "56px",
    backgroundColor: "#18181b",
    color: "white",
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
    flex: 1,
    display: "flex", // Added
    alignItems: "center", // Added
    justifyContent: "center", // Added
    gap: "8px",
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
};

export function Convergence({
  initialConfig = INITIAL_THEME,
  className,
}: ConvergenceProps) {
  const [theme, setTheme] = useState<ThemeConfig>(initialConfig);
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ThemeConfig[]>([initialConfig]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  const engine = useMemo(() => {
    if (typeof window !== "undefined") {
      return new ConvergenceEngine(initialConfig);
    }
    return null;
  }, [initialConfig]);

  const updateTheme = useCallback(
    (newTheme: ThemeConfig, addToHistory = true) => {
      setTheme(newTheme);
      (Object.keys(newTheme) as ThemeKey[]).forEach((key) => {
        engine?.setOklch(key, newTheme[key]);
      });

      if (addToHistory) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newTheme);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    },
    [engine, history, historyIndex]
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

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevTheme = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      updateTheme(prevTheme, false);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextTheme = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      updateTheme(nextTheme, false);
    }
  };

  const handleReset = () => {
    updateTheme(initialConfig);
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleExport = () => {
    const cssLines = (Object.entries(theme) as [ThemeKey, OklchColor][]).map(
      ([key, value]) => {
        if (!value) return "";
        return `  --${key}: oklch(${value.l.toFixed(4)} ${value.c.toFixed(
          4
        )} ${value.h.toFixed(3)});`;
      }
    );

    const cssOutput = `:root {\n${cssLines.filter(Boolean).join("\n")}\n}`;
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
        className="group hover:scale-105 active:scale-95" // keeping minimal scale transforms via class if helpful, but styles handle base
      >
        <span style={{ fontSize: "24px", lineHeight: 1 }}>🎨</span>
      </button>
    );
  }

  return (
    <div style={COMPONENT_STYLES.wrapperOpen} className={className || ""}>
      <div style={COMPONENT_STYLES.backdrop} onClick={() => setIsOpen(false)} />

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

          {/* History Controls */}
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              variant="outline"
              style={COMPONENT_STYLES.buttonClass}
              onClick={handleUndo}
              disabled={historyIndex === 0}
            >
              <Undo size={16} />
            </Button>
            <Button
              variant="outline"
              style={COMPONENT_STYLES.buttonClass}
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
            >
              <Redo size={16} />
            </Button>
            <Button
              variant="outline"
              style={COMPONENT_STYLES.buttonClass}
              onClick={handleReset}
            >
              <RotateCcw size={16} /> Reset
            </Button>
          </div>

          {/* Mode Toggle (Visual Only for now) */}
          {/* <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Label>Mode</Label>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="outline"
                style={COMPONENT_STYLES.buttonClass}
                onClick={() => updateTheme({ ...theme, mode: "light" })}
                disabled={theme.mode === "light"}
              >
                <Sun size={16} /> Light
              </Button>
              <Button
                variant="outline"
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  gap: "8px",
                  fontWeight: 400,
                }}
              >
                <Moon size={16} /> Dark
              </Button>
            </div>
          </div> */}

          {/* Themes Actions */}
          {/* <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Label>Themes</Label>
            <div style={{ display: "flex" }}>
              <Button
                variant="outline"
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  gap: "8px",
                  fontWeight: 400,
                  fontSize: "12px",
                }}
              >
                <Download size={16} /> Import
              </Button>
            </div>
          </div> */}

          {/* Tabs
          <div
            style={{
              display: "flex",
              padding: "4px",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
            }}
          >
            <button
              style={{
                flex: 1,
                padding: "2px 0",
                fontSize: "12px",
                fontWeight: 500,
                backgroundColor: "#09090b",
                borderRadius: "6px",
                color: "#f4f4f5",
                border: "none",
                cursor: "pointer",
              }}
            >
              Colors
            </button>
          </div> */}

          {/* Colors List */}
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
                          2
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
                                    updateColorFromHex(themeKey, e.target.value)
                                  }
                                  style={COMPONENT_STYLES.colorInput}
                                />
                              </div>
                              <Input
                                value={oklchString}
                                onChange={(e) =>
                                  updateColorFromOklchString(
                                    themeKey,
                                    e.target.value
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
        </div>
      </div>
    </div>
  );
}
