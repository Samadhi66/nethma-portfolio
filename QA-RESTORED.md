# Restored theme verification — 2026-10-16

Restored the previous Midnight & Mint theme from local commit `82a6011`, including the portrait, social image and all four project interface concepts with their responsive image variants. Generated project artwork retains its concept disclosure.

Validation after restoration:

- Production build and ESLint: passed.
- Automated tests: 21 passed, 0 failed, including navigation, case studies, mobile menu, clipboard fallback, accessibility, metadata, contrast and local asset resolution.
- Local production preview: 34 HTTP checks passed, including PDF, images, fonts, direct routes and true 404 responses.
- Browser: homepage and all four case pages checked at 320, 375, 768, 1440 and 1920 pixels; no horizontal overflow or broken completed images.
- All five homepage images loaded successfully. Mobile menu keyboard opening, Escape focus recovery, Contact navigation and email copying verified in the browser.
- Browser console: no errors observed.

Preview: http://127.0.0.1:4173/#projects

No commit or push was performed for this restoration. The older QA-MONOCHROME.md and qa/monochrome-responsive-results.json describe the superseded design. Monochrome artwork is archived outside public/.
