import { profile } from './profile.js';
import { projects } from './projects.js';

export const siteUrl = 'https://nethma.vercel.app';
export const socialImage = `${siteUrl}/images/nethma-samadhi-social.jpg`;

export function pageMetadata(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const project = projects.find(item => path === `/projects/${item.slug}`);
  const found = path === '/' || Boolean(project);
  return {
    path, found,
    title: project ? `${project.shortTitle} | Nethma Samadhi` : found ? 'Nethma Samadhi | Software Engineering, Web & Data' : 'Page not found | Nethma Samadhi',
    description: project?.summary || 'Meet Nethma Samadhi, a Software Engineering undergraduate with hands-on full-stack, QA and data projects, and Web Content & SEO experience at eBEYONDS.',
    canonical: `${siteUrl}${path === '/' ? '/' : path}`,
    robots: found ? 'index, follow' : 'noindex, follow',
    schema: found ? project ? {
      '@context': 'https://schema.org', '@type': 'CreativeWork',
      name: project.title, description: project.summary, url: `${siteUrl}${path}`,
      creator: { '@type': 'Person', name: profile.name, url: `${siteUrl}/` },
      keywords: project.technologies.join(', '),
      ...(project.repository ? { sameAs: project.repository } : {}),
    } : {
      '@context': 'https://schema.org', '@type': 'Person',
      name: profile.name, url: `${siteUrl}/`, image: socialImage,
      description: 'Software Engineering undergraduate at ICBT Campus. Academic studies completed; graduation pending.',
      email: `mailto:${profile.email}`, sameAs: Object.values(profile.social),
      worksFor: { '@type': 'Organization', name: 'eBEYONDS PVT' },
    } : null,
  };
}
