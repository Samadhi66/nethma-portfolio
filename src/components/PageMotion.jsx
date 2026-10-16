import { useEffect, useRef } from 'react';
import { motion as Motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 35 });
  return <Motion.div aria-hidden="true" className="scroll-progress" style={{scaleX: reduced ? scrollYProgress : smoothProgress}}/>;
}

// Animate only after mounting, keeping server-rendered content visible and accessible.
export function PageEntrance({children}) {
  const {pathname} = useLocation();
  const reduced = useReducedMotion();
  const ref = useRef(null);
  useEffect(() => {
    if (reduced || !ref.current?.animate) return;
    const animation = ref.current.animate([{opacity: 0.45, transform: 'translateY(14px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 500, easing: 'cubic-bezier(.22,1,.36,1)'});
    return () => animation.cancel();
  }, [pathname, reduced]);
  return <div ref={ref} className="page-entrance">{children}</div>;
}
