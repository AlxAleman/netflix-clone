import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { MovieCardSkeleton } from './SkeletonLoader';
import type { Movie } from '../types/movie';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  loading?: boolean;
}

export default function MovieRow({ title, movies, onMovieClick, loading = false }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(3);
      else if (window.innerWidth < 1024) setVisibleCount(4);
      else setVisibleCount(6);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="px-4 md:px-16 mb-12">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-6">
        {title}
      </h2>
      
      <div className="relative group">
        {/* Left arrow */}
        {showLeftArrow && !loading && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right arrow */}
        {showRightArrow && !loading && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Movies container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          {loading ? (
            // Show skeleton loaders
            Array.from({ length: visibleCount }).map((_, index) => (
              <MovieCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            // Show actual movies
            movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onMovieClick={onMovieClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}