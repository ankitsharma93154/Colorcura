// MockupPreview.tsx (Light Mode Only) - Full Width Version
import React from 'react';
import { Palette, Shuffle, LayoutGrid, Feather, Star, Heart, Copy, Download } from 'lucide-react';
import { ColorRoles } from '../../utils/colorUtils';

interface MockupPreviewProps {
  colorRoles: ColorRoles;
  onElementClick: (element: keyof ColorRoles | 'icon' | 'card_element') => void;
  likedPalettes?: Set<number>;
  toggleLike?: (index: number) => void;
}

const featuredPalettes = [
  { name: 'Ocean Mist', colors: ['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5'], likes: 312 },
  { name: 'City Lights', colors: ['#4A4A4A', '#9B9B9B', '#F5A623', '#7ED321'], likes: 258 },
  { name: 'Deep Sea', colors: ['#003B46', '#07575B', '#66A5AD', '#C4DFE6'], likes: 199 }
];

const MockupPreview: React.FC<MockupPreviewProps> = ({ 
  colorRoles, 
  onElementClick,
  likedPalettes = new Set(),
  toggleLike = () => {}
}) => {
  const { 
    background, primary, accent, text, 
    textOnPrimary, textOnAccent, border 
  } = colorRoles;

  return (
    <div 
      className="w-full rounded-lg overflow-hidden shadow-xl border cursor-pointer"
      style={{ backgroundColor: background, borderColor: border }}
      onClick={() => onElementClick('background')} 
      title="Click to change Background role"
    >
      {/* Header - primary role */}
      <header
        className="px-6 py-4 flex justify-between items-center border-b cursor-pointer"
        style={{ backgroundColor: primary, borderColor: border, color: textOnPrimary }}
        onClick={(e) => { e.stopPropagation(); onElementClick('primary'); }}
        title="Click to change Primary role"
      >
        <div className="flex items-center space-x-3" onClick={(e) => { e.stopPropagation(); onElementClick('textOnPrimary'); }}
              title="Click to change Text on Primary role">
          <Palette className="w-7 h-7" style={{ color: accent }} onClick={(e) => { e.stopPropagation(); onElementClick('accent'); }}/>
          <div className="font-bold text-xl tracking-tight">
            ColorVerse
          </div>
        </div>
        <nav className="flex items-center space-x-6">
          {["Explore", "Generate", "Tools", "About"].map((item) => (
            <div 
              key={item} 
              className="font-medium text-sm hover:opacity-70 cursor-pointer transition-opacity"
              onClick={(e) => { e.stopPropagation(); onElementClick('textOnPrimary'); }}
              title="Click to change Text on Primary role"
            >
              {item}
            </div>
          ))}
        </nav>
      </header>
      
      {/* Hero Section - background role */}
      <section 
        className="px-8 py-16 md:py-24 text-center flex flex-col items-center cursor-pointer"
        style={{ backgroundColor: background }} 
        onClick={(e) => { e.stopPropagation(); onElementClick('background'); }}
        title="Click to change Background role"
      >
        <div 
          className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-md transform rotate-[-15deg] cursor-pointer"
          style={{ background: `linear-gradient(45deg, ${primary}, ${accent})` }}
          onClick={(e) => { e.stopPropagation(); onElementClick('primary'); }}
          title="Click to change Primary role (Gradient uses Primary & Accent)"
        >
           <Feather className="w-8 h-8 text-white opacity-90" style={{ color: textOnPrimary }} />
        </div>
        <h1 
          className="text-4xl md:text-5xl font-bold mb-5 max-w-4xl leading-tight cursor-pointer"
          style={{ color: text }} 
          onClick={(e) => { e.stopPropagation(); onElementClick('text'); }}
          title="Click to change Text role"
        >
          Discover & Create Stunning <span style={{ color: accent }} onClick={(e) => { e.stopPropagation(); onElementClick('accent'); }} title="Click to change Accent role">4-Color Palettes</span> Effortlessly
        </h1>
        
        <p 
          className="text-lg max-w-3xl mx-auto mb-10 cursor-pointer"
          style={{ color: text + 'B3' }} 
          onClick={(e) => { e.stopPropagation(); onElementClick('text'); }}
          title="Click to change Text role"
        >
          Explore curated palettes, generate unique combinations with our smart tools, 
          and visualize them instantly on realistic mockups.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Accent button */}
          <button 
            className="px-7 py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 justify-center"
            style={{ backgroundColor: accent, color: textOnAccent }}
            onClick={(e) => { e.stopPropagation(); onElementClick('accent'); }}
            title="Click to change Accent role (Button uses Accent & Text on Accent)"
          >
            <LayoutGrid className="w-5 h-5" />
            Browse Palettes
          </button>
          {/* Bordered button using accent */}
          <button 
            className="px-7 py-3 rounded-lg font-semibold cursor-pointer hover:bg-opacity-10 transition-colors border-2 flex items-center gap-2 justify-center"
            style={{ borderColor: accent, color: accent, backgroundColor: 'transparent' }}
            onClick={(e) => { e.stopPropagation(); onElementClick('accent'); }}
            title="Click to change Accent role (Button uses Accent)"
          >
            <Shuffle className="w-5 h-5" />
            Generate Yours
          </button>
        </div>
      </section>
      
      {/* Featured Palettes Section - primary role */}
      <section 
        className="px-8 py-16 cursor-pointer"
        style={{ backgroundColor: primary, color: textOnPrimary }}
        onClick={(e) => { e.stopPropagation(); onElementClick('primary'); }}
        title="Click to change Primary role"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 
            className="text-3xl font-bold cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onElementClick('textOnPrimary'); }}
            title="Click to change Text on Primary role"
          >
            Featured Collections
          </h2>
          <div 
            className="text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
            style={{ color: accent }} 
            onClick={(e) => { e.stopPropagation(); onElementClick('accent'); }}
            title="Click to change Accent role"
          >
            View All <span aria-hidden="true">→</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {featuredPalettes.map((palette, i) => (
            <div 
              key={i}
              className="rounded-lg overflow-hidden border cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col"
              style={{ backgroundColor: background, color: text, borderColor: border }}
              onClick={(e) => { e.stopPropagation(); onElementClick('background'); }} // Card background click
              title="Click to change Background role (Card uses Background & Border)"
            >
              {/* Palette Colors Preview (4 colors) */}
              <div className="flex h-20">
                {palette.colors.slice(0, 4).map((color, j) => (
                  <div 
                    key={j}
                    className="flex-1 cursor-pointer hover:brightness-110 transition-filter"
                    style={{ backgroundColor: color }}
                    onClick={(e) => { e.stopPropagation(); onElementClick('card_element'); }} // Keep specific for raw color?
                    title={color}
                  />
                ))}
              </div>
              
              {/* Palette Info */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 
                    className="font-semibold text-lg mb-1 cursor-pointer"
                    style={{ color: text }} 
                    onClick={(e) => { e.stopPropagation(); onElementClick('text'); }}
                    title="Click to change Text role"
                  >
                    {palette.name}
                  </h3>
                  <div className="flex items-center text-sm mb-3" style={{ color: text + '99' }}>
                    {/* Wrap Star in a span to apply title */}
                    <span title="Click to change Accent role" onClick={(e) => { e.stopPropagation(); onElementClick("accent"); }}>
                      <Star className="w-4 h-4 mr-1.5 fill-current" style={{ color: accent }} /> 
                    </span>
                    {palette.likes} likes
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 items-center mt-2">
                  <button 
                    className={`p-1.5 rounded-full transition-all ${likedPalettes.has(i) ? 'bg-red-100' : 'hover:bg-gray-100'}`}
                    onClick={(e) => { e.stopPropagation(); toggleLike(i); onElementClick('icon'); }}
                    aria-label={likedPalettes.has(i) ? 'Unlike palette' : 'Like palette'}
                    title="Like/Unlike (Icon uses Accent)"
                  >
                    <Heart 
                      className={`w-5 h-5 transition-all ${likedPalettes.has(i) ? 'fill-current text-red-500' : ''}`}
                      style={{ color: likedPalettes.has(i) ? '#FF6B6B' : accent }}
                    />
                  </button>
                  <button 
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onElementClick('icon'); }}
                    aria-label="Copy palette"
                    title="Copy (Icon uses Accent)"
                  >
                    <Copy 
                      className="w-5 h-5 hover:opacity-70 transition-opacity"
                      style={{ color: accent }}
                    />
                  </button>
                  <button 
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onElementClick('icon'); }}
                    aria-label="Download palette"
                    title="Download (Icon uses Accent)"
                  >
                    <Download 
                      className="w-5 h-5 hover:opacity-70 transition-opacity"
                      style={{ color: accent }}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer - primary role */}
      <footer 
        className="px-6 py-6 text-center text-sm border-t cursor-pointer"
        style={{ backgroundColor: primary, color: textOnPrimary + 'A0', borderColor: border }}
        onClick={(e) => { e.stopPropagation(); onElementClick('primary'); }}
        title="Click to change Primary role"
      >
        <div className="flex justify-center items-center space-x-4">
          <span>&copy; {new Date().getFullYear()} ColorVerse</span>
          <span className="hover:text-opacity-100 cursor-pointer transition-opacity" style={{ color: textOnPrimary + 'A0' }} onClick={(e) => { e.stopPropagation(); onElementClick('textOnPrimary'); }} title="Click to change Text on Primary role">Privacy Policy</span>
          <span className="hover:text-opacity-100 cursor-pointer transition-opacity" style={{ color: textOnPrimary + 'A0' }} onClick={(e) => { e.stopPropagation(); onElementClick('textOnPrimary'); }} title="Click to change Text on Primary role">Terms of Service</span>
        </div>
      </footer>
    </div>
  );
};

export default MockupPreview;