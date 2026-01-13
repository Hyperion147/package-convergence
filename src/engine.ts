export interface OklchColor {
    l: number;
    c: number;
    h: number;
}

export interface ThemeConfig {
    background: OklchColor;
    foreground: OklchColor;
    primary: OklchColor;
    // // primary-foreground: ;
    // secondary: OklchColor;
    // // secondary-foreground: oklch(0.35 0.07 41.41);
    // muted: OklchColor;
    // // muted-foreground: oklch(0.50 0 0);
    // accent: OklchColor;
    // // accent-foreground: oklch(0.24 0 0);
    // destructive: OklchColor;
    // border: OklchColor;
}

export class ThemeManager {
    private config: ThemeConfig;

    constructor(initialConfig: ThemeConfig) {
        this.config = initialConfig;
        this.applyAll();
    }

    updateColor(key: keyof ThemeConfig, values: Partial<OklchColor>) {
        this.config[key] = { ...this.config[key], ...values };
        const { l, c, h } = this.config[key];

        document.documentElement.style.setProperty(
            `--${key}`,
            `${l.toFixed(3)} ${h.toFixed(3)} ${h.toFixed(1)}`
        );
    }

    private applyAll() {
        (Object.keys(this.config) as Array<keyof ThemeConfig>).forEach(
            (key) => {
                this.updateColor(key, {});
            }
        );
    }

    generateCSS(): string {
        return `:root {\n${Object.entries(this.config)
            .map(([key, { l, c, h }]) => ` --${key}: ${l} ${c} ${h};`)
            .join("\n")}\n}`;
    }
}
