import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import { Link } from 'react-router';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { formatTelHref } from '../data/settings';
import './Terms.css'; // Shared sleek legal page styles

export default function Privacy() {
  const lastUpdated = 'February 2026';
  const { settings } = useSiteSettings();

  useDocumentMeta({
    title: 'Privacy Policy | Vertex 7',
    description: 'Read how Vertex 7 collects, uses, and protects your personal information.',
  });

  return (
    <>
      <PageHero
        eyebrow="Data Protection & Compliance"
        title="Privacy Policy"
        subtitle="How Vertex 7 collects, protects, and responsibly uses your email and contact information when you request quotations or interact with our services."
      />

      <section className="legal-page" id="privacy-content">
        <Container className="legal-page__container">
          {/* Metadata banner */}
          <div className="legal-page__meta">
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
            <span>Compliance: <strong>Data Privacy Act of 2012 (RA 10173)</strong></span>
          </div>

          <div className="legal-page__content">
            {/* 1. Commitment */}
            <article className="legal-section">
              <h2 className="legal-section__title">1. Our Commitment to Your Privacy</h2>
              <p className="legal-section__text">
                At <strong>Vertex 7 Heavy Equipment Rental</strong> (&ldquo;Vertex 7&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), we take your privacy and the confidentiality of your personal information seriously.
                This Privacy Policy explains how we collect, process, store, and safeguard information submitted through our website (<Link to="/" className="legal-link">vertex7.com</Link>), quotation forms, and customer support channels.
              </p>
            </article>

            {/* 2. Information Collected */}
            <article className="legal-section">
              <h2 className="legal-section__title">2. Information We Collect</h2>
              <p className="legal-section__text">
                When you interact with our website or request equipment rentals, we may collect the following details:
              </p>
              <ul className="legal-list">
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <div>
                    <strong>Contact & Identification Details:</strong> Your full name, business or individual email address, contact telephone/mobile number, and company name.
                  </div>
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <div>
                    <strong>Project & Equipment Requirements:</strong> Requested machinery types (e.g., excavators, cranes, bulldozers), project site location, estimated rental duration, and scope descriptions.
                  </div>
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <div>
                    <strong>Technical & Usage Data:</strong> Anonymized browser type, device information, IP address, and interaction metrics to optimize site performance and prevent spam.
                  </div>
                </li>
              </ul>
            </article>

            {/* 3. How We Use Collected Emails & Data */}
            <article className="legal-section">
              <h2 className="legal-section__title">3. How We Use Your Email & Data</h2>
              <p className="legal-section__text">
                We only use your personal data for legitimate business and operational purposes:
              </p>
              <ul className="legal-list">
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <strong>Generating Quotations:</strong> Calculating equipment availability, mobilization rates, and delivering official proposals directly to your email.
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <strong>Customer Communication:</strong> Answering inquiries, confirming job-site logistics, and providing technical equipment support.
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <strong>Service Updates:</strong> Providing critical notices regarding machinery deployment, scheduling, or contract administration.
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <strong>Spam & Fraud Prevention:</strong> Protecting our systems against unauthorized submissions, rate abuse, or malicious activity.
                </li>
              </ul>
            </article>

            {/* 4. Strict No-Sale & Sharing Policy */}
            <article className="legal-section legal-section--highlight">
              <h2 className="legal-section__title">4. No-Sale & Sharing Guarantee</h2>
              <p className="legal-section__text">
                <strong>We do NOT sell, rent, trade, or monetize your email address or personal contact data to any third-party advertisers or data brokers under any circumstances.</strong>
              </p>
              <p className="legal-section__text">
                Your data is accessible only by authorized Vertex 7 sales, engineering, and administrative personnel, as well as trusted cloud infrastructure providers (such as secure database and transactional email processors) bound by strict confidentiality agreements.
              </p>
            </article>

            {/* 5. Data Storage & Security */}
            <article className="legal-section">
              <h2 className="legal-section__title">5. Data Storage & Security Measures</h2>
              <p className="legal-section__text">
                We implement robust physical, technical, and administrative security measures to protect your submitted data against unauthorized access, disclosure, alteration, or destruction. All web traffic is encrypted using modern TLS/SSL security protocols.
              </p>
            </article>

            {/* 6. Your Rights */}
            <article className="legal-section">
              <h2 className="legal-section__title">6. Your Data Privacy Rights</h2>
              <p className="legal-section__text">
                Under the Philippine Data Privacy Act of 2012 (RA 10173) and international privacy standards, you have the right to:
              </p>
              <ul className="legal-list">
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  Request a copy of the personal information we hold about you.
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  Request correction or updating of any inaccurate contact details.
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  Request the deletion or removal of your email and contact records from our active sales systems.
                </li>
              </ul>
            </article>

            {/* 7. Contact for Privacy Inquiries */}
            <article className="legal-section">
              <h2 className="legal-section__title">7. Contacting Us About Your Data</h2>
              <p className="legal-section__text">
                If you have questions regarding this Privacy Policy, wish to exercise your data privacy rights, or request removal of your email from our records, please reach out to us:
              </p>
              <div className="legal-contact-card">
                <p><strong>Vertex 7 Data Privacy Team</strong></p>
                <p>{settings.address || '43 Viola St., Santa Rita Matanda, San Miguel, Bulacan, Philippines'}</p>
                <p>Email: <a href={`mailto:${settings.email}`} className="legal-link">{settings.email}</a></p>
                <p>Phone: <a href={formatTelHref(settings.phone)} className="legal-link">{settings.phone}</a></p>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
