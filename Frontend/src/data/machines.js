/* ══════════════════════════════════════════════════════════════
   Machines — Static Data
   ══════════════════════════════════════════════════════════════
   PLACEHOLDER DATA — Replace with actual client equipment.
   Do NOT present this data as the company's real inventory.
   ════════════════════════════════════════════════════════════ */

import machineExcavator from '../assets/machine-excavator.jpg';
import machineBulldozer from '../assets/machine-bulldozer.jpg';
import machineCrane from '../assets/machine-crane.jpg';

const machines = [
  {
    id: 1,
    slug: 'hydraulic-excavator',
    name: 'Hydraulic Excavator',
    type: 'Excavator',
    category: 'Excavators',
    brand: '[Brand — CLIENT TO PROVIDE]',
    model: '[Model — CLIENT TO PROVIDE]',
    image: machineExcavator,
    description:
      'Heavy-duty hydraulic excavator for earthmoving, grading, and excavation work. Ideal for foundations, trenching, and large-scale site preparation.',
    specifications: [
      { label: 'Operating Weight', value: '[CLIENT TO PROVIDE]' },
      { label: 'Engine Power', value: '[CLIENT TO PROVIDE]' },
      { label: 'Bucket Capacity', value: '[CLIENT TO PROVIDE]' },
      { label: 'Max Digging Depth', value: '[CLIENT TO PROVIDE]' },
      { label: 'Max Reach', value: '[CLIENT TO PROVIDE]' },
    ],
  },
  {
    id: 2,
    slug: 'track-bulldozer',
    name: 'Track Bulldozer',
    type: 'Bulldozer',
    category: 'Bulldozers',
    brand: '[Brand — CLIENT TO PROVIDE]',
    model: '[Model — CLIENT TO PROVIDE]',
    image: machineBulldozer,
    description:
      'Powerful track-type bulldozer for land clearing, grading, and heavy push operations. Built for demanding terrain and large-scale earthwork.',
    specifications: [
      { label: 'Operating Weight', value: '[CLIENT TO PROVIDE]' },
      { label: 'Engine Power', value: '[CLIENT TO PROVIDE]' },
      { label: 'Blade Width', value: '[CLIENT TO PROVIDE]' },
      { label: 'Blade Capacity', value: '[CLIENT TO PROVIDE]' },
      { label: 'Ground Pressure', value: '[CLIENT TO PROVIDE]' },
    ],
  },
  {
    id: 3,
    slug: 'mobile-crane',
    name: 'Mobile Crane',
    type: 'Crane',
    category: 'Cranes',
    brand: '[Brand — CLIENT TO PROVIDE]',
    model: '[Model — CLIENT TO PROVIDE]',
    image: machineCrane,
    description:
      'High-capacity mobile crane for structural steel, precast concrete, and heavy lifting operations. Suitable for commercial and infrastructure projects.',
    specifications: [
      { label: 'Max Lifting Capacity', value: '[CLIENT TO PROVIDE]' },
      { label: 'Max Boom Length', value: '[CLIENT TO PROVIDE]' },
      { label: 'Max Lifting Height', value: '[CLIENT TO PROVIDE]' },
      { label: 'Counterweight', value: '[CLIENT TO PROVIDE]' },
      { label: 'Engine Power', value: '[CLIENT TO PROVIDE]' },
    ],
  },
];

export function getMachines() {
  return machines;
}

export function getMachineBySlug(slug) {
  return machines.find((m) => m.slug === slug) || null;
}

export function getMachineCategories() {
  return [...new Set(machines.map((m) => m.category))];
}

export default machines;
