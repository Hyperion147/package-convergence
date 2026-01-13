import React, { useState } from "react";
import { ThemeManager, ThemeConfig } from "../engine";

const initialTheme: ThemeConfig = {
    primary: { l: 0.6, c: 0.15, h: 250 },
    background: { l: 0.98, c: 0.01, h: 250 },
    foreground: { l: 0.1, c: 0.02, h: 250 },
};

// Initialize manager outside or in a Ref
const manager = new ThemeManager(initialTheme);

export function ThemeGenerator() {
    const [primary, setPrimary] = useState(initialTheme.primary);

    const handleUpdate = (newValues: Partial<typeof primary>) => {
        setPrimary((prev) => {
            const updated = { ...prev, ...newValues };
            manager.updateColor("primary", updated);
            return updated;
        });
    };

    return (
        <div className="p-6 bg-card border rounded-lg shadow-sm w-80">
            <h3 className="text-lg font-bold mb-4">Theme Editor (OKLCH)</h3>

            <div className="space-y-4">
                <label>Lightness: {Math.round(primary.l * 100)}%</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={primary.l}
                    onChange={(e) =>
                        handleUpdate({ l: parseFloat(e.target.value) })
                    }
                />

                <label>Chroma: {primary.c.toFixed(2)}</label>
                <input
                    type="range"
                    min="0"
                    max="0.37"
                    step="0.01"
                    value={primary.c}
                    onChange={(e) =>
                        handleUpdate({ c: parseFloat(e.target.value) })
                    }
                />

                <label>Hue: {Math.round(primary.h)}°</label>
                <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={primary.h}
                    onChange={(e) =>
                        handleUpdate({ h: parseFloat(e.target.value) })
                    }
                />
            </div>

            <button
                onClick={() => console.log(manager.generateCSS())}
                className="mt-6 w-full bg-primary text-white py-2 rounded"
            >
                Export CSS
            </button>
        </div>
    );
}
