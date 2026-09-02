/* ══════════════════════════════════════════════════════════════
   Services — Data Layer
   ══════════════════════════════════════════════════════════════
   Fetches from Supabase. Falls back to static data if unavailable.
   ════════════════════════════════════════════════════════════ */

import { supabase } from '../lib/supabase';
import serviceRental from '../assets/service-rental.jpg';
import serviceTransport from '../assets/service-transport.jpg';
import serviceSupplies from '../assets/service-supplies.jpg';
import whyChooseUs from '../assets/why-choose-us.jpg';

/* ── Static Fallback ──────────────────────────────────────── */
const staticServices = [
  {
    id: 'static-1',
    slug: 'heavy-equipment-rental',
    number: '01',
    title: 'Heavy Equipment Rental',
    shortDescription:
      'Excavators, loaders, bulldozers, cranes, and more — all maintained to the highest standards and ready for deployment.',
    description:
      'Our fleet of heavy equipment is available for short-term and long-term rental. Every machine is regularly serviced, inspected, and maintained to ensure reliable performance on your job site.',
    image: serviceRental,
    benefits: [
      'Well-maintained, inspection-ready equipment',
      'Flexible rental periods — daily, weekly, monthly',
      'Delivery and pickup included',
      'Operator support available on request',
    ],
  },
  {
    id: 'static-2',
    slug: 'equipment-operation',
    number: '02',
    title: 'Equipment Operation',
    shortDescription:
      'Experienced operators for excavators, loaders, bulldozers, cranes, and more.',
    description:
      'We provide skilled and certified operators for all types of heavy equipment.',
    image: serviceTransport,
    benefits: [
      'Experienced and certified operators',
      'Safe and efficient machinery use',
      'Flexible rental periods — daily, weekly, monthly',
      'Equipment secured with professional rigging',
    ],
  },
  {
    id: 'static-3',
    slug: 'construction-supplies',
    number: '03',
    title: 'Construction Supplies',
    shortDescription:
      'Quality construction materials and supplies to keep your project moving.',
    description:
      'Vertex 7 supplies construction materials including aggregates, sand, gravel, concrete, and essential building supplies.',
    image: serviceSupplies,
    benefits: [
      'Aggregates, sand, gravel, and fill materials',
      'Concrete supply coordination',
      'Bulk delivery to job sites',
      'Consistent material quality',
    ],
  },
  {
    id: 'static-4',
    slug: 'preventive-maintenance-and-field-support',
    number: '04',
    title: 'Preventive Maintenance and Field Support',
    shortDescription:
      'On-site technical support and maintenance services.',
    description:
      'Our team provides on-site technical support including preventive maintenance, troubleshooting, and emergency repairs.',
    image: whyChooseUs,
    benefits: [
      'Preventive maintenance programs',
      'On-site troubleshooting and repair',
      'Emergency breakdown response',
      'Operator training and guidance',
    ],
  },
  {
    id: 'static-5',
    slug: 'mobilization-demobilization',
    number: '05',
    title: 'Mobilization and Demobilization',
    shortDescription: 'Smooth, safe, and efficient loading, hauling, and unloading of heavy equipment.',
    description: 'We handle all mobilization and demobilization logistics for heavy equipment.',
    image: whyChooseUs,
    benefits: [
      'Secure loading and unloading operations',
      'Professional rigging and equipment securing',
      'On-time delivery coordination',
      'Route planning for heavy loads',
    ],
  },
  {
    id: 'static-6',
    slug: 'project-site-logistics-and-coordination',
    number: '06',
    title: 'Project-Site Logistics and Coordination',
    shortDescription: 'Efficient site management and coordination.',
    description: 'We handle all project-site logistics including planning, scheduling, and coordination.',
    image: whyChooseUs,
    benefits: [
      'Efficient site management and coordination',
      'Minimized downtime',
      'Equipment and material coordination',
      'Personnel management',
    ],
  },
  {
    id: 'static-7',
    slug: 'towing-services',
    number: '07',
    title: 'Towing Services',
    shortDescription: '24/7 emergency towing and roadside assistance.',
    description: 'We provide fast, reliable towing services for all types of vehicles.',
    image: whyChooseUs,
    benefits: [
      '24/7 emergency towing available',
      'All vehicle types serviced',
      'Experienced and professional drivers',
      'Quick response times',
    ],
  },
];

/* ── Normalize Supabase row → frontend shape ──────────────── */
function normalize(row) {
  return {
    ...row,
    shortDescription: row.short_description || '',
  };
}

/* ── Async Fetchers (Supabase) ────────────────────────────── */

export async function fetchServices() {
  if (!supabase) return staticServices;
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('published', true)
      .order('number', { ascending: true });

    if (error || !data?.length) return staticServices;
    return data.map(normalize);
  } catch {
    return staticServices;
  }
}

export async function fetchServiceBySlug(slug) {
  if (!supabase) return staticServices.find((s) => s.slug === slug) || null;
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      return staticServices.find((s) => s.slug === slug) || null;
    }
    return normalize(data);
  } catch {
    return staticServices.find((s) => s.slug === slug) || null;
  }
}

/* ── Sync Getters (static fallback) ───────────────────────── */

export function getServices() {
  return staticServices;
}

export function getServiceBySlug(slug) {
  return staticServices.find((s) => s.slug === slug) || null;
}

export default staticServices;
