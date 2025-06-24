import { useState, useEffect } from 'react';
import Hero from './Hero';
import MovieRow from './MovieRow';
import TrailerModal from './TrailerModal';
import Header from './Header';
import { HeroSkeleton, MovieRowSkeleton } from './SkeletonLoader';
import type { Movie } from '../types/movie';

interface NetflixAppProps {
  heroMovie?: Movie;
  trending?: Movie[];
  popular?: Movie[];
  topRated?: Movie[];
  nowPlaying?: Movie[];
  upcoming?: Movie[];
}

export default function NetflixApp({
  heroMovie,
  trending = [],
  popular = [],
  topRated = [],
  nowPlaying = [],
  upcoming = []
}: NetflixAppProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [focusedRowIndex, setFocusedRowIndex] = useState(0);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSearch && e.target instanceof HTMLInputElement) return;

      const rows = [trending, popular, topRated, nowPlaying, upcoming].filter(row => row.length > 0);

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedRowIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedRowIndex(prev => Math.min(rows.length - 1, prev + 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedCardIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (rows[focusedRowIndex]) {
            setFocusedCardIndex(prev => Math.min(rows[focusedRowIndex].length - 1, prev + 1));
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (rows[focusedRowIndex] && rows[focusedRowIndex][focusedCardIndex]) {
            handleMovieClick(rows[focusedRowIndex][focusedCardIndex]);
          }
          break;
        case '/':
          e.preventDefault();
          setShowSearch(true);
          break;
        case 'Escape':
          if (showSearch) {
            setShowSearch(false);
            setSearchQuery('');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [focusedRowIndex, focusedCardIndex, showSearch, trending, popular, topRated, nowPlaying, upcoming]);

  // Real-time search using /api/search endpoint
  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearchActive(true);
      const delayDebounceFn = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data.results || []);
          });
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setIsSearchActive(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  return (
    <>
      {/* Header */}
      <Header onSearchClick={handleSearchClick} />

      {/* Search Bar */}
      {showSearch && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Hero Section - hidden when searching */}
      {!isSearchActive && heroMovie && (
        <>
          {isLoading ? (
            <HeroSkeleton />
          ) : (
            <Hero
              movie={heroMovie}
              onPlayClick={handleMovieClick}
            />
          )}
        </>
      )}

      {/* Movie Rows / Search Results */}
      <section className={`relative z-20 bg-gradient-to-t from-black via-black/95 to-transparent ${
        isSearchActive ? 'pt-24' : '-mt-40 pt-20'
      }`}>
        <div className="space-y-12">
          {isSearchActive || searchQuery.length > 2 ? (
            // Search Results
            <div className="px-4 md:px-16 pt-20">
              <h2 className="text-white text-xl md:text-2xl font-bold mb-6">
                Search Results ({searchResults.length} movies found)
              </h2>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.map((movie) => (
                    <div key={movie.id} className="cursor-pointer group" onClick={() => handleMovieClick(movie)}>
                      <div className="relative">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-auto rounded-md object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                          ★ {movie.vote_average?.toFixed(1)}
                        </div>
                      </div>
                      <p className="text-white text-sm mt-2 truncate">{movie.title}</p>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length > 2 ? (
                <div className="text-center text-gray-400 py-20">
                  <p className="text-xl">No movies found</p>
                  <p className="text-sm mt-2">Try searching for something else</p>
                </div>
              ) : null}
            </div>
          ) : (
            // Regular movie rows
            <>
              {isLoading ? (
                <>
                  <MovieRowSkeleton />
                  <MovieRowSkeleton />
                  <MovieRowSkeleton />
                </>
              ) : (
                <>
                  {trending.length > 0 && (
                    <MovieRow
                      title="Trending Now"
                      movies={trending}
                      onMovieClick={handleMovieClick}
                      loading={false}
                    />
                  )}
                  {popular.length > 0 && (
                    <MovieRow
                      title="Popular"
                      movies={popular}
                      onMovieClick={handleMovieClick}
                      loading={false}
                    />
                  )}
                  {topRated.length > 0 && (
                    <MovieRow
                      title="Top Rated"
                      movies={topRated}
                      onMovieClick={handleMovieClick}
                      loading={false}
                    />
                  )}
                  {nowPlaying.length > 0 && (
                    <MovieRow
                      title="Now Playing"
                      movies={nowPlaying}
                      onMovieClick={handleMovieClick}
                      loading={false}
                    />
                  )}
                  {upcoming.length > 0 && (
                    <MovieRow
                      title="Coming Soon"
                      movies={upcoming}
                      onMovieClick={handleMovieClick}
                      loading={false}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
