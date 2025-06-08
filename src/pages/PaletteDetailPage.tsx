import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Copy, Share2, Heart, Palette,
  Tag, ThumbsUp, Calendar, Undo, Redo // Added Undo/Redo back
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

// Interface for history state (needed for undo/redo)
interface ColorHistory {
  roles: ColorRoles;
  timestamp: number;
}

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
  const [selectedRole, setSelectedRole] = useState<keyof ColorRoles | null>(null); // State for modal

  // History state for undo/redo
  const [colorHistory, setColorHistory] = useState<ColorHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < colorHistory.length - 1;

  // Function to add state to history (restored)
  const addToHistory = useCallback((newRoles: ColorRoles) => {
    // Check if newRoles is substantially different from the last one to avoid duplicates
    if (historyIndex >= 0 && JSON.stringify(colorHistory[historyIndex].roles) === JSON.stringify(newRoles)) {
        return; // Don't add identical state
    }
    const newHistory = colorHistory.slice(0, historyIndex + 1);
    newHistory.push({ roles: newRoles, timestamp: Date.now() });
    // Limit history size if needed (e.g., keep last 20 states)
    // if (newHistory.length > 20) { newHistory.shift(); }
    setColorHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [colorHistory, historyIndex]);

  // Handle Undo (restored)
  const handleUndo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setColorRoles(colorHistory[newIndex].roles);
    }
  }, [canUndo, historyIndex, colorHistory]);

  // Handle Redo (restored)
  const handleRedo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setColorRoles(colorHistory[newIndex].roles);
    }
  }, [canRedo, historyIndex, colorHistory]);


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
            // Initialize history
            const initialHistory = [{ roles, timestamp: Date.now() }];
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

  // Restored: Handle click on mockup element or role swatch to open modal
  const handleElementClick = useCallback((role: keyof ColorRoles | 'icon' | 'card_element') => {
    if (role !== 'icon' && role !== 'card_element') {
      setSelectedRole(role);
    }
  }, []);

  // Restored: Handle color selection from the modal
  const handleColorRoleChange = useCallback((color: string) => {
    if (!selectedRole) return;
    const newRoles = {
      ...colorRoles,
      [selectedRole]: color
    };
    setColorRoles(newRoles);
    addToHistory(newRoles); // Add change to history
    setSelectedRole(null); // Close modal
  }, [selectedRole, colorRoles, addToHistory]);


  const displayRoles: (keyof ColorRoles)[] = useMemo(() => [
    'background', 'primary', 'accent', 'text',
    'textOnPrimary', 'textOnAccent', 'border'
  ], []);

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

        {/* Section 1 (New): Combined Palette Info & Gradient Generator (Side-by-Side) */}
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
                  {/* Action Buttons */}
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

            {/* Middle part: Color Strip with details - Restored hover effect */}
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

        {/* Section 2: Assigned Color Roles - Now clickable to edit */}
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
                  usage={getSuggestedUsage(color, role)}
                  onClick={() => handleElementClick(role)} // Opens modal
                  isSelected={selectedRole === role} // Highlight when selected for editing
                />
              );
            })}
          </div>
        </section>

        {/* Section 3: UI Mockup Preview (Full Width) - Now interactive */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 -mx-4 sm:mx-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl  text-gray-800 flex items-center font-semibold ">
              <Palette className="h-5 w-5 mr-2 text-indigo-600" />
              UI Preview
            </h2>
             {/* Restored Undo/Redo Controls */}
            <div className="flex space-x-2">
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
    <div className="flex items-center space-x-1.5">
      <Undo className="h-4 w-4" />
    </div>
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
    <div className="flex items-center space-x-1.5">
      <Redo className="h-4 w-4" />

    </div>
  </button>
</div>
          </div>
          {/* Full width container for the mockup */}
          <div className="w-full max-w-none">
             <MockupPreview
               colorRoles={colorRoles}
               onElementClick={handleElementClick} // Pass handler for interaction
             />
          </div>
        </section>

        {/* Section 4: Palette Info */}
        <section className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Palette Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            {/* Tags */}
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
            {/* Likes */}
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Likes</span>
                <span>{palette.likes_count + (liked ? 1 : 0)}</span>
              </div>
            </div>
            {/* Downloads */}
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-500 block">Downloads</span>
                <span>{downloadCount}</span>
              </div>
            </div>
            {/* Creation Date */}
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

      {/* Restored: Modal for Changing Color Role */}
      {selectedRole && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
          onClick={() => setSelectedRole(null)} // Close on overlay click
        >
          <div
            className="rounded-lg p-6 shadow-xl max-w-md w-full border bg-white border-gray-200 text-gray-900"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h3 className="text-lg font-bold mb-4">
              Assign Color to '{selectedRole.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}' Role
            </h3>
            <p className="text-sm mb-4 text-gray-600">Select a color from the palette, or black/white:</p>
            <div className="grid grid-cols-6 gap-3 mb-6">
              {[...palette.hex_codes.slice(0, 4), "#FFFFFF", "#000000"].map((color, index) => (
                <button
                  key={index}
                  className={`h-12 w-full rounded-md border-2 border-gray-300 hover:opacity-80 transition-all ring-offset-2 ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${color === "#FFFFFF" ? "shadow-inner" : ""} ${color === "#000000" ? "shadow-inner" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorRoleChange(color)}
                  aria-label={`Select color ${color} for ${selectedRole}`}
                  title={color}
                />
              ))}
            </div>
            <div className="text-right">
              <button
                onClick={() => setSelectedRole(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaletteDetailPage;

