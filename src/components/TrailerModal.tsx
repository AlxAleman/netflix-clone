import { useState, useEffect } from 'react';
import { X, Play, Plus, ThumbsUp, VolumeX, Volume2 } from 'lucide-react';
import type { Movie } from '../types/movie';

interface TrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

interface MovieDetails {
  runtime: number;
  genres: { id: number; name: string }[];
  cast: { name: string; character: string }[];
  director: string;
  trailerKey: string | null;
}

interface VideoResult {
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

export default function TrailerModal({ movie, isOpen, onClose }: TrailerModalProps) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails();
    }
  }, [isOpen, movie]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case ' ': // Spacebar
          e.preventDefault();
          setIsMuted(!isMuted);
          break;
        case 'm':
        case 'M':
          setIsMuted(!isMuted);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isMuted, onClose]);

  const fetchMovieDetails = async () => {
    if (!movie) return;
    
    setLoading(true);
    try {
      console.log('🎬 Fetching details for movie:', movie.title, 'ID:', movie.id);
      
      // Fetch movie details
      const apiKey = import.meta.env.PUBLIC_TMDB_API_KEY || import.meta.env.TMDB_API_KEY;
      console.log('🔑 API Key exists:', !!apiKey);
      
      const url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits,videos`;
      console.log('🌐 Fetching from URL:', url);
      
      const detailsResponse = await fetch(url);
      console.log('📡 Response status:', detailsResponse.status);
      
      if (!detailsResponse.ok) {
        throw new Error(`HTTP error! status: ${detailsResponse.status}`);
      }
      
      const details = await detailsResponse.json();
      console.log('📊 Full API response:', details);
      console.log('🎥 Videos array:', details.videos?.results);

      // Find trailer
      const allVideos = details.videos?.results || [];
      console.log('🔍 All videos found:', allVideos.length);
      
      allVideos.forEach((video: VideoResult, index: number) => {
        console.log(`Video ${index + 1}:`, {
          name: video.name,
          type: video.type,
          site: video.site,
          key: video.key
        });
      });

      const trailer = allVideos.find((video: VideoResult) => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      console.log('🎯 Selected trailer:', trailer);

      // Get main cast (first 3 actors)
      const cast = details.credits?.cast?.slice(0, 3) || [];

      // Find director
      const director = details.credits?.crew?.find((person: any) => 
        person.job === 'Director'
      );

      const movieDetailsData = {
        runtime: details.runtime || 0,
        genres: details.genres || [],
        cast,
        director: director?.name || 'Unknown',
        trailerKey: trailer?.key || null
      };
      
      console.log('✅ Final movie details:', movieDetailsData);
      setMovieDetails(movieDetailsData);
    } catch (error) {
      console.error('❌ Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getMaturityRating = (voteAverage: number) => {
    if (voteAverage >= 8) return '13+';
    if (voteAverage >= 6) return '16+';
    return '18+';
  };

  const getMatchPercentage = () => {
    return Math.floor(Math.random() * 20) + 80; // 80-99% match
  };

  // Funciones para el sistema de colores de calificación
  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) return 'bg-green-600'; // Verde para excelente
    if (rating >= 6.0) return 'bg-yellow-600'; // Amarillo para bueno
    return 'bg-red-600'; // Rojo para regular
  };

  const getRatingTextColor = (rating: number) => {
    if (rating >= 7.5) return 'text-green-100'; 
    if (rating >= 6.0) return 'text-yellow-100'; 
    return 'text-red-100'; 
  };

  const getRatingBorderColor = (rating: number) => {
    if (rating >= 7.5) return 'border-green-500'; 
    if (rating >= 6.0) return 'border-yellow-500'; 
    return 'border-red-500'; 
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Rating badge en la esquina superior izquierda del modal */}
        <div className={`absolute top-4 left-4 z-20 ${getRatingColor(movie.vote_average)} ${getRatingTextColor(movie.vote_average)} px-3 py-1 rounded-md font-bold text-sm shadow-lg backdrop-blur-sm`}>
          ★ {movie.vote_average.toFixed(1)}
        </div>

        {/* Video section */}
        <div className="relative h-96 bg-gradient-to-b from-transparent to-black">
          {movieDetails?.trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${movieDetails.trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center flex items-center justify-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
              }}
            >
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-60" />
                <p className="text-lg opacity-80">No trailer available</p>
              </div>
            </div>
          )}

          {/* Volume control */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-4 right-4 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-20 left-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center bg-white text-black px-8 py-2 rounded font-semibold hover:bg-gray-200 transition-colors">
                <Play className="w-5 h-5 mr-2 fill-black" />
                Play
              </button>
              
              <button className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                <Plus className="w-5 h-5 text-white" />
              </button>
              
              <button className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                <ThumbsUp className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Movie details */}
        <div className="p-8">
          {loading ? (
            <div className="text-white text-center py-8">Loading details...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left column */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-500 font-semibold">
                    {getMatchPercentage()}% Match
                  </span>
                  <span className="text-white">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                  <span className="border border-gray-400 px-1 text-gray-300 text-xs">
                    {getMaturityRating(movie.vote_average)}
                  </span>
                  {movieDetails?.runtime ? (
                    <span className="text-white">
                      {formatRuntime(movieDetails.runtime)}
                    </span>
                  ) : null}
                  <span className="border border-gray-400 px-1 text-gray-300 text-xs">
                    HD
                  </span>
                  {/* Rating badge en los detalles */}
                  <span className={`${getRatingColor(movie.vote_average)} ${getRatingTextColor(movie.vote_average)} px-2 py-1 rounded text-xs font-bold`}>
                    ★ {movie.vote_average.toFixed(1)}
                  </span>
                </div>

                <p className="text-white text-lg leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Right column */}
              <div className="space-y-4 text-sm">
                {movieDetails?.cast && movieDetails.cast.length > 0 && (
                  <div>
                    <span className="text-gray-400">Cast: </span>
                    <span className="text-white">
                      {movieDetails.cast.map(actor => actor.name).join(', ')}
                      {movieDetails.cast.length >= 3 && ', '}
                      <span className="text-gray-400">more</span>
                    </span>
                  </div>
                )}

                {movieDetails?.genres && movieDetails.genres.length > 0 && (
                  <div>
                    <span className="text-gray-400">Genres: </span>
                    <span className="text-white">
                      {movieDetails.genres.map(genre => genre.name).join(', ')}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-gray-400">This Movie Is: </span>
                  <span className="text-white">
                    {movie.vote_average >= 7 ? 'Exciting, Thrilling' : 'Entertaining, Dramatic'}
                  </span>
                </div>

                {/* Rating destacado en la columna derecha */}
                <div className={`p-3 rounded-lg border-2 ${getRatingBorderColor(movie.vote_average)} bg-black/50`}>
                  <div className="text-center">
                    <div className={`${getRatingColor(movie.vote_average)} ${getRatingTextColor(movie.vote_average)} inline-block px-3 py-2 rounded-lg font-bold text-lg mb-2`}>
                      ★ {movie.vote_average.toFixed(1)}
                    </div>
                    <p className="text-gray-400 text-xs">
                      {movie.vote_average >= 7.5 ? 'Excellent Rating' : 
                       movie.vote_average >= 6.0 ? 'Good Rating' : 'Fair Rating'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}