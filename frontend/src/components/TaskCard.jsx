import { useState } from 'react';
import { apiPut } from '../services/api';

export default function TaskCard({ task, user, onStatusChange }) {
  const [status, setStatus] = useState(task.status);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);

    const response = await apiPut(`/tasks/${task.id}/status`, {
      status: newStatus,
    });

    if (!response.error && onStatusChange) {
      onStatusChange(response);
    }
  };

  return (
    <article className="task-card glass-card">
      <div className="task-card-title">
        <h4>{task.title}</h4>

        <span className={`status-pill status-${status.toLowerCase()}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      <p>{task.description || 'No task description available.'}</p>

      <div className="task-card-meta">
        <small>
          Project: {task.project?.name || 'Unknown'}
        </small>

        <small>
          Assignee: {task.assignee?.name || 'Unassigned'}
        </small>
      </div>

      {task.dueDate && (
        <p className="due-date">
          Due {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {(user?.role === 'ADMIN' ||
        user?.id === task.assigneeId) && (
        <select
          value={status}
          onChange={(e) =>
            handleStatusChange(e.target.value)
          }
          className="status-select"
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      )}
    </article>
  );
}