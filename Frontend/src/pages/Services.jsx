import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Image from '../components/ui/Image';
import { fetchServices, getServices } from '../data/services';
import heroServicesImg from '../assets/hero-services.jpg';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Services.css';

export default function Services() {
  const [services, setServices] = useState(getServices());
  const location = useLocation();
  const hasScrolledRef = useRef(false);

  useDocumentMeta({
    title: 'Services | Vertex 7',
    description: 'Explore Vertex 7\'s range of construction services including equipment rental, hauling, and materials supply in Bulacan, Philippines.',
  });

  useEffect(() => {
    fetchServices().then((data) => {
      setServices(data);
    });
  }, []);

  // Smooth scroll to the targeted service section ONCE if a hash is present
  useEffect(() => {
    if (location.hash && !hasScrolledRef.current) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        hasScrolledRef.current = true;
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash, services]);

  return (
    <>
      <PageHero
        eyebrow="What We Offer"
        title="Our Services"
        subtitle="From equipment rental to on-site support — comprehensive services built for the field."
        backgroundImage={heroServicesImg}
      />

      <section className="services-page" id="services-directory">
        <Container>
          {services.map((service, index) => (
            <article
              className={`services-page__item reveal-slide-up ${index % 2 !== 0 ? 'services-page__item--reversed' : ''}`}
              key={service.id || service.slug || index}
              id={service.slug}
            >
              {/* Image */}
              <div className="services-page__image-wrap">
                <Image
                  src={service.image}
                  alt={service.title}
                  className="services-page__image"
                  fallbackText={service.title}
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="services-page__content">
                <span className="services-page__number">{service.number}</span>
                <h2 className="services-page__title">{service.title}</h2>
                <p className="services-page__description">{service.description}</p>

                {service.benefits && service.benefits.length > 0 && (
                  <ul className="services-page__benefits">
                    {service.benefits.map((benefit) => (
                      <li className="services-page__benefit" key={benefit}>
                        <span className="services-page__bullet" aria-hidden="true" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}

                <Button to="/quote" variant="outline-lime" size="md">
                  Get a Quote
                </Button>
              </div>
            </article>
          ))}
        </Container>
      </section>
    </>
  );
}
