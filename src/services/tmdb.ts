import type { TMDBResponse, Movie } from '../types/movie';

// Using TMDB Read Access Token for authentication
const API_READ_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZjEzMWVhYjI2OTQwMTdkMjI4ZjU4MzE1YTAwYmNlNSIsIm5iZiI6MTc1MDcwNDE3Ni4yMjMsInN1YiI6IjY4NTlhMDMwMjI2YzAzNjQ3MTc0NGRmMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PANNDnkW7IPhil0-NiXed0OnyWRGyzog2S1_PGYhkmI';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBService {
  private async fetchFromTMDB(endpoint: string): Promise<TMDBResponse> {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_READ_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching from TMDB:', error);
      // Fallback to mock data in case of error
      return this.getMockData();
    }
  }

  private getMockData(): TMDBResponse {
    // Sample data for development
    return {
      page: 1,
      total_pages: 1,
      total_results: 5,
      results: [
        {
          id: 1,
          title: "The Dark Knight",
          overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
          poster_path: "/example1.jpg",
          backdrop_path: "/example1_backdrop.jpg",
          release_date: "2008-07-18",
          vote_average: 9.0,
          genre_ids: [28, 18, 80],
          adult: false,
          original_language: "en",
          original_title: "The Dark Knight",
          popularity: 1000,
          video: false,
          vote_count: 2500
        },
        {
          id: 2,
          title: "Inception",
          overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          poster_path: "/example2.jpg",
          backdrop_path: "/example2_backdrop.jpg",
          release_date: "2010-07-16",
          vote_average: 8.8,
          genre_ids: [28, 878, 53],
          adult: false,
          original_language: "en",
          original_title: "Inception",
          popularity: 950,
          video: false,
          vote_count: 2100
        },
        {
          id: 3,
          title: "Interstellar",
          overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          poster_path: "/example3.jpg",
          backdrop_path: "/example3_backdrop.jpg",
          release_date: "2014-11-07",
          vote_average: 8.6,
          genre_ids: [18, 878],
          adult: false,
          original_language: "en",
          original_title: "Interstellar",
          popularity: 890,
          video: false,
          vote_count: 1900
        },
        {
          id: 4,
          title: "Pulp Fiction",
          overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
          poster_path: "/example4.jpg",
          backdrop_path: "/example4_backdrop.jpg",
          release_date: "1994-10-14",
          vote_average: 8.9,
          genre_ids: [80, 18],
          adult: false,
          original_language: "en",
          original_title: "Pulp Fiction",
          popularity: 820,
          video: false,
          vote_count: 1800
        },
        {
          id: 5,
          title: "The Matrix",
          overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
          poster_path: "/example5.jpg",
          backdrop_path: "/example5_backdrop.jpg",
          release_date: "1999-03-31",
          vote_average: 8.7,
          genre_ids: [28, 878],
          adult: false,
          original_language: "en",
          original_title: "The Matrix",
          popularity: 780,
          video: false,
          vote_count: 1700
        }
      ]
    };
  }

  async getTrending(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/trending/movie/week');
    return data.results;
  }

  async getPopular(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/popular');
    return data.results;
  }

  async getTopRated(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/top_rated');
    return data.results;
  }

  async getNowPlaying(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/now_playing');
    return data.results;
  }

  async getUpcoming(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/upcoming');
    return data.results;
  }

  async searchMovies(query: string): Promise<Movie[]> {
  try {
    // Intentar buscar en la API real
    const data = await this.fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
    return data.results;
  } catch (error) {
    // Si hay error, buscar en los mocks usando coincidencia parcial (case-insensitive)
    const mock = this.getMockData();
    const q = query.toLowerCase();
    return mock.results.filter(
      m =>
        m.title.toLowerCase().includes(q) ||
        (m.overview && m.overview.toLowerCase().includes(q))
    );
  }
}


  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) {
      return `https://via.placeholder.com/500x750/1a1a1a/ffffff?text=Image+Not+Available`;
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getBackdropUrl(path: string, size: string = 'w1280'): string {
    if (!path) {
      return `https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=Background+Not+Available`;
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
}

export const tmdbService = new TMDBService();