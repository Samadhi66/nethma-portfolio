import { Link } from 'react-router';
import { ArrowDown, ArrowUpRight, Download, Code2, CheckCheck, ChartNoAxesCombined, Search } from 'lucide-react';
import { profile, expertise, experience, education } from '../data/profile';
import { projects } from '../data/projects';
import { Reveal, SectionHeading, Tags, ProjectCover, ExternalLink } from '../components/UI';

const skillIcons = [Code2, CheckCheck, ChartNoAxesCombined, Search];
function ProjectCard({project, index}) {
  return <Reveal className={`project-row ${index === 0 ? 'project-featured' : ''}`}>
    <Link to={`/projects/${project.slug}`} className="project-visual-link" aria-label={`Read ${project.shortTitle} case study`}>
      <ProjectCover project={project} compact/>
      <span className="project-visual-arrow" aria-hidden="true"><ArrowUpRight size={22}/></span>
    </Link>
    <div className="project-copy">
      <p className="eyebrow"><span>{project.number}</span> / {index === 0 ? 'FEATURED PROJECT' : 'ACADEMIC PROJECT'}</p>
      <p className="project-category">{project.category}</p>
      <h3><Link to={`/projects/${project.slug}`}>{project.shortTitle}</Link></h3>
      <p className="project-summary">{project.summary}</p>
      {index === 0 && <ul className="project-highlights"><li>Transaction workflows & financial dashboards</li><li>Predictive models, receipt & voice entry</li></ul>}
      <Tags items={project.technologies}/>
      <div className="project-actions"><Link className="text-link" to={`/projects/${project.slug}`}>Explore case study<ArrowUpRight size={18} aria-hidden="true"/></Link>
        {project.repository && <ExternalLink className="quiet-link" href={project.repository}>GitHub</ExternalLink>}
      </div>
    </div>
  </Reveal>;
}
export default function Home() {
  return <>
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-overline"><p className="eyebrow"><span className="status-dot"/> SOFTWARE ENGINEERING · WEB · DATA</p><span className="mono hero-index">NETHMA SAMADHI / PORTFOLIO</span></div>
      <div className="intro-layout">
        <Reveal className="intro-content">
          <h1 id="hero-title"><span className="intro-greeting">Hi, I'm</span>{' '}Nethma <span className="text-mint">Samadhi.</span></h1>
          <p className="hero-statement">{profile.subtitle}</p>
          <p className="hero-description">Software Engineering studies completed at ICBT Campus, with graduation pending. Currently working on website content and optimization at eBEYONDS.</p>
          <div className="hero-actions"><Link className="button button-primary" to="/#projects">Explore My Work<ArrowDown size={18} aria-hidden="true"/></Link><a className="button button-outline" href={profile.cv} download>Download CV<Download size={17} aria-hidden="true"/></a><Link className="quiet-link" to="/#contact">Get in Touch<ArrowUpRight size={17} aria-hidden="true"/></Link></div>
        </Reveal>
        <Reveal className="portrait-panel"><figure><img src="/images/nethma-samadhi-hq-1402.webp" srcSet="/images/nethma-samadhi-hq-480.webp 480w, /images/nethma-samadhi-hq-960.webp 960w, /images/nethma-samadhi-hq-1402.webp 1402w" sizes="(max-width: 520px) min(calc(100vw - 54px), 346px), (max-width: 800px) 380px, (min-width: 1520px) 536px, 38vw" alt="Portrait of Nethma Samadhi" width="1402" height="1122" fetchPriority="high"/><figcaption><span className="mono">CURRENTLY AT eBEYONDS</span><strong>Web Content &amp; SEO Assistant</strong><span>December 2025 – Present</span></figcaption></figure><span className="portrait-index" aria-hidden="true">NS — SOFTWARE / WEB / DATA</span></Reveal>
      </div>
      <div className="intro-note"><span className="mono">A CONNECTED PERSPECTIVE</span><p>Building applications. Checking the details.<br/>Understanding the web beyond the interface.</p><Link className="text-link" to="/#about">About me<ArrowUpRight size={18} aria-hidden="true"/></Link></div>
    </section>
    <section id="projects" tabIndex={-1} aria-labelledby="projects-title" className="section container"><SectionHeading id="projects-title" number="01" label="SELECTED PROJECTS" title={<>Ideas into<br/><span className="text-mint">working applications.</span></>}>Academic projects across full-stack development, data management and mobile workflows.</SectionHeading><div className="project-list">{projects.map((project,index)=><ProjectCard project={project} index={index} key={project.slug}/>)}</div></section>
    <section id="experience" tabIndex={-1} aria-labelledby="experience-title" className="section experience-section"><div className="container"><SectionHeading id="experience-title" number="02" label="PROFESSIONAL EXPERIENCE" title={<>The work behind<br/><span className="text-mint">a better website.</span></>}/><div className="experience-layout"><div className="experience-role"><p className="mono"><span className="status-dot"/> DEC 2025 – PRESENT</p><h3>Web Content<br/>&amp; SEO Assistant</h3><p className="company">eBEYONDS PVT</p><p className="role-description">Maintaining content, supporting optimization and working with the tools behind day-to-day website operations.</p></div><ol className="experience-details">{experience.map((item,index)=><li key={item.title}><Reveal className="experience-row"><span className="row-number" aria-hidden="true">0{index+1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></Reveal></li>)}</ol></div></div></section>
    <section id="expertise" tabIndex={-1} aria-labelledby="expertise-title" className="section container"><SectionHeading id="expertise-title" number="03" label="TECHNICAL EXPERTISE" title={<>A practical toolkit.<br/><span className="text-mint">A connected approach.</span></>}>From building features and validating inputs to reporting and website optimization.</SectionHeading><div className="expertise-list">{expertise.map((group,index)=>{const Icon=skillIcons[index];return <Reveal className="expertise-row" key={group.title}><Icon size={25} strokeWidth={1.5} aria-hidden="true"/><div><h3>{group.title}</h3><p>{group.description}</p></div><Tags items={group.skills} label={`${group.title} skills`}/></Reveal>;})}</div></section>
    <section id="about" tabIndex={-1} aria-labelledby="about-title" className="section about-section"><div className="container about-layout"><div className="about-copy"><p className="eyebrow"><span>04</span> / ABOUT &amp; EDUCATION</p><h2 id="about-title">Learning through<br/><span className="text-mint">building.</span></h2><p className="about-lead">I’m a Software Engineering undergraduate interested in how useful digital products come together.</p><p>My academic studies at ICBT Campus are complete, with graduation pending. Through my projects, I’ve worked on interfaces, backend functionality, databases, mobile workflows and applied machine learning.</p><p>My role at eBEYONDS adds another perspective: the content, optimization and daily work behind a website. I’m looking to contribute these experiences in an early-career technology role and continue learning.</p><a className="text-link" href={profile.cv} download>Read my CV<Download size={18} aria-hidden="true"/></a></div><div className="education-list"><p className="mono education-label">EDUCATION &amp; CONTINUOUS LEARNING</p><ol>{education.map((item,index)=><li className={`education-item ${index===0?'degree':''}`} key={item.title}><h3>{item.title}</h3><p>{item.institution}</p>{item.detail&&<span className="degree-note">{item.detail}</span>}</li>)}</ol></div></div></section>
  </>;
}
