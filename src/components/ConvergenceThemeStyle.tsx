import React from "react";
import { ThemeDefinition } from "../types";
import { createThemeCss } from "../core/exporters";

interface ConvergenceThemeStyleProps {
  definition: ThemeDefinition;
  id?: string;
}

export function ConvergenceThemeStyle({
  definition,
  id = "convergence-theme-ssr",
}: ConvergenceThemeStyleProps) {
  return <style id={id} dangerouslySetInnerHTML={{ __html: createThemeCss(definition) }} />;
}
