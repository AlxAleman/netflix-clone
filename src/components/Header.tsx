import { Search, Bell, User } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  onSearchClick?: () => void;
}

export default function Header({ onSearchClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-500
        ${isScrolled ? "bg-black/90 backdrop-blur-sm" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"}
      `}
      style={{
        backdropFilter: isScrolled ? "blur(10px)" : "none"
      }}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto">
        {/* Logo & Navigation */}
        <div className="flex items-center space-x-6">
          <span 
            className="text-xl md:text-2xl font-extrabold tracking-tight text-white select-none cursor-pointer hover:text-red-500 transition-colors"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            NETFLIX
          </span>
          {/* Navigation - hidden on mobile */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#" className="text-gray-200 hover:text-white transition-colors duration-200">Home</a>
            <a href="#" className="text-gray-200 hover:text-white transition-colors duration-200">TV Shows</a>
            <a href="#" className="text-gray-200 hover:text-white transition-colors duration-200">Movies</a>
            <a href="#" className="text-gray-200 hover:text-white transition-colors duration-200">New & Popular</a>
            <a href="#" className="text-gray-200 hover:text-white transition-colors duration-200">My List</a>
          </nav>
          {/* Mobile menu icon (hamburger) - visible on mobile */}
          <button className="md:hidden flex items-center px-2 text-gray-200 hover:text-white">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
        {/* User actions */}
        <div className="flex items-center space-x-4 md:space-x-5 text-white">
          <Search 
            className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors duration-200" 
            onClick={onSearchClick}
          />
          <Bell className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors duration-200" />
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 cursor-pointer">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
