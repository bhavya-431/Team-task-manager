import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Dashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      const projectResult = await apiGet('/projects');
      const taskResult = await apiGet('/tasks');
      const userResult = user.role === 'ADMIN' ? await apiGet('/users') : [];

      if (projectResult.error || taskResult.error || (user.role === 'ADMIN' && userResult.error)) {
        setError(projectResult.error || taskResult.error || userResult.error || 'Unable to load dashboard');
      } else {
        setProjects(projectResult);
        setTasks(taskResult);
        if (user.role === 'ADMIN') {
          setUsers(userResult || []);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [user.role]);

  const resetProjectForm = () => {
    setProjectName('');
    setProjectDescription('');
    setFormError('');
  };

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskProjectId('');
    setTaskAssigneeId('');
    setTaskDueDate('');
    setFormError('');
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!projectName.trim()) {
      setFormError('Project name is required.');
      return;
    }

    const response = await apiPost('/projects', {
      name: projectName,
      description: projectDescription,
    });

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setProjects([response, ...projects]);
    setShowProjectModal(false);
    resetProjectForm();
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!taskTitle.trim() || !taskProjectId) {
      setFormError('Task title and project selection are required.');
      return;
    }

    const response = await apiPost('/tasks', {
      title: taskTitle,
      description: taskDescription,
      projectId: taskProjectId,
      assigneeId: taskAssigneeId || undefined,
      dueDate: taskDueDate || undefined,
    });

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setTasks([response, ...tasks]);
    setShowTaskModal(false);
    resetTaskForm();
  };

  return (
    <main className="dashboard-page shell-card">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{user.name}'s team workspace</h1>
          <p className="summary">Role: {user.role}</p>
        </div>
        <div className="header-actions">
          {user.role === 'ADMIN' && (
            <>
              <Button variant="secondary" onClick={() => setShowProjectModal(true)}>New project</Button>
              <Button variant="secondary" onClick={() => setShowTaskModal(true)}>New task</Button>
            </>
          )}
          <Button variant="ghost" onClick={onLogout}>Logout</Button>
        </div>
      </header>

      {loading && <p>Loading your projects and tasks...</p>}
      {error && <p className="form-error">{error}</p>}

      <section className="dashboard-grid">
        <div className="panel">
          <h2>Projects</h2>
          <div className="card-grid">
            {projects.length ? projects.map((project) => <ProjectCard key={project.id} project={project} />) : <p>No projects yet.</p>}
          </div>
        </div>

        <div className="panel">
          <h2>Tasks</h2>
          <div className="card-list">
            {tasks.length ? tasks.map((task) => <TaskCard key={task.id} task={task} />) : <p>No tasks assigned.</p>}
          </div>
        </div>
      </section>

      <Modal title="Create new project" open={showProjectModal} onClose={() => setShowProjectModal(false)}>
        <form onSubmit={handleCreateProject}>
          <Input label="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
          <Input label="Description" as="textarea" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
          {formError && <div className="form-error">{formError}</div>}
          <div className="modal-actions">
            <Button variant="secondary" type="button" onClick={() => setShowProjectModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create project</Button>
          </div>
        </form>
      </Modal>

      <Modal title="Create new task" open={showTaskModal} onClose={() => setShowTaskModal(false)}>
        <form onSubmit={handleCreateTask}>
          <Input label="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
          <Input label="Description" as="textarea" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
          <label className="field-label">
            Project
            <select value={taskProjectId} onChange={(e) => setTaskProjectId(e.target.value)} required>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Assignee
            <select value={taskAssigneeId} onChange={(e) => setTaskAssigneeId(e.target.value)}>
              <option value="">Unassigned</option>
              {users.map((userItem) => (
                <option key={userItem.id} value={userItem.id}>
                  {userItem.name} ({userItem.role.toLowerCase()})
                </option>
              ))}
            </select>
          </label>
          <Input label="Due date" type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
          {formError && <div className="form-error">{formError}</div>}
          <div className="modal-actions">
            <Button variant="secondary" type="button" onClick={() => setShowTaskModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create task</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
