// colorUtils.ts (Recreated for 4-Color Palettes)
// Based on research into Material Design principles and accessibility best practices.

// --- Core Color Conversion & Calculation ---

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const sanitizedHex = hex.startsWith("#") ? hex.slice(1) : hex;
  if (sanitizedHex.length === 3) {
    const shorthandRegex = /^([a-f\d])([a-f\d])([a-f\d])$/i;
    const result = shorthandRegex.exec(sanitizedHex);
    return result
      ? {
          r: parseInt(result[1] + result[1], 16),
          g: parseInt(result[2] + result[2], 16),
          b: parseInt(result[3] + result[3], 16),
        }
      : null;
  }
  if (sanitizedHex.length === 6) {
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(sanitizedHex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
  return null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number): string => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const { r, g, b } = rgb;
  const [R, G, B] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

export const getContrastRatio = (color1: string, color2: string): number => {
  try {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch (error) {
    console.error("Error calculating contrast ratio:", error, color1, color2);
    return 1;
  }
};

export const hexToHsl = (hex: string): { h: number; s: number; l: number } | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let { r, g, b } = rgb;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
};

export const hslToHex = (h: number, s: number, l: number): string => {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
};

// --- Color Role Assignment Logic for 4 Colors ---

interface ColorInfo {
  hex: string;
  luminance: number;
  hsl: { h: number; s: number; l: number } | null;
  originalIndex: number;
}

// Simplified ColorRoles interface for a 4-color system
export interface ColorRoles {
  background: string; // Primary background
  primary: string;    // Primary content/element color (often cards/surfaces)
  accent: string;     // Accent color for CTAs, highlights
  text: string;       // Main text color (on background)
  textOnPrimary: string; // Text on primary color surfaces
  textOnAccent: string;  // Text on accent color elements
  border: string;     // Subtle border/divider color
}

// Helper to find the best text color (black or white) for a given background
const getAccessibleTextColor = (bgHex: string, minimumContrast = 4.5): string => {
  const contrastWithWhite = getContrastRatio(bgHex, "#FFFFFF");
  const contrastWithBlack = getContrastRatio(bgHex, "#000000");

  if (contrastWithWhite >= minimumContrast && contrastWithBlack >= minimumContrast) {
    // If both meet contrast, prefer the one with higher contrast
    return contrastWithWhite > contrastWithBlack ? "#FFFFFF" : "#000000";
  } else if (contrastWithWhite >= minimumContrast) {
    return "#FFFFFF";
  } else if (contrastWithBlack >= minimumContrast) {
    return "#000000";
  } else {
    // Fallback if neither meets minimum contrast (should be rare with good palettes)
    // Return the one with higher contrast, even if insufficient
    console.warn(`Neither white nor black text meets WCAG AA contrast (${minimumContrast}:1) on background ${bgHex}`);
    return contrastWithWhite > contrastWithBlack ? "#FFFFFF" : "#000000";
  }
};

// Helper to adjust lightness
const adjustLightness = (hex: string, amount: number): string => {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  const newL = Math.max(0, Math.min(100, hsl.l + amount));
  return hslToHex(hsl.h, hsl.s, newL);
};

/**
 * Assigns semantic roles to a palette of 4 colors (Light Mode Only).
 * Aims for WCAG AA accessibility (4.5:1 for text, 3:1 for UI elements).
 *
 * @param palette - An array of exactly 4 hex color strings.
 * @returns A ColorRoles object or null if input is invalid.
 */
export const assignColorRolesForFour = (
  palette: string[]
): ColorRoles | null => {
  if (!Array.isArray(palette) || palette.length !== 4) {
    console.error("Palette must be an array of exactly 4 hex colors.");
    return null;
  }

  // 1. Analyze Palette Colors
  const colorInfos: ColorInfo[] = palette.map((hex, index) => ({
    hex: hex,
    luminance: getLuminance(hex),
    hsl: hexToHsl(hex),
    originalIndex: index,
  }));

  // Sort by luminance (darkest to brightest)
  const sortedByLuminance = [...colorInfos].sort((a, b) => a.luminance - b.luminance);

  // 2. Assign Background and Primary/Surface (Light Mode: Brightest = Background)
  let background: ColorInfo = sortedByLuminance[3]; // Brightest
  let primary: ColorInfo = sortedByLuminance[2];    // Second brightest as primary surface

  // Ensure primary surface has some contrast with background (at least 1.3:1 recommended)
  if (getContrastRatio(background.hex, primary.hex) < 1.3) {
      // If too similar, try the next available color or adjust lightness slightly
      const nextOptionIndex = 1; // Second darkest in light mode
      if (getContrastRatio(background.hex, sortedByLuminance[nextOptionIndex].hex) >= 1.3) {
          primary = sortedByLuminance[nextOptionIndex];
      } else {
          // Adjust lightness as a fallback (make slightly darker)
          primary = { ...primary, hex: adjustLightness(primary.hex, -5) };
          console.warn(`Adjusted primary color lightness due to low contrast with background.`);
      }
  }

  // 3. Assign Text Colors for Background and Primary
  const textOnBackground = getAccessibleTextColor(background.hex);
  const textOnPrimary = getAccessibleTextColor(primary.hex);

  // 4. Assign Accent and Text on Accent
  // Use the remaining color that has the highest saturation or best contrast as accent
  const remainingColors = colorInfos.filter(
    c => c.hex !== background.hex && c.hex !== primary.hex
  );

  if (remainingColors.length !== 1) {
      // Fallback: use the most saturated of the original palette not already used
      const usedHex = [background.hex, primary.hex];
      const potentialAccents = colorInfos.filter(c => !usedHex.includes(c.hex))
                                       .sort((a, b) => (b.hsl?.s ?? 0) - (a.hsl?.s ?? 0));
      if (potentialAccents.length > 0) {
          remainingColors[0] = potentialAccents[0];
          console.warn("Fallback logic used to determine accent color.");
      } else {
          // Absolute fallback: slightly modify primary (make darker)
          remainingColors[0] = { ...primary, hex: adjustLightness(primary.hex, -15) };
          console.error("Could not determine a distinct accent color. Using modified primary.");
      }
  }

  let accent = remainingColors[0];

  // Ensure accent has sufficient contrast (3:1) against the primary surface for UI elements
  if (getContrastRatio(accent.hex, primary.hex) < 3) {
      // Try adjusting accent lightness towards better contrast
      const needsDarker = getLuminance(accent.hex) > getLuminance(primary.hex);
      let adjustedAccentHex = accent.hex;
      let foundBetterAccent = false;
      for (let i = 1; i <= 4; i++) { // Try adjusting up to 20%
          adjustedAccentHex = adjustLightness(accent.hex, needsDarker ? -5 * i : 5 * i);
          if (getContrastRatio(adjustedAccentHex, primary.hex) >= 3) {
              accent = { ...accent, hex: adjustedAccentHex };
              foundBetterAccent = true;
              console.warn(`Adjusted accent color lightness for better contrast on primary surface.`);
              break;
          }
      }
      if (!foundBetterAccent) {
          console.warn(`Accent color ${accent.hex} might lack contrast (needs 3:1) with primary surface ${primary.hex}.`);
      }
  }

  const textOnAccent = getAccessibleTextColor(accent.hex, 3.0); // Use 3:1 for UI elements/buttons

  // 5. Define Border Color (Light Mode: Slightly darker version)
  let border = adjustLightness(primary.hex, -10);
  // Ensure border has *some* visible difference from primary surface
  if (getContrastRatio(border, primary.hex) < 1.15) {
      border = adjustLightness(primary.hex, -15);
  }
  // Ensure border also has some difference from background
   if (getContrastRatio(border, background.hex) < 1.15) {
       border = adjustLightness(background.hex, -10);
   }


  // 6. Final Assembly
  const finalRoles: ColorRoles = {
    background: background.hex,
    primary: primary.hex,
    accent: accent.hex,
    text: textOnBackground,
    textOnPrimary: textOnPrimary,
    textOnAccent: textOnAccent,
    border: border,
  };

  // Final contrast validation (optional but recommended)
  if (getContrastRatio(finalRoles.text, finalRoles.background) < 4.5) console.warn(`Low contrast: text (${finalRoles.text}) on background (${finalRoles.background})`);
  if (getContrastRatio(finalRoles.textOnPrimary, finalRoles.primary) < 4.5) console.warn(`Low contrast: textOnPrimary (${finalRoles.textOnPrimary}) on primary (${finalRoles.primary})`);
  // Check accent text contrast (using 3:1 minimum for UI elements)
  if (getContrastRatio(finalRoles.textOnAccent, finalRoles.accent) < 3) console.warn(`Low contrast: textOnAccent (${finalRoles.textOnAccent}) on accent (${finalRoles.accent}) - may fail WCAG AA for UI controls`);
  // Check accent contrast on primary surface (common for buttons)
  if (getContrastRatio(finalRoles.accent, finalRoles.primary) < 3) console.warn(`Low contrast: accent (${finalRoles.accent}) on primary surface (${finalRoles.primary}) - may fail WCAG AA for UI controls`);

  return finalRoles;
};

// --- Other Utilities ---

// Generate gradient CSS (Unchanged)
export const generateGradient = (
  colors: string[],
  type: 'linear' | 'radial' | 'conic' = 'linear',
  angle: number = 90
): string => {
  if (colors.length < 2) return '';
  switch (type) {
    case 'linear': return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
    case 'radial': return `radial-gradient(circle, ${colors.join(', ')})`;
    case 'conic': return `conic-gradient(from ${angle}deg, ${colors.join(', ')})`;
    default: return `linear-gradient(to right, ${colors.join(', ')})`;
  }
};

// Suggest usage based on the assigned role (Updated for 4-color roles)
export const getSuggestedUsage = (color: string, role: keyof ColorRoles): string => {
  const roleDescriptions: Record<keyof ColorRoles, string> = {
    background: "Main Background",
    primary: "Primary Surface (Cards, Sections)",
    accent: "Accent Color (Buttons, Highlights, Links)",
    text: "Main Text (on Background)",
    textOnPrimary: "Text on Primary Surfaces",
    textOnAccent: "Text on Accent Elements (e.g., Buttons)",
    border: "Borders & Dividers"
  };
  return roleDescriptions[role] || "General Use";
};




