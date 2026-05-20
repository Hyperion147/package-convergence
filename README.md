# Convergence UI 2.0

Convergence UI 2.0 is a headless OKLCH design token engine with a React editor on top. It is built for teams shipping CSS-variable themes in Tailwind v4, shadcn/ui, and modern React apps.

## What changed in 2.0

- Headless core engine with typed theme definitions
- Dual-theme support for `:root` and `.dark`
- Per-component token overrides with data attributes
- Built-in export registry for CSS, Tailwind v4, JSON, and shadcn/ui
- CSS import support for existing token files
- Theme validation utilities
- Accessibility scoring for semantic token pairs
- SSR-friendly `<ConvergenceThemeStyle />` helper for Next.js and other React SSR setups
- Updated overlay UI with mode switching, override editing, exports, and accessibility QA

## Installation

```bash
npm install convergence-ui
```

## Core concepts

Convergence 2.0 works around a typed `ThemeDefinition`:

```ts
import type { ThemeDefinition } from "convergence-ui";

const theme: ThemeDefinition = {
  themes: {
    light: { /* semantic OKLCH tokens */ },
    dark: { /* semantic OKLCH tokens */ },
  },
  typography: {
    fontSans: "Inter, sans-serif",
    fontSerif: 'Georgia, serif',
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
  components: {
    button: {
      dark: {
        primary: { l: 0.72, c: 0.16, h: 255 },
      },
    },
  },
};
```

## Quick start

### 1. Drop in the editor

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

### 2. Use the core engine directly

```ts
import {
  ConvergenceEngine,
  DEFAULT_THEME_DEFINITION,
  scoreThemeAccessibility,
} from "convergence-ui";

const engine = new ConvergenceEngine(DEFAULT_THEME_DEFINITION);

engine.setOklch("primary", { l: 0.64, c: 0.18, h: 262 }, { mode: "light" });
engine.setComponentOverride("button", "dark", {
  primary: { l: 0.78, c: 0.12, h: 240 },
});

const css = engine.export("tailwind-v4");
const accessibility = scoreThemeAccessibility(engine.getResolvedTheme("dark", "button"));
```

### 3. Render theme CSS during SSR

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

## Export formats

Convergence 2.0 ships with a built-in export registry.

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

You can also register custom exporters:

```ts
import {
  defaultExportRegistry,
  type ThemeExporter,
} from "convergence-ui";

const customExporter: ThemeExporter = {
  id: "tokens-stub",
  label: "Tokens Stub",
  export: (definition) => JSON.stringify({ tokens: definition.themes.light }, null, 2),
};

defaultExportRegistry.register(customExporter);
```

## Importing existing CSS variables

```ts
import {
  ConvergenceEngine,
  DEFAULT_THEME_DEFINITION,
} from "convergence-ui";

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

Convergence can scope token overrides to individual components by targeting:

```html
<button data-convergence-component="button">Save</button>
```

That lets you keep a semantic base theme while adjusting specific components for special contexts.

The helper below keeps attribute naming consistent:

```ts
import { createComponentThemeAttributes } from "convergence-ui";

const attrs = createComponentThemeAttributes("button");
```

## Validation and accessibility

```ts
import {
  DEFAULT_THEME_DEFINITION,
  scoreThemeAccessibility,
  validateThemeDefinition,
} from "convergence-ui";

const validation = validateThemeDefinition(DEFAULT_THEME_DEFINITION);
const report = scoreThemeAccessibility(DEFAULT_THEME_DEFINITION.themes.light);
```

Validation checks structure and token shapes. Accessibility scoring reports contrast results for the main semantic foreground/background pairs used across the system.

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
- The headless engine can run without the editor and can export CSS in build-time flows.
- Fonts are loaded lazily in the editor when supported Google Fonts are selected.
- A full local `yalc` testing walkthrough lives in [LOCAL_TESTING.md](X:\webdev\package-convergence\LOCAL_TESTING.md).

## License

MIT
