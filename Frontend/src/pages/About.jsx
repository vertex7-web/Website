import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import aboutImg from '../assets/about-preview.jpg';
import './About.css';

export default function About() {
  return (
    <>
      {/* Page Hero */}
      <PageHero
        eyebrow="About Us"
        title="About Vertex 7"
        subtitle="Heavy equipment rentals and construction supplies — built on reliability, driven by results."
        backgroundImage={aboutImg}
      />

      {/* Company Story */}
      <section className="about-story" id="company-story">
        <Container className="about-story__grid">
          <div className="about-story__content">
            <SectionHeading
              eyebrow="Our Story"
              title="Built from the Ground Up"
            />
            <p className="about-story__text">
              {/* CLIENT TO PROVIDE — company history and background */}
              [CLIENT TO PROVIDE — Company founding story, history, and development.
              How the company started, key milestones, and growth over the years.]
            </p>
            <p className="about-story__text">
              [CLIENT TO PROVIDE — Current business focus, areas of expertise,
              and what sets the company apart in the industry today.]
            </p>
          </div>
          <div className="about-story__image-wrap">
            <img
              src={aboutImg}
              alt="Vertex 7 team at a construction site"
              className="about-story__image"
              loading="lazy"
            />
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="about-vm" id="vision-mission">
        <Container>
          <div className="about-vm__grid">
            <div className="about-vm__card">
              <span className="about-vm__label">Vision</span>
              <h3 className="about-vm__title">
                [CLIENT TO PROVIDE — Company vision statement]
              </h3>
              <p className="about-vm__text">
                [CLIENT TO PROVIDE — expanded vision description.]
              </p>
            </div>
            <div className="about-vm__divider" aria-hidden="true" />
            <div className="about-vm__card">
              <span className="about-vm__label">Mission</span>
              <h3 className="about-vm__title">
                [CLIENT TO PROVIDE — Company mission statement]
              </h3>
              <p className="about-vm__text">
                [CLIENT TO PROVIDE — expanded mission description.]
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Areas Served */}
      <section className="about-areas" id="areas-served">
        <Container>
          <SectionHeading eyebrow="Coverage" title="Areas We Serve" light />
          <div className="about-areas__grid">
            {['[Region 1]', '[Region 2]', '[Region 3]', '[Region 4]', '[Region 5]', '[Region 6]'].map(
              (area) => (
                <div className="about-areas__card" key={area}>
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
            [CLIENT TO PROVIDE — geographic coverage description and details]
          </p>
        </Container>
      </section>

      {/* Certifications */}
      <section className="about-certs" id="certifications">
        <Container>
          <SectionHeading
            eyebrow="Credentials"
            title="Certifications & Licenses"
            subtitle="Our team maintains the certifications and licenses required to deliver safe, compliant service."
          />
          <div className="about-certs__grid">
            {[
              { name: '[Certification Name]', issuer: '[Issuing Body]', year: '[Year]' },
              { name: '[Certification Name]', issuer: '[Issuing Body]', year: '[Year]' },
              { name: '[Certification Name]', issuer: '[Issuing Body]', year: '[Year]' },
            ].map((cert, i) => (
              <div className="about-certs__card" key={i}>
                <div className="about-certs__icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 15l-2 5l2-1l2 1l-2-5z" />
                    <circle cx="12" cy="9" r="6" />
                    <path d="M9 9l2 2l4-4" />
                  </svg>
                </div>
                <h3 className="about-certs__name">{cert.name}</h3>
                <p className="about-certs__issuer">{cert.issuer}</p>
                <span className="about-certs__year">{cert.year}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
