// ============================================================
// App.jsx — enrutamiento principal
// ============================================================

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import ComoFunciona from './pages/ComoFunciona.jsx';
import SobreMi from './pages/SobreMi.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminCourses from './pages/admin/AdminCourses.jsx';
import AdminCourseForm from './pages/admin/AdminCourseForm.jsx';
import AdminMaterials from './pages/admin/AdminMaterials.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/cursos/:slug" element={<CourseDetail />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/sobre-mi" element={<SobreMi />} />
          <Route path="/ingresar" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminCourses /></AdminRoute>} />
          <Route path="/admin/cursos/nuevo" element={<AdminRoute><AdminCourseForm /></AdminRoute>} />
          <Route path="/admin/cursos/:id/editar" element={<AdminRoute><AdminCourseForm /></AdminRoute>} />
          <Route path="/admin/cursos/:id/materiales" element={<AdminRoute><AdminMaterials /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
