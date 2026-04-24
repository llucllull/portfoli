# 🚀 Portfoli - Angular Portfolio Website

[![Angular](https://img.shields.io/badge/Angular-19.0.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, responsive portfolio website built with Angular, featuring static site generation (SSG) with prerendering, and multilingual support. Showcase your projects, skills, and contact information in a sleek, professional layout.

## ✨ Features

- **📱 Responsive Design**: Optimized for all devices and screen sizes
- **🌐 Multilingual Support**: Easy language switching with JSON-based content
- **⚡ High Performance**: SSG with prerendering for fast loading times and SEO
- **🔍 SEO Optimized**: Meta tags, sitemaps, and structured data
- **🎨 Dynamic Content**: Load content from JSON files for easy updates
- **🛠️ Developer Friendly**: Built with Angular CLI, TypeScript, and modern tooling

## 🏗️ Architecture Overview

This portfolio website is built using **Angular 19** with a **Static Site Generation (SSG)** approach through prerendering. The architecture emphasizes performance, SEO, and maintainability:

### Content Management System (CMS)

- **JSON-based Content**: All content is stored in structured JSON files under `src/jsons/content/v1/`
- **Versioned Content**: Content is versioned (v1) for future extensibility
- **Dynamic Loading**: Services load content dynamically, allowing easy updates without code changes

### Routing & Pages

- **Localized Routes**: Supports multiple languages with URL patterns like `/{lang}/page`
- **Prerendered Routes**: All routes are prerendered at build time for optimal SEO and performance
- **Lazy Loading**: Components are structured for efficient loading

### Services Architecture

- **Content Service**: Handles loading and caching of JSON content
- **Language Service**: Manages language switching and localization
- **SEO Service**: Dynamically sets meta tags, titles, and structured data
- **Layout Service**: Manages responsive layout and navigation state
- **Site Config Service**: Provides global configuration settings

### Build & Deployment

- **Prerendering**: Generates static HTML for each route during build (SSG)
- **Optional SSR**: SSR capabilities available via `npm run serve:ssr:portfoli` for dynamic serving if needed
- **Sitemap Generation**: Automatically creates sitemap.xml for search engines
- **Asset Optimization**: Fonts, images, and styles are optimized for production
- **Vercel Deployment**: Configured for static hosting with proper caching headers

### Data Flow & Component Architecture

The application follows a **reactive data flow** pattern with clear separation of concerns:

#### Content Loading Flow

1. **Route Resolution**: `page.resolver.ts` intercepts routes and loads required content
2. **Content Service**: Fetches JSON data from `src/jsons/content/v1/` and caches it
3. **Language Service**: Applies current language translations and locale settings
4. **SEO Service**: Updates meta tags, titles, and structured data based on content
5. **Layout Service**: Manages navigation state and responsive layout changes

#### Dynamic Component System

The `dynamic-renderer` system enables flexible content rendering:

- **Component Registry**: `component-registry.service.ts` maps content types to Angular components
- **Dynamic Renderer**: `dynamic-renderer.component.ts` instantiates components based on JSON configuration
- **Content-Driven UI**: Pages are built dynamically from JSON structure, allowing content editors to modify layouts without code changes
- **Type Safety**: TypeScript interfaces ensure type safety across dynamic components

#### Page Rendering Flow

```
Route → Resolver → Content Service → JSON Data → Dynamic Renderer → Components → SEO Update
```

This architecture allows for:

- **Content-first development**: UI adapts to content structure
- **Easy maintenance**: Update content in JSON without touching code
- **Scalability**: New page types can be added by extending the component registry
- **Performance**: Static generation with optional SSR fallback

### Key Architectural Benefits

- **Separation of Concerns**: Content, logic, and presentation are clearly separated
- **Maintainability**: Changes to content don't require code modifications
- **Performance**: SSG provides fast loading, SSR available when needed
- **Developer Experience**: Type-safe development with Angular's powerful tooling
- **SEO Friendly**: Both static generation and dynamic meta tag management

## 🛠️ Tech Stack

- **Framework**: Angular 19
- **Language**: TypeScript
- **Styling**: SCSS with Angular Material
- **Build Tool**: Angular CLI
- **Deployment**: Vercel-ready configuration
- **Content Management**: JSON-based content system
- **Icons**: Lucide Angular, Simple Icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd portfoli
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   Navigate to `http://localhost:4200/` in your browser.

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory, with prerendered static pages.

## 📁 Project Structure

```
src/
├── app/
│   ├── pages/                      # Page components
│   │   ├── 404/                    # 404 error page
│   │   ├── about/                  # About page
│   │   ├── contact/                # Contact page
│   │   ├── home/                   # Home page
│   │   ├── project-detail/         # Individual project detail page
│   │   └── projects/               # Projects listing page
│   ├── layout/                     # Main layout component
│   ├── imports/                    # Centralized imports
│   ├── resolvers/                  # Route resolvers for data loading
│   ├── services/                   # Business logic services
│   │   ├── content/                # Content loading services
│   │   │   ├── content-loader.service.ts
│   │   │   ├── content.service.ts
│   │   │   └── content.store.ts
│   │   ├── language/               # Language management
│   │   ├── layout/                 # Layout state management
│   │   ├── seo/                    # SEO meta tag management
│   │   └── site-config/            # Global site configuration
│   ├── shared/                     # Reusable components
│   │   ├── base-page/              # Base page component
│   │   └── dynamic-renderer/       # Dynamic component rendering
│   ├── utils/                      # Utility functions
│   │   ├── prefetch-idle.ts        # Idle prefetching utilities
│   │   ├── resolve-lang.ts         # Language resolution
│   │   └── ssg-routes.ts           # SSG route utilities
│   ├── scripts/                    # Build-time scripts
│   │   ├── generate-sitemap.mjs    # Sitemap generation
│   │   └── prerender-routes.mjs    # Route prerendering
│   ├── app.component.*             # Root component
│   ├── app.config.*                # App configuration
│   └── app.routes.ts               # Route definitions
├── assets/                         # Static assets
│   └── favicons/                   # Favicon files
├── environments/                   # Environment configurations
│   ├── environment.prod.ts         # Production config
│   └── environment.ts              # Development config
├── jsons/                          # Content data (CMS)
│   └── content/
│       └── v1/                     # Versioned content
│           ├── config.json         # Site configuration
│           ├── languages.json      # Language settings
│           ├── layout.json         # Layout configuration
│           ├── manifest.json       # Web app manifest
│           ├── navigation.json     # Navigation structure
│           ├── social.json         # Social media links
│           ├── pages/              # Page-specific content
│           │   ├── 404.json
│           │   ├── about.json
│           │   ├── contact.json
│           │   ├── home.json
│           │   └── projects.json
│           └── projects/            # Project data
│               └── puro-hotels.json # Individual project
├── main.ts                         # Application bootstrap
├── main.server.ts                  # Server-side bootstrap
├── server.ts                       # Express server for SSR
├── index.html                      # Main HTML template
├── styles.scss                     # Global styles
├── vercel.json                     # Vercel deployment config
├── robots.txt                      # Search engine crawling rules
└── sitemap.xml                     # Generated sitemap
```

## 📜 Scripts

- `npm start` - Start development server
- `npm run build` - Build for production with prerendering
- `npm run routes` - Generate routes for prerendering
- `npm run sitemap` - Generate sitemap
- `npm test` - Run unit tests
- `npm run serve:ssr:portfoli` - Serve with SSR (if needed)

## 🤝 Contributing

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ using Angular
