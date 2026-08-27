/* ══════════════════════════════════════════════════════════════
   Projects — Data Layer
   ══════════════════════════════════════════════════════════════
   Fetches from Supabase. Falls back to static data if unavailable.
   ════════════════════════════════════════════════════════════ */

import { supabase } from '../lib/supabase';
import projectHighway from '../assets/project-highway.jpg';
import projectBuilding from '../assets/project-building.jpg';
import projectBridge from '../assets/project-bridge.jpg';

/* ── Static Fallback ──────────────────────────────────────── */
const staticProjects = [
  {
    id: 'static-1',
    slug: 'project-placeholder-1',
    name: '[Project Name — CLIENT TO PROVIDE]',
    location: '[Location — CLIENT TO PROVIDE]',
    category: 'Infrastructure',
    coverImage: projectHighway,
    cover_image: projectHighway,
    gallery: [projectHighway],
    description: '[CLIENT TO PROVIDE]',
    scope: [],
    equipment: ['Excavator', 'Bulldozer', 'Dump Trucks'],
  },
  {
    id: 'static-2',
    slug: 'project-placeholder-2',
    name: '[Project Name — CLIENT TO PROVIDE]',
    location: '[Location — CLIENT TO PROVIDE]',
    category: 'Commercial',
    coverImage: projectBuilding,
    cover_image: projectBuilding,
    gallery: [projectBuilding],
    description: '[CLIENT TO PROVIDE]',
    scope: [],
    equipment: ['Mobile Crane', 'Excavator'],
  },
  {
    id: 'static-3',
    slug: 'project-placeholder-3',
    name: '[Project Name — CLIENT TO PROVIDE]',
    location: '[Location — CLIENT TO PROVIDE]',
    category: 'Infrastructure',
    coverImage: projectBridge,
    cover_image: projectBridge,
    gallery: [projectBridge],
    description: '[CLIENT TO PROVIDE]',
    scope: [],
    equipment: ['Mobile Crane', 'Excavator', 'Pile Driver'],
  },
];

/* ── Normalize Supabase row → frontend shape ──────────────── */
function normalize(row) {
  return {
    ...row,
    coverImage: row.cover_image || '',
  };
}

/* ── Async Fetchers (Supabase) ────────────────────────────── */

export async function fetchProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data?.length) return staticProjects;
    return data.map(normalize);
  } catch {
    return staticProjects;
  }
}

export async function fetchProjectBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      return staticProjects.find((p) => p.slug === slug) || null;
    }
    return normalize(data);
  } catch {
    return staticProjects.find((p) => p.slug === slug) || null;
  }
}

/* ── Sync Getters (static fallback — used by components not yet migrated) */

export function getProjects() {
  return staticProjects;
}

export function getProjectBySlug(slug) {
  return staticProjects.find((p) => p.slug === slug) || null;
}

export function getProjectCategories() {
  return [...new Set(staticProjects.map((p) => p.category))];
}

export default staticProjects;
