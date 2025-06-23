import { Search, Bell, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para cambiar el fondo del header
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="logo">
            NETFLIX
          </h1>
          
          {/* Navigation */}
          <nav className="nav">
            <a href="#">Home</a>
            <a href="#">TV Shows</a>
            <a href="#">Movies</a>
            <a href="#">New & Popular</a>
            <a href="#">My List</a>
          </nav>
        </div>

        {/* User actions */}
        <div className="user-actions">
          <Search />
          <Bell />
          <div className="user-avatar">
            <User style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </div>
      </div>
    </header>
  );
}