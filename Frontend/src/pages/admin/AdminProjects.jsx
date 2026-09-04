import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Image from '../../components/ui/Image';
import { supabase } from '../../lib/supabase';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => { loadProjects(); }, []);

  async function handleTogglePublish(project) {
    await supabase
      .from('projects')
      .update({ published: !project.published })
      .eq('id', project.id);
    loadProjects();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('projects').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    loadProjects();
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Projects</h1>
        <Link to="/admin/projects/new" className="admin-btn admin-btn--primary">
          + New Project
        </Link>
      </div>

      {loading ? (
        <div className="admin-empty">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="admin-empty">No projects yet. Create your first project.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="admin-table__cell-thumb">
                  <Image
                    src={p.cover_image}
                    alt={p.name}
                    className="admin-table__thumb"
                    wrapperClassName="admin-table__thumb-wrap"
                    fallbackText=""
                    showFallbackIcon={false}
                  />
                </td>
                <td className="admin-table__cell-name">{p.name}</td>
                <td className="admin-table__cell-status">
                  <button
                    className={`admin-badge ${p.published ? 'admin-badge--published' : 'admin-badge--draft'}`}
                    onClick={() => handleTogglePublish(p)}
                    title={p.published ? 'Click to unpublish' : 'Click to publish'}
                  >
                    {p.published ? '● Published' : '○ Draft'}
                  </button>
                </td>
                <td className="admin-table__cell-actions">
                  <div className="admin-table__actions">
                    <Link
                      to={`/admin/projects/${p.id}/edit`}
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setDeleteTarget(p)}
                      style={{ color: '#e53e3e', borderColor: 'rgba(229,62,62,0.3)' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal__title">Delete Project</h3>
            <p className="admin-modal__text">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="admin-modal__actions">
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
