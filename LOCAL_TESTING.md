# Local Testing With Next.js, shadcn/ui, and yalc

This is the fastest way to test `convergence-ui` in a real app before publishing to npm.

## Prerequisites

- Node.js installed
- `yalc` installed globally

```bash
npm install -g yalc
```

## 1. Build and publish this package locally

From the library repo:

```bash
cd X:\webdev\package-convergence
npm install
npm run build
yalc publish
```

When you make changes later, republish with:

```bash
cd X:\webdev\package-convergence
npm run build
yalc publish --push
```

## 2. Create the test app

From `X:\webdev`:

```bash
npx create-next-app@latest test-convergence --ts --eslint --app --src-dir --import-alias "@/*"
cd X:\webdev\test-convergence
```

Choose the options you like. For local package testing, the defaults are fine.

## 3. Install shadcn/ui in the test app

Inside `X:\webdev\test-convergence`:

```bash
npx shadcn@latest init
```

Then add a few basic components:

```bash
npx shadcn@latest add button card input badge
```

## 4. Add the local package with yalc

Inside `X:\webdev\test-convergence`:

```bash
yalc add convergence-ui
npm install
```

If the package is already linked and you just pushed updates from the library repo:

```bash
yalc update convergence-ui
npm install
```

## 5. Add Convergence to the app

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Convergence } from "convergence-ui";

export const metadata: Metadata = {
  title: "Test Convergence",
  description: "Local test app for Convergence UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Convergence />
      </body>
    </html>
  );
}
```

Then add a visible test surface in `src/app/page.tsx`:

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Badge variant="secondary">Convergence test app</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">
              Theme everything live
            </h1>
            <p className="text-muted-foreground">
              Use this page to validate shadcn tokens, shadows, radius, and typography.
            </p>
          </div>
          <Button>Primary action</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card surface</CardTitle>
              <CardDescription>
                This should respond to card, border, foreground, and muted tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Type to inspect input styling" />
              <div className="flex gap-3">
                <Button>Save</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Watch radius, shadows, and typography here too.
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview block</CardTitle>
              <CardDescription>
                A second surface makes contrast and semantic tokens easier to spot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-4">
                Nested border container
              </div>
              <div className="flex gap-2">
                <Badge>Chart 1</Badge>
                <Badge variant="outline">Chart 2</Badge>
                <Badge variant="secondary">Chart 3</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
```

## 6. Start the app

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 7. Typical edit loop

Library repo:

```bash
cd X:\webdev\package-convergence
npm run build
yalc publish --push
```

Test app repo:

```bash
cd X:\webdev\test-convergence
yalc update convergence-ui
npm install
```

If the app is already running, Next.js usually picks up the updated package after the install. If not, restart `npm run dev`.

## 8. What to verify

- Floating Convergence trigger appears
- Opening the panel shows the new live preview area
- Color edits update the test app immediately
- Light and dark mode tokens export correctly
- shadcn surfaces respond to radius, border, and shadow changes
- Copy export produces usable CSS / Tailwind output
- Accessibility scores change when contrast changes

## Useful cleanup commands

Remove the linked local package:

```bash
yalc remove convergence-ui
npm install
```

Reset all yalc references in the test app:

```bash
yalc retreat
npm install
```
