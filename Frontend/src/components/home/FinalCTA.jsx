import Container from '../ui/Container';
import Button from '../ui/Button';
import './FinalCTA.css';

export default function FinalCTA() {
  return (
    <section className="final-cta" id="final-cta">
      <Container className="final-cta__content">
        <span className="final-cta__eyebrow">Get Started</span>
        <h2 className="final-cta__title">Ready to Build?</h2>
        <p className="final-cta__description">
          Let's discuss your next project. Whether you need equipment, supplies,
          or professional support — we're here to help.
        </p>
        <div className="final-cta__actions">
          <Button to="/contact" variant="primary" size="lg">
            Contact Us
          </Button>
          <Button to="/contact" variant="outline" size="lg">
            Request a Quote
          </Button>
        </div>
      </Container>
    </section>
  );
}
