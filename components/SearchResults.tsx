"use client";
import { useEffect, useState } from "react";
import { searchMovies } from "@actions/movieData";
import { Movie } from "@lib/types";
import MovieCard from "./MovieCard";

const SearchResults = ({ query }: { query: string }) => {
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Menentukan apakah ada lebih banyak data untuk dimuat

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      const movies = await searchMovies(query, page); // Modifikasi searchMovies untuk menerima page
      if (movies.length === 0) {
        setHasMore(false); // Jika tidak ada film lagi, hentikan pemuatan
      }
      setSearchedMovies((prevMovies) => [...prevMovies, ...movies]); // Gabungkan data baru dengan yang sebelumnya
      setIsLoading(false);
    };

    fetchMovies();
  }, [query, page]);

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1); // Tambah halaman
  };

  return (
    <div className="search-page">
      {isLoading && page === 1 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : searchedMovies.length === 0 ? (
        <h1 className="text-heading2-bold text-white">No results found</h1>
      ) : (
        <>
          <h1 className="text-heading2-bold text-white">
            Results for "{query}"
          </h1>
          <div className="list">
            {searchedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {isLoading && page > 1 && (
            <div className="flex justify-center items-center my-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
            </div>
          )}
          {hasMore && !isLoading && (
            <div className="flex justify-center">
              <button
                onClick={loadMoreMovies}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
