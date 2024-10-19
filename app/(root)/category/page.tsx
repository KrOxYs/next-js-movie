"use client";
import { fetchGenreMovies } from "@actions/movieData";
import CategoryList from "@components/CategoryList";
import { Movie } from "@lib/types";
import React, { useEffect, useState, useRef } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Navbar from "@components/Navbar";
import Loader from "@components/Loader";

interface Genre {
  id: number;
  name: string;
  movies: any[];
}

export default function Page() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const fetchGenre = async () => {
      setLoading(true);
      const data = await fetchGenreMovies();
      setGenres(data);
      setLoading(false);
    };

    fetchGenre();
  }, []);

  const scrollLeft = (id: number) => {
    if (scrollRefs.current[id]) {
      scrollRefs.current[id]?.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = (id: number) => {
    if (scrollRefs.current[id]) {
      scrollRefs.current[id]?.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="p-4">
          <h1 className="text-heading3-bold text-gray-700 p-4">Categories</h1>
          {genres.map((genre) => (
            <div key={genre.id} className="mb-8 p-4 relative">
              <div className="flex items-center">
                <button
                  onClick={() => scrollLeft(genre.id)}
                  className="absolute left-0 z-10 p-2 top-1/2 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition"
                >
                  <ArrowBackIosIcon />
                </button>
                <div
                  ref={(p) => {
                    scrollRefs.current[genre.id] = p;
                  }}
                  className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory "
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  <CategoryList title={genre.name} movies={genre.movies} />
                </div>
                <button
                  onClick={() => scrollRight(genre.id)}
                  className="absolute right-0 z-0 p-2 top-1/2 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition"
                >
                  <ArrowForwardIosIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
