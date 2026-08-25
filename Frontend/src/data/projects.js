/* ══════════════════════════════════════════════════════════════
   Projects — Static Data
   ══════════════════════════════════════════════════════════════
   PLACEHOLDER DATA — These are NOT real projects.
   Replace with actual client project data.
   ════════════════════════════════════════════════════════════ */

import projectHighway from '../assets/project-highway.jpg';
import projectBuilding from '../assets/project-building.jpg';
import projectBridge from '../assets/project-bridge.jpg';

const projects = [
  {
    id: 1,
    slug: 'project-placeholder-1',
    name: '[Project Name — CLIENT TO PROVIDE]',
    location: '[Location — CLIENT TO PROVIDE]',
    category: 'Infrastructure',
    coverImage: projectHighway,
    gallery: [projectHighway],
    description:
      '[CLIENT TO PROVIDE — project overview describing the scope, scale, and nature of the work performed.]',
    scope: [
      '[Scope item 1 — CLIENT TO PROVIDE]',
      '[Scope item 2 — CLIENT TO PROVIDE]',
      '[Scope item 3 — CLIENT TO PROVIDE]',
    ],
    equipment: ['Excavator', 'Bulldozer', 'Dump Trucks'],
  },
  {
    id: 2,
    slug: 'project-placeholder-2',
    name: '[Project Name — CLIENT TO PROVIDE]',
    location: '[Location — CLIENT TO PROVIDE]',
    category: 'Commercial',
    coverImage: projectBuilding,
    gallery: [projectBuilding],
    description:
      '[CLIENT TO PROVIDE — project overview describing the scope, scale, and nature of the work performed.]',
    scope: [
      '[Scope item 1 — CLIENT TO PROVIDE]',
      '[Scope item 2 — CLIENT TO PROVIDE]',
      '[Scope item 3 — CLIENT TO PROVIDE]',
    ],
    equipment: ['Mobile Crane', 'Excavator'],
  },
  {
    id: 3,
    slug: 'project-placeholder-3',
    name: '[Project Name — CLIENT TO PROVIDE]',
    location: '[Location — CLIENT TO PROVIDE]',
    category: 'Infrastructure',
    coverImage: projectBridge,
    gallery: [projectBridge],
    description:
      '[CLIENT TO PROVIDE — project overview describing the scope, scale, and nature of the work performed.]',
    scope: [
      '[Scope item 1 — CLIENT TO PROVIDE]',
      '[Scope item 2 — CLIENT TO PROVIDE]',
      '[Scope item 3 — CLIENT TO PROVIDE]',
    ],
    equipment: ['Mobile Crane', 'Excavator', 'Pile Driver'],
  },
];

export function getProjects() {
  return projects;
}

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function getProjectCategories() {
  return [...new Set(projects.map((p) => p.category))];
}

export default projects;
