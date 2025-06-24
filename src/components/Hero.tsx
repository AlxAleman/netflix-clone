import { Play, Info } from 'lucide-react';
import type { Movie } from '../types/movie';

interface HeroProps {
  movie: Movie;
  onPlayClick: (movie: Movie) => void;
}

const getBackdropUrl = (path: string | null) => {
  if (!path) {
    return `https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=Background+Not+Available`;
  }
  return `https://image.tmdb.org/t/p/w1280${path}`;
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function Hero({ movie, onPlayClick }: HeroProps) {
  const handlePlayClick = () => {
    onPlayClick(movie);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
          filter: 'blur(0.5px)',
        }}
      >
        {/* Simple dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-16 w-full max-w-4xl">
        <div className="mt-20">
          <h1 
            className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight"
            style={{
              textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
            }}
          >
            {movie.title}
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-100 leading-relaxed max-w-2xl drop-shadow-lg">
            {truncateText(movie.overview, 200)}
          </p>

          {/* Buttons */}
          <div className="flex space-x-4 mb-8">
            <button 
              onClick={handlePlayClick}
              className="flex items-center bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg"
            >
              <Play className="w-6 h-6 mr-2 fill-black" />
              Play
            </button>
            
            <button 
              className="flex items-center text-white px-8 py-3 rounded transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg bg-gray-700/80 backdrop-blur"
            >
              <Info className="w-6 h-6 mr-2" />
              More Info
            </button>
          </div>

          {/* Additional information */}
          <div className="flex items-center space-x-4 text-sm text-gray-200">
            <span 
              className="px-3 py-1 rounded text-xs font-bold shadow-lg bg-red-700"
              style={{
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              ★ {movie.vote_average.toFixed(1)}
            </span>
            <span className="drop-shadow-lg">{new Date(movie.release_date).getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
