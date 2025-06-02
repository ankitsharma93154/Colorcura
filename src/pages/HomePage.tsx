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

    // Sort
    processedPalettes.sort((a, b) => {
      if (activeSort === 'trending') {
        return b.likes_count - a.likes_count;
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return processedPalettes;
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
            ? palette.likes_count - 1
            : palette.likes_count + 1
        };
      }
      return palette;
    });
    setAllPalettes(updatedAllPalettes);
    paletteCache = updatedAllPalettes; // Keep cache in sync
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Calculate tags based on *all* palettes for consistent filtering options
  const allTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    allPalettes.forEach(palette => {
      palette.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([tag]) => tag);
  }, [allPalettes]);

  // --- Render Logic ---

  if (loading && allPalettes.length === 0) { // Show initial loading state only
    return (
      <div className="px-4 py-8 bg-white min-h-screen">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading palettes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 bg-white">
        <div className="text-center py-16">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple reload for error state
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Sidebar - Tags - Hidden on mobile */}
        <div className="hidden md:block w-44 border-r border-gray-200 bg-white">
          <div
            className="sticky top-0 p-4 h-screen overflow-y-auto"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            <h2 className="text-lg font-semibold mb-4">Tags</h2>
            <div className="space-y-2">
              <button
                onClick={() => setActiveFilter(null)}
                className={`
                  block w-full text-left px-3 py-2 rounded-md
                  ${!activeFilter ?
                    'bg-indigo-100 text-indigo-700' :
                    'hover:bg-gray-100 text-gray-700'}
                `}
              >
                All Palettes
              </button>

              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`
                    block w-full text-left px-3 py-2 rounded-md
                    ${activeFilter === tag ?
                      'bg-indigo-100 text-indigo-700' :
                      'hover:bg-gray-100 text-gray-700'}
                  `}
                >
                  {capitalizeFirstLetter(tag)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-4"> {/* Added pb-20 for mobile bottom bar space */}
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600">×</span>
                </button>
              )}
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                {filteredAndSortedPalettes.length} palette{filteredAndSortedPalettes.length !== 1 ? 's' : ''} found for "{searchQuery}"
              </p>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveSort('trending')}
                className={`
                  flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md
                  ${activeSort === 'trending' ?
                    'bg-indigo-100 text-indigo-700' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </button>

              <button
                onClick={() => setActiveSort('newest')}
                className={`
                  flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md
                  ${activeSort === 'newest' ?
                    'bg-indigo-100 text-indigo-700' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                <Sparkles className="h-4 w-4" />
                <span>Newest</span>
              </button>
            </div>

          </div>

          {/* Palette Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {palettesToDisplay.map(palette => (
              <PaletteCard
                key={palette.id}
                palette={palette}
                onLike={handleLikePalette}
                isLiked={likedPalettes.has(palette.id)} // Pass liked status down
              />
            ))}
          </div>

          {/* Sentinel Element for Intersection Observer */}
          <div ref={loadMoreRef} style={{ height: '10px' }} />

          {/* Loading indicator for infinite scroll */}
          {loading && allPalettes.length > 0 && (
             <div className="text-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
             </div>
          )}

          {/* No Results Message */}
          {palettesToDisplay.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600 mb-2">
                {searchQuery ?
                  `No palettes found for "${searchQuery}"` :
                  (activeFilter ? 'No palettes found with the selected filter.' : 'No palettes available.')
                }
              </p>
              <div className="space-x-2">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Clear search
                  </button>
                )}
                {activeFilter && (
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Heading and Promo - Hidden on mobile */}
        <aside className="hidden lg:block w-72 border-l border-gray-200 bg-white">
          <div className="sticky top-0 px-4 py-8 h-screen ">
            <h1 className="text-2xl font-bold mb-2 ">Curated Color Palettes</h1>
            <p className="text-gray-600">
              Explore thoughtfully curated 4-color palettes designed for real-world UI use.
            </p>

            {/* Promo Section */}
            <div className="mt-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3">Design with Confidence</h2>
              <p className="text-gray-700 mb-4 text-sm">
                ColorCura helps you visualize and experiment with color combinations that truly work — no guesswork needed.
              </p>
              <div className="space-y-2">
                <div className="px-3 py-1.5 bg-white rounded-md shadow-sm text-sm">
                  <span className="font-medium">4 colors</span> per palette for harmony
                </div>
                <div className="px-3 py-1.5 bg-white rounded-md shadow-sm text-sm">
                  <span className="font-medium">Smart</span> role suggestions (Heading, Accent, Background)
                </div>
                <div className="px-3 py-1.5 bg-white rounded-md shadow-sm text-sm">
                  <span className="font-medium">Live</span> UI mockup previews
                </div>
                <div className="px-3 py-1.5 bg-white rounded-md shadow-sm text-sm">
                  <span className="font-medium">Gradient</span> generator with CSS export
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Bar - Tags - Sticky */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white shadow-lg z-10">
        <div className="overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => setActiveFilter(null)}
              className={`
                px-3 py-2 rounded-md text-sm whitespace-nowrap
                ${!activeFilter ?
                  'bg-indigo-100 text-indigo-700' :
                  'hover:bg-gray-100 text-gray-700'}
              `}
            >
              All
            </button>

            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`
                  px-3 py-2 rounded-md text-sm whitespace-nowrap
                  ${activeFilter === tag ?
                    'bg-indigo-100 text-indigo-700' :
                    'hover:bg-gray-100 text-gray-700'}
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

