// import { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { apiGet, apiPost } from '../services/api';
// import TaskCard from '../components/TaskCard';
// import Modal from '../components/Modal';
// import Input from '../components/Input';
// import Button from '../components/Button';

// export default function ProjectDetails({ user, onLogout }) {
//   const { id } = useParams();
//   const [project, setProject] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [formError, setFormError] = useState('');
//   const [showTaskModal, setShowTaskModal] = useState(false);
//   const [taskTitle, setTaskTitle] = useState('');
//   const [taskDescription, setTaskDescription] = useState('');
//   const [taskAssigneeId, setTaskAssigneeId] = useState('');
//   const [taskDueDate, setTaskDueDate] = useState('');

//   useEffect(() => {
//     const loadProject = async () => {
//       setLoading(true);
//       setError('');
//       const response = await apiGet(`/projects/${id}`);
//       if (response.error) {
//         setError(response.error);
//       } else {
//         setProject(response);
//       }
//       setLoading(false);
//     };

//     loadProject();
//   }, [id]);

//   useEffect(() => {
//     if (user.role !== 'ADMIN') return;

//     const loadUsers = async () => {
//       const response = await apiGet('/users');
//       if (!response.error) {
//         setUsers(response);
//       }
//     };

//     loadUsers();
//   }, [user.role]);

//   const resetTaskForm = () => {
//     setTaskTitle('');
//     setTaskDescription('');
//     setTaskAssigneeId('');
//     setTaskDueDate('');
//     setFormError('');
//   };

//   const handleCreateTask = async (event) => {
//     event.preventDefault();
//     setFormError('');

//     if (!taskTitle.trim()) {
//       setFormError('Task title is required.');
//       return;
//     }

//     const response = await apiPost('/tasks', {
//       title: taskTitle,
//       description: taskDescription,
//       projectId: id,
//       assigneeId: taskAssigneeId || undefined,
//       dueDate: taskDueDate || undefined,
//     });

//     if (response.error) {
//       setFormError(response.error);
//       return;
//     }

//     setProject({ ...project, tasks: [response, ...project.tasks] });
//     setShowTaskModal(false);
//     resetTaskForm();
//   };

//   if (loading) return <main className="shell-card"><p>Loading project...</p></main>;
//   if (error) return <main className="shell-card"><p className="form-error">{error}</p></main>;
//   if (!project) return null;

//   return (
//     <main className="project-details-page shell-card">
//       <header className="dashboard-header">
//         <div>
//           <p className="eyebrow">Project overview</p>
//           <h1>{project.name}</h1>
//           <p>{project.description || 'No description provided.'}</p>
//           <p className="summary">Owner: {project.owner.name}</p>
//         </div>
//         <div className="header-actions">
//           <Link className="ghost-button" to="/dashboard">Back</Link>
//           {user.role === 'ADMIN' && (
//             <Button variant="secondary" onClick={() => setShowTaskModal(true)}>Add task</Button>
//           )}
//           <Button variant="ghost" onClick={onLogout}>Logout</Button>
//         </div>
//       </header>
//       <section className="panel">
//         <h2>Tasks</h2>
//         <div className="card-list">
//           {project.tasks.length ? project.tasks.map((task) => <TaskCard key={task.id} task={task} />) : <p>No tasks added yet.</p>}
//         </div>
//       </section>

//       <Modal title="Add task to project" open={showTaskModal} onClose={() => setShowTaskModal(false)}>
//         <form onSubmit={handleCreateTask}>
//           <Input label="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
//           <Input label="Description" as="textarea" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
//           <label className="field-label">
//             Assignee
//             <select value={taskAssigneeId} onChange={(e) => setTaskAssigneeId(e.target.value)}>
//               <option value="">Unassigned</option>
//               {users.map((userItem) => (
//                 <option key={userItem.id} value={userItem.id}>
//                   {userItem.name} ({userItem.role.toLowerCase()})
//                 </option>
//               ))}
//             </select>
//           </label>
//           <Input label="Due date" type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
//           {formError && <div className="form-error">{formError}</div>}
//           <div className="modal-actions">
//             <Button variant="secondary" type="button" onClick={() => setShowTaskModal(false)}>Cancel</Button>
//             <Button variant="primary" type="submit">Create task</Button>
//           </div>
//         </form>
//       </Modal>
//     </main>
//   );
// }

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

export default function ProjectDetails({ user, onLogout }) {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const [showTaskModal, setShowTaskModal] = useState(false);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskStatus, setTaskStatus] = useState('PENDING');

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      setError('');

      const response = await apiGet(`/projects/${id}`);

      if (response.error) {
        setError(response.error);
      } else {
        setProject(response);
      }

      setLoading(false);
    };

    loadProject();
  }, [id]);

  useEffect(() => {
    if (user.role !== 'ADMIN') return;

    const loadUsers = async () => {
      const response = await apiGet('/users');

      if (!response.error) {
        setUsers(response);
      }
    };

    loadUsers();
  }, [user.role]);

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskAssigneeId('');
    setTaskDueDate('');
    setTaskStatus('PENDING');
    setFormError('');
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    setFormError('');

    if (!taskTitle.trim()) {
      setFormError('Task title is required.');
      return;
    }

    const response = await apiPost('/tasks', {
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      projectId: id,
      assigneeId: taskAssigneeId || undefined,
      dueDate: taskDueDate || undefined,
      status: taskStatus,
    });

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setProject({
      ...project,
      tasks: [response, ...project.tasks],
    });

    setShowTaskModal(false);
    resetTaskForm();
  };

  if (loading) {
    return (
      <main className="shell-card">
        <p>Loading project...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shell-card">
        <p className="form-error">{error}</p>
      </main>
    );
  }

  if (!project) return null;

  return (
    <main className="project-details-page shell-card">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Project overview</p>

          <h1>{project.name}</h1>

          <p>
            {project.description || 'No description provided.'}
          </p>

          <p className="summary">
            Owner: {project.owner.name}
          </p>
        </div>

        <div className="header-actions">
          <Link className="ghost-button" to="/dashboard">
            Back
          </Link>

          {user.role === 'ADMIN' && (
            <Button
              variant="secondary"
              onClick={() => setShowTaskModal(true)}
            >
              Add task
            </Button>
          )}

          <Button variant="ghost" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <section className="panel">
        <h2>Tasks</h2>

        <div className="card-list">
          {project.tasks.length ? (
            project.tasks.map((task) => (
              <TaskCard
  key={task.id}
  task={task}
  user={user}
/>
            ))
          ) : (
            <p>No tasks added yet.</p>
          )}
        </div>
      </section>

      <Modal
        title="Add task to project"
        open={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          resetTaskForm();
        }}
      >
        <form onSubmit={handleCreateTask}>
          <Input
            label="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />

          <Input
            label="Description"
            as="textarea"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />

          <label className="field-label">
            Task Status

            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="PENDING">Pending</option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="COMPLETED">
                Completed
              </option>
            </select>
          </label>

          <label className="field-label">
            Assignee

            <select
              value={taskAssigneeId}
              onChange={(e) => setTaskAssigneeId(e.target.value)}
            >
              <option value="">Unassigned</option>

              {users.map((userItem) => (
                <option
                  key={userItem.id}
                  value={userItem.id}
                >
                  {userItem.name} (
                  {userItem.role.toLowerCase()})
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Due date"
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />

          {formError && (
            <div className="form-error">
              {formError}
            </div>
          )}

          <div className="modal-actions">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setShowTaskModal(false);
                resetTaskForm();
              }}
            >
              Cancel
            </Button>

            <Button variant="primary" type="submit">
              Create task
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}