# Nethma Samadhi — Midnight & Mint

A responsive React portfolio based on the supplied CV. Built with React 19, Vite 6, Tailwind CSS 4, React Router 7, Motion and Lucide React. Fonts are bundled locally: Manrope, Inter and JetBrains Mono.

## Run locally

Requires Node.js 22 or newer (validated with Node 24).

```powershell
cd "E:\nethma samadhi\nethma-portfolio\portfolio"
npm ci
npm run dev
```

Open the local URL printed by Vite, normally http://127.0.0.1:5173.

```powershell
npm run lint
npm run build
npm test
npm run preview
```

The build prerenders the homepage, all four case studies and a 404 page, including route-specific titles and descriptions. React hydrates the HTML for client-side navigation. `dist/` is generated output. Run tests after building.

## Routes

- `/`
- `/projects/finai`
- `/projects/ayurvedic-medicine`
- `/projects/library-management`
- `/projects/cleaning-service`

## Edit content

- `src/data/profile.js`: identity, verified social links, experience, expertise and education.
- `src/data/projects.js`: verified project descriptions, technologies, contributions and testing information.
- `src/components/`: reusable navigation, contact, footer, tags, reveal and screenshot components.
- `src/pages/`: homepage and case studies.
- `src/styles.css`: Midnight & Mint design and responsive layout; Tailwind theme tokens.
- `public/Nethma-Samadhi-CV.pdf`: reformatted public CV excluding home address, phone number and references. The original supplied PDF is unchanged and is not included in the public build.
- `scripts/create-public-cv.py`: optional PDF regeneration using Python and ReportLab; not required for the website build.


## Project evidence still needed

Project covers are AI-generated concept artwork. Three project repository links were supplied by the owner. Actual application screenshots, live demos, model scores and formal test reports are still needed. The site does not invent these. LinkedIn and GitHub profile links were extracted from the CV's hyperlink annotations.

To add screenshots, put actual images in `public/projects/` and populate each project's `screenshots` array with `{ src, alt, caption }`. Use descriptive alt text and optimized WebP/AVIF files. `screenshotLabels` controls the gallery slots. Do not add private user data to screenshots.

## Deploy to Vercel

Import this folder/repository into Vercel using the Vite preset. The included `vercel.json` uses `npm run build`, serves `dist`, and supplies navigation fallback plus basic security headers. No environment variables or backend are needed. Set a custom domain in Vercel if desired. Add canonical URLs and a sitemap only after the final public domain is chosen.

Contact uses `mailto:` and clipboard copy; no contact form or message backend is implied. The mobile navigation supports keyboard access and Escape to close. Motion honors reduced-motion settings. Every project page explicitly labels missing screenshot and testing evidence.

## Implementation references

- https://tailwindcss.com/docs/installation/using-vite
- https://motion.dev/docs/react-installation
- https://reactrouter.com/start/declarative/installation
