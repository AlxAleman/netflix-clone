// src/pages/api/search.ts
import type { APIRoute } from 'astro';
import { tmdbService } from '../../services/tmdb';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q') || '';
  if (!query || query.length < 1) {
    return new Response(JSON.stringify({ results: [] }), { status: 200 });
  }
  const results = await tmdbService.searchMovies(query);
  return new Response(JSON.stringify({ results }), { status: 200 });
};
