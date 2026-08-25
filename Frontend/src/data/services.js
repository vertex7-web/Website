/* ══════════════════════════════════════════════════════════════
   Services — Static Data
   ══════════════════════════════════════════════════════════════
   PLACEHOLDER DATA — Replace with actual client services.
   ════════════════════════════════════════════════════════════ */

import serviceRental from '../assets/service-rental.jpg';
import serviceTransport from '../assets/service-transport.jpg';
import serviceSupplies from '../assets/service-supplies.jpg';
import whyChooseUs from '../assets/why-choose-us.jpg';

const services = [
  {
    id: 1,
    slug: 'heavy-equipment-rental',
    number: '01',
    title: 'Heavy Equipment Rental',
    shortDescription:
      'Excavators, loaders, bulldozers, cranes, and more — all maintained to the highest standards and ready for deployment.',
    description:
      'Our fleet of heavy equipment is available for short-term and long-term rental. Every machine is regularly serviced, inspected, and maintained to ensure reliable performance on your job site. From excavation and grading to heavy lifting, we provide the right equipment for the job.',
    image: serviceRental,
    benefits: [
      'Well-maintained, inspection-ready equipment',
      'Flexible rental periods — daily, weekly, monthly',
      'Delivery and pickup included',
      'Operator support available on request',
    ],
  },
  {
    id: 2,
    slug: 'equipment-transport',
    number: '02',
    title: 'Equipment Transport',
    shortDescription:
      'Safe and timely transport of heavy machinery to and from your project site, with professional handling every step of the way.',
    description:
      'We handle the logistics of getting your equipment where it needs to be. Our transport service covers heavy machinery pickup, delivery, and repositioning — safely, on time, and with the proper permits and route planning for oversized loads.',
    image: serviceTransport,
    benefits: [
      'Licensed and insured heavy-haul transport',
      'Route planning for oversized loads',
      'On-time delivery coordination',
      'Equipment secured with professional rigging',
    ],
  },
  {
    id: 3,
    slug: 'construction-supplies',
    number: '03',
    title: 'Construction Supplies',
    shortDescription:
      'Quality construction materials and supplies to keep your project moving. Aggregates, concrete, and essential building materials.',
    description:
      'Vertex 7 supplies construction materials including aggregates, sand, gravel, concrete, and essential building supplies. We source quality materials and coordinate delivery to keep your project on schedule without interruption.',
    image: serviceSupplies,
    benefits: [
      'Aggregates, sand, gravel, and fill materials',
      'Concrete supply coordination',
      'Bulk delivery to job sites',
      'Consistent material quality',
    ],
  },
  {
    id: 4,
    slug: 'machinery-support',
    number: '04',
    title: 'Machinery Support',
    shortDescription:
      'On-site technical support and maintenance services to minimize downtime and keep your equipment running at peak performance.',
    description:
      'Our team provides on-site technical support including preventive maintenance, troubleshooting, and emergency repairs. We work to minimize equipment downtime so your project stays on schedule.',
    image: whyChooseUs,
    benefits: [
      'Preventive maintenance programs',
      'On-site troubleshooting and repair',
      'Emergency breakdown response',
      'Operator training and guidance',
    ],
  },
];

export function getServices() {
  return services;
}

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug) || null;
}

export default services;
