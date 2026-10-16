# Nethma Samadhi — Portfolio V2

A CV-backed portfolio built with React 19, Vite 6, React Router 7, Motion and Lucide. The Midnight & Mint design uses self-hosted Manrope, Inter and JetBrains Mono fonts. There is no application backend or external tracking script.

## Local development and verification

Use Node 24.15+ (or Node 22.22.2+); the test DOM dependency has a newer Node requirement than Vite itself.

```powershell
cd "E:\GitHub-Projects\nethma-portfolio"
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
