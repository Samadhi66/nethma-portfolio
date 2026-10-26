import { useEffect, useRef } from 'react';

export default function AnimatedCursor() {
  const layer = useRef(null);
  const dot = useRef(null);
  const trail = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forcedColors = window.matchMedia('(forced-colors: active)');
    const root = document.documentElement;
    const cursor = layer.current;
    let frame = 0;
    let visible = false;
    let targetX = 0, targetY = 0, ringX = 0, ringY = 0, previousTime = 0;
    const position = (element, x, y) => { element.style.transform = `translate3d(${x}px, ${y}px, 0)`; };

    const hide = () => {
      visible = false;
      cursor.dataset.visible = 'false';
      cursor.dataset.pressed = 'false';
      root.classList.remove('cursor-enhanced');
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const animate = time => {
      if (!visible) return;
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16.67;
      previousTime = time;
      const ease = 1 - Math.exp(-elapsed / 65);
      ringX += (targetX - ringX) * ease;
      ringY += (targetY - ringY) * ease;
      position(trail.current, ringX, ringY);
      if (Math.abs(targetX - ringX) + Math.abs(targetY - ringY) > .1) frame = requestAnimationFrame(animate);
      else { frame = 0; previousTime = 0; }
    };
    const move = event => {
      if (!finePointer.matches || reducedMotion.matches || forcedColors.matches || event.pointerType !== 'mouse') { hide(); return; }
      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) { hide(); return; }
      targetX = event.clientX;
      targetY = event.clientY;
      position(dot.current, targetX, targetY);
      if (!visible) {
        ringX = targetX; ringY = targetY; previousTime = 0;
        position(trail.current, ringX, ringY);
        visible = true;
        cursor.dataset.visible = 'true';
        root.classList.add('cursor-enhanced');
      }
      cursor.dataset.hover = String(Boolean(element?.closest('a, button, [role="button"], summary, label')));
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const leave = event => { if (!event.relatedTarget) hide(); };
    const down = event => { if (event.pointerType !== 'mouse') hide(); else if (visible) cursor.dataset.pressed = 'true'; };
    const up = () => { cursor.dataset.pressed = 'false'; };
    const key = event => { if (event.key === 'Tab' || event.key === 'Escape') hide(); };
    const visibility = () => { if (document.hidden) hide(); };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerout', leave, { passive: true });
    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('pointercancel', hide, { passive: true });
    document.addEventListener('keydown', key);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', hide);
    finePointer.addEventListener('change', hide);
    reducedMotion.addEventListener('change', hide);
    forcedColors.addEventListener('change', hide);
    return () => {
      hide();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', leave);
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', hide);
      document.removeEventListener('keydown', key);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', hide);
      finePointer.removeEventListener('change', hide);
      reducedMotion.removeEventListener('change', hide);
      forcedColors.removeEventListener('change', hide);
    };
  }, []);

  return <div ref={layer} className="cursor-layer" aria-hidden="true" data-visible="false"><span ref={dot} className="cursor-dot"/><span ref={trail} className="cursor-trail"><span className="cursor-ring"/></span></div>;
}
