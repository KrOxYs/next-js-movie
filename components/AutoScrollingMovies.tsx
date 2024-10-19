"use client";

import { baseImgUrl } from "@lib/constants";
import { Movie } from "@lib/types";
import { useState } from "react";
import Modal from "./Modal";
import { AiOutlineEye, AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Import ikon fill dari React Icons

const MovieCard = ({ movie }: { movie: Movie }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // State untuk ikon Love

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Fungsi toggle untuk ikon Love
  const toggleLike = () => setIsLiked((prev) => !prev);

  return (
    <>
      <div
        className="relative movie-card group w-[30vw] md:h-[20vw]"
        onClick={openModal}
      >
        <img
          src={
            movie?.backdrop_path || movie?.poster_path
              ? `${baseImgUrl}${movie?.backdrop_path || movie?.poster_path}`
              : "/assets/no-image.png"
          }
          className="thumbnail"
          alt={movie?.title || movie?.name}
        />
        <div className="border"></div>

        {/* Ikon Mata, Love, dan Nama Film yang muncul saat di-hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-4">
          <div className="text-white text-lg font-bold text-center">
            {movie?.title || movie?.name}
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex flex-col items-center text-white">
              <AiOutlineEye size={24} />
              <span className="text-sm">Lihat</span>
            </div>
            {/* Ikon Love dengan toggle */}
            {/* <div
              className="flex flex-col items-center text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Menghindari modal terbuka saat klik ikon Love
                toggleLike();
              }}
            >
              {isLiked ? (
                <AiFillHeart size={24} className="text-red-500" />
              ) : (
                <AiOutlineHeart size={24} />
              )}
              <span className="text-sm">Suka</span>
            </div> */}
          </div>
          {/* Nama film */}
        </div>
      </div>

      {showModal && <Modal movie={movie} closeModal={closeModal} />}
    </>
  );
};

export default MovieCard;
