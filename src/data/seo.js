import { profile } from './profile.js';
import { projects } from './projects.js';
import { pages } from './pages.js';

export const siteUrl = 'https://nethma.vercel.app';
export const socialImage = `${siteUrl}/images/nethma-samadhi-social.jpg`;

export function pageMetadata(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const project = projects.find(item => path === `/projects/${item.slug}`);
  const page = pages.find(item => item.path === path);
  const found = Boolean(page || project);
  return {
    path, found,
    title: project ? `${project.shortTitle} | Nethma Samadhi` : page?.title || 'Page not found | Nethma Samadhi',
    description: project?.summary || page?.description || 'This page could not be found. Return to Nethma Samadhi’s portfolio.',
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
