/* ══════════════════════════════════════════════════════════════
   Machines — Data Layer
   ══════════════════════════════════════════════════════════════
   Fetches from Supabase. Falls back to static data if unavailable.
   ════════════════════════════════════════════════════════════ */

import { supabase } from '../lib/supabase';
import machineExcavator from '../assets/machine-excavator.jpg';
import machineBulldozer from '../assets/machine-bulldozer.jpg';
import machineCrane from '../assets/machine-crane.jpg';

/* ── Static Fallback ──────────────────────────────────────── */
const staticMachines = [
  {
    id: 'static-1',
    slug: 'hydraulic-excavator',
    name: 'Hydraulic Excavator',
    type: 'Excavator',
    category: 'Excavators',
    brand: '[Brand — CLIENT TO PROVIDE]',
    model: '[Model — CLIENT TO PROVIDE]',
    image: machineExcavator,
    description:
      'Heavy-duty hydraulic excavator for earthmoving, grading, and excavation work.',
    specifications: [
      { label: 'Operating Weight', value: '[CLIENT TO PROVIDE]' },
      { label: 'Engine Power', value: '[CLIENT TO PROVIDE]' },
    ],
    specs: {},
  },
  {
    id: 'static-2',
    slug: 'track-bulldozer',
    name: 'Track Bulldozer',
    type: 'Bulldozer',
    category: 'Bulldozers',
    brand: '[Brand — CLIENT TO PROVIDE]',
    model: '[Model — CLIENT TO PROVIDE]',
    image: machineBulldozer,
    description:
      'Powerful track-type bulldozer for land clearing, grading, and heavy push operations.',
    specifications: [
      { label: 'Operating Weight', value: '[CLIENT TO PROVIDE]' },
      { label: 'Engine Power', value: '[CLIENT TO PROVIDE]' },
    ],
    specs: {},
  },
  {
    id: 'static-3',
    slug: 'mobile-crane',
    name: 'Mobile Crane',
    type: 'Crane',
    category: 'Cranes',
    brand: '[Brand — CLIENT TO PROVIDE]',
    model: '[Model — CLIENT TO PROVIDE]',
    image: machineCrane,
    description:
      'High-capacity mobile crane for structural steel, precast concrete, and heavy lifting.',
    specifications: [
      { label: 'Max Lifting Capacity', value: '[CLIENT TO PROVIDE]' },
      { label: 'Max Boom Length', value: '[CLIENT TO PROVIDE]' },
    ],
    specs: {},
  },
];

/* ── Normalize Supabase row → frontend shape ──────────────── */
function normalize(row) {
  // Convert specs JSONB to specifications array format for compatibility
  const specifications = row.specs && typeof row.specs === 'object'
    ? Object.entries(row.specs).map(([label, value]) => ({ label, value: String(value) }))
    : [];

  return {
    ...row,
    specifications,
  };
}

/* ── Async Fetchers (Supabase) ────────────────────────────── */

export async function fetchMachines() {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data?.length) return staticMachines;
    return data.map(normalize);
  } catch {
    return staticMachines;
  }
}

export async function fetchMachineBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      return staticMachines.find((m) => m.slug === slug) || null;
    }
    return normalize(data);
  } catch {
    return staticMachines.find((m) => m.slug === slug) || null;
  }
}

export async function fetchMachineCategories() {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select('category')
      .eq('published', true);

    if (error || !data?.length) {
      return [...new Set(staticMachines.map((m) => m.category))];
    }
    return [...new Set(data.map((m) => m.category).filter(Boolean))];
  } catch {
    return [...new Set(staticMachines.map((m) => m.category))];
  }
}

/* ── Sync Getters (static fallback) ───────────────────────── */

export function getMachines() {
  return staticMachines;
}

export function getMachineBySlug(slug) {
  return staticMachines.find((m) => m.slug === slug) || null;
}

export function getMachineCategories() {
  return [...new Set(staticMachines.map((m) => m.category))];
}

export default staticMachines;
