import { m as Motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export function Reveal({children, className = '', delay = 0}) {
  const reduced = useReducedMotion();
  return <Motion.div initial={false} whileInView={reduced ? {} : {y: [12, 0]}} viewport={{once: true, amount: 0.12}} transition={{duration: 0.45, delay, ease: [0.22, 1, 0.36, 1]}} className={className}>{children}</Motion.div>;
}
export function SectionHeading({id, number, label, title, children}) {
  return <Reveal className="section-heading"><div><p className="eyebrow"><span>{number}</span> / {label}</p><h2 id={id}>{title}</h2></div>{children && <p className="section-aside">{children}</p>}</Reveal>;
}
export function Tags({items, label = 'Technologies'}) {return <ul className="tags" aria-label={label}>{items.map(item=><li key={item}>{item}</li>)}</ul>;}
export function ProjectCover({project, compact = false, priority = false}) {
  const actual = project.screenshots[0];
  const visual = actual || project.cover;
  if (!visual) return <div className="typographic-cover"><span className="mono">ACADEMIC PROJECT / {project.number}</span><span>{project.shortTitle}</span></div>;
  return <figure className="project-cover"><img src={visual.src} srcSet={visual.srcSet} sizes={compact ? '(max-width: 800px) calc(100vw - 40px), (max-width: 1440px) 52vw, 720px' : '(max-width: 1440px) 92vw, 1280px'} alt={visual.alt} width={visual.width || 1536} height={visual.height || 1024} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':undefined} decoding="async"/><figcaption>{actual ? actual.caption : 'AI-generated interface concept · Not an application screenshot'}</figcaption></figure>;
}
export function Screenshot({shot}) {
  return <figure className="actual-screenshot"><img src={shot.src} alt={shot.alt} loading="lazy" width={shot.width || 1200} height={shot.height || 750}/><figcaption>{shot.caption}</figcaption></figure>;
}
export function ExternalLink({href, children, ...props}) {return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}<ArrowUpRight size={17} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a>;}
