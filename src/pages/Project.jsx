import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { projects } from '../data/projects';
import { Reveal, Tags, Screenshot, ProjectCover, ExternalLink } from '../components/UI';

export function NotFound() {return <section className="container not-found"><p className="eyebrow">404 / PAGE NOT FOUND</p><h1>This page isn’t here.</h1><p>Explore the portfolio to find the current projects and experience.</p><Link className="button button-primary" to="/">Back to portfolio<ArrowLeft size={18} aria-hidden="true"/></Link></section>;}
function CaseSection({id, number, label, title, children}) {
  return <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`}><p className="eyebrow">{number} / {label}</p><h2 id={`${id}-title`}>{title}</h2>{children}</section>;
}
export default function Project() {
  const {slug} = useParams();
  const project = projects.find(item=>item.slug===slug);
  if (!project) return <NotFound/>;
  const next = projects[(projects.indexOf(project)+1)%projects.length];
  return <>
    <section className="case-hero container" aria-labelledby="case-title">
      <Link className="back-link" to="/#projects"><ArrowLeft size={17} aria-hidden="true"/>All projects</Link>
      <Reveal><p className="eyebrow">PROJECT {project.number} / ACADEMIC WORK</p><h1 id="case-title">{project.title}</h1><p className="case-summary">{project.summary}</p><div className="case-links">{project.repository&&<ExternalLink className="button button-outline" href={project.repository}>View source on GitHub</ExternalLink>}{project.demo&&<ExternalLink className="text-link" href={project.demo}>View live demo</ExternalLink>}</div></Reveal>
      <dl className="case-meta"><div><dt>CONTEXT</dt><dd>Academic project</dd></div><div><dt>FOCUS</dt><dd>{project.category}</dd></div><div><dt>TECHNOLOGIES</dt><dd><Tags items={project.technologies}/></dd></div></dl>
      <ProjectCover project={project} priority/>
    </section>
    <div className="case-body container">
      <aside className="case-sidebar"><p className="mono">IN THIS CASE STUDY</p><nav aria-label="Case study sections">{[['overview','01 Overview'],['problem','02 The problem'],['features','03 Features'],['architecture','04 Architecture'],['contributions','05 My contribution'],['testing','06 Validation'],...(project.screenshots.length?[['screenshots','07 Screenshots']]:[])].map(([id,label])=><Link key={id} to={`#${id}`}>{label}</Link>)}</nav></aside>
      <div className="case-content">
        <CaseSection id="overview" number="01" label="OVERVIEW" title="What the project does."><p>{project.overview}</p></CaseSection>
        <CaseSection id="problem" number="02" label="THE PROBLEM" title="The workflow it addresses."><p>{project.problem}</p></CaseSection>
        <CaseSection id="features" number="03" label="FEATURES & SOLUTION" title="Inside the application."><div className="feature-list">{project.features.map((feature,index)=><Reveal key={feature.title} className="case-feature"><span className="row-number" aria-hidden="true">0{index+1}</span><div><h3>{feature.title}</h3><p>{feature.text}</p></div></Reveal>)}</div></CaseSection>
        <CaseSection id="architecture" number="04" label={project.slug==='cleaning-service'?'WORKFLOW OVERVIEW':'ARCHITECTURE'} title="How the pieces connect."><ol className="architecture-flow">{project.architecture.map((step,index)=><li key={step.title}><span className="mono">0{index+1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol><p className="architecture-note">{project.architectureNote}</p></CaseSection>
        <CaseSection id="contributions" number="05" label="MY CONTRIBUTION" title="The work I contributed."><ul className="contribution-list">{project.contributions.map(item=><li key={item}><ArrowUpRight size={18} aria-hidden="true"/><span>{item}</span></li>)}</ul></CaseSection>
        <CaseSection id="testing" number="06" label="TESTING & VALIDATION" title="Checking the details.">{project.testing.length>0&&<ul className="contribution-list">{project.testing.map(item=><li key={item}><Check size={18} aria-hidden="true"/><span>{item}</span></li>)}</ul>}<p className="evidence-note">{project.evidenceNote}</p></CaseSection>
        {project.screenshots.length>0&&<CaseSection id="screenshots" number="07" label="PROJECT SCREENSHOTS" title="A closer look."><div className="case-screenshots">{project.screenshots.map(shot=><Screenshot key={shot.src} shot={shot}/>)}</div></CaseSection>}
      </div>
    </div>
    <section className="next-project container" aria-label="Next project"><p className="eyebrow">CONTINUE EXPLORING</p><Link to={`/projects/${next.slug}`}><span><span className="mono">NEXT PROJECT / {next.number}</span><strong>{next.shortTitle}</strong></span><ArrowRight size={32} aria-hidden="true"/></Link></section>
  </>;
}
