# Portfolio V2 delivery and QA — 16 October 2026

Review branch: `codex/portfolio-v2`. Baseline: `0a89d68`. The production domain remains https://nethma.vercel.app/. No merge, push, production deployment, DNS change or Vercel project change was performed.

## Delivered design and behavior

- Consolidated Midnight & Mint tokens, responsive typography, spacing, surfaces and focus states in one stylesheet. Removed obsolete layouts and the competing redesign stylesheet.
- Added NS branding, five-section primary navigation and a keyboard-operable mobile disclosure. First-link focus, Escape restoration, outside-click dismissal, focus-exit dismissal and desktop breakpoint cleanup are implemented.
- Rebuilt the hero around the requested identity and CTAs, retaining the approved portrait. Added readable background/context copy without invented achievements.
- Made FinAI the featured project and used alternating editorial rows for supporting work. Kept all project content, source URLs and truthful generated-image disclosures.
- Added reusable problem, architecture/workflow, feature, contribution and validation sections to all four cases. For unprovided testing or architecture details, the page states the evidence limit instead of inventing implementation specifics.
- Kept the eBEYONDS responsibilities, corrected heading hierarchy, organized skills, and retained all verified education items.
- Improved copy-email success and failure feedback, in-page focus navigation, repeated-section navigation, malformed fragments, error recovery and 404 behavior.
- Added canonical URLs, synchronized Open Graph/Twitter metadata, a real portrait social image, Person/CreativeWork JSON-LD, robots.txt and a five-URL sitemap.
- Retained prerendered HTML and explicit Vercel project rewrites. Removed the homepage catch-all so unknown requests use the custom 404 document. Vercel documents this behavior at https://vercel.com/kb/guide/custom-404-page; preview mirrors it locally. Deployment itself still needs the normal post-merge verification below.

## Actual verification results

Environment: Windows, Node **24.20.0**, npm **11.19.0**.

| Check | Result |
| --- | --- |
| Clean `npm ci --no-audit --no-fund` | Passed after stopping project servers that held native modules open |
| `npm run lint` | Passed, no lint findings |
| `npm run build` | Passed; homepage, four cases and 404 prerendered, crawler files generated |
| `npm test` | **21 passed, 0 failed, 0 skipped** |
| `node scripts/check-preview.mjs http://127.0.0.1:4173` | **34 HTTP checks passed** |
| Browser viewport/page combinations | **60 checked**, no measured horizontal overflow, clipped tracked content or loaded broken images |
| Additional 640px reflow checks | Six pages checked, no horizontal overflow |
| Browser console | No error-level messages captured in final production-build checks |
| `git diff --check` | Passed |

The 21 tests cover homepage identity/sections, every project card, case-study content and return navigation, global links from case pages, mobile focus/Escape/closing, clipboard success and denial, same-section navigation, malformed fragments, unknown-route recovery, runtime error recovery, axe DOM accessibility, prerendering, metadata/schema, crawler files, every generated local link/anchor/image/srcset, external rel attributes, Vercel rewrites, PDF signature and design-token contrast.

The 34 HTTP checks cover all five public routes, metadata, generated assets/fonts, responsive images, the PDF signature/content type, crawler files and two unknown routes returning HTTP 404.

## Responsive and manual browser coverage

The homepage, all four case studies and a missing route were loaded at each requested width:

- Mobile: **320, 360, 375, 390, 430px**.
- Tablet: **768, 1024px**.
- Desktop: **1280, 1440, 1920px**.

Raw DOM measurements are committed in `qa/responsive-results.json`. The 15px difference between viewport and document client widths is the browser scrollbar; scroll widths equal client widths throughout. The extra 640px reflow record is in `qa/reflow-640.json`.

Screenshots were visually reviewed for the hero/portrait, featured project, case-study architecture, and mobile navigation/focus. Browser checks also exercised all five global section links, project entry/return, logo navigation, nested-route refresh on every case, browser back/forward, and copy-email success feedback. Enter/Tab/Escape were manually exercised in the mobile menu; Escape returned focus to its toggle. Temporary viewport overrides were reset.

## Accessibility and SEO scope

- Axe ran on the homepage, four cases and 404 with WCAG 2 A/AA, 2.1 AA and 2.2 AA tagged rules. **No violations were reported by the enabled DOM rules**.
- jsdom cannot measure visual contrast, so that axe rule was disabled. A separate numeric test verifies main text, secondary text and mint against every defined surface, plus dark button text on mint, at **4.5:1 or better**.
- Semantic landmarks, one h1 per page, ordered headings, descriptive image alternatives, new-tab notices, focus outlines, minimum control sizing, status feedback and reduced-motion behavior are implemented.
- The interaction suite runs with reduced-motion preference mocked on. Native OS preference toggling and a screen-reader session were not performed. This is not a claim of complete WCAG certification.
- Canonical URLs and schema are generated from the same function used by client navigation. Unknown pages receive noindex, and 404 is absent from the sitemap. Social imagery is the existing approved portrait, not a generated face.

## Measured performance changes

Vite output sizes; decimal KB, not Lighthouse scores:

| Resource | Baseline | V2 |
| --- | ---: | ---: |
| JavaScript | 432.84 KB / 137.97 KB gzip | **392.41 KB / 126.06 KB gzip** |
| CSS | 40.64 KB / 8.96 KB gzip | **23.30 KB / 5.40 KB gzip** |
| Main portrait | 1,357,628-byte PNG | **32,040-byte 960px WebP**, plus a 10,064-byte mobile variant |

Motion uses `LazyMotion` with the lighter `domAnimation` feature set. Unused font weights and unused Tailwind dependencies were removed. Original portrait/project PNGs are retained in `artwork-originals/` and no longer ship in the published directory. The full output is approximately **1.40 MB across 33 files**, including all five pages, fonts and assets; an initial visit does not fetch every lazy image or legacy font format.

Page-level lazy route imports were not added: these are small static pages that are intentionally prerendered for crawlable content, with a shared reusable case template. The significant runtime reduction came from dropping unused animation features instead.

## Remaining limitations and unverified items

- No authentic application screenshots, demo URLs, FinAI repository URL, numerical model results or formal testing reports were supplied. Generated interfaces remain explicitly labeled concepts.
- LinkedIn matches the URI in the supplied CV. Its service returned HTTP 999 to automated validation, so the profile content could not be independently inspected. The GitHub profile and all three supplied repositories returned HTTP 200.
- The email href and copy interaction were checked; opening a configured external mail client was not verified in this environment.
- Native browser zoom control was not exercised. Six-page 640px reflow checks provide an additional narrow-layout check, not a claim of testing browser zoom itself.
- Lighthouse was unavailable, so no Lighthouse scores, throttled performance results, field LCP/INP/CLS or cross-browser/Safari/physical-device results are claimed.
- npm reports the existing ESLint 9 line as deprecated. It remains the repository's configured lint tool and all checks pass; dependency modernization can be reviewed separately.
- Vercel production behavior must be verified after deployment. Local checks do not claim that unmerged code is already live.

## Files and components changed

- Design and UI: `src/styles.css`, `src/pages/Home.jsx`, `src/pages/Project.jsx`, `src/components/Layout.jsx`, `UI.jsx`, `PageMotion.jsx`, `src/App.jsx`, `src/main.jsx`; removed `src/redesign.css`.
- Content/SEO: `src/data/profile.js`, `src/data/projects.js`, new `src/data/seo.js`, `index.html`, `scripts/prerender.mjs`.
- Build/reliability: `vite.config.js`, `vercel.json`, `package.json`, `package-lock.json`.
- QA: `tests/site.test.mjs`, new `tests/interactions.test.mjs`, `tests/TestApp.jsx`, `scripts/check-preview.mjs`, and `qa/` measurements.
- Assets/documentation: compressed portrait/social assets, preserved `artwork-originals/`, `README.md`, `PROJECT-ARTWORK.md`, `AUDIT-V2.md` and this report.

## Review, merge and production verification

1. Review `git diff main...codex/portfolio-v2`, the local preview, this report and the baseline audit. Run the documented clean-install/build/lint/test commands if reviewing on another machine.
2. Push the review branch when ready: `git push -u origin codex/portfolio-v2`. Open a PR into `main`, review its Vercel preview, and merge only after approval.
3. Let the existing GitHub-to-Vercel integration build the approved merge. Keep the project, DNS and production domain unchanged.
4. After Vercel reports a successful deployment, run `node scripts/check-preview.mjs https://nethma.vercel.app` from this built checkout. All 34 checks should pass against the deployed version of the same commit.
5. Open and refresh each of the four nested project URLs, check the mobile menu and keyboard focus, download/open the CV, use copy-email, inspect console errors, and confirm a random unknown URL returns HTTP 404.
6. Check `/robots.txt`, `/sitemap.xml`, canonical/social tags and JSON-LD on the live HTML; inspect the sharing preview. Run Lighthouse on the deployed URL and record the real scores/conditions if desired.
