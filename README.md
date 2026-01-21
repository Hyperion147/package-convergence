# Convergence UI

A lightweight, powerful engine for real-time CSS theme generation and management. `convergence-ui` makes it effortless to create, preview, and export color themes for your web applications using modern OKLCH color spaces.

## Features

- 🎨 **Real-time Theme Generation**: Instantly visualize changes as you adjust colors.
- 📐 **OKLCH Color Space**: Uses modern perceptual color models for consistent and vibrant palettes.
- 🔄 **Two-way Syncing**: Initializes from your existing CSS variables.
- 📦 **Zero-Config UI Component**: Includes a drop-in `<Convergence />` component for an immediate theme editor overlay.
- 💾 **Presets**: Built-in Light and Dark presets (easily extensible).
- 📋 **Export to CSS**: One-click copy of generated CSS variables to your clipboard.

## Installation

```bash
npm install convergence-ui
# or
yarn add convergence-ui
# or
pnpm add convergence-ui
```

## Usage

### 1. The Comparison Component (Recommended)

The easiest way to use Convergence is to drop the `<Convergence />` component into your application's root layout or a specific page. It provides a collapsible UI for tweaking your application's design tokens in real-time.

```tsx
import { Convergence } from "convergence-ui";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Add the Convergence overlay */}
        <Convergence />
      </body>
    </html>
  );
}
```

The component will appear as a floating toggle button in the bottom-right corner of your screen.

### 2. Programmatic Usage

You can also use the underlying `ConvergenceEngine` to manipulate themes programmatically.

```ts
import { ConvergenceEngine, ThemeConfig } from "convergence-ui";

const myTheme: ThemeConfig = {
  // define your oklch colors here
  primary: { l: 0.5, c: 0.2, h: 250 },
  // ...
};

// Initialize the engine
const engine = new ConvergenceEngine(myTheme, { autoApply: true });

// Update a specific color
engine.setOklch("primary", { l: 0.6, c: 0.2, h: 250 });
```

## Configuration

The `<Convergence />` component accepts the following props:

| Prop            | Type          | Default      | Description                                                                                                |
| --------------- | ------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `initialConfig` | `ThemeConfig` | `DARK_THEME` | The starting configuration for the theme editor.                                                           |
| `syncStart`     | `boolean`     | `true`       | If true, the editor will read the current CSS variables from the DOM on mount, overriding `initialConfig`. |
| `className`     | `string`      | `undefined`  | Optional CSS class for the wrapper element.                                                                |

## Types

`convergence-ui` is written in TypeScript and exports all necessary types relative to its operation.

```ts
import { OklchColor, ThemeConfig, ThemeKey } from "convergence-ui";

// OklchColor structure
// { l: number; c: number; h: number; }
```

## Presets

The package comes with standard `Light` and `Dark` presets out of the box.

## License

ISC
