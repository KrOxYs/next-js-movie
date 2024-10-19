"use client";

import { Genre, Movie, Video } from "@lib/types";
import { AddCircle, CancelRounded, RemoveCircle } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ToasterContext from "@context/ToasterContext";

interface Props {
  movie: Movie;
  closeModal: () => void;
}

interface User {
  email: string;
  username: string;
  favorites: number[];
}

const Modal: React.FC<Props> = ({ movie, closeModal }) => {
  const router = useRouter();

  const [video, setVideo] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: session } = useSession();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
    },
  };

  const getMovieDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movie/${movie.id}?append_to_response=videos`,
        options
      );
      const data = await res.json();

      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (video: Video) => video.type === "Trailer"
        );
        if (index !== -1) {
          setVideo(data.videos.results[index].key);
        }
      }

      if (data?.genres) {
        setGenres(data.genres);
      }

      setLoading(false); // Set loading ke false setelah fetch selesai
    } catch (err) {
      console.log("Error fetching movie details", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovieDetails();
  }, [movie]);

  const getUser = async () => {
    if (!session) return; // Jika tidak ada session, hentikan fungsi

    try {
      const res = await fetch(`/api/user/${session.user?.email}`);
      const data = await res.json();
      setUser(data);
      setIsFavorite(data.favorites.includes(movie.id));
    } catch (err) {
      console.log("Error fetching user", err);
    }
  };

  useEffect(() => {
    if (session) getUser(); // Ambil data user hanya jika ada session
  }, [session]);

  const handleMyList = async () => {
    if (!session) {
      toast.error("Anda harus login untuk menggunakan fitur ini.");
      return;
    }

    try {
      const res = await fetch(`/api/user/${session?.user?.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId: movie.id }),
      });
      const data = await res.json();
      setUser(data);
      setIsFavorite(data.favorites.includes(movie.id));
      router.refresh();

      // Menampilkan notifikasi berdasarkan status
      if (data.favorites.includes(movie.id)) {
        toast.success("Film berhasil ditambahkan ke favorit!");
      } else {
        toast.success("Film dihapus dari daftar favorit.");
      }
    } catch (err) {
      console.log("Failed to handle my list", err);
      toast.error("Gagal memperbarui daftar.");
    }
  };

  return loading ? (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2">
      <Loader />
    </div>
  ) : (
    <div className="modal bg-white rounded-lg shadow-lg p-4 relative z-30">
      <button
        className="absolute top-4 right-4 text-white"
        onClick={closeModal}
      >
        <CancelRounded sx={{ fontSize: "35px", ":hover": { color: "red" } }} />
      </button>

      <iframe
        src={`https://www.youtube.com/embed/${video}?autoplay=1&mute=1&loop=1`}
        className="modal-video w-full h-64 rounded-lg mb-4"
        loading="lazy"
        allowFullScreen
      />

      <div className="modal-content">
        <div className="flex justify-between mb-2">
          <div className="flex gap-2">
            <p className="font-semibold">Name:</p>
            <p className="text-gray-700">{movie?.title || movie?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">Add To List:</p>
            {session ? (
              isFavorite ? (
                <RemoveCircle
                  className="cursor-pointer text-pink-600"
                  onClick={handleMyList}
                />
              ) : (
                <AddCircle
                  className="cursor-pointer text-pink-600"
                  onClick={handleMyList}
                />
              )
            ) : (
              <p className="text-gray-500">Login untuk menambahkan ke daftar</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          <p className="font-semibold">Release Date:</p>
          <p className="text-gray-700">{movie?.release_date}</p>
        </div>

        <p className="text-gray-700 mb-2">{movie?.overview}</p>

        <div className="flex gap-2 mb-2">
          <p className="font-semibold">Rating:</p>
          <p className="text-gray-700">{movie?.vote_average}</p>
        </div>

        <div className="flex gap-2">
          <p className="font-semibold">Genres:</p>
          <p className="text-gray-700">
            {genres.map((genre) => genre.name).join(", ")}
          </p>
        </div>
      </div>

      <ToasterContext />
    </div>
  );
};

export default Modal;
