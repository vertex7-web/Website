import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import Container from '../ui/Container';
import Button from '../ui/Button';
import transparentLogo from '../../assets/transparent-logo.svg';
import './Header.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Machineries', to: '/machineries' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`} id="site-header">
        <Container className="header__inner">
          {/* Logo */}
          <Link to="/" className="header__logo" aria-label="Vertex 7 — Home">
            <img
              src={transparentLogo}
              alt=""
              className="header__logo-img"
              width="32"
              height="32"
              aria-hidden="true"
            />
            <span className="header__logo-text">
              <span className="header__logo-mark">VERTEX</span>
              <span className="header__logo-accent">7</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header__nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `header__link ${isActive ? 'header__link--active' : ''}`
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="header__cta">
            <Button to="/quote" variant="primary" size="sm">
              Request a Quote
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            id="mobile-menu-toggle"
          >
            <span className="header__hamburger-line" />
            <span className="header__hamburger-line" />
            <span className="header__hamburger-line" />
          </button>
        </Container>
      </header>

      {/* Mobile Menu Overlay — outside <header> so it's not clipped by its fixed height */}
      <div
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Mobile navigation"
      >
        {/* Dedicated Close Button */}
        <button
          className="mobile-menu__close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation menu"
          tabIndex={menuOpen ? 0 : -1}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <nav className="mobile-menu__nav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
              }
              end={link.to === '/'}
              tabIndex={menuOpen ? 0 : -1}
            >
              {link.label}
            </NavLink>
          ))}
          <Button
            to="/quote"
            variant="primary"
            size="lg"
            className="mobile-menu__cta"
            tabIndex={menuOpen ? 0 : -1}
          >
            Request a Quote
          </Button>
        </nav>
      </div>
    </>
  );
}
