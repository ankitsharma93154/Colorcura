import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ColorPalette } from '../data/mockData';

interface HomePageState {
  allPalettes: ColorPalette[];
  setAllPalettes: React.Dispatch<React.SetStateAction<ColorPalette[]>>;
  displayedPalettesCount: number;
  setDisplayedPalettesCount: React.Dispatch<React.SetStateAction<number>>;
  likedPalettes: Set<number>;
  setLikedPalettes: React.Dispatch<React.SetStateAction<Set<number>>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  activeFilter: string | null;
  setActiveFilter: React.Dispatch<React.SetStateAction<string | null>>;
  activeSort: 'trending' | 'newest';
  setActiveSort: React.Dispatch<React.SetStateAction<'trending' | 'newest'>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  scrollPosition: number;
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>;
}

const HomePageContext = createContext<HomePageState | undefined>(undefined);

interface HomePageProviderProps {
  children: ReactNode;
}

export const HomePageProvider: React.FC<HomePageProviderProps> = ({ children }) => {
  const [allPalettes, setAllPalettes] = useState<ColorPalette[]>([]);
  const [displayedPalettesCount, setDisplayedPalettesCount] = useState<number>(15); // Initial value from HomePage
  const [likedPalettes, setLikedPalettes] = useState<Set<number>>(() => {
    // Initialize from localStorage if available
    try {
      const storedLikes = localStorage.getItem('likedPalettes');
      return storedLikes ? new Set(JSON.parse(storedLikes)) : new Set();
    } catch (e) {
      console.error("Failed to parse likedPalettes from localStorage", e);
      return new Set();
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<'trending' | 'newest'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  // Persist likedPalettes to localStorage
  useEffect(() => {
    localStorage.setItem('likedPalettes', JSON.stringify(Array.from(likedPalettes)));
  }, [likedPalettes]);

  return (
    <HomePageContext.Provider
      value={{
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
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};

export const useHomePage = () => {
  const context = useContext(HomePageContext);
  if (context === undefined) {
    throw new Error('useHomePage must be used within a HomePageProvider');
  }
  return context;
};


