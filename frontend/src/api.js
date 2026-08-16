// ============================================================
// api.js — wrapper único sobre fetch para hablar con el backend
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('skillcode_token');

  const headers = { ...options.headers };
  const isFormData = options.body instanceof FormData;
  if (isFormData === false) {
    headers['Content-Type'] = 'application/json';
  }
  if (token !== null && token !== undefined) {
    headers.Authorization = 'Bearer ' + token;
  }

  const response = await fetch(API_URL + path, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (response.ok === false) {
    throw new Error(data.error || 'Ocurrió un error inesperado.');
  }

  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),

  getCourses: (category) => request('/courses' + (category && category !== 'Todas' ? '?category=' + encodeURIComponent(category) : '')),
  getCategories: () => request('/courses/categories'),
  getCourse: (slug) => request('/courses/' + slug),

  getMyEnrollments: () => request('/enrollments/me'),
  enroll: (courseId) => request('/enrollments', { method: 'POST', body: JSON.stringify({ courseId }) }),
  updateProgress: (enrollmentId, progress) => request('/enrollments/' + enrollmentId + '/progress', { method: 'PATCH', body: JSON.stringify({ progress }) }),

  getCourseMaterials: (slug) => request('/courses/' + slug + '/materials'),

  adminGetCourses: () => request('/admin/courses'),
  adminCreateCourse: (payload) => request('/admin/courses', { method: 'POST', body: JSON.stringify(payload) }),
  adminUpdateCourse: (id, payload) => request('/admin/courses/' + id, { method: 'PUT', body: JSON.stringify(payload) }),
  adminDeleteCourse: (id) => request('/admin/courses/' + id, { method: 'DELETE' }),

  adminGetMaterials: (courseId) => request('/admin/materials/' + courseId),
  adminCreateMaterial: (formData) => request('/admin/materials', { method: 'POST', body: formData }),
  adminDeleteMaterial: (id) => request('/admin/materials/' + id, { method: 'DELETE' })
};
