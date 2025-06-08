import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TrendingUp, Sparkles, Search } from 'lucide-react';
import PaletteCard from '../components/palette/PaletteCard';
import { fetchPalettes, ColorPalette } from '../data/mockData';

// Cache for palettes - simple in-memory cache
let paletteCache: ColorPalette[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const PALETTES_PER_PAGE = 15; // Number of palettes to load per scroll

const HomePage: React.FC = () => {
  const [allPalettes, setAllPalettes] = useState<ColorPalette[]>([]); // Holds all fetched palettes (cache)
  const [displayedPalettesCount, setDisplayedPalettesCount] = useState<number>(PALETTES_PER_PAGE);
  const [likedPalettes, setLikedPalettes] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<'trending' | 'newest'>('trending');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null); // Ref for the element to observe

  // Fetch palettes and manage cache
  useEffect(() => {
    const loadPalettes = async () => {
      const now = Date.now();
      // Check cache validity
      if (paletteCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        console.log('Using cached palettes');
        setAllPalettes(paletteCache);
        setLoading(false);
        return;
      }

      // Fetch new data if cache is invalid or empty
      try {
        console.log('Fetching new palettes...');
        setLoading(true);
        const data = await fetchPalettes();
        paletteCache = data; // Update cache
        cacheTimestamp = now; // Update timestamp
        setAllPalettes(data);
      } catch (err) {
        setError('Failed to load palettes');
        console.error('Error loading palettes:', err);
        paletteCache = null; // Clear cache on error
        cacheTimestamp = null;
      } finally {
        setLoading(false);
      }
    };

    loadPalettes();
  }, []);

  // Reset displayed count when filters/sort/search change
  useEffect(() => {
    setDisplayedPalettesCount(PALETTES_PER_PAGE);
  }, [activeFilter, activeSort, searchQuery]);

  // Memoize filtering and sorting operations
  const filteredAndSortedPalettes = useMemo(() => {
    let processedPalettes = allPalettes;

    // Filter by tag
    if (activeFilter) {
      processedPalettes = processedPalettes.filter(palette => palette.tags.includes(activeFilter));
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const lowerCaseQuery = searchQuery.toLowerCase().trim();
      processedPalettes = processedPalettes.filter(palette =>
        palette.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // FIX: Sort a *copy* of the array to avoid mutating state directly
    const sortedPalettes = [...processedPalettes].sort((a, b) => { // Create copy with spread syntax [...]
      if (activeSort === 'trending') {
        // Ensure likes_count exists, default to 0 if not
        const likesA = a.likes_count ?? 0;
        const likesB = b.likes_count ?? 0;
        return likesB - likesA;
      } else { // newest
        // Ensure created_at exists and is valid, fallback to 0 timestamp if not
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        // Handle potential NaN from invalid dates
        return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
      }
    });

    return sortedPalettes; // Return the newly sorted copy
  }, [allPalettes, activeFilter, activeSort, searchQuery]);

  // Palettes to actually display based on infinite scroll count
  const palettesToDisplay = useMemo(() => {
    return filteredAndSortedPalettes.slice(0, displayedPalettesCount);
  }, [filteredAndSortedPalettes, displayedPalettesCount]);

  // Infinite scroll observer setup
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      // Check if there are more palettes to load
      if (displayedPalettesCount < filteredAndSortedPalettes.length) {
        console.log('Loading more palettes...');
        setDisplayedPalettesCount(prevCount => prevCount + PALETTES_PER_PAGE);
      }
    }
  }, [loading, displayedPalettesCount, filteredAndSortedPalettes.length]);

  useEffect(() => {
    const options = {
      root: null, // relative to document viewport
      rootMargin: '0px',
      threshold: 1.0 // Trigger when 100% visible
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.current.observe(currentLoadMoreRef);
    }

    // Cleanup observer on component unmount or when ref changes
    return () => {
      if (observer.current && currentLoadMoreRef) {
        observer.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [handleObserver]); // Re-run if handleObserver changes (due to dependencies)

  // Update liked palettes (operates on the cached `allPalettes`)
  const handleLikePalette = (id: number) => {
    const isCurrentlyLiked = likedPalettes.has(id);
    const newLikedPalettes = new Set(likedPalettes);
    if (isCurrentlyLiked) {
      newLikedPalettes.delete(id);
    } else {
      newLikedPalettes.add(id);
    }
    setLikedPalettes(newLikedPalettes);

    // Update the master list (cache)
    const updatedAllPalettes = allPalettes.map(palette => {
      if (palette.id === id) {
        return {
          ...palette,
          likes_count: isCurrentlyLiked
            ? (palette.likes_count ?? 0) - 1
            : (palette.likes_count ?? 0) + 1
        };
      }
      return palette;
    });
    setAllPalettes(updatedAllPalettes);
    paletteCache = updatedAllPalettes; // Keep cache in sync
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Calculate tags based on *all* palettes for consistent filtering options
  const allTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    allPalettes.forEach(palette => {
      // Ensure tags is an array before iterating
      if (Array.isArray(palette.tags)) {
          palette.tags.forEach(tag => {
            if (tag) { // Ensure tag is not null/undefined
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            }
          });
      }
    });
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([tag]) => tag);
  }, [allPalettes]);

  // --- Render Logic ---

  if (loading && allPalettes.length === 0) { // Show initial loading state only
    return (
      <div className="px-4 py-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-orange-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-border mx-auto mb-6" style={{ 
            mask: 'radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0)',
            WebkitMask: 'radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0)'
          }}></div>
          <p className="text-xl font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Loading palettes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 text-center py-16">
          <p className="text-xl text-red-600 mb-6 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple reload for error state
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-orange-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      {/* Fixed Left Sidebar - Tags (Desktop) */}
      <div className="hidden md:block w-48 h-screen fixed left-0 top-18 border-r border-white/30 bg-white/60 backdrop-blur-xl shadow-lg z-40">
        <div className="p-6 h-full overflow-y-auto scrollbar-hide">
          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">Tags</h2>
          <div className="space-y-2">
            <button
              onClick={() => setActiveFilter(null)}
              className={`
                block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm border
                ${!activeFilter ?
                  'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg border-indigo-300 scale-105' :
                  'text-gray-700 hover:bg-white/60 border-white/30 hover:scale-105 hover:shadow-md'}
              `}
            >
              All Palettes
            </button>

            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`
                  block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm border
                  ${activeFilter === tag ?
                    'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg border-indigo-300 scale-105' :
                    'text-gray-700 hover:bg-white/60 border-white/30 hover:scale-105 hover:shadow-md'}
                `}
              >
                {capitalizeFirstLetter(tag)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Right Sidebar (Desktop) */}
      <aside className="hidden lg:block w-80 h-screen fixed right-0 top-18 border-l border-white/30 bg-white/60 backdrop-blur-xl shadow-lg z-40">
        <div className="px-4 py-8 h-full overflow-y-auto scrollbar-hide">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Curated Color Palettes
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Explore thoughtfully curated 4-color palettes designed for real-world UI use.
          </p>

          {/* Enhanced Promo Section */}
          <div className="bg-gradient-to-br from-indigo-100/80 to-purple-100/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Design with Confidence
            </h2>
            <p className="text-indigo-800 mb-6 text-sm leading-relaxed">
              ColorCura helps you visualize how colors work together in real interfaces. No more guessing – see your palette in action before you commit.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-indigo-700">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                <span>Live UI previews</span>
              </div>
              <div className="flex items-center text-sm text-indigo-700">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                <span>Smart color role suggestions</span>
              </div>
              <div className="flex items-center text-sm text-indigo-700">
                <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3"></div>
                <span>Gradient generator</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - with proper margins for sidebars */}
      <main className="flex-1 md:ml-48 lg:mr-80 min-h-screen overflow-y-auto bg-white/40 backdrop-blur-sm">
        <div className="p-6 md:p-8 pb-32 md:pb-6">
          {/* Enhanced Search Bar */}
          <div className="mb-6">
            <div className="relative w-full max-w-3xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border border-white/30 rounded-2xl leading-5 bg-white/80 backdrop-blur-lg placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 shadow-lg text-lg transition-all duration-300 hover:shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              )}
            </div>

            {/* Enhanced Search Results Info */}
            {searchQuery && (
              <p className="mt-4 text-center text-sm text-gray-600 font-medium">
                {filteredAndSortedPalettes.length} palette{filteredAndSortedPalettes.length !== 1 ? 's' : ''} found for "{searchQuery}"
              </p>
            )}
          </div>

          {/* Enhanced Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveSort('trending')}
                className={`
                  flex items-center space-x-2 text-sm px-5 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border shadow-lg hover:scale-105
                  ${activeSort === 'trending' ?
                    'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-300 shadow-indigo-500/25' :
                    'bg-white/80 text-gray-700 border-white/30 hover:bg-white/90 hover:shadow-xl'}
                `}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </button>

              <button
                onClick={() => setActiveSort('newest')}
                className={`
                  flex items-center space-x-2 text-sm px-5 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border shadow-lg hover:scale-105
                  ${activeSort === 'newest' ?
                    'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-300 shadow-indigo-500/25' :
                    'bg-white/80 text-gray-700 border-white/30 hover:bg-white/90 hover:shadow-xl'}
                `}
              >
                <Sparkles className="h-4 w-4" />
                <span>Newest</span>
              </button>
            </div>
          </div>

          {/* Enhanced Palette Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {palettesToDisplay.map(palette => (
              <PaletteCard
                key={palette.id}
                palette={palette}
                onLike={handleLikePalette}
                isLiked={likedPalettes.has(palette.id)}
              />
            ))}
          </div>

          {/* Sentinel Element for Intersection Observer */}
          <div ref={loadMoreRef} style={{ height: '10px' }} />

          {/* Enhanced loading indicator for infinite scroll */}
          {loading && allPalettes.length > 0 && (
             <div className="text-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-border mx-auto" style={{ 
                 mask: 'radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0)',
                 WebkitMask: 'radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0)'
               }}></div>
             </div>
          )}

          {/* Enhanced No Results Message */}
          {palettesToDisplay.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-xl max-w-md mx-auto">
                <p className="text-xl text-gray-600 mb-4 font-medium">
                  {searchQuery ?
                    `No palettes found for "${searchQuery}"` :
                    (activeFilter ? 'No palettes found with the selected filter.' : 'No palettes available.')
                  }
                </p>
                <div className="space-x-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Clear search
                    </button>
                  )}
                  {activeFilter && (
                    <button
                      onClick={() => setActiveFilter(null)}
                      className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Bar - Tags (Mobile/Tablet) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-white/30 shadow-lg z-50">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveFilter(null)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${!activeFilter ?
                  'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' :
                  'bg-white/80 text-gray-700 border border-white/50 hover:bg-white'}
              `}
            >
              All
            </button>

            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${activeFilter === tag ?
                    'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' :
                    'bg-white/80 text-gray-700 border border-white/50 hover:bg-white'}
                `}
              >
                {capitalizeFirstLetter(tag)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;