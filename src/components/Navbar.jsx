import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout }      = useAuth();
  const location              = useLocation();
  const navigate              = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]       = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const active = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar__inner">

        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-hex">⬡</span>OTPAuth
        </Link>

        <button className={`navbar__ham ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="menu">
          <span /><span /><span />
        </button>

        <div className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          <Link to="/" className={`navbar__link ${active('/')}`}>Home</Link>

          {user ? (
            <>
              <Link to="/dashboard" className={`navbar__link ${active('/dashboard')}`}>Dashboard</Link>
              <button className="navbar__btn outline" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"  className={`navbar__link ${active('/login')}`}>Login</Link>
              <Link to="/signup" className="navbar__btn primary">Get Started</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
