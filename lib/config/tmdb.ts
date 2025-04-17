export const TMDB_API_KEY = '3e96dde95504d1869608527d9979dce8';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTk2ZGRlOTU1MDRkMTg2OTYwODUyN2Q5OTc5ZGNlOCIsIm5iZiI6MTczMDc3Mjg1MS4zODQsInN1YiI6IjY3Mjk3ZjczMDZkYzg4NTk2MzIzZmEzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qec9DYUWXONCmhdoG5zguW14ByLeZjJNYzcWZH5KXbU';

export const headers = {
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'accept': 'application/json'
};

export const INDUSTRY_MAPPING: { [key: string]: { 
  region: string; 
  language: string;
  keywords: string[];
  companies: string[];
} } = {
  Hollywood: {
    region: 'US',
    language: 'en',
    keywords: ['1701', '155', '818'], // hollywood, american-film, studio-film
    companies: ['33', '2', '3', '4'], // Disney, Warner Bros, Universal, Paramount
  },
  Bollywood: {
    region: 'IN',
    language: 'hi',
    keywords: ['1924', '2109', '9663'], // bollywood, indian-cinema, mumbai-film-industry
    companies: ['1569', '3538', '1416'], // Yash Raj Films, Dharma Productions, Excel Entertainment
  },
  Korean: {
    region: 'KR',
    language: 'ko',
    keywords: ['2157', '2154', '9648'], // korean-drama, korean-film, korean-cinema
    companies: ['7036', '9339', '4378'], // CJ Entertainment, Showbox, Lotte Entertainment
  },
  Japanese: {
    region: 'JP',
    language: 'ja',
    keywords: ['6867', '210024', '9840'], // japanese-film, anime, japanese-animation
    companies: ['5', '2883', '3341'], // Toho, Studio Ghibli, Toei Animation
  }
};