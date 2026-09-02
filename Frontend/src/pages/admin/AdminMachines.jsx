import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Image from '../../components/ui/Image';
import { supabase } from '../../lib/supabase';

export default function AdminMachines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadMachines() {
    setLoading(true);
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setMachines(data || []);
    setLoading(false);
  }

  useEffect(() => { loadMachines(); }, []);

  async function handleTogglePublish(machine) {
    await supabase
      .from('machines')
      .update({ published: !machine.published })
      .eq('id', machine.id);
    loadMachines();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('machines').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    loadMachines();
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Machineries</h1>
        <Link to="/admin/machines/new" className="admin-btn admin-btn--primary">
          + New Machinery
        </Link>
      </div>

      {loading ? (
        <div className="admin-empty">Loading...</div>
      ) : machines.length === 0 ? (
        <div className="admin-empty">No machineries yet. Add your first one.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Brand / Model</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr key={m.id}>
                <td className="admin-table__cell-thumb">
                  <Image
                    src={m.image}
                    alt={m.name}
                    className="admin-table__thumb"
                    wrapperClassName="admin-table__thumb-wrap"
                    fallbackText=""
                    showFallbackIcon={false}
                  />
                </td>
                <td className="admin-table__cell-name">{m.name}</td>
                <td className="admin-table__cell-subtitle">{m.brand} {m.model}</td>
                <td className="admin-table__cell-category">{m.category || 'General'}</td>
                <td className="admin-table__cell-status">
                  <button
                    className={`admin-badge ${m.published ? 'admin-badge--published' : 'admin-badge--draft'}`}
                    onClick={() => handleTogglePublish(m)}
                    title={m.published ? 'Click to unpublish' : 'Click to publish'}
                  >
                    {m.published ? '● Published' : '○ Draft'}
                  </button>
                </td>
                <td className="admin-table__cell-actions">
                  <div className="admin-table__actions">
                    <Link
                      to={`/admin/machines/${m.id}/edit`}
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => setDeleteTarget(m)}
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
            <h3 className="admin-modal__title">Delete Machinery</h3>
            <p className="admin-modal__text">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
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
