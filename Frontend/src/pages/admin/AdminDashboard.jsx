import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, machines: 0, services: 0 });

  useEffect(() => {
    async function loadStats() {
      const [p, m, s] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('machines').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        projects: p.count ?? 0,
        machines: m.count ?? 0,
        services: s.count ?? 0,
      });
    }
    loadStats();
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat__label">Projects</div>
          <div className="admin-stat__value">{stats.projects}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__label">Machineries</div>
          <div className="admin-stat__value">{stats.machines}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__label">Services</div>
          <div className="admin-stat__value">{stats.services}</div>
        </div>
      </div>

      <div className="admin-page-header">
        <h2 className="admin-page-title" style={{ fontSize: '1.125rem' }}>Quick Actions</h2>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/admin/projects/new" className="admin-btn admin-btn--primary">+ New Project</Link>
        <Link to="/admin/machines/new" className="admin-btn admin-btn--primary">+ New Machinery</Link>
        <Link to="/admin/services/new" className="admin-btn admin-btn--primary">+ New Service</Link>
      </div>
    </>
  );
}
