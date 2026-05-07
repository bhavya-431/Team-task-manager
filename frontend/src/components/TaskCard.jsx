export default function TaskCard({ task }) {
  return (
    <article className="task-card glass-card">
      <div className="task-card-title">
        <h4>{task.title}</h4>
        <span className={`status-pill status-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
      </div>
      <p>{task.description || 'No task description available.'}</p>
      <div className="task-card-meta">
        <small>Project: {task.project?.name || 'Unknown'}</small>
        <small>Assignee: {task.assignee?.name || 'Unassigned'}</small>
      </div>
      {task.dueDate && <p className="due-date">Due {new Date(task.dueDate).toLocaleDateString()}</p>}
    </article>
  );
}
