// src/pages/HomePage.tsx
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { TrendingUp, Sparkles, Search } from 'lucide-react';
import PaletteCard from '../components/palette/PaletteCard';
import { fetchPalettes, updatePaletteLikes } from '../data/mockData';
import { Helmet } from 'react-helmet-async';

import { useHomePage } from '../context/HomePageStateContext';

const PALETTES_PER_PAGE = 27;

const HomePage: React.FC = () => {
  const {
    allPalettes,
    setAllPalettes,
    displayedPalettesCount,
    setDisplayedPalettesCount,
    likedPalettes,
    setLikedPalettes,
    loading,
    setLoading,
    error,
    setError,
    activeFilter,
    setActiveFilter,
    activeSort,
    setActiveSort,
    searchQuery,
    setSearchQuery,
    scrollPosition,
    setScrollPosition,
  } = useHomePage();

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // --- Data Fetching and Initial Load ---
  useEffect(() => {
    const loadPalettes = async () => {
      if (allPalettes.length > 0) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching new palettes...');
        setLoading(true);
        const data = await fetchPalettes();
        setAllPalettes(data);
      } catch (err) {
        setError('Failed to load palettes');
        console.error('Error loading palettes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPalettes();
  }, [allPalettes.length, setAllPalettes, setLoading, setError]);

  // --- Reset displayed count when filters/sort/search change ---
  useEffect(() => {
    // This effect's dependencies are crucial. Ensure it only runs when criteria change.
    setDisplayedPalettesCount(PALETTES_PER_PAGE);
    // When filter/sort/search changes, we typically want to scroll to top for new results.
    // However, if the user explicitly wants to retain scroll, this needs to be re-thought.
    // For now, let's assume new criteria means a "fresh" view.
    setScrollPosition(0); // Reset scroll position when filters/sort/search change
  }, [activeFilter, activeSort, searchQuery, setDisplayedPalettesCount, setScrollPosition]);

  // --- Filtering and Sorting ---
  // Memoize this heavily, as it's a core data transformation.
  const filteredAndSortedPalettes = useMemo(() => {
    let processedPalettes = allPalettes;

    // Filter by tag
    if (activeFilter) {
      processedPalettes = processedPalettes.filter(palette => palette.tags.includes(activeFilter));
    }

    // Filter by search query (case-insensitive, partial match)
    if (searchQuery.trim() !== '') {
      const lowerCaseQuery = searchQuery.toLowerCase().trim();
      processedPalettes = processedPalettes.filter(palette =>
        palette.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // Sort a *copy* of the array to avoid mutating state directly
    const sortedPalettes = [...processedPalettes].sort((a, b) => {
      if (activeSort === 'trending') {
        const likesA = a.likes_count ?? 0;
        const likesB = b.likes_count ?? 0;
        return likesB - likesA;
      } else { // 'newest'
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
      }
    });

    return sortedPalettes;
  }, [allPalettes, activeFilter, activeSort, searchQuery]); // Dependencies are correct here

  // Palettes to actually display based on infinite scroll count
  // This is also memoized, so it only re-slices when the underlying data or count changes.
  const palettesToDisplay = useMemo(() => {
    return filteredAndSortedPalettes.slice(0, displayedPalettesCount);
  }, [filteredAndSortedPalettes, displayedPalettesCount]);

  // --- Infinite Scroll Observer Setup ---
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      if (displayedPalettesCount < filteredAndSortedPalettes.length) {
        // console.log('Loading more palettes via infinite scroll...');
        setDisplayedPalettesCount(prevCount => prevCount + PALETTES_PER_PAGE);
      }
    }
  }, [loading, displayedPalettesCount, filteredAndSortedPalettes.length, setDisplayedPalettesCount]);

  useEffect(() => {
    const options = {
      root: null,
      // Increase rootMargin to trigger load earlier, preventing blank space
      rootMargin: '0px 0px 200px 0px', // Load when 200px from bottom
      threshold: 0.1 // Can be less strict than 1.0, means trigger when 10% visible
    };

    // Ensure previous observer is disconnected before creating a new one
    if (observer.current) {
        observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(handleObserver, options);

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.current.observe(currentLoadMoreRef);
    }

    return () => {
      if (observer.current && currentLoadMoreRef) {
        observer.current.unobserve(currentLoadMoreRef);
      }
    };
    // Re-run observer setup if handleObserver changes.
    // handleObserver itself uses useCallback, so it only changes if its dependencies change.
  }, [handleObserver]);


  // --- Scroll Position Retention ---
  // Save scroll position with a throttle to avoid excessive updates
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const THROTTLE_DELAY = 100; // ms

    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        setScrollPosition(window.scrollY);
        timeoutId = null;
      }, THROTTLE_DELAY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrollPosition]);

  // Restore scroll position when the component mounts and scrollPosition from context is available
  useEffect(() => {
    // Only scroll if a position was saved AND if the current scroll position is not already close
    // This prevents jarring jumps if the page loaded at the correct position naturally.
    if (scrollPosition > 0 && Math.abs(window.scrollY - scrollPosition) > 20) { // Add a small threshold
      window.scrollTo(0, scrollPosition);
    }
  }, [scrollPosition]);


  // --- Like Functionality ---
  const handleLikePalette = useCallback(async (id: number) => {
    const isCurrentlyLiked = likedPalettes.has(id);
    const newLikedPalettes = new Set(likedPalettes);
    let newLikesCount: number;

    const updatedAllPalettes = allPalettes.map(palette => {
      if (palette.id === id) {
        newLikesCount = isCurrentlyLiked
          ? (palette.likes_count ?? 0) - 1
          : (palette.likes_count ?? 0) + 1;

        updatePaletteLikes(id, newLikesCount); // Persist to mock data/backend

        return {
          ...palette,
          likes_count: newLikesCount
        };
      }
      return palette;
    });

    if (isCurrentlyLiked) {
      newLikedPalettes.delete(id);
    } else {
      newLikedPalettes.add(id);
    }
    setLikedPalettes(newLikedPalettes);
    setAllPalettes(updatedAllPalettes);
  }, [allPalettes, likedPalettes, setAllPalettes, setLikedPalettes]); // Dependencies for useCallback


  // --- Helper Functions ---
  const capitalizeFirstLetter = useCallback((str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, []); // No dependencies, can be memoized once

  // Calculate tags based on *all* palettes for consistent filtering options
  const allTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    allPalettes.forEach(palette => {
      if (Array.isArray(palette.tags)) {
        palette.tags.forEach(tag => {
          if (tag) tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });
    // Sort tags by frequency (descending)
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [allPalettes]);
  const limitedTags = allTags.slice(0, 20);

  // --- Render Logic ---

  if (loading && allPalettes.length === 0) {
    return (
      <div className="px-4 py-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 relative overflow-hidden">
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
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 text-center py-16">
          <p className="text-xl text-red-600 mb-6 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>ColorCura – Curated Color Palettes & UI Mockups for Modern Web Design</title>
        <meta name="description" content="Discover stunning color palettes for websites and apps. Instantly preview palettes in real UI mockups, copy hex codes, and find the perfect color scheme for your next project. Free, fast, and modern." />
        <meta name="keywords" content="color palettes, website color schemes, UI colors, color generator, colorcura, web design, hex codes, palette preview, color mockup" />
        <link rel="canonical" href="https://www.colorcura.site/" />
        {/* Open Graph */}
        <meta property="og:title" content="ColorCura – Curated Color Palettes & UI Mockups for Modern Web Design" />
        <meta property="og:description" content="Browse trending color palettes and preview them in real UI mockups. Perfect for designers, developers, and brands." />
        <meta property="og:image" content="https://www.colorcura.site/og-preview.png" />
        <meta property="og:url" content="https://www.colorcura.site/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ColorCura" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ColorCura – Curated Color Palettes & UI Mockups" />
        <meta name="twitter:description" content="Browse trending color palettes and preview them in real UI mockups. Perfect for designers, developers, and brands." />
        <meta name="twitter:image" content="https://www.colorcura.site/images/colorcura-twitter.jpg" />
        <meta name="twitter:site" content="@colorcura" />
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ColorCura",
            "url": "https://www.colorcura.site/",
            "description": "Discover stunning color palettes for websites and apps. Instantly preview palettes in real UI mockups, copy hex codes, and find the perfect color scheme for your next project.",
            "publisher": {
              "@type": "Organization",
              "name": "ColorCura",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.colorcura.site/logo.png"
              }
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.colorcura.site/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 overflow-x-hidden">
          {/* Animated background elements */}
          <div className="fixed top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none z-0"></div>
          <div className="fixed bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-orange-500/10 rounded-full blur-2xl animate-pulse pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-purple-500/5 rounded-full blur-3xl animate-pulse pointer-events-none z-0" style={{ animationDelay: '4s' }}></div>

          <div className="flex flex-1 w-full max-w-[1920px] mx-auto min-h-0">
            {/* Left Sidebar - Innovative Glassy/Gradient/Animated Tags */}
            <aside className="hidden md:flex flex-col w-40 min-h-screen border-r border-white/30 bg-white/60 backdrop-blur-xl shadow-lg z-30 fixed left-0 top-20 bottom-0">
              <div className="p-4 h-full overflow-y-auto scrollbar-hide flex flex-col gap-0">
                {/* Sidebar Title & Divider */}
                <div className="mb-2">
                  <h2 className="text-base font-extrabold mb-1 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent tracking-wide flex items-center gap-2">
                    <span>🎨</span> Tags
                  </h2>
                  <div className="h-1 w-10 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full mb-2" />
                </div>

                {/* Tag Search Input removed (duplicate) */}

                {/* Animated Tag Pills with Usage Count */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setActiveFilter(null)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400/40
                      ${!activeFilter ?
                        'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-indigo-300 scale-105 shadow-lg' :
                        'bg-white/70 text-gray-700 border-white/40 hover:bg-white/90'}
                    `}
                  >
                    <span className="text-base">🌈</span> All
                  </button>
                  {limitedTags.map((tag, idx) => {
                    // Assign a unique gradient for each tag for visual variety
                    const gradients = [
                      'from-indigo-400 via-purple-400 to-pink-400',
                      'from-pink-400 via-orange-300 to-yellow-400',
                      'from-green-400 via-blue-400 to-purple-400',
                      'from-yellow-400 via-pink-400 to-purple-400',
                      'from-blue-400 via-cyan-400 to-green-400',
                      'from-purple-400 via-pink-400 to-orange-400',
                    ];
                    const gradient = gradients[idx % gradients.length];
                    // Find tag usage count
                    const tagCount = allPalettes.reduce((acc, p) => Array.isArray(p.tags) && p.tags.includes(tag) ? acc + 1 : acc, 0);
                    return (
                      <button
                        key={tag}
                        onClick={() => setActiveFilter(tag)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400/40
                          ${activeFilter === tag ?
                            `bg-gradient-to-r ${gradient} text-white border-indigo-300 scale-105 shadow-lg animate-gradient-x` :
                            'bg-white/70 text-gray-700 border-white/40 hover:bg-white/90'}
                        `}
                        style={{ backgroundSize: '200% 200%' }}
                      >
                        <span className="capitalize font-bold tracking-wide">{capitalizeFirstLetter(tag)}</span>
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-white/30 text-gray-700 font-semibold border border-white/40 shadow-sm">
                          {tagCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sidebar Footer or Tip */}
                <div className="mt-6 text-[11px] text-gray-400 text-center select-none">
                  <span>Tip: Try searching for "brand", "pastel", or "dark"</span>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 md:ml-40 lg:mr-80 bg-white/40 backdrop-blur-sm min-h-screen">
              <div className="p-6 md:p-8 pb-32 md:pb-6">
                {/* Enhanced Search Bar */}
                <div className="mb-6">
                  <div className="relative w-full max-w-4xl mx-auto">
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
                {/* "You've reached the end" message */}
                {!loading && displayedPalettesCount >= filteredAndSortedPalettes.length && (
                  <p className="text-center text-gray-500 mt-8">You've reached the end of the palettes!</p>
                )}
              </div>
            </main>

            {/* Right Sidebar */}
            <aside className="hidden lg:flex flex-col w-80 min-h-screen border-l border-white/30 bg-white/60 backdrop-blur-xl shadow-lg z-30 fixed right-0 top-16 bottom-0">
              <div className="px-4 py-8 h-full overflow-y-auto scrollbar-hide">
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Not Just Palettes.
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Colorcura lets you <span className="font-semibold text-indigo-700">preview any palette</span> in a real UI mockup instantly.
                  See how your colors actually feel in context — not just how they look in a grid.
                </p>

                {/* Promo Section */}
                <div className="bg-gradient-to-br from-indigo-100/80 to-purple-100/80 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
                    Why Colorcura?
                  </h2>
                  <ul className="space-y-4 text-sm text-indigo-800 leading-relaxed">
                    <li className="flex items-start">
                      <span className="w-2 h-2 mt-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3"></span>
                      Live UI mockup previews — click any palette to see it in action.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 mt-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></span>
                      Smart color role suggestions for buttons, backgrounds, and accents.
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 mt-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3"></span>
                      Built-in gradient generator to complete your design system.
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

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
              {limitedTags.map(tag => (
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
    </>
  );
};

export default HomePage;