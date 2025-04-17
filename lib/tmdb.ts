import { BASE_URL, headers, INDUSTRY_MAPPING } from './config/tmdb';
import { Movie, TVShow } from './types/tmdb';
import { getCertificationQuery } from './utils/certifications';
import { getRandomPage } from './utils/pagination';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000;

async function fetchWithCache(url: string, options: RequestInit) {
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const response = await fetch(url, options);
  const data = await response.json();
  
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

export const fetchMovies = async (params: {
  industry?: string;
  year?: string;
  genre?: string;
  contentRating?: string;
}) => {
  const { industry, year, genre, contentRating } = params;
  
  let baseUrl = `${BASE_URL}/discover/movie?include_adult=false&sort_by=vote_count.desc&vote_count.gte=1000&vote_average.gte=6.0`;
  
  if (industry) {
    const industryConfig = INDUSTRY_MAPPING[industry];
    if (industryConfig) {
      baseUrl += `&with_original_language=${industryConfig.language}`;
      baseUrl += `&region=${industryConfig.region}`;
      
      if (industryConfig.companies.length > 0) {
        baseUrl += `&with_companies=${industryConfig.companies.join('|')}`;
      }
      
      if (industryConfig.keywords.length > 0) {
        baseUrl += `&with_keywords=${industryConfig.keywords.join('|')}`;
      }
    }
  }
  
  if (year) {
    const yearNum = parseInt(year);
    baseUrl += `&primary_release_year=${year}`;
    // Include movies from nearby years if not enough results
    baseUrl += `&primary_release_date.gte=${yearNum-1}-01-01`;
    baseUrl += `&primary_release_date.lte=${yearNum+1}-12-31`;
  }
  
  if (genre) baseUrl += `&with_genres=${genre}`;
  
  if (industry && contentRating) {
    baseUrl += getCertificationQuery(industry, contentRating);
  }

  try {
    // First try with strict filters
    const strictUrl = `${baseUrl}&page=1`;
    const strictData = await fetchWithCache(strictUrl, { headers });
    
    if (strictData.results?.length >= 3) {
      return strictData.results.slice(0, 3);
    }
    
    // If not enough results, relax some constraints
    const relaxedUrl = baseUrl
      .replace('vote_count.gte=1000', 'vote_count.gte=100')
      .replace('vote_average.gte=6.0', 'vote_average.gte=5.0');
    
    const randomPage = await getRandomPage(relaxedUrl);
    const relaxedData = await fetchWithCache(`${relaxedUrl}&page=${randomPage}`, { headers });
    
    return (relaxedData.results || []).slice(0, 3);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchTVShows = async (params: {
  industry?: string;
  year?: string;
  genre?: string;
  contentRating?: string;
}) => {
  const { industry, year, genre } = params;
  
  let baseUrl = `${BASE_URL}/discover/tv?include_adult=false&sort_by=vote_count.desc&vote_count.gte=500&vote_average.gte=7.0`;
  
  if (industry) {
    const industryConfig = INDUSTRY_MAPPING[industry];
    if (industryConfig) {
      baseUrl += `&with_original_language=${industryConfig.language}`;
      baseUrl += `&with_origin_country=${industryConfig.region}`;
      
      if (industryConfig.companies.length > 0) {
        baseUrl += `&with_companies=${industryConfig.companies.join('|')}`;
      }
      
      if (industryConfig.keywords.length > 0) {
        baseUrl += `&with_keywords=${industryConfig.keywords.join('|')}`;
      }
    }
  }
  
  if (year) {
    const yearNum = parseInt(year);
    baseUrl += `&first_air_date_year=${year}`;
    // Include shows from nearby years if not enough results
    baseUrl += `&first_air_date.gte=${yearNum-1}-01-01`;
    baseUrl += `&first_air_date.lte=${yearNum+1}-12-31`;
  }
  
  if (genre) baseUrl += `&with_genres=${genre}`;

  try {
    // First try with strict filters
    const strictUrl = `${baseUrl}&page=1`;
    const strictData = await fetchWithCache(strictUrl, { headers });
    
    let results = strictData.results || [];
    
    if (industry) {
      const industryConfig = INDUSTRY_MAPPING[industry];
      if (industryConfig) {
        results = results.filter((show: TVShow) => 
          show.origin_country.includes(industryConfig.region)
        );
      }
    }
    
    if (results.length >= 3) {
      return results.slice(0, 3);
    }
    
    // If not enough results, relax some constraints
    const relaxedUrl = baseUrl
      .replace('vote_count.gte=500', 'vote_count.gte=50')
      .replace('vote_average.gte=7.0', 'vote_average.gte=6.0');
    
    const randomPage = await getRandomPage(relaxedUrl);
    const relaxedData = await fetchWithCache(`${relaxedUrl}&page=${randomPage}`, { headers });
    
    results = relaxedData.results || [];
    
    if (industry) {
      const industryConfig = INDUSTRY_MAPPING[industry];
      if (industryConfig) {
        results = results.filter((show: TVShow) => 
          show.origin_country.includes(industryConfig.region)
        );
      }
    }
    
    return results.slice(0, 3);
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return [];
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  const url = `${BASE_URL}/movie/${id}?language=en-US`;
  return fetchWithCache(url, { headers });
};

export const fetchMovieCredits = async (id: number) => {
  const url = `${BASE_URL}/movie/${id}/credits?language=en-US`;
  return fetchWithCache(url, { headers });
};

export const fetchTVShowDetails = async (id: number): Promise<TVShow> => {
  const url = `${BASE_URL}/tv/${id}?language=en-US`;
  return fetchWithCache(url, { headers });
};

export const fetchTrending = async () => {
  const url = `${BASE_URL}/trending/movie/day?language=en-US`;
  const data = await fetchWithCache(url, { headers });
  return data.results;
};

export const fetchPopular = async () => {
  const url = `${BASE_URL}/movie/now_playing?language=en-US`;
  const data = await fetchWithCache(url, { headers });
  return data.results;
};

export const fetchNowPlaying = async () => {
  const url = `${BASE_URL}/movie/now_playing?language=en-US&region=US`;
  const data = await fetchWithCache(url, { headers });
  return data.results;
};

export const fetchTopRatedMovies = async () => {
  const url = `${BASE_URL}/movie/top_rated?language=en-US`;
  const data = await fetchWithCache(url, { headers });
  return data.results;
};

export const fetchTopRatedTVShows = async () => {
  const url = `${BASE_URL}/tv/top_rated?language=en-US`;
  const data = await fetchWithCache(url, { headers });
  return data.results;
};

export const fetchMovieTrailer = async (id: number) => {
  const url = `${BASE_URL}/movie/${id}/videos?language=en-US`;
  const data = await fetchWithCache(url, { headers });
  return data.results.find((video: any) => video.type === 'Trailer');
};