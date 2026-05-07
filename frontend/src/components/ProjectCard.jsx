import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <article className="project-card glass-card">
      <div className="project-card-header">
        <h3>{project.name}</h3>
        <span className={`status-pill status-${project.tasks.length ? 'active' : 'empty'}`}>
          {project.tasks.length} tasks
        </span>
      </div>
      <p>{project.description || 'No project description yet.'}</p>
      <div className="project-card-meta">
        <small>Owner: {project.owner.name}</small>
      </div>
      <Link className="secondary-button" to={`/project/${project.id}`}>View details</Link>
    </article>
  );
}
