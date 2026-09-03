import { Link } from 'react-router';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './NotFound.css';

export default function NotFound() {
  useDocumentMeta({
    title: '404: Page Not Found | Vertex 7',
    description: 'The requested page could not be found. Return to Vertex 7 for heavy equipment rentals, services, and construction solutions.',
  });

  return (
    <div className="not-found-page" id="not-found-page">
      {/* Background Ghost 404 Watermark */}
      <div className="not-found-page__watermark" aria-hidden="true">
        404
      </div>

      <Container className="not-found-page__container">
        {/* Eyebrow / Warning Badge */}
        <div className="not-found-page__badge reveal-slide-up">
          <svg className="not-found-page__badge-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Error 404 // Route Not Found</span>
        </div>

        {/* Headline & Explainer */}
        <h1 className="not-found-page__title reveal-slide-up delay-1">
          Off-Route: Destination Unavailable
        </h1>
        <p className="not-found-page__description reveal-slide-up delay-2">
          The path you took led to an unmapped lot or a moved route. Let’s redirect you back to the main site or connect you with the heavy machinery and services you need.
        </p>

        {/* Primary Action Buttons */}
        <div className="not-found-page__actions reveal-slide-up delay-3">
          <Button to="/" variant="primary" size="lg">
            Back to Homepage
          </Button>
          <Button to="/machineries" variant="outline-lime" size="lg">
            Browse Machinery Fleet
          </Button>
        </div>

        {/* Quick Links Navigation Grid */}
        <div className="not-found-page__quick-links reveal-slide-up delay-4">
          <p className="not-found-page__quick-title">Popular Job Site Portals</p>
          <div className="not-found-page__grid">
            <Link to="/services" className="not-found-card">
              <svg className="not-found-card__icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <h2 className="not-found-card__title">Services</h2>
              <span className="not-found-card__text">Rental, hauling, and materials supply.</span>
            </Link>

            <Link to="/projects" className="not-found-card">
              <svg className="not-found-card__icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <h2 className="not-found-card__title">Projects</h2>
              <span className="not-found-card__text">Completed infrastructure & commercial builds.</span>
            </Link>

            <Link to="/quote" className="not-found-card">
              <svg className="not-found-card__icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h2 className="not-found-card__title">Get a Quote</h2>
              <span className="not-found-card__text">Fast project estimation & fleet rates.</span>
            </Link>

            <Link to="/contact" className="not-found-card">
              <svg className="not-found-card__icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <h2 className="not-found-card__title">Contact</h2>
              <span className="not-found-card__text">Direct phone, email, and Bulacan dispatch.</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
