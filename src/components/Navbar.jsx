import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, Search } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const {  setContentType } = useContentStore();
  return (
    <header className="relative top-0 left-0 w-full  text-white z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 h-20">
        {/* Logo and Navigation Links */}
        <div className="flex items-center gap-10">
          <Link to={"/"}>
            <img
              src="/netflix-logo.png"
              alt="netflix-logo"
              className="w-32 sm:w-40"
            />
          </Link>

          {/* Desktop Navbar Items */}
          <div className="hidden sm:flex gap-6 items-center">
            <Link
              to="/"
              className="hover:underline"
              onClick={() => setContentType("movie")}
            >
              Movies
            </Link>
            <Link
              to="/"
              className="hover:underline"
              onClick={() => setContentType("tv")}
             >
              TV Shows
            </Link>
            <Link to="/history" className="hover:underline">
              Search-History
            </Link>
          </div>
        </div>

        {/* Search, Avatar, and Logout Icons */}
        <div className="flex gap-6 items-center">
          <Link to={"/search"}>
            <Search className="w-6 h-6 cursor-pointer" />
          </Link>
          <img
            src={user.image}
            alt="Avatar"
            className="h-8 w-8 cursor-pointer"
          />
          <LogOut className="w-6 h-6 cursor-pointer" onClick={logout} />
          {/* Mobile Menu Icon */}
          <div className="sm:hidden">
            <Menu
              className="w-6 h-6 cursor-pointer"
              onClick={toggleMobileMenu}
            />
          </div>
        </div>
      </div>

      {/* Mobile Navbar Items */}
      {isMobileMenuOpen && (
        <div className="w-full sm:hidden mt-4 bg-black border rounded border-gray-800">
          <Link
            to={"/"}
            className="block hover:underline p-2"
            onClick={toggleMobileMenu}
          >
            Movies
          </Link>
          <Link
            to={"/"}
            className="block hover:underline p-2"
            onClick={toggleMobileMenu}
          >
            TV Shows
          </Link>
          <Link
            to={"/history"}
            className="block hover:underline p-2"
            onClick={toggleMobileMenu}
          >
            Search History
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
