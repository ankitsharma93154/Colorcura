import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ColorPalette } from '../../data/mockData';

interface PaletteCardProps {
  palette: ColorPalette;
  onLike: (id: number) => void;
  isLiked: boolean; 
}

const PaletteCard: React.FC<PaletteCardProps> = ({ palette, onLike }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState<string | null>(null);

  const handleCopyColor = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(color);
    setIsCopied(color);

    setTimeout(() => {
      setIsCopied(null);
    }, 750);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(palette.id);
  };

  return (
    <div className="relative mb-4">
      {/* Main palette card as a link */}
      <Link 
        to={`/palette/${palette.id}`}
        className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
      >
        <div className="h-60 w-full flex flex-col">
          {palette.hex_codes.map((color, index) => {
            const totalColors = palette.hex_codes.length;
            const startWeight = 10;
            const increment = 5;
            
            const rawWeights = Array.from({ length: totalColors }, (_, i) =>
              startWeight + (i * increment)
            );
            
            const weights = rawWeights;
            const totalWeightSum = weights.reduce((sum, weight) => sum + weight, 0);
            const normalizedWeight = (weights[index] / totalWeightSum) * 100;

            return (
              <div
                key={index}
                className="relative group flex items-end justify-start text-white font-mono text-sm"
                style={{
                  backgroundColor: color,
                  flexBasis: `${normalizedWeight}%`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hex code display at bottom left on hover */}
                {hoveredIndex === index && isCopied !== color && (
                  <div 
                    className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs font-mono px-2 py-1 rounded cursor-pointer hover:bg-opacity-80"
                    onClick={(e) => handleCopyColor(e, color)}
                  >
                    {color}
                  </div>
                )}
                
                {/* Copied message */}
                {isCopied === color && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded flex items-center justify-center bg-black bg-opacity-60 text-white text-xs animate-fade-in-out">
                    Copied!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Link>

      {/* Like button positioned outside the card at bottom left */}
      <button
        onClick={handleLike}
        className="absolute -bottom-6 left-2 flex items-center space-x-1 bg-white dark:bg-gray-800 text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors px-2 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-600"
        aria-label="Like"
      >
        <Heart
          className={`h-4 w-4 ${
            palette.likes_count > 0 ? 'fill-red-500 text-red-500' : ''
          }`}
        />
        <span className="text-sm">{palette.likes_count}</span>
      </button>

     
    </div>
  );
};

export default PaletteCard;