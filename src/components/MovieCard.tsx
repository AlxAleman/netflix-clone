import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getImageUrl = (path: string) => {
    if (!path) {
      return `https://via.placeholder.com/500x750/1a1a1a/ffffff?text=Image+Not+Available`;
    }
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <div
      className="relative min-w-[200px] md:min-w-[300px] cursor-pointer transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main image */}
      <img
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        className="w-full h-auto rounded-md object-cover"
        loading="lazy"
      />

      {/* Overlay with information (appears on hover) */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/80 rounded-md flex flex-col justify-end p-4 transition-all duration-300">
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm md:text-base overflow-hidden" 
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
              {movie.title}
            </h3>
            
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <span className="bg-red-600 px-1 py-0.5 rounded text-xs">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>

            <p className="text-gray-300 text-xs overflow-hidden"
               style={{
                 display: '-webkit-box',
                 WebkitLineClamp: 3,
                 WebkitBoxOrient: 'vertical'
               }}>
              {movie.overview}
            </p>

            {/* Action buttons */}
            <div className="flex items-center space-x-2 pt-2">
              <button className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
                <Play className="w-4 h-4 fill-black" />
              </button>
              
              <button className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
              
              <button className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors">
                <ThumbsUp className="w-4 h-4" />
              </button>
              
              <button className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors ml-auto">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}