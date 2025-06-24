import { Play, Plus, ThumbsUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { LazyImage } from './LazyImage';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onMovieClick: (movie: Movie) => void;
  enableAutoplay?: boolean;
}

const TMDB_BASE_URL = import.meta.env.PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = import.meta.env.PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
const TMDB_TOKEN = import.meta.env.PUBLIC_TMDB_READ_ACCESS_TOKEN;

export default function MovieCard({ movie, onMovieClick, enableAutoplay = true }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) {
      return `https://via.placeholder.com/500x750/1a1a1a/ffffff?text=${encodeURIComponent(movie.title || 'No Title')}`;
    }
    return `${TMDB_IMAGE_BASE_URL}/w500${path}`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) return 'bg-green-600';
    if (rating >= 6.0) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getRatingTextColor = (rating: number) => {
    if (rating >= 7.5) return 'text-green-100';
    if (rating >= 6.0) return 'text-yellow-100';
    return 'text-red-100';
  };

  const handleCardClick = () => {
    if (onMovieClick && typeof onMovieClick === 'function') {
      onMovieClick(movie);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCardClick();
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // Muestra el video después de hover suficiente tiempo
  useEffect(() => {
    if (isHovered && enableAutoplay && !videoError) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowVideo(true);
      }, 800);
    } else {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setShowVideo(false);
    }
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [isHovered, enableAutoplay, videoError]);

  // SOLO pedir trailer al hacer hover
  useEffect(() => {
    if (showVideo && !videoError) {
      setLoadingVideo(true);
      setVideoKey(null);

      console.log("TMDB_TOKEN", TMDB_TOKEN);
      fetch(`${TMDB_BASE_URL}/movie/${movie.id}/videos`, {
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          accept: 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log("Video API data:", data);
          // Buscar: Trailer > Teaser > cualquier YouTube
          let video = data.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
          if (!video) video = data.results?.find((v: any) => v.type === 'Teaser' && v.site === 'YouTube');
          if (!video) video = data.results?.find((v: any) => v.site === 'YouTube');
          setVideoKey(video ? video.key : null);
          setLoadingVideo(false);
        })
        .catch(err => {
          setVideoKey(null);
          setLoadingVideo(false);
          console.log("Video API error:", err);
        });
    }
    if (!showVideo) {
      setVideoKey(null);
      setLoadingVideo(false);
    }
  }, [showVideo, movie.id, videoError]);

  return (
    <div
      className="relative min-w-[200px] md:min-w-[300px] cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Imagen principal */}
      <div className="relative overflow-hidden rounded-md">
        <LazyImage
          src={getImageUrl(movie.poster_path)}
          alt={movie.title || 'Movie poster'}
          className="w-full h-[300px] md:h-[450px]"
        />
        {/* Video preview */}
        {showVideo && !videoError && (
          <div className="absolute inset-0 bg-black z-20 flex items-center justify-center">
            {loadingVideo ? (
              <span className="text-white">Loading trailer...</span>
            ) : videoKey ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoKey}`}
                allow="autoplay; encrypted-media"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full object-cover rounded-md"
                title={movie.title}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-black text-white">
                Trailer not available
              </div>
            )}
            {/* Mute toggle solo para videos */}
            {videoKey && (
              <button
                onClick={handleMuteToggle}
                className="absolute bottom-16 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors z-30"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
        {/* Rating badge */}
        <div className={`absolute bottom-2 right-2 ${getRatingColor(movie.vote_average)} ${getRatingTextColor(movie.vote_average)} px-2 py-1 rounded-md font-bold text-xs shadow-lg backdrop-blur-sm z-10`}>
          ★ {movie.vote_average.toFixed(1)}
        </div>
      </div>

      {/* Overlay con info (aparece en hover) */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-md flex flex-col justify-end p-4 transition-all duration-300 z-30">
          <div className="space-y-2">
            <h3 className="text-white font-bold text-sm md:text-base overflow-hidden"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
              {movie.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <span className={`${getRatingColor(movie.vote_average)} px-1 py-0.5 rounded text-xs font-bold ${getRatingTextColor(movie.vote_average)}`}>
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
            {/* Botones de acción */}
            <div className="flex items-center space-x-2 pt-2">
              <button 
                onClick={handlePlayClick}
                className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-110"
              >
                <Play className="w-4 h-4 fill-black" />
              </button>
              <button className="bg-gray-600/80 backdrop-blur text-white p-2 rounded-full hover:bg-gray-500 transition-all duration-300 transform hover:scale-110">
                <Plus className="w-4 h-4" />
              </button>
              <button className="bg-gray-600/80 backdrop-blur text-white p-2 rounded-full hover:bg-gray-500 transition-all duration-300 transform hover:scale-110">
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button className="bg-gray-600/80 backdrop-blur text-white p-2 rounded-full hover:bg-gray-500 transition-all duration-300 ml-auto transform hover:scale-110">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
