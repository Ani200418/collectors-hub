import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Diamond, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Marketplace' },
    { path: '/community', label: 'Community' },
    { path: '/collection', label: 'My Collection' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" onClick={closeMobileMenu}>
          <Diamond className="navbar__logo-icon" size={24} />
          <span className="navbar__logo-text">Collector's Hub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar__actions">
          <button 
            className="navbar__theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            className="navbar__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="navbar__mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
