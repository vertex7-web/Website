import './SectionHeading.css';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  light = false,
  className = '',
}) {
  return (
    <div className={`section-heading section-heading--${align} ${light ? 'section-heading--light' : ''} ${className}`}>
      {eyebrow && (
        <span className="section-heading__eyebrow reveal-slide-up">{eyebrow}</span>
      )}
      <h2 className="section-heading__title reveal-slide-up delay-1">{title}</h2>
      {subtitle && (
        <p className="section-heading__subtitle reveal-slide-up delay-2">{subtitle}</p>
      )}
    </div>
  );
}
