"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ConvergenceEngine } from "../index";
import { ThemeConfig, ThemeKey, OklchColor } from "../types";
import { INITIAL_THEME } from "../defaults";
import { convertHexToOklch, convertOklchToHex } from "../utils/color";
import { Input, Label, Button } from "./ui/primitives";
import { Copy, X, Undo, Redo } from "lucide-react";

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

// Simple icon components to avoid external deps
const Icons = {
  Reset: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.8536 1.14645C12.0488 1.34171 12.0488 1.65829 11.8536 1.85355L10.7071 3H12.5C13.3284 3 14 3.67157 14 4.5C14 5.32843 13.3284 6 12.5 6H8C7.72386 6 7.5 5.77614 7.5 5.5C7.5 5.22386 7.72386 5 8 5H12.5C12.7761 5 13 4.77614 13 4.5C13 4.22386 12.7761 4 12.5 4H10.7071L11.8536 5.14645C12.0488 5.34171 12.0488 5.65829 11.8536 5.85355C11.6583 6.04882 11.3417 6.04882 11.1464 5.85355L9.14645 3.85355C8.95118 3.65829 8.95118 3.34171 9.14645 3.14645L11.1464 1.14645C11.3417 0.951184 11.6583 0.951184 11.8536 1.14645ZM2.5 3H7C7.27614 3 7.5 3.22386 7.5 3.5C7.5 3.77614 7.27614 4 7 4H2.5C2.22386 4 2 4.22386 2 4.5C2 4.77614 2.22386 5 2.5 5H3.70711L2.56066 3.85355C2.3654 3.65829 2.04882 3.65829 1.85355 3.85355C1.65829 4.04882 1.65829 4.36531 1.85355 4.56058L3.85355 6.56058C4.04882 6.75585 4.36531 6.75585 4.56058 6.56058L6.56058 4.56058C6.75585 4.36531 6.75585 4.04882 6.56058 3.85355C6.36531 3.65829 6.04882 3.65829 5.85355 3.85355L4.70711 5H2.5C1.67157 5 1 4.32843 1 3.5C1 2.67157 1.67157 2 2.5 2H4.5C4.77614 2 5 1.77614 5 1.5C5 1.22386 4.77614 1 4.5 1H2.5C1.11929 1 0 2.11929 0 3.5C0 4.88071 1.11929 6 2.5 6Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  Moon: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.66 11.362C2.69665 12.3986 4.12906 13.0402 5.72355 13.0402C9.09623 13.0402 11.8335 10.3029 11.8335 6.93021C11.8335 5.33572 11.1918 3.90331 10.1553 2.86657C10.0263 2.73756 9.87325 2.87157 9.94314 3.03754C10.1704 3.57726 10.2974 4.17062 10.2974 4.79093C10.2974 8.25935 7.48584 11.0709 4.01742 11.0709C3.39711 11.0709 2.80376 10.9439 2.26403 10.7166C2.09806 10.6467 1.96405 10.7998 2.09306 10.9288L1.66 11.362Z"
        stroke="currentColor"
        fill="none"
      ></path>
    </svg>
  ),
  Sun: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 1.5C7.77614 1.5 8 1.72386 8 2V3C8 3.27614 7.77614 3.5 7.5 3.5C7.22386 3.5 7 3.27614 7 3V2C7 1.72386 7.22386 1.5 7.5 1.5ZM7.5 11.5C7.77614 11.5 8 11.7239 8 12V13C8 13.2761 7.77614 13.5 7.5 13.5C7.22386 13.5 7 13.2761 7 13V12C7 11.7239 7.22386 11.5 7.5 11.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H3.5C3.77614 7 4 7.22386 4 7.5C4 7.77614 3.77614 8 3.5 8H2.5C2.22386 8 2 7.77614 2 7.5ZM11.5 7.5C11.5 7.22386 11.7239 7 12 7H13C13.2761 7 13.5 7.22386 13.5 7.5C13.5 7.77614 13.2761 8 13 8H12C11.7239 8 11.5 7.77614 11.5 7.5ZM3.61091 3.61091C3.80617 3.41565 4.12276 3.41565 4.31802 3.61091L5.02513 4.31802C5.22039 4.51328 5.22039 4.82987 5.02513 5.02513C4.82987 5.22039 4.51329 5.22039 4.31802 5.02513L3.61091 4.31802C3.41565 4.12276 3.41565 3.80617 3.61091 3.61091ZM10.6865 10.6865C10.8817 10.4913 11.1983 10.4913 11.3936 10.6865L12.1007 11.3936C12.296 11.5889 12.296 11.9054 12.1007 12.1007C11.9054 12.296 11.5889 12.296 11.3936 12.1007L10.6865 11.3936C10.4913 11.1983 10.4913 10.8817 10.6865 10.6865ZM3.61091 11.3936C3.41565 11.5889 3.41565 11.9054 3.61091 12.1007C3.80617 12.296 4.12276 12.296 4.31802 12.1007L5.02513 11.3936C5.22039 11.1983 5.22039 10.8817 5.02513 10.6865C4.82987 10.4913 4.51329 10.4913 4.31802 10.6865L3.61091 11.3936ZM10.6865 4.31802C10.4913 4.51328 10.4913 4.82987 10.6865 5.02513C10.8817 5.22039 11.1983 5.22039 11.3936 5.02513L12.1007 4.31802C12.296 4.12276 12.296 3.80617 12.1007 3.61091C11.9054 3.41565 11.5889 3.41565 11.3936 3.61091L10.6865 4.31802Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
      <path
        d="M7.5 5C6.11929 5 5 6.11929 5 7.5C5 8.88071 6.11929 10 7.5 10C8.88071 10 10 8.88071 10 7.5C10 6.11929 8.88071 5 7.5 5ZM6 7.5C6 6.67157 6.67157 6 7.5 6C8.32843 6 9 6.67157 9 7.5C9 8.32843 8.32843 9 7.5 9C6.67157 9 6 8.32843 6 7.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  Import: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 2C7.77614 2 8 2.22386 8 2.5V8.5C8 8.77614 7.77614 9 7.5 9C7.22386 9 7 8.77614 7 8.5V2.5C7 2.22386 7.22386 2 7.5 2ZM5.14645 6.64645C5.34171 6.45118 5.65829 6.45118 5.85355 6.64645L7.5 8.29289L9.14645 6.64645C9.34171 6.45118 9.65829 6.45118 9.85355 6.64645C10.0488 6.84171 10.0488 7.15829 9.85355 7.35355L7.85355 9.35355C7.65829 9.54882 7.34171 9.54882 7.14645 9.35355L5.14645 7.35355C4.95118 7.15829 4.95118 6.84171 5.14645 6.64645ZM2.5 10C2.5 9.72386 2.72386 9.5 3 9.5H4C4.27614 9.5 4.5 9.72386 4.5 10C4.5 10.2761 4.27614 10.5 4 10.5H3V11.5H12V10.5H11C10.7239 10.5 10.5 10.2761 10.5 10C10.5 9.72386 10.7239 9.5 11 9.5H12C12.2761 9.5 12.5 9.72386 12.5 10V12C12.5 12.2761 12.2761 12.5 12 12.5H3C2.72386 12.5 2.5 12.2761 2.5 12V10Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  Random: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 3C4.22386 3 4 3.22386 4 3.5C4 3.77614 4.22386 4 4.5 4H10.5C10.7761 4 11 3.77614 11 3.5C11 3.22386 10.7761 3 10.5 3H4.5ZM7.5 5C7.22386 5 7 5.22386 7 5.5C7 5.77614 7.22386 6 7.5 6H10.5C10.7761 6 11 5.77614 11 5.5C11 5.22386 10.7761 5 10.5 5H7.5ZM2.5 7C2.22386 7 2 7.22386 2 7.5C2 7.77614 2.22386 8 2.5 8H4.5C4.77614 8 5 7.77614 5 7.5C5 7.22386 4.77614 7 4.5 7H2.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12H10.5C10.7761 12 11 11.7761 11 11.5C11 11.2239 10.7761 11 10.5 11H5.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  ChevronDown: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
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
            style={{ width: "100%", gap: "8px", height: "40px" }}
            variant="outline"
            onClick={handleExport}
          >
            <Copy /> Copy CSS Variables
          </Button>

          {/* History Controls */}
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              variant="outline"
              style={{ flex: 1, gap: "8px" }}
              onClick={handleUndo}
              disabled={historyIndex === 0}
            >
              <Undo />
            </Button>
            <Button
              variant="outline"
              style={{ flex: 1, gap: "8px" }}
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
            >
              <Redo />
            </Button>
            <Button
              variant="outline"
              style={{ flex: 2, gap: "8px" }}
              onClick={handleReset}
            >
              <Icons.Reset /> Reset
            </Button>
          </div>

          {/* Mode Toggle (Visual Only for now) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Label>Mode</Label>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="outline"
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  gap: "8px",
                  fontWeight: 400,
                }}
              >
                <Icons.Sun /> Light
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
                <Icons.Moon /> Dark
              </Button>
            </div>
          </div>

          {/* Themes Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Label>Themes</Label>
            <div style={{ display: "flex", gap: "8px" }}>
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
                <Icons.Import /> Import
              </Button>
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
                <Icons.Random /> Random
              </Button>
            </div>
          </div>

          {/* Tabs */}
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
                padding: "4px 0",
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
            <button
              style={{
                flex: 1,
                padding: "4px 0",
                fontSize: "12px",
                fontWeight: 500,
                color: "#a1a1aa",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Typography
            </button>
            <button
              style={{
                flex: 1,
                padding: "4px 0",
                fontSize: "12px",
                fontWeight: 500,
                color: "#a1a1aa",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Other
            </button>
          </div>

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
                      <Icons.ChevronDown />
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
