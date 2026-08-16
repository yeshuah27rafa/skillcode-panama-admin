// ============================================================
// pages/Courses.jsx — catálogo completo con filtros
// ============================================================

import { useEffect, useState } from 'react';
import { api } from '../api.js';
import CourseCard from '../components/CourseCard.jsx';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    api.getCourses(activeCategory)
      .then((data) => setCourses(data.courses))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [activeCategory]);

  const visibleCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Catálogo</span>
          <h2 className="section-title">Todos los cursos</h2>
          <p className="section-desc">Elige un área y empieza a tu ritmo. Puedes inscribirte en más de un curso a la vez.</p>
        </div>

        <div className="catalog__toolbar">
          <div className="catalog__filters">
            <button
              type="button"
              className={'filter-chip' + (activeCategory === 'Todas' ? ' is-active' : '')}
              onClick={() => setActiveCategory('Todas')}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={'filter-chip' + (activeCategory === category ? ' is-active' : '')}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <input
            type="search"
            className="catalog__search"
            placeholder="Buscar un curso..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {isLoading ? (
          <p className="loading-dots">cargando catálogo...</p>
        ) : visibleCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__title">Sin resultados</div>
            <p>No encontramos cursos que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="course-grid">
            {visibleCourses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </div>
    </section>
  );
}
