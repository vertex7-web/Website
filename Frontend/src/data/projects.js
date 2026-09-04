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
    scope: [
      'Site clearing and grubbing',
      'Subgrade excavation and compaction',
      'Aggregate subbase and base course installation',
      'Concrete pouring and drainage structure construction',
    ],
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
    scope: [
      'Deep basement and foundation excavation',
      'Structural steel erection support',
      'Utility trenching and backfilling',
      'Final site grading and finishing',
    ],
    equipment: [],
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

/* ── In-Memory Cache ──────────────────────────────────────── */
let projectsCache = null;

export async function fetchProjects() {
  if (projectsCache) return projectsCache;
  if (!supabase) return staticProjects;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data?.length) return staticProjects;
    projectsCache = data.map(normalize);
    return projectsCache;
  } catch {
    return staticProjects;
  }
}

export async function fetchProjectBySlug(slug) {
  if (!supabase) return staticProjects.find((p) => p.slug === slug) || null;
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
  return projectsCache || staticProjects;
}

export function getProjectBySlug(slug) {
  return staticProjects.find((p) => p.slug === slug) || null;
}

export function getProjectCategories() {
  return [...new Set(staticProjects.map((p) => p.category))];
}

export default staticProjects;
