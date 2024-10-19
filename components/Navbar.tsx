"use client";

import { Search } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react"; // Import useSession
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { data: session } = useSession(); // Mengambil session
  const router = useRouter();

  console.log("session", session);

  const [search, setSearch] = useState<string>("");
  const [dropdownMenu, setDropdownMenu] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Cleanup function to remove the event listener when component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className={`navbar ${isScrolled && "bg-black-1"}`}>
      <Link href="/">
        <img src="/assets/logo.png" alt="logo" className="logo" />
      </Link>

      <div className="nav-links">
        <Link href="/" className="nav-link">
          Home
        </Link>
        <Link href="/my-list" className="nav-link">
          My List
        </Link>
        <Link href="/category" className="nav-link">
          Category
        </Link>
      </div>

      <div className="nav-right">
        <div className="search">
          <input
            placeholder="Search movie..."
            className="input-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button disabled={search === ""}>
            <Search
              className="icon"
              onClick={() => router.push(`/search/${search}`)}
            />
          </button>
        </div>

        {session ? (
          <>
            <img
              src="/assets/profile_icon.jpg"
              className="profile"
              alt="profile"
              onClick={() => setDropdownMenu(!dropdownMenu)}
            />

            {dropdownMenu && (
              <div className="dropdown-menu">
                <Link href="/">Home</Link>
                <Link href="/my-list">My List</Link>
                <a onClick={handleLogout}>Log Out</a>
              </div>
            )}
          </>
        ) : (
          <>
            {/* <div className=" text-heading4-bold gap-3 flex text-white ">
              <div className="max-sm:hidden">
                <Link href="/login" className="hover:text-pink-600">
                  Login
                </Link>
              </div>
              <div className="max-sm:hidden">
                <Link href="/register" className="hover:text-pink-600">
                  Register
                </Link>
              </div>
            </div> */}
          </>
        )}
      </div>
      {!session && (
        <div className="">
          <img
            src="https://www.svgrepo.com/show/312300/hamburger-menu.svg"
            className=" text-blue-500 bg-white w-10 h-10 "
            alt="hamburger"
            onClick={() => setDropdownMenu(!dropdownMenu)}
          />
          {dropdownMenu && (
            <div className="dropdown-menu">
              <Link href="/">Home</Link>
              <Link href="/my-list">My List</Link>
              <div className="flex flex-row">
                <Link href="/register" className="hover:text-pink-600">
                  Register
                </Link>
                <Link href="/login" className="hover:text-pink-600">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
