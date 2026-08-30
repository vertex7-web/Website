import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

export default function Layout() {
  const { pathname, hash } = useLocation();

  // Scroll to top on route change (only when there is no target hash)
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="layout">
      <Header />
      <main className="layout__main" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
