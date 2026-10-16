# Nethma Samadhi — Personal Portfolio

**Software Development · Quality Assurance · Web & SEO · Data Analysis**

A modern, responsive personal portfolio presenting my technical background, professional experience, academic projects and interests across software engineering and digital technologies.

Designed with a **Midnight & Mint** visual identity, focusing on clean typography, intuitive navigation, accessibility and a consistent user experience.

**[View Live Portfolio](https://nethma.vercel.app/)** · **[GitHub Profile](https://github.com/Samadhi66)** · **[Contact Me](mailto:nethmasamadhi66@gmail.com)**

---

## About Me

I'm Nethma Samadhi, a Software Engineering undergraduate at ICBT Campus, with my academic studies completed and graduation pending.

I have hands-on experience developing full-stack web applications, mobile applications and data-driven solutions. I currently work as a Web Content & SEO Assistant at eBEYONDS, where I contribute to website content management, on-page optimization and digital workflows.

My interests span software and web development, software quality, technical analysis, data-driven applications and digital operations.

## Portfolio Features

- Modern Midnight & Mint visual design
- Responsive layouts for desktop, tablet and mobile
- Professional introduction and downloadable CV
- Featured software projects with individual case-study pages
- Professional experience and technical expertise sections
- Education and background information
- Contact options and professional profile links
- Accessible navigation and reduced-motion support
- SEO-oriented page metadata and route-specific content

## Featured Projects

### 01. FinAI — AI-Powered Financial Intelligence System

A full-stack financial application integrating transaction management, interactive financial dashboards and machine-learning functionality.

**Key features:** Transaction CRUD, spending insights, budget and transaction-amount prediction, behavioral fraud detection, receipt extraction and voice-assisted expense entry.

**Technologies:** React, Vite, Python, FastAPI, SQLite, Scikit-learn, EasyOCR and Browser Speech API.

### 02. Ayurvedic Medicine Management System

A database-driven application designed to support medicine inventory, order management, record tracking and reporting.

**Technologies:** PHP and MySQL.

### 03. Library Management Website

A web application supporting book cataloguing, member management and library-related workflows.

**Technologies:** HTML, CSS, JavaScript and PHP.

### 04. Cleaning Service Mobile App

A mobile application featuring user registration, service booking and appointment scheduling.

**Development environment:** Android Studio.

Each project is presented through an individual case study detailing its purpose, functionality, technologies and verified implementation information.

## Portfolio Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, JavaScript, HTML5, CSS3 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4, custom CSS |
| Routing | React Router 7 |
| Animation | Motion |
| Icons | Lucide React |
| Fonts | Manrope, Inter, JetBrains Mono |
| Deployment | Vercel |
| Version Control | Git and GitHub |

## Getting Started

To run the portfolio locally, use Node.js 22 or newer.

**1. Clone the repository**

```bash
git clone https://github.com/Samadhi66/nethma-portfolio.git
cd nethma-portfolio
```

**2. Install dependencies**

```bash
npm ci
npm run lint
npm run build
npm test
npm run preview -- --port 4173
```

In a second terminal:

```powershell
node scripts/check-preview.mjs http://127.0.0.1:4173
```

`npm run dev` starts the development server on port 5173. Stop running project servers before `npm ci` on Windows so native build modules are not locked. `npm test` includes DOM interaction, accessibility, content, metadata, local-link and deployment-configuration tests. Run a build before tests because some assertions inspect the actual generated output.

## Architecture

- `src/data/profile.js`: professional identity, verified social URLs, skills, responsibilities and education.
- `src/data/projects.js`: all four projects, problem statements, architecture/workflow descriptions, features, contributions and validation evidence.
- `src/data/seo.js`: production domain and shared page metadata/structured data.
- `src/pages/Home.jsx`: hero, editorial project sequence, experience, expertise and education.
- `src/pages/Project.jsx`: reusable case-study sections, visual disclosures, validation, next-project navigation and 404 view.
- `src/components/Layout.jsx`: responsive navigation, focus behavior, contact/clipboard and footer.
- `src/components/UI.jsx` and `PageMotion.jsx`: reusable visuals and restrained, reduced-motion-aware interaction.
- `src/styles.css`: the consolidated design system. The former override stylesheet and unused Tailwind integration have been removed.
- `scripts/prerender.mjs`: renders all five public routes plus a noindex 404 document; generates robots.txt and sitemap.xml.
- `tests/`: static output and React DOM interaction/accessibility tests.
- `qa/responsive-results.json`: measured browser overflow/image checks for 60 page/viewport combinations.

## Content and images

The existing portrait is preserved and compressed into responsive WebP variants. Original assets are retained in `artwork-originals/`, outside the published `public/` directory. The JPEG social image derives from the same approved portrait.

Project images remain clearly labeled **AI-generated interface concepts**, not implementation screenshots. The existing prompt set is in `PROJECT-INTERFACE-ARTWORK.md`. No new face or project metrics have been generated.

To add authentic screenshots, place optimized images in `public/projects/` and populate the appropriate `screenshots` array with `{src, alt, caption, width, height}`. The cover automatically prefers the first real screenshot and the case-study gallery appears only when images exist.

The downloadable `public/Nethma-Samadhi-CV.pdf` is the existing public CV, excluding private phone, home address and references. Its source generation script is optional and is not part of the website build. Keep the supplied private original out of `public/`.

## Routes and Vercel

The public domain remains **https://nethma.vercel.app/**.

- `/`
- `/projects/finai`
- `/projects/ayurvedic-medicine`
- `/projects/library-management`
- `/projects/cleaning-service`

The build writes crawlable HTML for every route. Vercel uses `npm run build`, the Vite preset and `dist/`. Explicit case-study rewrites are retained. The previous homepage catch-all is removed so unmatched URLs use the generated `404.html` with HTTP 404. The local production preview models that behavior. Security headers are retained; no DNS, production project or audience settings are changed.

When adding a project, update `vercel.json` along with the project data. Tests check that every case-study rewrite has a generated page. Keep production changes on a review branch until the PR has been reviewed.

For the full audit, QA coverage, measured sizes, known limitations and post-deployment checks, see `AUDIT-V2.md` and `QA-V2.md`.
