import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import ImageUpload from '../../components/admin/ImageUpload';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const BLANK = {
  title: '',
  slug: '',
  number: '01',
  short_description: '',
  description: '',
  image: '',
  benefits: [''],
  published: true,
};

export default function AdminServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    supabase.from('services').select('*').eq('id', id).single()
      .then(({ data, error: fetchErr }) => {
        if (fetchErr || !data) {
          setError('Service not found.');
        } else {
          setForm({
            ...data,
            benefits: data.benefits?.length ? data.benefits : [''],
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
      ...(name === 'title' && !isEdit ? { slug: slugify(value) } : {}),
    }));
  }

  function handleBenefitChange(index, value) {
    setForm((prev) => {
      const arr = [...prev.benefits];
      arr[index] = value;
      return { ...prev, benefits: arr };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      number: form.number.trim(),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      image: form.image,
      benefits: form.benefits.filter((b) => b.trim()),
      published: form.published,
    };

    try {
      if (isEdit) {
        const { error: updateErr } = await supabase.from('services').update(payload).eq('id', id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase.from('services').insert(payload);
        if (insertErr) throw insertErr;
      }
      navigate('/admin/services');
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
        <h1 className="admin-page-title">{isEdit ? 'Edit Service' : 'New Service'}</h1>
      </div>

      {error && <div className="admin-form__error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__section">
          <h3 className="admin-form__section-title">Basic Info</h3>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} className="admin-form__input" required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Display Number</label>
              <input name="number" value={form.number} onChange={handleChange} className="admin-form__input" placeholder="01" />
            </div>
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="admin-form__input" />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Short Description</label>
            <textarea
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              className="admin-form__textarea"
              rows="2"
              placeholder="Brief summary for cards and previews"
            />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Full Description</label>
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
          <h3 className="admin-form__section-title">Benefits</h3>
          <div className="admin-array-field">
            {form.benefits.map((item, i) => (
              <div key={i} className="admin-array-field__row">
                <input
                  value={item}
                  onChange={(e) => handleBenefitChange(i, e.target.value)}
                  className="admin-form__input"
                  placeholder="Benefit"
                />
                <button
                  type="button"
                  className="admin-array-field__remove"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      benefits: prev.benefits.filter((_, j) => j !== i),
                    }))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-array-field__add"
              onClick={() =>
                setForm((prev) => ({ ...prev, benefits: [...prev.benefits, ''] }))
              }
            >
              + Add Benefit
            </button>
          </div>
        </div>

        <div className="admin-form__section">
          <h3 className="admin-form__section-title">Service Cover Image</h3>
          <ImageUpload
            folder="services"
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            enableCrop={true}
            defaultAspect="16:10"
            label="Upload Service Cover Image"
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
            {saving ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
          </button>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => navigate('/admin/services')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
