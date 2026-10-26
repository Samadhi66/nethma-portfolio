import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, Code2, ChartNoAxesCombined, Search, CheckCheck, MapPin, BriefcaseBusiness, GraduationCap, Layers3 } from 'lucide-react';
import { expertise, experience, education } from '../data/profile';
import { projects } from '../data/projects';
import { Reveal, SectionHeading, Tags, ProjectCover, ExternalLink } from '../components/UI';
const skillIcons = [Code2, CheckCheck, ChartNoAxesCombined, Search];

function ProjectCard({ project, index }) {
  return <Reveal className="project-row" delay={index % 2 * .08}>
    <Link to={`/projects/${project.slug}`} className="project-visual-link" aria-label={`Read ${project.shortTitle} case study`}>
      <ProjectCover project={project} compact/>
      <span className="project-card-badge">{index === 0 ? 'FEATURED PROJECT' : 'ACADEMIC PROJECT'}</span>
      <span className="project-visual-arrow" aria-hidden="true"><ArrowUpRight size={20}/></span>
    </Link>
    <div className="project-copy">
      <p className="project-category">{project.category}</p>
      <h3><Link to={`/projects/${project.slug}`}>{project.shortTitle}</Link></h3>
      <p className="project-summary">{project.summary}</p>
      <Tags items={project.technologies}/>
    </div>
    <div className="project-actions">
      <Link className="text-link" to={`/projects/${project.slug}`}>Explore case study<ArrowUpRight size={16} aria-hidden="true"/></Link>
      {project.repository && <ExternalLink className="quiet-link" href={project.repository}>GitHub</ExternalLink>}
    </div>
  </Reveal>;
}


export function ProjectsPage() {
  const [projectFilter, setProjectFilter] = useState('all');
  const visibleProjects = projects.filter(project => projectFilter === 'all' || (projectFilter === 'mobile' ? /cleaning/i.test(project.slug) : !/cleaning/i.test(project.slug)));
  return (<section id="projects" tabIndex={-1} aria-labelledby="projects-title" className="section page-section container">
      <SectionHeading level={1} id="projects-title" number="01" label="SELECTED WORK" title={<>Featured <span className="text-mint">Projects</span></>}>Academic projects across full-stack development, data management and mobile workflows.</SectionHeading>
      <div className="filter-tabs" role="group" aria-label="Filter projects">{[['all','All projects'],['web','Web & data'],['mobile','Mobile']].map(([key,label])=><button key={key} type="button" aria-pressed={projectFilter===key} onClick={()=>setProjectFilter(key)}>{label}</button>)}</div>
      <div className="project-list">{visibleProjects.map(project=><ProjectCard project={project} index={projects.indexOf(project)} key={project.slug}/>)}</div>
    </section>);
}
export function ExperiencePage() { return (<section id="experience" tabIndex={-1} aria-labelledby="experience-title" className="section page-section experience-section"><div className="container">
      <SectionHeading level={1} id="experience-title" number="02" label="MY JOURNEY" title={<>Professional <span className="text-mint">Experience</span></>}>The content, optimization and everyday operations behind a better website.</SectionHeading>
      <div className="experience-layout">
        <Reveal className="experience-role"><span className="role-icon"><BriefcaseBusiness size={28} aria-hidden="true"/></span><p className="mono"><span className="status-dot"/> DEC 2025 – PRESENT</p><h3>Web Content<br/>&amp; SEO Assistant</h3><p className="company">eBEYONDS PVT</p><p className="role-description">Maintaining content, supporting optimization and working with the tools behind day-to-day website operations.</p></Reveal>
        <ol className="experience-details">{experience.map((item,index)=><li key={item.title}><Reveal className="experience-row"><span className="row-number" aria-hidden="true">0{index+1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></Reveal></li>)}</ol>
      </div>
    </div></section>); }
export function ExpertisePage() {
  const [skillFilter, setSkillFilter] = useState('all');
  return (<section id="expertise" tabIndex={-1} aria-labelledby="expertise-title" className="section page-section container">
      <SectionHeading level={1} id="expertise-title" number="03" label="CORE COMPETENCIES" title={<>Technical <span className="text-mint">Skills</span></>}>A practical toolkit across development, software validation, data and website optimization.</SectionHeading>
      <div className="filter-tabs" role="group" aria-label="Filter skill categories"><button type="button" aria-pressed={skillFilter==='all'} onClick={()=>setSkillFilter('all')}>All skills</button>{expertise.map((group,index)=><button type="button" key={group.title} aria-pressed={skillFilter===index} onClick={()=>setSkillFilter(index)}>{group.title}</button>)}</div>
      <div className="expertise-list">{expertise.map((group,index)=>{const Icon=skillIcons[index];return (skillFilter==='all'||skillFilter===index)&&<div className="skill-group" key={group.title}><div className="skill-group-heading"><Icon size={23} aria-hidden="true"/><h3>{group.title}</h3><span className="mono">{group.skills.length} skills</span></div><p className="skill-description">{group.description}</p><div className="skill-grid">{group.skills.map((skill,i)=><Reveal className="skill-card" key={skill} delay={i%5*.025}><span className="skill-monogram" aria-hidden="true">{skill.replace(/[^a-z0-9]/gi,'').slice(0,2).toUpperCase()}</span><Icon size={15} aria-hidden="true"/><h4>{skill}</h4><p>{group.title}</p><span className="skill-card-line" aria-hidden="true"/></Reveal>)}</div></div>;})}</div>
    </section>);
}
export function AboutPage() { return (<section id="about" tabIndex={-1} aria-labelledby="about-title" className="section page-section about-section"><div className="container">
      <SectionHeading level={1} id="about-title" number="04" label="PERSONAL PROFILE" title={<>About <span className="text-mint">Me</span></>}/>
      <Reveal className="about-profile"><div className="about-profile-heading"><span className="role-icon"><Layers3 size={26} aria-hidden="true"/></span><div><h3>Who I Am</h3><p className="mono">SOFTWARE ENGINEERING · ICBT CAMPUS</p></div></div><div className="about-copy"><p className="about-lead">I’m a Software Engineering undergraduate interested in how useful digital products come together.</p><p>My academic studies at ICBT Campus are complete, with graduation pending. Through my projects, I’ve worked on interfaces, backend functionality, databases, mobile workflows and applied machine learning.</p><p>My role at eBEYONDS adds another perspective: the content, optimization and daily work behind a website. I’m looking to contribute these experiences in an early-career technology role and continue learning.</p></div><div className="about-facts"><span><GraduationCap size={18} aria-hidden="true"/>ICBT Campus</span><span><BriefcaseBusiness size={18} aria-hidden="true"/>eBEYONDS</span><span><MapPin size={18} aria-hidden="true"/>Sri Lanka</span><Link to="/contact">Let’s connect<ArrowUpRight size={16} aria-hidden="true"/></Link></div></Reveal>
      <div className="education-list"><div className="education-heading"><p className="eyebrow">ACADEMIC TIMELINE</p><h3>Education &amp; <span className="text-mint">Continuous Learning</span></h3></div><ol>{education.map(item=><li className="education-item" key={item.title}><span className="education-icon"><GraduationCap size={20} aria-hidden="true"/></span><Reveal><h3>{item.title}</h3><p>{item.institution}</p>{item.detail&&<span className="degree-note">{item.detail}</span>}</Reveal></li>)}</ol></div>
    </div></section>); }
