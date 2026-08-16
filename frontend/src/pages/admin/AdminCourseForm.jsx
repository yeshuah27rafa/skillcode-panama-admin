// ============================================================
// pages/admin/AdminCourseForm.jsx — crear o editar un curso
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api.js';

const EMPTY_FORM = {
  title: '', category: '', level: 'Principiante', summary: '', description: '',
  durationHours: '', accent: 'teal', syllabusText: ''
};

const ACCENTS = ['teal', 'amber', 'coral', 'azure'];
const LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];

export default function AdminCourseForm() {
  const { id } = useParams();
  const isEditing = id !== undefined;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing === false) return;

    api.adminGetCourses().then((data) => {
      const course = data.courses.find((item) => String(item.id) === id);
      if (course === undefined) {
        setError('Curso no encontrado.');
        return;
      }
      setForm({
        title: course.title,
        category: course.category,
        level: course.level,
        summary: course.summary,
        description: course.description,
        durationHours: course.duration_hours,
        accent: course.accent,
        syllabusText: course.syllabus.join('\n')
      });
    }).catch((err) => setError(err.message)).finally(() => setIsLoading(false));
  }, [id, isEditing]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload = {
      title: form.title,
      category: form.category,
      level: form.level,
      summary: form.summary,
      description: form.description,
      durationHours: Number(form.durationHours),
      accent: form.accent,
      syllabus: form.syllabusText.split('\n').map((line) => line.trim()).filter((line) => line.length > 0)
    };

    try {
      if (isEditing) {
        await api.adminUpdateCourse(id, payload);
      } else {
        await api.adminCreateCourse(payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="container page-section"><p className="loading-dots">cargando curso...</p></div>;
  }

  return (
    <section className="page-section">
      <div className="container" style={{ maxWidth: '640px' }}>
        <span className="eyebrow">Panel admin</span>
        <h1 className="section-title">{isEditing ? 'Editar curso' : 'Nuevo curso'}</h1>

        {error !== '' && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="field">
            <label htmlFor="title">Título</label>
            <input id="title" name="title" required value={form.title} onChange={handleChange} />
          </div>

          <div className="admin-form__row">
            <div className="field">
              <label htmlFor="category">Categoría</label>
              <input id="category" name="category" required value={form.category} onChange={handleChange} placeholder="Ej. Programación" />
            </div>
            <div className="field">
              <label htmlFor="level">Nivel</label>
              <select id="level" name="level" value={form.level} onChange={handleChange}>
                {LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="summary">Resumen corto</label>
            <input id="summary" name="summary" required value={form.summary} onChange={handleChange} placeholder="Una línea que aparece en la tarjeta del curso" />
          </div>

          <div className="field">
            <label htmlFor="description">Descripción completa</label>
            <textarea id="description" name="description" required rows={4} value={form.description} onChange={handleChange}></textarea>
          </div>

          <div className="admin-form__row">
            <div className="field">
              <label htmlFor="durationHours">Duración (horas)</label>
              <input id="durationHours" name="durationHours" type="number" min="1" required value={form.durationHours} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="accent">Color de acento</label>
              <select id="accent" name="accent" value={form.accent} onChange={handleChange}>
                {ACCENTS.map((accent) => <option key={accent} value={accent}>{accent}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="syllabusText">Temario (un tema por línea)</label>
            <textarea id="syllabusText" name="syllabusText" required rows={5} value={form.syllabusText} onChange={handleChange} placeholder={'Tema 1\nTema 2\nTema 3'}></textarea>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear curso'}
          </button>
        </form>
      </div>
    </section>
  );
}
