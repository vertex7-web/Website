import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import { Link } from 'react-router';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Terms.css';

export default function Terms() {
  const lastUpdated = 'February 2026';

  useDocumentMeta({
    title: 'Terms of Service | Vertex 7',
    description: 'Read the terms and conditions for using Vertex 7\'s website and services.',
  });

  return (
    <>
      <PageHero
        eyebrow="Legal & Agreements"
        title="Terms of Service"
        subtitle="Please review these terms carefully before using our website, requesting quotations, or engaging our equipment rental and support services."
      />

      <section className="legal-page" id="terms-content">
        <Container className="legal-page__container">
          {/* Metadata banner */}
          <div className="legal-page__meta">
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
            <span>Effective Date: <strong>January 1, 2025</strong></span>
          </div>

          <div className="legal-page__content">
            {/* 1. Introduction */}
            <article className="legal-section">
              <h2 className="legal-section__title">1. Acceptance of Terms</h2>
              <p className="legal-section__text">
                Welcome to <strong>Vertex 7 Heavy Equipment Rental</strong> (&ldquo;Vertex 7&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
                By accessing or using our website, submitting an equipment inquiry or quote request, or contracting our machinery and logistical services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) and our <Link to="/privacy" className="legal-link">Privacy Policy</Link>.
              </p>
              <p className="legal-section__text">
                If you do not agree to all terms and conditions stated herein, please refrain from accessing the site or submitting requests.
              </p>
            </article>

            {/* 2. Services Overview */}
            <article className="legal-section">
              <h2 className="legal-section__title">2. Scope of Services</h2>
              <p className="legal-section__text">
                Vertex 7 provides heavy equipment rental, skilled machinery operation, construction material supplies (through our trading partners), preventive on-site maintenance, equipment hauling/mobilization, and project site coordination.
              </p>
              <p className="legal-section__text">
                Information on machinery specifications, availability, and capability displayed on this website is for informational purposes and may vary depending on model upgrades, customized attachments, and job-site conditions.
              </p>
            </article>

            {/* 3. Inquiries, Quotations & Rental Agreements */}
            <article className="legal-section">
              <h2 className="legal-section__title">3. Inquiries, Quotes & Rental Contracts</h2>
              <p className="legal-section__text">
                Submitting a quote request or email via our website does not create a binding rental contract. Official equipment bookings, rental rates, mobilization schedules, and payment terms are formalized through a separate, signed Master Rental Agreement or Purchase Order between Vertex 7 and the Client.
              </p>
              <ul className="legal-list">
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <strong>Estimates:</strong> All online estimates and rates are subject to equipment availability, site inspection, and duration validation.
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <strong>Accurate Information:</strong> You agree to provide accurate and complete contact details (including valid business email and phone number) so our sales and engineering team can reach you.
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  <strong>Deposit & Mobilization:</strong> Final deployment requires confirmed mobilization logistics and agreed deposit schedules as outlined in your official quotation.
                </li>
              </ul>
            </article>

            {/* 4. Equipment Operation & Safety */}
            <article className="legal-section">
              <h2 className="legal-section__title">4. Safety & On-Site Operational Standards</h2>
              <p className="legal-section__text">
                Safety is our highest priority. All Vertex 7 machineries and deployed operators adhere strictly to occupational safety and health standards.
              </p>
              <p className="legal-section__text">
                Clients must ensure the job site possesses proper clearances, stable ground conditions, load capacity compliance, and safe ingress/egress for heavy machinery mobilization. Vertex 7 reserves the right to halt operations if site conditions pose imminent danger to personnel or machinery.
              </p>
            </article>

            {/* 5. User Conduct & Website Usage */}
            <article className="legal-section">
              <h2 className="legal-section__title">5. Acceptable Website Use</h2>
              <p className="legal-section__text">
                When using this website, you agree not to:
              </p>
              <ul className="legal-list">
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  Transmit false, deceptive, or spam inquiries through our quote and contact forms.
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  Attempt to bypass, disable, or tamper with the security or authentication of any portion of this site.
                </li>
                <li className="legal-list__item">
                  <span className="legal-list__bullet" aria-hidden="true" />
                  Scrape, reproduce, or redistribute website assets, technical specs, or photography without express written permission.
                </li>
              </ul>
            </article>

            {/* 6. Intellectual Property */}
            <article className="legal-section">
              <h2 className="legal-section__title">6. Intellectual Property Rights</h2>
              <p className="legal-section__text">
                All branding, trademarks, logos, texts, photographs, interface designs, and software code on this website are the intellectual property of Vertex 7 Heavy Equipment Rental or its licensors and are protected under copyright and trademark laws.
              </p>
            </article>

            {/* 7. Limitation of Liability */}
            <article className="legal-section">
              <h2 className="legal-section__title">7. Limitation of Liability & Disclaimers</h2>
              <p className="legal-section__text">
                This website and its content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. Vertex 7 disclaims all warranties, express or implied.
              </p>
              <p className="legal-section__text">
                In no event will Vertex 7 be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access to or inability to use this website, including but not limited to electronic transmission errors or delays in quote processing.
              </p>
            </article>

            {/* 8. Governing Law */}
            <article className="legal-section">
              <h2 className="legal-section__title">8. Governing Law & Jurisdiction</h2>
              <p className="legal-section__text">
                These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes arising under or in connection with these Terms or website usage shall be subject to the exclusive jurisdiction of the competent courts of Bulacan, Philippines.
              </p>
            </article>

            {/* 9. Contact Us */}
            <article className="legal-section legal-section--highlight">
              <h2 className="legal-section__title">9. Inquiries & Legal Notices</h2>
              <p className="legal-section__text">
                For questions regarding these Terms of Service or to submit legal correspondence:
              </p>
              <div className="legal-contact-card">
                <p><strong>Vertex 7 Heavy Equipment Rental</strong></p>
                <p>43 Viola St., Santa Rita Matanda, San Miguel, Bulacan, Philippines</p>
                <p>Email: <a href="mailto:vertex7.her@gmail.com" className="legal-link">vertex7.her@gmail.com</a></p>
                <p>Phone: <a href="tel:+639688568983" className="legal-link">0968 856 8983</a></p>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
