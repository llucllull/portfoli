# PORTFOLI

[![Angular](https://img.shields.io/badge/Angular-19.0.0-red.svg?style=for-the-badge&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg?style=for-the-badge&logo=vercel)](https://vercel.com)

> **RAW POWER • CLEAN CODE • MAXIMUM PERFORMANCE**

A brutalist portfolio website forged with **Angular 19**. Static Site Generation meets dynamic content in a symphony of raw efficiency. No bullshit, just results.

## 🌐 LIVE DEMO

**Visit the live portfolio at: [llucllull.dev](https://llucllull.dev)**

---

## CORE FEATURES

| Feature                  | Description                          | Impact                  |
| ------------------------ | ------------------------------------ | ----------------------- |
| **RESPONSIVE DESIGN**    | Optimized for every screen size      | Universal accessibility |
| **MULTILINGUAL**         | JSON-powered language switching      | Global reach            |
| **SSG + PRERENDERING**   | Lightning-fast static generation     | SEO domination          |
| **SEO OPTIMIZED**        | Meta tags, sitemaps, structured data | Search engine supremacy |
| **DYNAMIC CONTENT**      | JSON-driven content system           | Content freedom         |
| **DEVELOPER EXPERIENCE** | Angular CLI + TypeScript             | Development velocity    |

---

## ARCHITECTURE OVERVIEW

**BUILT FOR SCALE • DESIGNED FOR SPEED • CODED FOR MAINTAINABILITY**

This portfolio is a **technological fortress** built with Angular 19's Static Site Generation through prerendering. Every component serves a purpose. Every service has a mission. Every line of code is a weapon.

### CONTENT MANAGEMENT SYSTEM (CMS)

```
JSON-DRIVEN • VERSIONED • DYNAMICALLY LOADED
```

- **JSON-BASED CONTENT**: All content lives in `src/jsons/content/v1/` - structured, versioned, immutable
- **VERSIONED ARCHITECTURE**: v1 namespace for future evolution and backward compatibility
- **DYNAMIC LOADING**: Services inject content at runtime - update without redeployment

### ROUTING & PAGES

```
LOCALIZED • PRERENDERED • LAZY-LOADED
```

- **LOCALIZED ROUTES**: `/{lang}/page` patterns for global domination
- **PRERENDERED ROUTES**: Every route forged into static HTML at build time
- **LAZY LOADING**: Components load on demand - zero wasted resources

### SERVICES ARCHITECTURE

```
CONTENT • LANGUAGE • SEO • LAYOUT • CONFIG
```

- **CONTENT SERVICE**: Loads, caches, serves JSON content with military precision
- **LANGUAGE SERVICE**: Manages localization, switching, cultural adaptation
- **SEO SERVICE**: Commands meta tags, titles, structured data like a general
- **LAYOUT SERVICE**: Controls responsive layout, navigation state, UI flow
- **SITE CONFIG SERVICE**: Global configuration, environment variables, app settings

### BUILD & DEPLOYMENT

```
PRERENDERED • OPTIMIZED • DEPLOYED
```

- **PRERENDERING**: Static HTML generation (SSG) - lightning fast loading
- **OPTIONAL SSR**: SSR capabilities via `npm run serve:ssr:portfoli` when dynamic serving is needed
- **SITEMAP GENERATION**: Automatic sitemap.xml creation for search engine conquest
- **ASSET OPTIMIZATION**: Fonts, images, styles compressed for production warfare
- **VERCEL DEPLOYMENT**: Static hosting with intelligent caching headers

### DATA FLOW & COMPONENT ARCHITECTURE

```
ROUTE → RESOLVER → SERVICE → JSON → RENDERER → COMPONENT → SEO
```

**THE ULTIMATE CONTENT-FIRST ARCHITECTURE**

#### DYNAMIC COMPONENT SYSTEM

```
REGISTRY • RENDERER • TYPE-SAFE • CONTENT-DRIVEN
```

- **COMPONENT REGISTRY**: Maps content types to Angular components with precision
- **DYNAMIC RENDERER**: Instantiates components from JSON configuration - pure magic
- **TYPE-SAFE**: TypeScript interfaces enforce type safety across dynamic boundaries
- **CONTENT-DRIVEN UI**: Pages built from JSON structure - content dictates design

**ARCHITECTURAL SUPERPOWERS:**

- **CONTENT-FIRST DEVELOPMENT**: UI adapts to content, not vice versa
- **MAINTAINABILITY**: Update content in JSON, no code changes required
- **SCALABILITY**: New page types via component registry extension
- **PERFORMANCE**: SSG speed with optional SSR fallback
- **SEO DOMINATION**: Static generation + dynamic meta management

---

## TECH STACK

**MODERN • POWERFUL • RELIABLE**

| Category       | Technology                    | Purpose                       |
| -------------- | ----------------------------- | ----------------------------- |
| **Framework**  | Angular 19                    | Core application framework    |
| **Language**   | TypeScript                    | Type-safe development         |
| **Styling**    | SCSS + Angular Material       | Modern, responsive design     |
| **Build**      | Angular CLI                   | Development and build tooling |
| **Deployment** | Vercel                        | Static site hosting           |
| **Content**    | JSON-based CMS                | Content management            |
| **Icons**      | Lucide Angular + Simple Icons | Consistent iconography        |
| **3D**         | Three.js                      | Interactive 3D elements       |
| **UI Library** | @lluc_llull/ui-lib            | Custom component library      |

---

## QUICK START

**GET THIS BEAST RUNNING IN 3 STEPS**

### Prerequisites

- **Node.js** ≥18.0.0
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd portfoli

# Install dependencies
npm install

# Launch development server
npm start
```

**Navigate to `http://localhost:4200/` and witness the power.**

### Production Build

```bash
# Build for production
npm run build

# Deploy the dist/portfoli/ directory
```

---

## PROJECT STRUCTURE

```
src/
├── app/
│   ├── pages/                      # PAGE COMPONENTS
│   │   ├── 404/                    # Error handling
│   │   ├── about/                  # Personal story
│   │   ├── contact/                # Connection portal
│   │   ├── home/                   # Landing battlefield
│   │   ├── project-detail/         # Project showcase
│   │   └── projects/               # Project gallery
│   ├── layout/                     # MAIN LAYOUT
│   ├── services/                   # BUSINESS LOGIC
│   │   ├── content/                # Content management
│   │   ├── language/               # Localization
│   │   ├── layout/                 # UI state
│   │   ├── seo/                    # Search optimization
│   │   └── site-config/            # Configuration
│   ├── shared/                     # REUSABLE COMPONENTS
│   ├── resolvers/                  # ROUTE RESOLVERS
│   ├── utils/                      # UTILITIES
│   └── scripts/                    # BUILD SCRIPTS
├── assets/                         # STATIC ASSETS
├── environments/                   # ENVIRONMENT CONFIGS
├── jsons/                          # CONTENT DATA (CMS)
└── *.ts                            # CONFIGURATION FILES
```

---

## COMMANDS

| Command                      | Description        | Use Case               |
| ---------------------------- | ------------------ | ---------------------- |
| `npm start`                  | Development server | Local development      |
| `npm run build`              | Production build   | Deployment preparation |
| `npm run routes`             | Generate routes    | Pre-build step         |
| `npm run sitemap`            | Generate sitemap   | SEO optimization       |
| `npm test`                   | Run tests          | Quality assurance      |
| `npm run serve:ssr:portfoli` | SSR server         | Dynamic serving        |

---

## CONTRIBUTING

**JOIN THE BATTLE • CONTRIBUTE • DOMINATE**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## LICENSE

**MIT LICENSE** - Use it. Break it. Make it better.

---
