import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ColorPalette } from '../../data/mockData';

interface PaletteCardProps {
  palette: ColorPalette;
  onLike: (id: number) => void;
  isLiked: boolean;
}

const PaletteCard: React.FC<PaletteCardProps> = ({ palette, onLike, isLiked }) => {
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
    <div className="relative mb-8 group">
      {/* Main palette card with glassmorphism and modern styling */}
      <Link
        to={`/palette/${palette.id}`}
        className="block bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
        aria-label={`View palette ${palette.name}`}
      >
        <div className="h-64 w-full flex flex-col relative">
          {/* Gradient overlay for depth - moved to lower z-index */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 pointer-events-none z-0"></div>

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
                className="relative group/color flex items-end justify-start text-white font-mono text-sm transition-all duration-300 hover:z-30"
                style={{
                  backgroundColor: color,
                  flexBasis: `${normalizedWeight}%`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Enhanced hex code display with glassmorphism - higher z-index */}
                {hoveredIndex === index && isCopied !== color && (
                  <div
                    className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-mono px-3 py-2 rounded-xl cursor-pointer hover:bg-black/80 transition-all duration-200 border border-white/20 shadow-lg hover:scale-105 z-40"
                    onClick={(e) => handleCopyColor(e, color)}
                  >
                    {color}
                  </div>
                )}

                {/* Enhanced copied message with modern styling - higher z-index */}
                {isCopied === color && (
                  <div className="absolute bottom-3 left-3 px-3 py-2 rounded-xl flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 backdrop-blur-md text-white text-xs font-medium animate-pulse border border-white/30 shadow-lg z-40">
                    <span className="mr-1">✓</span>
                    Copied!
                  </div>
                )}

                {/* Subtle hover overlay for each color - lower z-index */}
                <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-300 z-10"></div>
              </div>
            );
          })}
        </div>
      </Link>

      {/* Enhanced like button with glassmorphism */}
      <button
        onClick={handleLike}
        className="absolute -bottom-4 left-36 flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-all duration-300 px-4 py-2 rounded-full shadow-lg border border-white/30 dark:border-gray-600/30 hover:scale-110 hover:-translate-y-1 hover:shadow-xl group/like z-50"
        aria-label="Like"
      >
        <Heart
          className={`h-4 w-4 transition-all duration-300 group-hover/like:scale-110 ${
            isLiked
              ? 'fill-red-500 text-red-500' // Red when liked
              : 'fill-white text-gray-400 dark:fill-gray-300 dark:text-gray-500' // White fill, gray stroke when not liked
          }`}
        />
        <span className="text-sm font-medium">{palette.likes_count}</span>

        {/* Subtle gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover/like:from-red-500/10 group-hover/like:to-pink-500/10 rounded-full transition-all duration-300"></div>
      </button>
    </div>
  );
};

export default PaletteCard;