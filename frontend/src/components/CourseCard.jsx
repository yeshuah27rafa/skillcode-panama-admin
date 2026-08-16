// ============================================================
// components/CourseCard.jsx
// ============================================================

import { Link } from 'react-router-dom';

const ACCENT_MAP = {
  teal: 'var(--brand)',
  amber: 'var(--amber)',
  coral: '#9A3B27',
  azure: 'var(--azure)'
};

export default function CourseCard({ course }) {
  const accentColor = ACCENT_MAP[course.accent] || 'var(--brand)';

  return (
    <Link to={'/cursos/' + course.slug} className="course-card" style={{ '--accent-color': accentColor }}>
      <div className="course-card__top">
        <span className="tag tag--brand">{course.category}</span>
        <span className="tag">{course.level}</span>
      </div>
      <h3 className="course-card__title">{course.title}</h3>
      <p className="course-card__summary">{course.summary}</p>
      <div className="course-card__meta">
        <span>{course.duration_hours ?? course.durationHours} h</span>
        <span>·</span>
        <span>{course.syllabus.length} módulos</span>
      </div>
    </Link>
  );
}
