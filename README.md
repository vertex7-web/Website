# Vertex 7 Website

Responsive brochure website for Vertex 7, a heavy equipment rental and construction supplies company.

## Overview

The site presents Vertex 7's equipment, services, and project experience through an industrial visual system built around strong typography, construction photography, dark surfaces, and lime accents.

## Features

- Responsive marketing homepage
- About, machines, services, projects, and contact pages
- Machine and project detail routes
- Reusable React components
- Static data structure for equipment, services, and projects
- Accessibility, SEO, and performance foundations

## Tech Stack

- React 19
- React Router
- Vite
- CSS
- Oxlint

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
cd Frontend
npm install
```

### Run Locally

```bash
npm run dev
```

Vite will start a local development server and provide the URL in the terminal.

## Available Scripts

Run these commands from the `Frontend` directory:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with Oxlint |

## Project Structure

```text
Frontend/
├── public/              # Public assets
├── src/
│   ├── components/      # Shared layout, UI, and homepage components
│   ├── pages/           # Route-level page components
│   ├── assets/          # Images and bundled assets
│   ├── App.jsx          # Application routes
│   └── main.jsx         # Application entry point
├── index.html
└── package.json
```

## Scope

The current project focuses on the core brochure website.
