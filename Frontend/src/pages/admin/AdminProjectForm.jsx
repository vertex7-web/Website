import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import ImageUpload from '../../components/admin/ImageUpload';
import MultiImageUpload from '../../components/admin/MultiImageUpload';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const BLANK = {
  name: '',
  slug: '',
  location: '',
  category: '',
  description: '',
  scope: [''],
  equipment: [''],
  cover_image: '',
  gallery: [],
  published: false,
};

export default function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    supabase.from('projects').select('*').eq('id', id).single()
      .then(({ data, error: fetchErr }) => {
        if (fetchErr || !data) {
          setError('Project not found.');
        } else {
          setForm({
            ...data,
            scope: data.scope?.length ? data.scope : [''],
            equipment: data.equipment?.length ? data.equipment : [''],
            gallery: data.gallery || [],
          });
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

  function handleArrayChange(field, index, value) {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  }

  function handleArrayAdd(field) {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  }

  function handleArrayRemove(field, index) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }


  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      location: form.location.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      scope: form.scope.filter((s) => s.trim()),
      equipment: form.equipment.filter((s) => s.trim()),
      cover_image: form.cover_image,
      gallery: form.gallery,
      published: form.published,
    };

    try {
      if (isEdit) {
        const { error: updateErr } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('projects')
          .insert(payload);
        if (insertErr) throw insertErr;
      }
      navigate('/admin/projects');
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
        <h1 className="admin-page-title">{isEdit ? 'Edit Project' : 'New Project'}</h1>
      </div>

      {error && <div className="admin-form__error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__section">
          <h3 className="admin-form__section-title">Basic Info</h3>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Project Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="admin-form__input"
                required
              />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Slug</label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="admin-form__input"
                placeholder="auto-generated"
              />
            </div>
          </div>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="admin-form__input"
              />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="admin-form__input"
                placeholder="e.g. Infrastructure, Commercial"
              />
            </div>
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="admin-form__textarea"
              rows="4"
            />
          </div>
        </div>

        <div className="admin-form__section">
          <h3 className="admin-form__section-title">Scope</h3>
          <div className="admin-array-field">
            {form.scope.map((item, i) => (
              <div key={i} className="admin-array-field__row">
                <input
                  value={item}
                  onChange={(e) => handleArrayChange('scope', i, e.target.value)}
                  className="admin-form__input"
                  placeholder="Scope item"
                />
                <button
                  type="button"
                  className="admin-array-field__remove"
                  onClick={() => handleArrayRemove('scope', i)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="admin-array-field__add" onClick={() => handleArrayAdd('scope')}>
              + Add Scope Item
            </button>
          </div>
        </div>

        <div className="admin-form__section">
          <h3 className="admin-form__section-title">Equipment Used</h3>
          <div className="admin-array-field">
            {form.equipment.map((item, i) => (
              <div key={i} className="admin-array-field__row">
                <input
                  value={item}
                  onChange={(e) => handleArrayChange('equipment', i, e.target.value)}
                  className="admin-form__input"
                  placeholder="Equipment name"
                />
                <button
                  type="button"
                  className="admin-array-field__remove"
                  onClick={() => handleArrayRemove('equipment', i)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="admin-array-field__add" onClick={() => handleArrayAdd('equipment')}>
              + Add Equipment
            </button>
          </div>
        </div>

        <div className="admin-form__section">
          <h3 className="admin-form__section-title">Images</h3>
          <div className="admin-form__field">
            <label className="admin-form__label">Cover Image (Featured / Hero)</label>
            <ImageUpload
              folder="projects"
              value={form.cover_image}
              onChange={(url) => setForm((prev) => ({ ...prev, cover_image: url }))}
              enableCrop={true}
              defaultAspect="16:10"
              label="Upload Project Cover Image"
            />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Project Gallery</label>
            <MultiImageUpload
              folder="projects"
              images={form.gallery}
              onChange={(newGallery) => setForm((prev) => ({ ...prev, gallery: newGallery }))}
            />
          </div>
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
            {saving ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
