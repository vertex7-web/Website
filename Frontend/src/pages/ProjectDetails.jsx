import { useParams } from 'react-router';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';

export default function ProjectDetails() {
  const { slug } = useParams();

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
            eyebrow="Project Details"
            title={slug ? slug.replace(/-/g, ' ') : 'Project'}
          />
        </Container>
      </section>

      <section style={{ padding: 'var(--section-pad-y) 0', background: 'var(--color-black)' }}>
        <Container>
          <p style={{ color: 'var(--color-muted)' }}>
            Project detail page will be built in Phase 3.
          </p>
        </Container>
      </section>
    </>
  );
}
