import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Copy, Share2, Heart, Palette,
  Tag, ThumbsUp, Calendar, Undo, Redo, X, FileDown
} from 'lucide-react';
import { getMockPaletteById, ColorPalette } from '../data/mockData';
import ColorSwatch from '../components/palette/ColorSwatch';
import MockupPreview from '../components/mockup/MockupPreview';
import { assignColorRolesForFour, getSuggestedUsage, ColorRoles } from '../utils/colorUtils';
import GradientGenerator from '../components/gradient/GradientGenerator';

const initialColorRoles: ColorRoles = {
  background: '#ffffff',
  primary: '#f0f0f0',
  accent: '#007bff',
  text: '#000000',
  textOnPrimary: '#000000',
  textOnAccent: '#ffffff',
  border: '#dddddd',
};

// Update ColorHistory to include selectedFont
interface ColorHistory {
  roles: ColorRoles;
  font: string;
  timestamp: number;
}

// Custom Color Picker Component with 2D selection
interface ColorPickerProps {
  initialColor: string;
  onLiveColorChange?: (color: string) => void;
}

type ColorPickerRef = {
  getCurrentColor: () => string;
};

const ColorPicker = React.memo(React.forwardRef<ColorPickerRef, ColorPickerProps>(({ initialColor, onLiveColorChange }, ref) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [pickerPosition, setPickerPosition] = useState({ x: 50, y: 50 });
  const colorAreaRef = useRef<HTMLDivElement>(null);

  // Helper to convert hex to HSL
  const hexToHsl = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, []);

  // Helper to convert hex to RGB
  const hexToRgb = useCallback((hex: string) => {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16)
    };
  }, []);

  // Helper to convert RGB to HSL
  const rgbToHsl = useCallback((rgb: { r: number; g: number; b: number }) => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

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

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, []);

  // Helper to convert HSL to hex
  const hslToHex = useCallback((h: number, s: number, l: number) => {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (sNorm === 0) {
      r = g = b = lNorm;
    } else {
      const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
      const p = 2 * lNorm - q;
      r = hue2rgb(p, q, hNorm + 1 / 3);
      g = hue2rgb(p, q, hNorm);
      b = hue2rgb(p, q, hNorm - 1 / 3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);

  // Initialize HSL and picker position from initialColor on mount or initialColor change
  useEffect(() => {
    if (initialColor && initialColor.length === 7 && initialColor.startsWith('#')) {
      const hsl = hexToHsl(initialColor);
      if (hsl && typeof hsl.h === 'number' && typeof hsl.s === 'number' && typeof hsl.l === 'number') {
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);

        // Set picker position based on saturation and lightness
        setPickerPosition({
          x: hsl.s,
          y: 100 - hsl.l
        });
      }
    }
  }, [initialColor, hexToHsl]);

  // Derive hex and rgb from HSL, and notify parent when HSL changes
  const currentColor = useMemo(() => hslToHex(hue, saturation, lightness), [hue, saturation, lightness, hslToHex]);
  const currentRgb = useMemo(() => hexToRgb(currentColor), [currentColor, hexToRgb]);

  // Handle 2D color area click
  const handleColorAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!colorAreaRef.current) return;

    const rect = colorAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Update saturation and lightness based on click position
    const newSaturation = Math.max(0, Math.min(100, x));
    const newLightness = Math.max(0, Math.min(100, 100 - y));

    setPickerPosition({ x: newSaturation, y: 100 - newLightness });
    setSaturation(newSaturation);
    setLightness(newLightness);
  };

  // Handle RGB input changes
  const handleRgbChange = useCallback((component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...currentRgb, [component]: value };
    const hsl = rgbToHsl(newRgb);
    if (hsl.h !== hue) setHue(hsl.h);
    if (hsl.s !== saturation) setSaturation(hsl.s);
    if (hsl.l !== lightness) setLightness(hsl.l);
    setPickerPosition({ x: hsl.s, y: 100 - hsl.l });
  }, [currentRgb, rgbToHsl, hue, saturation, lightness]);

  // Handle Hex input changes
  const handleHexChange = useCallback((value: string) => {
    if (/^#?([0-9A-Fa-f]{1,6})$/.test(value)) {
      if (value.length === 7 && value.startsWith('#')) {
        try {
          const rgbValues = hexToRgb(value);
          const hsl = rgbToHsl(rgbValues);
          if (hsl.h !== hue) setHue(hsl.h);
          if (hsl.s !== saturation) setSaturation(hsl.s);
          if (hsl.l !== lightness) setLightness(hsl.l);
          setPickerPosition({ x: hsl.s, y: 100 - hsl.l });
        } catch (e) {
          console.error("Invalid hex input during conversion:", value, e);
        }
      }
    }
  }, [hexToRgb, rgbToHsl, hue, saturation, lightness]);

  React.useImperativeHandle(ref, () => ({
    getCurrentColor: () => currentColor
  }), [currentColor]);

  useEffect(() => {
    if (onLiveColorChange) {
      onLiveColorChange(currentColor);
    }
  }, [currentColor, onLiveColorChange]);

  return (
    <div className="space-y-4">
      {/* 2D Color selection area */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Custom Color</label>
        <div
          ref={colorAreaRef}
          className="relative w-full h-48 rounded-lg border-2 border-gray-200 cursor-crosshair"
          onClick={handleColorAreaClick}
          style={{
            background: `linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, hsl(${hue}, 100%, 50%))`
          }}
        >
          {/* Color picker dot */}
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${pickerPosition.x}%`,
              top: `${pickerPosition.y}%`,
              backgroundColor: currentColor
            }}
          />
        </div>
      </div>

      {/* Hue slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Hue</label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="w-full h-4 rounded-lg appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
            }}
          />
        </div>
      </div>

      {/* RGB sliders */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">RGB Values</h4>

        {/* Red slider */}
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-600 w-4">R</label>
          <input
            type="range"
            min="0"
            max="255"
            value={currentRgb.r}
            onChange={(e) => handleRgbChange('r', Number(e.target.value))}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black to-red-500"
          />
          <span className="text-sm text-gray-600 w-8 text-right">{currentRgb.r}</span>
        </div>

        {/* Green slider */}
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-600 w-4">G</label>
          <input
            type="range"
            min="0"
            max="255"
            value={currentRgb.g}
            onChange={(e) => handleRgbChange('g', Number(e.target.value))}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black to-green-500"
          />
          <span className="text-sm text-gray-600 w-8 text-right">{currentRgb.g}</span>
        </div>

        {/* Blue slider */}
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-600 w-4">B</label>
          <input
            type="range"
            min="0"
            max="255"
            value={currentRgb.b}
            onChange={(e) => handleRgbChange('b', Number(e.target.value))}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black to-blue-500"
          />
          <span className="text-sm text-gray-600 w-8 text-right">{currentRgb.b}</span>
        </div>
      </div>

      {/* Hex input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Hex Color</label>
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded border-2 border-gray-200"
            style={{ backgroundColor: currentColor }}
          />
          <input
            type="text"
            value={currentColor} // Display derived hex
            onChange={(e) => handleHexChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="#ffffff"
          />
        </div>
      </div>
    </div>
  );
}));

// Font selector component
interface FontSelectorProps {
  currentFont: string;
  onFontChange: (font: string) => void;
}

const fontList = [
  { name: 'Inter', preview: 'The quick brown fox jumps' },
  { name: 'Arial', preview: 'The quick brown fox jumps' },
  { name: 'Helvetica', preview: 'The quick brown fox jumps' },
  { name: 'Georgia', preview: 'The quick brown fox jumps' },
  { name: 'Times New Roman', preview: 'The quick brown fox jumps' },
  { name: 'Verdana', preview: 'The quick brown fox jumps' },
  { name: 'Courier New', preview: 'The quick brown fox jumps' },
  { name: 'Trebuchet MS', preview: 'The quick brown fox jumps' },
  { name: 'Tahoma', preview: 'The quick brown fox jumps' },
  { name: 'Palatino', preview: 'The quick brown fox jumps' },
  { name: 'Garamond', preview: 'The quick brown fox jumps' },
  { name: 'Bookman', preview: 'The quick brown fox jumps' },
  { name: 'Comic Sans MS', preview: 'The quick brown fox jumps' },
  { name: 'Impact', preview: 'The quick brown fox jumps' },
  { name: 'Lucida Console', preview: 'The quick brown fox jumps' },
  { name: 'Century Gothic', preview: 'The quick brown fox jumps' }
];

const FontSelector: React.FC<FontSelectorProps> = React.memo(({ currentFont, onFontChange }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Font Family</h4>
      <div className="max-h-64 overflow-y-auto space-y-1">
        {fontList.map((font) => {
          const handleFontClick = useCallback(() => onFontChange(font.name), [onFontChange, font.name]);
          return (
            <button
              key={font.name}
              onClick={handleFontClick}
              className={`w-full text-left p-3 rounded-md border transition-colors ${currentFont === font.name
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm" style={{ fontFamily: font.name }}>
                {font.name}
              </div>
              <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: font.name }}>
                {font.preview}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

// Helper to format date
const formatDate = (timestamp: number | undefined): string => {
  if (timestamp === undefined || timestamp === null) return 'N/A';
  try {
    const numericTimestamp = Number(timestamp);
    if (isNaN(numericTimestamp)) return 'Invalid Date';
    return new Date(numericTimestamp).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid Date';
  }
};

const PaletteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const [colorRoles, setColorRoles] = useState<ColorRoles>(initialColorRoles);
  const [selectedRole, setSelectedRole] = useState<keyof ColorRoles | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [tempColor, setTempColor] = useState('#ffffff'); // This holds the color being picked in the custom picker
  const [livePickerColor, setLivePickerColor] = useState<string>(tempColor);

  // History state for undo/redo
  const [colorHistory, setColorHistory] = useState<ColorHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < colorHistory.length - 1;

  // Function to add state to history
  const addToHistory = useCallback((newRoles: ColorRoles, newFont: string = selectedFont) => {
    if (
      historyIndex >= 0 &&
      JSON.stringify(colorHistory[historyIndex].roles) === JSON.stringify(newRoles) &&
      colorHistory[historyIndex].font === newFont
    ) {
      return;
    }
    const newHistory = colorHistory.slice(0, historyIndex + 1);
    newHistory.push({ roles: newRoles, font: newFont, timestamp: Date.now() });
    setColorHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [colorHistory, historyIndex, selectedFont]);

  // Handle Undo
  const handleUndo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setColorRoles(colorHistory[newIndex].roles);
      setSelectedFont(colorHistory[newIndex].font);
    }
  }, [canUndo, historyIndex, colorHistory]);

  // Handle Redo
  const handleRedo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setColorRoles(colorHistory[newIndex].roles);
      setSelectedFont(colorHistory[newIndex].font);
    }
  }, [canRedo, historyIndex, colorHistory]);

  // Export color roles
  const handleExportColorRoles = useCallback(() => {
    const exportData = {
      colorRoles,
      selectedFont,
      palette: {
        name: palette?.name,
        originalColors: palette?.hex_codes?.slice(0, 4)
      },
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-roles-${palette?.name?.replace(/\s+/g, '_') || 'palette'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [colorRoles, selectedFont, palette]);

  useEffect(() => {
    const loadPalette = async () => {
      if (!id) {
        navigate('/');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const paletteData = await getMockPaletteById(id);
        if (!paletteData) {
          setError('Palette not found.');
          setLoading(false);
          return;
        }
        setPalette(paletteData);
        setLiked(false);

        if (paletteData.hex_codes && paletteData.hex_codes.length >= 4) {
          const roles = assignColorRolesForFour(paletteData.hex_codes.slice(0, 4));
          if (roles) {
            setColorRoles(roles);
            const initialHistory = [{ roles, font: selectedFont, timestamp: Date.now() }];
            setColorHistory(initialHistory);
            setHistoryIndex(0);
          } else {
            console.error("Failed to assign color roles:", paletteData.hex_codes);
            setError('Failed to process palette colors.');
            setColorRoles(initialColorRoles);
            setColorHistory([]);
            setHistoryIndex(-1);
          }
        } else {
          console.error("Palette data incomplete:", paletteData);
          setError('Palette data is incomplete (needs 4 colors).');
          setColorRoles(initialColorRoles);
          setColorHistory([]);
          setHistoryIndex(-1);
        }
      } catch (err) {
        setError('Failed to load palette.');
        console.error('Error loading palette:', err);
        setColorRoles(initialColorRoles);
        setColorHistory([]);
        setHistoryIndex(-1);
      } finally {
        setLoading(false);
      }
    };
    loadPalette();
  }, [id, navigate]);

  // Update tempColor when selectedRole changes for initial picker value
  useEffect(() => {
    if (selectedRole) {
      setTempColor(colorRoles[selectedRole] || '#ffffff');
    }
  }, [selectedRole, colorRoles]);

  const handleLike = useCallback(() => setLiked(!liked), [liked]);

  const handleCopyPalette = useCallback(() => {
    if (!palette) return;
    const colorText = palette.hex_codes.slice(0, 4).join(', ');
    navigator.clipboard.writeText(colorText).then(() => {
      setIsCopied('palette');
      setTimeout(() => setIsCopied(null), 1500);
    }).catch(err => console.error('Failed to copy palette:', err));
  }, [palette]);

  const handleCopyColor = useCallback((color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      setIsCopied(color);
      setTimeout(() => setIsCopied(null), 1500);
    }).catch(err => console.error('Failed to copy color:', err));
  }, []);

  const handleShare = useCallback(async () => {
    if (!palette) return;
    const shareData = {
      title: palette.name || 'Color Palette',
      text: `Check out this beautiful color palette: ${palette.hex_codes.slice(0, 4).join(', ')}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  }, [palette]);

  const handleDownload = useCallback(() => {
    if (!palette) return;
    const paletteData = {
      name: palette.name,
      colors: palette.hex_codes.slice(0, 4),
      tags: palette.tags,
      appliedRoles: colorRoles,
    };
    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(palette.name || 'palette').replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [palette, colorRoles]);

  // Handle click on mockup element or role swatch to open modal
  const handleElementClick = useCallback((role: keyof ColorRoles | 'icon' | 'card_element') => {
    if (role !== 'icon' && role !== 'card_element') {
      setSelectedRole(role);
      // Initialize tempColor with the currently assigned color for the selected role
      setTempColor(colorRoles[role] || '#ffffff');
      setShowColorPicker(false); // Ensure custom picker is closed initially
    }
  }, [colorRoles]);

  // Handle color selection from preset colors (does NOT close modal immediately)
  const handlePresetColorSelect = useCallback((color: string) => {
    if (!selectedRole) return;
    const newRoles = {
      ...colorRoles,
      [selectedRole]: color
    };
    setColorRoles(newRoles);
    addToHistory(newRoles);
    // Don't close modal here, let the user see the change or pick custom
    // setSelectedRole(null);
    // setShowColorPicker(false);
  }, [selectedRole, colorRoles, addToHistory]);

  // Handle custom color from color picker (updates tempColor, doesn't close modal)
  const handleCustomColorChange = useCallback((color: string) => {
    setTempColor(color);
  }, []);

  // Apply the custom color and close modal
  const handleApplyCustomColor = useCallback(() => {
    if (!selectedRole) return;
    // Get color from ColorPicker's ref
    const pickedColor = colorPickerRef.current?.getCurrentColor?.() || tempColor;
    const newRoles = {
      ...colorRoles,
      [selectedRole]: pickedColor
    };
    setColorRoles(newRoles);
    addToHistory(newRoles);
    setSelectedRole(null);
    setShowColorPicker(false);
  }, [selectedRole, colorRoles, tempColor, addToHistory]);

  const displayRoles: (keyof ColorRoles)[] = useMemo(() => [
    'background', 'primary', 'accent', 'text',
    'textOnPrimary', 'textOnAccent', 'border'
  ], []);

  // Check if selected role is a text role
  const isTextRole = selectedRole && (selectedRole.includes('text') || selectedRole.includes('Text'));

  // Reference for ColorPicker
  const colorPickerRef = useRef<ColorPickerRef | null>(null);

  // When changing font, add to history
  const handleFontChange = useCallback((font: string) => {
    setSelectedFont(font);
    addToHistory(colorRoles, font);
  }, [colorRoles, addToHistory]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading palette...</p>
        </div>
      </div>
    );
  }

  if (error || !palette) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-lg text-red-600 mb-4">
            {error || 'Palette data could not be loaded.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const downloadCount = palette.downloads_count ?? 0;
  const creationDateTimestamp = palette.created_at ? Number(palette.created_at) : undefined;
  const validCreationDate = creationDateTimestamp && !isNaN(creationDateTimestamp) ? creationDateTimestamp : undefined;

  return (
    <div className="px-4 py-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 text-gray-900">
      <div className="container mx-auto space-y-8">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors "
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to palettes</span>
          </button>
        </div>

        {/* Section 1: Combined Palette Info & Gradient Generator */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Combined Palette Info Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
            {/* Top part: Name and Actions */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 flex-shrink-0 mr-4">
                  {palette.name || 'Unnamed Palette'}
                </h1>
                <div className="flex space-x-2 text-gray-500 flex-wrap">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${liked ? 'text-red-500 bg-red-100' : 'hover:bg-gray-100 hover:text-red-500'}`}
                    aria-label={liked ? "Unlike" : "Like"}
                    title={liked ? "Unlike" : "Like"}
                  >
                    <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleCopyPalette}
                    className="p-2 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition-colors relative"
                    aria-label="Copy 4-color palette HEX codes"
                    title="Copy 4-color palette HEX codes"
                  >
                    <Copy className="h-5 w-5" />
                    {isCopied === 'palette' && (
                      <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 bg-indigo-600 text-white rounded shadow-lg">Copied!</span>
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition-colors relative"
                    aria-label="Share palette"
                    title="Share palette"
                  >
                    <Share2 className="h-5 w-5" />
                    {shareSuccess && (
                      <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 bg-green-600 text-white rounded shadow-lg">Link Copied!</span>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                    aria-label="Download palette data (JSON)"
                    title="Download palette data (JSON)"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Middle part: Color Strip with details */}
            <div className="p-4 flex-grow">
              <div className="flex w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm mb-2">
                {palette.hex_codes.slice(0, 4).map((color, index) => {
                  const hex = color.toUpperCase();
                  let rgb = 'rgb(N/A)';
                  try {
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    rgb = `rgb(${r}, ${g}, ${b})`;
                  } catch (e) { /* Ignore parsing errors */ }

                  return (
                    <div
                      key={index}
                      className="flex-1 text-center cursor-pointer group relative transition-all duration-200 ease-out hover:flex-grow-[1.2] bg-white pb-2"
                      onClick={() => handleCopyColor(hex)}
                      title={`Click to copy ${hex}`}
                    >
                      <div
                        className="h-16 relative transition-all duration-200 ease-out group-hover:scale-x-105"
                        style={{ backgroundColor: color }}
                      />
                      <div className="mt-1">
                        <div
                          className={`text-xs font-mono mx-1 px-1 py-0.5 rounded transition-colors inline-block border border-gray-300 ${isCopied === hex ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                        >
                          {isCopied === hex ? 'Copied!' : hex}
                        </div>
                        <div className="text-xs mt-0.5 text-gray-500">
                          {rgb}
                        </div>
                      </div>
                      {isCopied === hex && (
                        <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 bg-indigo-600 text-white rounded shadow-lg z-10">Copied!</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gradient Generator Section */}
          <div className="flex-grow shadow-lg flex items-center justify-center">
            <GradientGenerator colors={palette.hex_codes.slice(0, 4)} />
          </div>
        </section>

        {/* Section 2: Assigned Color Roles */}
        <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Assigned Color Roles</h2>
          <p className="text-sm text-gray-600 mb-4">Click a role's color swatch below to assign a different color using the palette colors, black, or white. These roles are used in the UI Preview.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {displayRoles.map((role) => {
              const color = colorRoles[role];
              if (!color) return null;
              const displayRoleName = role.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <ColorSwatch
                  key={role}
                  color={color}
                  role={displayRoleName}
                  usage={getSuggestedUsage(role)}
                  onClick={() => handleElementClick(role)}
                  isSelected={selectedRole === role}
                />
              );
            })}
          </div>
        </section>

        {/* Section 3: UI Mockup Preview */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 -mx-4 sm:mx-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl  text-gray-800 flex items-center font-semibold ">
              <Palette className="h-5 w-5 mr-2 text-indigo-600" />
              UI Preview
            </h2>
            <div className="flex space-x-2">
              {/* Export Button */}
              <button
                onClick={handleExportColorRoles}
                className="p-2.5 rounded-lg border bg-white hover:bg-green-50 border-gray-300 hover:border-green-300 text-gray-700 hover:text-green-700 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                aria-label="Export Color Roles"
                title="Export Color Roles & Settings"
              >
                <FileDown className="h-4 w-4" />
              </button>

              {/* Undo/Redo Controls */}
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={`
                  p-2.5 rounded-lg border transition-all duration-200 font-medium text-sm
                  ${canUndo
                    ? 'bg-white hover:bg-indigo-50 border-gray-300 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                    : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
                aria-label="Undo Role Assignment Change"
                title="Undo Role Assignment Change"
              >
                <Undo className="h-4 w-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className={`
                  p-2.5 rounded-lg border transition-all duration-200 font-medium text-sm
                  ${canRedo
                    ? 'bg-white hover:bg-indigo-50 border-gray-300 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                    : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
                aria-label="Redo Role Assignment Change"
                title="Redo Role Assignment Change"
              >
                <Redo className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="w-full max-w-none">
            <MockupPreview
              colorRoles={colorRoles}
              onElementClick={handleElementClick}
              fontFamily={selectedFont === 'Inter'
                ? "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
                : `${selectedFont}, sans-serif`}
            />
          </div>
        </section>

        {/* Section 4: Palette Info */}
        <section className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Palette Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <Tag className="h-4 w-4 mt-0.5 text-indigo-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Tags</span>
                {palette.tags && palette.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {palette.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span>No tags</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Likes</span>
                <span>{palette.likes_count + (liked ? 1 : 0)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Downloads</span>
                <span>{downloadCount}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Created</span>
                <span>{formatDate(validCreationDate)}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Modal for Changing Color Role */}
      {selectedRole && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-2"
          onClick={() => {
            setSelectedRole(null);
            setShowColorPicker(false);
          }}
        >
          <div
            className="rounded-lg p-4 shadow-xl max-w-3xl w-full border bg-white border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">
                Customize '{selectedRole.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}'
              </h3>
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setShowColorPicker(false);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - 2 Column Responsive Layout */}
            {!showColorPicker ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Left: Suggested Colors + Custom Picker Button */}
                <div className="flex flex-col ">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Suggested Colors</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                      {[...palette.hex_codes.slice(0, 4), "#FFFFFF", "#000000"].map((color, index) => (
                        <button
                          key={index}
                          className={`h-14 w-full rounded border border-gray-300 hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${color === "#FFFFFF" ? "shadow-inner" : ""} ${color === "#000000" ? "shadow-inner" : ""}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handlePresetColorSelect(color)}
                          aria-label={`Select color ${color} for ${selectedRole}`}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowColorPicker(true)}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded hover:border-indigo-400 hover:bg-indigo-50 text-xs text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    + Choose Custom Color
                  </button>
                </div>
                {/* Right: FontSelector (if text role) + Preview (symmetrical height) */}
                <div className="flex flex-col h-full justify-between">
                  {isTextRole && (
                    <div className="mb-2">
                      <FontSelector
                        currentFont={selectedFont}
                        onFontChange={handleFontChange}
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Preview</h4>
                    <div className="p-2 border border-gray-200 rounded bg-gray-50 flex items-center justify-center h-16">
                      <div
                        className="w-full h-12 rounded border flex items-center justify-center text-xs font-medium transition-all duration-200"
                        style={{
                          backgroundColor: !isTextRole
                            ? (selectedRole ? colorRoles[selectedRole] : '#ffffff')
                            : '#f3f4f6',
                          color: isTextRole
                            ? (selectedRole ? colorRoles[selectedRole] : '#000000')
                            : ((selectedRole ? colorRoles[selectedRole] : '#ffffff') === '#ffffff' ? '#374151' : '#ffffff'),
                          fontFamily: isTextRole
                            ? (selectedFont === 'Inter'
                                ? "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
                                : `${selectedFont}, sans-serif`)
                            : 'inherit'
                        }}
                      >
                        {selectedRole.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Preview
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => {
                        setSelectedRole(null);
                        setShowColorPicker(false);
                      }}
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded shadow transition-colors border border-gray-300"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Left: Color Picker */}
                <div className="flex flex-col h-full justify-between">
                  <ColorPicker
                    ref={colorPickerRef}
                    initialColor={tempColor}
                    onLiveColorChange={setLivePickerColor}
                  />
                </div>
                {/* Right: FontSelector (if text role), Suggested Colors, Preview, Actions */}
                <div className="flex flex-col h-full justify-between">
                  {isTextRole && (
                    <div className="mb-2">
                      <FontSelector
                        currentFont={selectedFont}
                        onFontChange={handleFontChange}
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Suggested Colors</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                      {[...palette.hex_codes.slice(0, 4), "#FFFFFF", "#000000"].map((color, index) => (
                        <button
                          key={index}
                          className={`h-8 w-full rounded border border-gray-300 hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${color === "#FFFFFF" ? "shadow-inner" : ""} ${color === "#000000" ? "shadow-inner" : ""}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handlePresetColorSelect(color)}
                          aria-label={`Select color ${color} for ${selectedRole}`}
                          title={color}
                        />
                      ))}
                    </div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Preview</h4>
                    <div className="p-2 border border-gray-200 rounded bg-gray-50 flex items-center justify-center h-16 mb-2">
                      <div
                        className="w-full h-12 rounded border flex items-center justify-center text-xs font-medium transition-all duration-200"
                        style={{
                          backgroundColor: !isTextRole
                            ? (showColorPicker ? livePickerColor : (selectedRole ? colorRoles[selectedRole] : '#ffffff'))
                            : '#f3f4f6',
                          color: isTextRole
                            ? (showColorPicker ? livePickerColor : (selectedRole ? colorRoles[selectedRole] : '#000000'))
                            : ((showColorPicker ? livePickerColor : (selectedRole ? colorRoles[selectedRole] : '#ffffff')) === '#ffffff' ? '#374151' : '#ffffff'),
                          fontFamily: isTextRole
                            ? (selectedFont === 'Inter'
                                ? "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
                                : `${selectedFont}, sans-serif`)
                            : 'inherit'
                        }}
                      >
                        {selectedRole.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Preview
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setSelectedRole(null);
                        setShowColorPicker(false);
                      }}
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded shadow transition-colors border border-gray-300"
                    >
                      Done
                    </button>
                    <button
                      onClick={handleApplyCustomColor}
                      className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition-colors border border-indigo-700"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaletteDetailPage;