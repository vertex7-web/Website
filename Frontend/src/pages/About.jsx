import { useState, useEffect } from 'react';
import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import Image from '../components/ui/Image';
import aboutImg from '../assets/about-preview.jpg';
import heroAboutImg from '../assets/hero-about.jpg';
import bir2303Img from '../assets/BIR 2303.jpg';
import businessPermitImg from '../assets/Business permit.jpg';
import dtiImg from '../assets/DTI.jpg';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './About.css';

const certifications = [
  {
    name: 'DTI Certificate of Registration',
    issuer: 'Department of Trade and Industry (DTI)',
    tag: 'Business Name Registration',
    image: dtiImg,
  },
  {
    name: "Mayor's / Business Permit",
    issuer: 'Local Government Unit (LGU)',
    tag: 'Business Operations Permit',
    image: businessPermitImg,
  },
  {
    name: 'BIR Certificate of Registration',
    issuer: 'Bureau of Internal Revenue (Form 2303)',
    tag: 'Tax & Corporate Compliance',
    image: bir2303Img,
  },
];

export default function About() {
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    if (!selectedCert) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedCert]);

  useDocumentMeta({
    title: 'About Us | Vertex 7',
    description: 'Learn about Vertex 7\'s story, vision, mission, and commitment to quality in heavy equipment rentals and construction supplies in Bulacan, Philippines.',
  });

  return (
    <>
      {/* Page Hero */}
      <PageHero
        eyebrow="About Us"
        title="At Vertex 7,"
        subtitle="we don’t just rent out equipment — we provide the power, precision, and partnership that builders need to bring their visions to life."
        backgroundImage={heroAboutImg}
      />

      {/* Company Story */}
      <section className="about-story" id="company-story">
        <Container className="about-story__grid">
          <div className="about-story__content reveal-slide-up">
            <SectionHeading
              eyebrow="Our Story"
              title="Built from the Ground Up"
            />
            <p className="about-story__text">
              {/* CLIENT TO PROVIDE — company history and background */}
              Founded in 2025, Vertex7 Heavy
              Equipment Rental may be a new name in
              the industry, but it carries with it years of
              trusted experience through its sister
              company, DRCJ Construction Supplies
              Trading, established in 2017.
            </p>
            <p className="about-story__text">
              What began as a humble trading business supplying high-quality construction
              materials, aggregates, and ready-mixed concrete through DRCJ has grown
              into a full-service group capable of providing complete construction support
              solutions — from materials to machinery.
            </p>
            <p className="about-story__text">
              With the growing demand for reliable heavy equipment and dependable
              service partners, Vertex7 was established to expand our reach and strengthen
              our commitment to the construction sector. Backed by a team of experienced
              operators, a modern fleet of well-maintained units, and the proven reliability of
              DRCJ, Vertex7 ensures that every project is built on quality, efficiency, and
              trust.
            </p>
          </div>
          <div className="about-story__image-wrap reveal-slide-up delay-2">
            <Image
              src={aboutImg}
              alt="Vertex 7 team at a construction site"
              className="about-story__image"
              fallbackText="Vertex 7 Operations"
              loading="lazy"
            />
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="about-vm" id="vision-mission">
        <Container>
          <div className="about-vm__grid">
            <div className="about-vm__card reveal-slide-up delay-1">
              <span className="about-vm__label">Vision</span>
              <h3 className="about-vm__title">
                To be a trusted and dependable partner in the construction industry
              </h3>
              <p className="about-vm__text">
                — known for our reliability, integrity, and humble pursuit of
                excellence. </p >
              <p className="about-vm__text">
                We envision a future where every project we serve becomes a
                lasting symbol of quality, teamwork, and genuine commitment to
                nation-building.
              </p>
            </div>
            <div className="about-vm__divider" aria-hidden="true" />
            <div className="about-vm__card reveal-slide-up delay-2">
              <span className="about-vm__label">Mission</span>
              <ul className="about-vm__list">
                <li className="about-vm__item">
                  <span className="about-vm__bullet" aria-hidden="true" />
                  To provide high-quality materials and machinery that ensure safety, efficiency, and durability in every project.
                </li>
                <li className="about-vm__item">
                  <span className="about-vm__bullet" aria-hidden="true" />
                  To deliver customer-focused services through professionalism, timely delivery, and operational excellence.
                </li>
                <li className="about-vm__item">
                  <span className="about-vm__bullet" aria-hidden="true" />
                  To uphold our legacy of integrity and reliability, established through years of partnership and trust.
                </li>
                <li className="about-vm__item">
                  <span className="about-vm__bullet" aria-hidden="true" />
                  To promote sustainability and innovation in all aspects of our operations.
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Areas Served */}
      <section className="about-areas" id="areas-served">
        <Container>
          <SectionHeading eyebrow="Coverage" title="Areas We Serve" light />
          <div className="about-areas__grid">
            {['Bulacan', 'Nueva Ecija', 'Pangasinan', 'Palawan', 'Occidental Mindoro', 'Cavite'].map(
              (area, index) => (
                <div
                  className={`about-areas__card reveal-slide-up delay-${Math.min((index % 3) + 1, 5)}`}
                  key={area}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="about-areas__name">{area}</span>
                </div>
              )
            )}
          </div>
          <p className="about-areas__note">
            We have proudly supported a variety of infrastructure, commercial, and residential projects
            across <b>Luzon </b> and <b>Visayas</b>. Each project reflects our commitment to quality,
            dependability, and service excellence.
          </p>
        </Container>
      </section>

      {/* Certifications */}
      <section className="about-certs" id="certifications">
        <Container>
          <SectionHeading
            eyebrow="Credentials"
            title="Legal Documents"
            subtitle="Verified official permits and statutory government registrations establishing Vertex 7 as a legitimate, compliant partner."
          />
          <div className="about-certs__grid">
            {certifications.map((cert, i) => (
              <div
                className={`about-certs__card reveal-slide-up delay-${Math.min(i + 1, 5)}`}
                key={i}
                onClick={() => setSelectedCert(cert)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCert(cert);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${cert.name}`}
                aria-haspopup="dialog"
              >
                <div className="about-certs__icon-wrap" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>

                <span className="about-certs__tag">{cert.tag}</span>

                <div className="about-certs__body">
                  <h3 className="about-certs__name">{cert.name}</h3>
                  <p className="about-certs__issuer">{cert.issuer}</p>
                </div>

                <div className="about-certs__footer">
                  <span className="about-certs__action">
                    <span>View Document</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Certificate Lightbox Viewer */}
      {selectedCert && (
        <div
          className="about-certs__modal-backdrop"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedCert.name}
        >
          <div className="about-certs__modal" onClick={(e) => e.stopPropagation()}>
            <div className="about-certs__modal-header">
              <div className="about-certs__modal-info">
                <span className="about-certs__modal-tag">{selectedCert.tag}</span>
                <h3 className="about-certs__modal-title">{selectedCert.name}</h3>
                <p className="about-certs__modal-issuer">{selectedCert.issuer}</p>
              </div>
              <button
                type="button"
                className="about-certs__modal-close"
                onClick={() => setSelectedCert(null)}
                aria-label="Close document viewer"
                autoFocus
              >
                ✕
              </button>
            </div>
            <div className="about-certs__modal-body">
              <Image
                src={selectedCert.image}
                alt={selectedCert.name}
                className="about-certs__modal-image"
                fallbackText={selectedCert.name}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

