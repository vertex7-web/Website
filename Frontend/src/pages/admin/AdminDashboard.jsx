import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { supabase } from '../../lib/supabase';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, machines: 0, services: 0 });
  const { settings } = useSiteSettings();

  useEffect(() => {
    async function loadStats() {
      if (!supabase) return;
      try {
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
      } catch {
        // graceful stats fallback
      }
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

      {/* Phone Number Summary */}
      <div
        style={{
          marginTop: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
          padding: 'var(--space-md) var(--space-lg)',
          backgroundColor: 'var(--color-dark)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>
            Phone Number
          </span>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-white)', marginTop: '0.125rem' }}>
            {settings.phone}
          </div>
        </div>

        <Link to="/admin/settings" className="admin-btn admin-btn--ghost admin-btn--sm">
          Edit
        </Link>
      </div>

      <div className="admin-page-header">
        <h2 className="admin-page-title" style={{ fontSize: '1.125rem' }}>Quick Actions</h2>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/admin/projects/new" className="admin-btn admin-btn--primary">+ New Project</Link>
        <Link to="/admin/machines/new" className="admin-btn admin-btn--primary">+ New Machinery</Link>
        <Link to="/admin/services/new" className="admin-btn admin-btn--primary">+ New Service</Link>
        <Link to="/admin/settings" className="admin-btn admin-btn--ghost">Site Settings</Link>
      </div>
    </>
  );
}

