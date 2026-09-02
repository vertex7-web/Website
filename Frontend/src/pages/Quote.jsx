import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import QuoteForm from '../components/ui/QuoteForm';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Quote.css';

export default function Quote() {
  useDocumentMeta({
    title: 'Request a Quote | Vertex 7',
    description: 'Request a free quote from Vertex 7 for heavy equipment rental and construction supplies in Bulacan, Philippines.',
  });

  return (
    <>
      <section className="quote-page" id="quote-form">
        <Container>
          <div className="quote-page__grid">
            {/* Form Column */}
            <div className="quote-page__form-col">
              <h2 className="quote-page__section-title">Fill Out the Form</h2>
              <p className="quote-page__intro">
                Provide your project details below. Required fields are marked
                with an asterisk. We'll get back to you within one business day.
              </p>
              <QuoteForm />
            </div>

            {/* Sidebar */}
            <aside className="quote-page__sidebar">
              <div className="quote-page__sidebar-card">
                <h3 className="quote-page__sidebar-title">Prefer to Talk?</h3>
                <p className="quote-page__sidebar-text">
                  Call us directly or send an email — we're happy to discuss your project.
                </p>
                <div className="quote-page__sidebar-contact">
                  <div className="quote-page__sidebar-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <a href="tel:09688568983" className="quote-page__sidebar-link">
                      0968 856 8983
                    </a>
                  </div>
                  <div className="quote-page__sidebar-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <a href="mailto:vertex7.her@gmail.com" className="quote-page__sidebar-link">
                      vertex7.her@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="quote-page__sidebar-card">
                <h3 className="quote-page__sidebar-title">What Happens Next?</h3>
                <ol className="quote-page__steps">
                  <li className="quote-page__step">
                    <span className="quote-page__step-num">1</span>
                    <div>
                      <strong>We Review</strong>
                      <p>Our team reviews your request and assesses equipment availability.</p>
                    </div>
                  </li>
                  <li className="quote-page__step">
                    <span className="quote-page__step-num">2</span>
                    <div>
                      <strong>We Contact You</strong>
                      <p>We reach out to clarify details and discuss options.</p>
                    </div>
                  </li>
                  <li className="quote-page__step">
                    <span className="quote-page__step-num">3</span>
                    <div>
                      <strong>We Deliver</strong>
                      <p>Once confirmed, we schedule delivery and get you set up.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
