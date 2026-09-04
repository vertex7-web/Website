import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from '../ui/CookieConsent';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Layout.css';

export default function Layout() {
  const { pathname, hash } = useLocation();

  // Activate scroll-triggered text slide animations on every page
  useScrollReveal();

  // Instant scroll to top on route change so new page mounts cleanly from top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="layout">
      <Header />
      <main className="layout__main" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
