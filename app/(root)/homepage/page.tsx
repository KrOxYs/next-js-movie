"use client";
import { useState, useEffect } from "react";
import {
  fetchPlayingMovies,
  fetchPopularMovies,
  fetchTrending,
} from "@actions/movieData"; // Pastikan kamu memiliki fungsi fetchNowPlaying
import Navbar from "@components/Navbar";
import { Movie } from "@lib/types";
import Hero from "@components/Hero";
import Loader from "@components/Loader";
import AutoScrollingMovies from "@components/AutoScrollingMovies";
import MovieCard from "@components/MovieCard";

const Home: React.FC = () => {
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]); // State untuk film yang ditampilkan
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loadingAll, setLoadingAll] = useState<boolean>(true); // Loading state
  const [trending, setTrending] = useState<Movie | undefined>(); // State untuk menyimpan film trending
  const [page, setPage] = useState(1); // State untuk halaman
  const [loading, setLoading] = useState(false); // State untuk loading
  const [visiblePopularMovies, setVisiblePopularMovies] = useState<Movie[]>([]);
  const moviesPerPage = 6;
  const totalPopularMoviesLimit = 30; // Batas total film populer yang akan diambil

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      const nowPlayingMovies = await fetchPlayingMovies();
      setVisibleMovies(nowPlayingMovies.slice(0, 6));
      setLoadingAll(false);
    };

    fetchNowPlayingMovies();
  }, []);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const trendingMovies = await fetchTrending();
      const randomNumber = Math.floor(Math.random() * trendingMovies.length);
      const trendingMovie = trendingMovies[randomNumber];
      setTrending(trendingMovie);
    };
    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoadingAll(true);
      const initialMovies = await fetchPopularMovies(page); // Ambil film untuk halaman pertama
      setPopularMovies(initialMovies);
      setVisiblePopularMovies(initialMovies.slice(0, moviesPerPage)); // Tampilkan hanya 6 film pertama
      setLoading(false);
    };

    fetchMovies();
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dimuat

  const loadMoreMovies = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const newMovies = await fetchPopularMovies(nextPage); // Ambil film baru

    setPopularMovies((prevMovies) => [...prevMovies, ...newMovies]); // Gabungkan dengan film sebelumnya
    setVisiblePopularMovies((prevVisiblePopularMovies) => [
      ...prevVisiblePopularMovies,
      ...newMovies.slice(0, moviesPerPage), // Tambahkan hanya 6 film tambahan
    ]);

    setPage(nextPage); // Update halaman
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="w-fit overflow-x-hidden">
        <Hero trendingMovies={trending} />
      </div>
      {loadingAll ? (
        <Loader />
      ) : (
        <div className="all-movies grid grid-cols-3 gap-6 p-4">
          <h1 className=" text-heading5-bold text-green-600 font-bold">
            Now Playing
          </h1>
          <div className="flex flex-wrap gap-9">
            {visibleMovies.map((movie) => (
              <div className="flex" key={movie.id}>
                <AutoScrollingMovies movie={movie} />
              </div>
            ))}
          </div>
          <h1 className=" text-heading5-bold text-green-600 font-bold">
            Popular Movies
          </h1>
          <div className="flex flex-wrap gap-9 justify-center">
            {visiblePopularMovies.map((m) => (
              <div className="flex justify-center " key={m.id}>
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
          {/* Tombol Load More */}
          {visiblePopularMovies.length < totalPopularMoviesLimit ? (
            <div className="load-more col-span-3 text-center mt-4 flex justify-center">
              <button
                onClick={loadMoreMovies}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          ) : (
            <div className="col-span-3 text-center mt-4">
              <p className="text-gray-600">
                Semua film populer sudah ditampilkan.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
