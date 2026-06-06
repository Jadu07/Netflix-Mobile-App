import axios from 'axios';

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getTrendingMovies = async () => {
  const response = await tmdbClient.get('/trending/movie/day');
  return response.data.results;
};

export const getTopRatedMovies = async () => {
  const response = await tmdbClient.get('/movie/top_rated');
  return response.data.results;
};

export const getUpcomingMovies = async () => {
  const response = await tmdbClient.get('/movie/upcoming');
  return response.data.results;
};

export const searchMovies = async (query, year) => {
  const params = { query };
  if (year) {
    params.primary_release_year = year;
  }
  const response = await tmdbClient.get('/search/movie', { params });
  return response.data.results;
};

export const discoverMovies = async (genreId, year) => {
  const params = {
    sort_by: 'popularity.desc',
  };
  if (genreId) params.with_genres = genreId;
  if (year) params.primary_release_year = year;
  
  const response = await tmdbClient.get('/discover/movie', { params });
  return response.data.results;
};

export const getGenres = async () => {
  const response = await tmdbClient.get('/genre/movie/list');
  return response.data.genres;
};

export const getMovieDetails = async (movieId) => {
  const response = await tmdbClient.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'videos',
    },
  });
  return response.data;
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
