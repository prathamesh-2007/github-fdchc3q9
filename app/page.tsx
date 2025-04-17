'use client';

import { RecommendationForm } from '@/components/recommendation-form';
import { MediaCard } from '@/components/media-card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useRecommendations } from '@/lib/hooks/useRecommendations';

export default function Home() {
  const {
    movies,
    tvShows,
    isLoading,
    fetchRecommendations,
    refresh,
    hasValues,
  } = useRecommendations();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Find Your Next Watch
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized movie and TV show recommendations based on your preferences.
          Discover hidden gems and popular hits tailored just for you.
        </p>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <RecommendationForm onSubmit={fetchRecommendations} isLoading={isLoading} />
      </div>

      {(movies.length > 0 || tvShows.length > 0) && (
        <div className="space-y-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          {movies.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Movie Recommendations</h2>
                <Button 
                  onClick={refresh} 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading || !hasValues}
                  className="smooth-transition"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movies.map((movie, index) => (
                  <div
                    key={movie.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <MediaCard
                      id={movie.id}
                      title={movie.title}
                      overview={movie.overview}
                      posterPath={movie.poster_path}
                      releaseDate={movie.release_date}
                      rating={movie.vote_average}
                      type="movie"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {tvShows.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">TV Show Recommendations</h2>
                <Button 
                  onClick={refresh} 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading || !hasValues}
                  className="smooth-transition"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tvShows.map((show, index) => (
                  <div
                    key={show.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <MediaCard
                      id={show.id}
                      title={show.name}
                      overview={show.overview}
                      posterPath={show.poster_path}
                      releaseDate={show.first_air_date}
                      rating={show.vote_average}
                      type="tv"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}