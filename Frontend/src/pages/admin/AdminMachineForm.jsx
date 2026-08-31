import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import ImageUpload from '../../components/admin/ImageUpload';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const BLANK = {
  name: '',
  slug: '',
  brand: '',
  model: '',
  type: '',
  category: '',
  image: '',
  description: '',
  published: true,
};

export default function AdminMachineForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    supabase.from('machines').select('*').eq('id', id).single()
      .then(({ data, error: fetchErr }) => {
        if (fetchErr || !data) {
          setError('Machinery not found.');
        } else {
          setForm(data);
        }
        setLoading(false);
      });
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && !isEdit ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      brand: form.brand.trim(),
      model: form.model.trim(),
      type: form.type.trim(),
      category: form.category.trim(),
      image: form.image,
      description: form.description.trim(),
      published: form.published,
    };

    try {
      if (isEdit) {
        const { error: updateErr } = await supabase.from('machines').update(payload).eq('id', id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase.from('machines').insert(payload);
        if (insertErr) throw insertErr;
      }
      navigate('/admin/machines');
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-empty">Loading...</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Edit Machinery' : 'New Machinery'}</h1>
      </div>

      {error && <div className="admin-form__error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__section">
          <h3 className="admin-form__section-title">Basic Info</h3>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="admin-form__input" required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="admin-form__input" />
            </div>
          </div>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} className="admin-form__input" placeholder="e.g. Caterpillar" />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Model</label>
              <input name="model" value={form.model} onChange={handleChange} className="admin-form__input" placeholder="e.g. 320D" />
            </div>
          </div>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Type</label>
              <input name="type" value={form.type} onChange={handleChange} className="admin-form__input" placeholder="e.g. Excavator" />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="admin-form__input" placeholder="e.g. Earthmoving" />
            </div>
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="admin-form__textarea" rows="3" />
          </div>
        </div>

        <div className="admin-form__section">
          <h3 className="admin-form__section-title">Image</h3>
          <ImageUpload
            folder="machines"
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
          />
        </div>

        <div className="admin-form__checkbox-row">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={form.published}
            onChange={handleChange}
            className="admin-form__checkbox"
          />
          <label htmlFor="published" className="admin-form__label" style={{ marginBottom: 0 }}>
            Published (visible to public)
          </label>
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Machinery' : 'Create Machinery'}
          </button>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => navigate('/admin/machines')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
