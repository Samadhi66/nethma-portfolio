# Black & White portfolio — implementation and QA

Date: 16 October 2026. Baseline: local commit `82a6011`. Changes are left **uncommitted** on the existing `codex/portfolio-v2` branch for review in GitHub Desktop. No GitHub push, remote write or deployment was performed. The production domain remains https://nethma.vercel.app/.

## Design and content

- Replaced the green theme with white/off-white editorial surfaces, black type, neutral gray secondary text and a black contact/footer section. Every literal CSS color is tested to be neutral grayscale.
- Rebuilt hero proportions around oversized Manrope typography, a smaller grayscale version of the existing portrait, crisp rectangular buttons and restrained technical labels.
- Refined sticky navigation, underline states, keyboard focus rings, the mobile menu, timeline, grouped expertise, education, case-study surfaces and responsive spacing.
- Removed all artificial project interface images from the site and published assets. The eight WebPs are preserved under `artwork-originals/interface-concepts/`. Existing screenshots arrays are empty; authentic project screenshots were not supplied. Public repository inspection found no usable screenshot assets; Cleaner-App’s tree API returned 409, so no source screenshot could be retrieved there. No application UI was invented.
- Added code-native typographic project covers with real project names and technologies. The shared cover component will use a real screenshot if one is supplied later.
- Preserved personal facts, experience, skills, project descriptions, verified links and the exact downloadable CV. `src/data/profile.js`, `vercel.json`, `vite.config.js`, package dependencies and the PDF are unchanged.
- Updated favicon/theme metadata and the Open Graph/Twitter image. The social PNG is an actual browser capture of the monochrome portfolio homepage. It is not an artificial application screenshot.

## Actual checks

| Check | Result |
| --- | --- |
| `npm run build` | Passed; six HTML pages prerendered, robots.txt and sitemap.xml generated |
| `npm run lint` | Passed |
| `npm test` | **22 passed, 0 failed, 0 skipped** |
| `node scripts/check-preview.mjs http://127.0.0.1:4173` | **26 HTTP checks passed** |
| Responsive browser checks | **30 page/viewport combinations passed** |
| Final `git diff --check` | Passed |

Browser widths: **320, 375, 768, 1440, 1920px**. At every width the homepage, all four project routes and a missing page were loaded and measured. The final record is `qa/monochrome-responsive-results.json`. No horizontal overflow, tracked text overflow, loaded broken images or artificial project image references remained.

An actual 320px defect was found: a cover’s minimum height/aspect ratio enlarged the grid’s intrinsic minimum width. It was corrected using zero-minimum grid tracks and child widths. All 30 combinations were repeated successfully after the fix.

Interaction tests cover project cards, case routes, return/global navigation, mobile menu focus and Escape behavior, clipboard success and denial feedback, malformed/repeated fragments, error recovery and 404 behavior. Browser checks additionally exercise mobile Enter/Escape and focus restoration, case-study refresh, desktop/global navigation, browser history and copy-email feedback. All emitted internal anchors/assets and preserved external-link security attributes are checked by tests.

HTTP checks cover all five public pages, canonical metadata, responsive portrait images, favicon, social image, fonts, the PDF signature/content type, sitemap/robots and two true HTTP 404 responses. The GitHub profile and all three project links were checked directly and returned HTTP 200. LinkedIn returned HTTP 999 to automated validation; its CV-verified URL is preserved.

## Accessibility

- Axe DOM checks run across the homepage, four cases and 404 with WCAG A/AA tags. Enabled rules reported no violations. jsdom cannot measure rendered contrast, so that axe rule is disabled.
- Separate numeric tests verify text/secondary text/focus colors against all light and dark surfaces at **4.5:1 or better**, plus primary button contrast. Decorative gray borders are not treated as body text.
- Semantic headings/landmarks, descriptive alternatives, 44px or larger principal controls, visible focus, live clipboard feedback, reduced-motion CSS and Motion preferences are retained.
- Reduced-motion behavior is exercised through the existing mocked-preference interaction suite. No screen-reader session, native OS preference toggle, physical-device or cross-browser certification is claimed.

## Measured performance

Final Vite output: **391.68 KB JavaScript (125.98 KB gzip)** and **24.48 KB CSS (5.72 KB gzip)**. The entire published output is **881,427 bytes across 25 files**, approximately 0.88 MB, compared with approximately 1.40 MB for the prior build. This is total build output, not the initial network transfer.

Removing unused project preview bitmaps eliminates 515,978 bytes of published image files. Responsive portrait WebPs, lazy loading, lighter Motion features and self-hosted fonts remain. No dependencies were added. Lighthouse and field Core Web Vitals were not measured; no scores are claimed.

## Review locally

The production-build preview is available at http://127.0.0.1:4173/. To restart it:

```powershell
npm run build
npm run preview -- --port 4173
```

Use GitHub Desktop to review the uncommitted changes on `codex/portfolio-v2`, including asset moves. Commit/push them yourself when ready. The existing Vercel configuration and domain are retained.

## Remaining limitations

- Authentic application screenshots and unprovided project demos/results remain unavailable. The design intentionally uses typography rather than artificial implementation screenshots.
- LinkedIn blocks automated profile inspection (HTTP 999).
- A configured external mail client was not launched; the mailto destination is checked and clipboard success/failure is tested.
- Lighthouse, field performance, native browser zoom, screen-reader and physical-device checks were not executed.
- Production hosting behavior after a future deployment is not implied by these local checks.
