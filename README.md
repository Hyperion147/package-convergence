# Convergence UI 2.0

Convergence UI 2.0 is a headless OKLCH theme engine with a React editor for semantic design tokens. It is built for teams shipping CSS-variable themes in Tailwind v4 and modern React apps.

## What it does

- Typed `ThemeDefinition` model for light and dark themes
- Headless engine for reading, updating, validating, importing, and exporting theme tokens
- Floating React editor for live token editing, presets, saved workspaces, and accessibility QA
- CSS import support for `:root`, `.dark`, and Tailwind-style token variables
- Export support for Tailwind v4 and JSON in the editor
- SSR-friendly `<ConvergenceThemeStyle />` helper for Next.js and other React SSR setups
- Per-component theme overrides through `data-convergence-component`

## Installation

```bash
npm install convergence-ui
```

## Quick start

### Add the editor

```tsx
import { Convergence } from "convergence-ui";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Convergence />
    </>
  );
}
```

### Use the engine directly

```ts
import {
  ConvergenceEngine,
  DEFAULT_THEME_DEFINITION,
  scoreThemeAccessibility,
} from "convergence-ui";

const engine = new ConvergenceEngine(DEFAULT_THEME_DEFINITION, {
  autoApply: false,
});

engine.setOklch("primary", { l: 0.64, c: 0.18, h: 262 }, { mode: "light" });
engine.setTypography({ fontSans: "Inter, sans-serif" });

const tailwindTheme = engine.export("tailwind-v4");
const jsonTheme = engine.export("json");
const report = scoreThemeAccessibility(engine.getDefinition().themes.light);
```

### Render theme CSS during SSR

```tsx
import {
  ConvergenceThemeStyle,
  DEFAULT_THEME_DEFINITION,
} from "convergence-ui";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ConvergenceThemeStyle definition={DEFAULT_THEME_DEFINITION} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Theme shape

```ts
import type { ThemeDefinition } from "convergence-ui";

const theme: ThemeDefinition = {
  themes: {
    light: { /* semantic OKLCH tokens */ },
    dark: { /* semantic OKLCH tokens */ },
  },
  typography: {
    fontSans: "Inter, sans-serif",
    fontSerif: "Georgia, serif",
    fontMono: '"JetBrains Mono", monospace',
    letterSpacing: "0px",
  },
  layout: {
    radius: "0.75rem",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  shadows: {
    "shadow-color": { l: 0, c: 0, h: 0, a: 1 },
    "shadow-2xs": "0 1px 3px 0px oklch(0 0 0 / 0.05)",
    "shadow-xs": "0 1px 3px 0px oklch(0 0 0 / 0.05)",
    "shadow-sm": "0 1px 3px 0px oklch(0 0 0 / 0.10)",
    shadow: "0 1px 3px 0px oklch(0 0 0 / 0.10)",
    "shadow-md": "0 1px 3px 0px oklch(0 0 0 / 0.10)",
    "shadow-lg": "0 1px 3px 0px oklch(0 0 0 / 0.10)",
    "shadow-xl": "0 1px 3px 0px oklch(0 0 0 / 0.10)",
    "shadow-2xl": "0 1px 3px 0px oklch(0 0 0 / 0.25)",
  },
};
```

## Import and export

The editor currently exposes two export targets:

- `tailwind-v4`
- `json`

The headless engine still supports the full export registry:

```ts
import { ConvergenceEngine, DEFAULT_THEME_DEFINITION } from "convergence-ui";

const engine = new ConvergenceEngine(DEFAULT_THEME_DEFINITION, {
  autoApply: false,
});

engine.export("css");
engine.export("tailwind-v4");
engine.export("json");
engine.export("shadcn");
```

You can import existing CSS variables into the engine:

```ts
import { ConvergenceEngine, DEFAULT_THEME_DEFINITION } from "convergence-ui";

const engine = new ConvergenceEngine(DEFAULT_THEME_DEFINITION, {
  autoApply: false,
});

engine.import(`
  :root {
    --background: oklch(0.98 0 0);
    --foreground: oklch(0.14 0.01 260);
  }

  .dark {
    --background: oklch(0.10 0 0);
    --foreground: oklch(0.96 0 0);
  }
`);
```

## Component overrides

Convergence can scope token overrides to individual components:

```html
<button data-convergence-component="button">Save</button>
```

Use the helper to keep attribute naming consistent:

```ts
import { createComponentThemeAttributes } from "convergence-ui";

const attrs = createComponentThemeAttributes("button");
```

## Validation and QA

```ts
import {
  DEFAULT_THEME_DEFINITION,
  scoreThemeAccessibility,
  validateThemeDefinition,
} from "convergence-ui";

const validation = validateThemeDefinition(DEFAULT_THEME_DEFINITION);
const report = scoreThemeAccessibility(DEFAULT_THEME_DEFINITION.themes.light);
```

Validation checks theme structure and token shapes. Accessibility scoring reports contrast results for the main semantic foreground/background pairs.

## Public API highlights

- `ConvergenceEngine`
- `Convergence`
- `ConvergenceThemeStyle`
- `DEFAULT_THEME_DEFINITION`
- `PRESETS`
- `validateThemeDefinition`
- `scoreThemeAccessibility`
- `defaultExportRegistry`
- `createThemeCss`
- `createComponentThemeAttributes`

## Notes

- The editor is a client component.
- The engine can run without the editor in build-time or server-side flows.
- The editor includes local saved workspaces, undo/redo history, and hidden-scrollbar contained scrolling.
- Fonts are loaded lazily in the editor when supported Google Fonts are selected.
- Local `yalc` testing steps live in [LOCAL_TESTING.md](X:\webdev\package-convergence\LOCAL_TESTING.md).

## License

MIT
