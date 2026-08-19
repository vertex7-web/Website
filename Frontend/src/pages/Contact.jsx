import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';

export default function Contact() {
  return (
    <>
      <section
        style={{
          minHeight: '350px',
          background: 'var(--color-charcoal)',
          display: 'flex',
          alignItems: 'center',
          marginTop: 'calc(var(--header-height) * -1)',
          paddingTop: 'var(--header-height)',
        }}
      >
        <Container>
          <SectionHeading
            eyebrow="Get In Touch"
            title="Contact Us"
          />
        </Container>
      </section>

      <section style={{ padding: 'var(--section-pad-y) 0', background: 'var(--color-black)' }}>
        <Container>
          <p style={{ color: 'var(--color-muted)' }}>
            Contact page will be built in Phase 3.
          </p>
        </Container>
      </section>
    </>
  );
}
