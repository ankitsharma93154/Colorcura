import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, Copy, Check } from 'lucide-react';
import { generateGradient } from '../../utils/colorUtils';

interface GradientGeneratorProps {
  colors: string[];
}

type GradientType = 'linear' | 'radial' | 'conic';

const GradientGenerator: React.FC<GradientGeneratorProps> = ({ colors }) => {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [selectedColors, setSelectedColors] = useState<string[]>(colors.slice(0, 2));
  const [gradientCSS, setGradientCSS] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    updateGradientCSS();
  }, [gradientType, angle, selectedColors]);
  
  const updateGradientCSS = () => {
    const css = generateGradient(selectedColors, gradientType, angle);
    setGradientCSS(css);
  };
  
  const handleColorToggle = (color: string) => {
    if (selectedColors.includes(color)) {
      if (selectedColors.length > 2) {
        setSelectedColors(selectedColors.filter(c => c !== color));
      }
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };
  
  const handleCopyCSS = () => {
    navigator.clipboard.writeText(gradientCSS);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };
  
  const shuffleColors = () => {
    const shuffled = [...selectedColors];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setSelectedColors(shuffled);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
      <h3 className="text-xl font-bold mb-4">Gradient Generator</h3>
      
      {/* Responsive layout: vertical on mobile, horizontal on desktop */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Preview and CSS section */}
        <div className="flex-1 min-w-0">
          <div 
            className="h-20 w-full rounded-lg mb-3 flex items-end justify-end p-3"
            style={{ background: gradientCSS }}
          >
            <button
              onClick={handleCopyCSS}
              className="bg-white dark:bg-gray-900 rounded-full p-2 shadow-sm"
              aria-label="Copy gradient CSS"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
          
          <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-gray-700 dark:text-gray-300 overflow-x-auto">
            background: {gradientCSS};
          </div>
        </div>
        
        {/* Controls section */}
        <div className="flex flex-col sm:flex-row lg:flex-row gap-4 lg:items-start">
          {/* Gradient Type */}
          <div className="min-w-fit">
            <label className="text-sm font-medium mb-2 block">Type</label>
            <div className="flex sm:flex-col lg:flex-col space-x-1 sm:space-x-0 sm:space-y-1 lg:space-x-0 lg:space-y-1">
              {(['linear', 'radial', 'conic'] as GradientType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setGradientType(type)}
                  className={`
                    px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap flex-1 sm:flex-none lg:flex-none
                    ${gradientType === type ? 
                      'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 
                      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Angle and Colors section */}
          <div className="space-y-4 flex-1 sm:flex-none lg:flex-none">
            {/* Angle Control */}
            {(gradientType === 'linear' || gradientType === 'conic') && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium">Angle: {angle}°</label>
                  <button
                    onClick={shuffleColors}
                    className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                    aria-label="Shuffle colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="flex-1 sm:w-32 lg:w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
            
            {/* Colors */}
            <div>
              <label className="text-sm font-medium mb-2 block">Colors (min 2)</label>
              <div className="grid grid-cols-6 sm:grid-cols-4 lg:grid-cols-4 gap-2 max-w-none sm:max-w-32 lg:max-w-32">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorToggle(color)}
                    className={`
                      h-7 w-7 rounded-full transition-transform
                      ${selectedColors.includes(color) ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110' : 'opacity-60'}
                    `}
                    style={{ backgroundColor: color }}
                    aria-label={`Toggle color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;