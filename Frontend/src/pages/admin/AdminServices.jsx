import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Image from '../../components/ui/Image';
import { supabase } from '../../lib/supabase';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadServices() {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('number', { ascending: true });

    if (!error) setServices(data || []);
    setLoading(false);
  }

  useEffect(() => { loadServices(); }, []);

  async function handleTogglePublish(service) {
    await supabase
      .from('services')
      .update({ published: !service.published })
      .eq('id', service.id);
    loadServices();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('services').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    loadServices();
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Services</h1>
        <Link to="/admin/services/new" className="admin-btn admin-btn--primary">
          + New Service
        </Link>
      </div>

      {loading ? (
        <div className="admin-empty">Loading...</div>
      ) : services.length === 0 ? (
        <div className="admin-empty">No services yet. Add your first one.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td style={{ color: '#555', fontWeight: 700 }}>{s.number}</td>
                <td>
                  <Image
                    src={s.image}
                    alt={s.title}
                    className="admin-table__thumb"
                    wrapperClassName="admin-table__thumb-wrap"
                    fallbackText=""
                    showFallbackIcon={false}
                  />
                </td>
                <td style={{ color: '#fff', fontWeight: 500 }}>{s.title}</td>
                <td>
                  <button
                    className={`admin-badge ${s.published ? 'admin-badge--published' : 'admin-badge--draft'}`}
                    onClick={() => handleTogglePublish(s)}
                    title={s.published ? 'Click to unpublish' : 'Click to publish'}
                  >
                    {s.published ? '● Published' : '○ Draft'}
                  </button>
                </td>
                <td>
                  <div className="admin-table__actions">
                    <Link
                      to={`/admin/services/${s.id}/edit`}
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setDeleteTarget(s)}
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

      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal__title">Delete Service</h3>
            <p className="admin-modal__text">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="admin-modal__actions">
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
