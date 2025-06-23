import { Play, Info } from 'lucide-react';
import type { Movie } from '../types/movie';

interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getBackdropUrl = (path: string) => {
    if (!path) {
      return `https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=Background+Not+Available`;
    }
    return `https://image.tmdb.org/t/p/w1280${path}`;
  };

  return (
    <div className="relative h-screen w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-16 w-full max-w-4xl">
        <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
          {movie.title}
        </h1>
        
        <p className="text-lg md:text-xl mb-8 text-gray-100 leading-relaxed max-w-2xl">
          {truncateText(movie.overview, 200)}
        </p>

        {/* Buttons */}
        <div className="flex space-x-4 mb-8">
          <button className="flex items-center bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition-colors font-semibold">
            <Play className="w-6 h-6 mr-2 fill-black" />
            Play
          </button>
          
          <button className="flex items-center bg-gray-500/70 text-white px-8 py-3 rounded hover:bg-gray-500/90 transition-colors font-semibold">
            <Info className="w-6 h-6 mr-2" />
            More Info
          </button>
        </div>

        {/* Additional information */}
        <div className="flex items-center space-x-4 text-sm text-gray-200">
          <span className="bg-red-600 px-2 py-1 rounded text-xs font-bold">
            ★ {movie.vote_average.toFixed(1)}
          </span>
          <span>{new Date(movie.release_date).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}