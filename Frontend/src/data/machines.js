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
    category: 'Excavators',
    brand: '[Brand — CLIENT TO PROVIDE]',
    model: '[Model — CLIENT TO PROVIDE]',
    image: machineExcavator,
    description:
      'Heavy-duty hydraulic excavator for earthmoving, grading, and excavation work.',
  },
  {
    id: 'static-2',
    slug: 'track-bulldozer',
    name: 'Track Bulldozer',
    category: 'Bulldozers',
    brand: '[Brand — CLIENT TO PROVIDE]',
    model: '[Model — CLIENT TO PROVIDE]',
    image: machineBulldozer,
    description:
      'Powerful track-type bulldozer for land clearing, grading, and heavy push operations.',
  },
  {
    id: 'static-3',
    slug: 'mobile-crane',
    name: 'Mobile Crane',
    category: 'Cranes',
    brand: '[Brand — CLIENT TO PROVIDE]',
    model: '[Model — CLIENT TO PROVIDE]',
    image: machineCrane,
    description:
      'High-capacity mobile crane for structural steel, precast concrete, and heavy lifting.',
  },
];

/* ── Category Normalization Helpers ──────────────────────── */
export function normalizeCategoryName(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  // Canonical fleet category mappings (pluralized standard)
  if (/^excavator(s)?$/i.test(lower)) return 'Excavators';
  if (/^(bulldozer|dozer)(s)?$/i.test(lower)) return 'Bulldozers';
  if (/^crane(s)?$/i.test(lower)) return 'Cranes';
  if (/^(dump\s*truck|truck)(s)?$/i.test(lower)) return 'Trucks';
  if (/^compactor(s)?(\s*\/\s*roller(s)?)?$/i.test(lower) || /^roller(s)?$/i.test(lower)) return 'Compactors';
  if (/^backhoe(s)?(\s*loader(s)?)?$/i.test(lower)) return 'Backhoes';
  if (/^(wheel\s*loader|loader)(s)?$/i.test(lower)) return 'Wheel Loaders';
  if (/^(motor\s*grader|grader)(s)?$/i.test(lower)) return 'Motor Graders';
  if (/^forklift(s)?$/i.test(lower)) return 'Forklifts';
  if (/^(concrete\s*mixer|mixer)(s)?$/i.test(lower)) return 'Mixers';

  // Fallback: clean Title Case
  return trimmed
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function matchesCategory(machineCategory, selectedCategory) {
  if (!selectedCategory || selectedCategory === 'All') return true;
  if (!machineCategory) return false;

  const normMachine = normalizeCategoryName(machineCategory).toLowerCase();
  const normSelected = normalizeCategoryName(selectedCategory).toLowerCase();

  if (normMachine === normSelected) return true;
  // Match singular and plural stems (e.g. "excavator" vs "excavators")
  if (normMachine.replace(/s$/, '') === normSelected.replace(/s$/, '')) return true;

  return false;
}

/* ── Normalize Supabase row → frontend shape ──────────────── */
function normalize(row) {
  const rawCat = row.category || row.type || 'Equipment';
  const category = normalizeCategoryName(rawCat);
  return {
    ...row,
    category,
    type: category,
  };
}

/* ── In-Memory Cache ──────────────────────────────────────── */
let machinesCache = null;

export async function fetchMachines() {
  if (machinesCache) return machinesCache;
  if (!supabase) return staticMachines;
  try {
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data?.length) return staticMachines;
    machinesCache = data.map(normalize);
    return machinesCache;
  } catch {
    return staticMachines;
  }
}

export async function fetchMachineBySlug(slug) {
  if (!supabase) return staticMachines.find((m) => m.slug === slug) || null;
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
  if (!supabase) return [...new Set(staticMachines.map((m) => normalizeCategoryName(m.category)))];
  try {
    const { data, error } = await supabase
      .from('machines')
      .select('category, type')
      .eq('published', true);

    if (error || !data?.length) {
      return [...new Set(staticMachines.map((m) => normalizeCategoryName(m.category)))];
    }
    const cats = data
      .map((m) => normalizeCategoryName(m.category || m.type))
      .filter(Boolean);
    return [...new Set(cats)];
  } catch {
    return [...new Set(staticMachines.map((m) => normalizeCategoryName(m.category)))];
  }
}

/* ── Sync Getters (static fallback) ───────────────────────── */

export function getMachines() {
  return machinesCache || staticMachines;
}

export function getMachineBySlug(slug) {
  return staticMachines.find((m) => m.slug === slug) || null;
}

export function getMachineCategories() {
  return [...new Set(staticMachines.map((m) => normalizeCategoryName(m.category)))];
}

export default staticMachines;
