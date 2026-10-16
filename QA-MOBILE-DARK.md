# Mobile navigation and darker theme — 2026-10-16

The current checkout still contained the original header blur handler. It could hide a mobile link before the tap click completed. Removed focus-based dismissal entirely. Touch/mouse opening now keeps focus on the toggle; keyboard opening focuses the first link without scrolling. Selection, the close toggle, outside pointer, Escape, route changes and desktop breakpoint changes dismiss the menu. Download CV also dismisses it. The toggle has a 48px hit area and its icon cannot intercept pointer events.

Darkened the background and surfaces while preserving mint accents. Added menu entry/link stagger, richer section reveals, project image hover zoom, skill icon hover movement and button press feedback. Reduced-motion support is retained. Restored the requested telephone link and original-resolution portrait variants in this checkout.

Validation:

- Production build and ESLint passed.
- 22 automated tests passed, including a regression for touch blur with null, body and main focus destinations; keyboard opening/Escape; outside pointer; all case studies; accessibility; contrast; asset resolution; clipboard success/fallback; phone URL.
- 35 HTTP checks passed on http://127.0.0.1:5174, including responsive images, PDF, direct routes and 404.
- Browser: all five mobile menu destinations selected successfully at 320px, 375px and 768px; each closed the menu and updated the URL. Menu visibility inspected at 375px; Escape verified. FinAI case opened and its return link worked.
- These are browser viewport and simulated touch-event checks. Physical iOS/Android hardware was not available; telephone dialer handoff and native mail apps were not invoked.

Local preview is running at http://127.0.0.1:5174/. No Git commit, push or production deployment was performed.
