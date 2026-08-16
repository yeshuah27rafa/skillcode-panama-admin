// ============================================================
// seedData.js — catálogo de cursos, separado de la lógica de
// inserción para poder usarlo tanto en seed.js (manual) como
// en el auto-seed de arranque en db.js (útil en hosting sin
// acceso a shell, como el plan free de Render).
// ============================================================

export const courses = [
  {
    slug: 'logica-de-programacion',
    title: 'Lógica de Programación desde Cero',
    category: 'Programación',
    level: 'Principiante',
    summary: 'La base antes de cualquier lenguaje: variables, condicionales, ciclos y estructuras de datos simples.',
    description: 'Un recorrido práctico por la lógica que sostiene todo software, pensado para quien nunca ha programado. Cada tema se resuelve con ejercicios cortos y un mini-proyecto final.',
    duration_hours: 18,
    accent: 'amber',
    syllabus: JSON.stringify([
      'Variables, tipos de datos y operadores',
      'Condicionales y estructuras de decisión',
      'Ciclos for / while y control de flujo',
      'Arreglos y funciones',
      'Proyecto final: calculadora de reglas simples'
    ])
  },
  {
    slug: 'javascript-desde-cero',
    title: 'JavaScript Aplicado',
    category: 'Programación',
    level: 'Intermedio',
    summary: 'De la sintaxis al DOM: construye interfaces interactivas con JavaScript puro.',
    description: 'Curso orientado a proyecto: cada módulo agrega una funcionalidad real a una mini-aplicación web hasta dejarla funcional de principio a fin.',
    duration_hours: 26,
    accent: 'teal',
    syllabus: JSON.stringify([
      'Sintaxis moderna (ES6+) y manejo del DOM',
      'Eventos, formularios y validación',
      'Fetch API y consumo de servicios REST',
      'Estado en el cliente sin frameworks',
      'Proyecto final: mini-app conectada a una API pública'
    ])
  },
  {
    slug: 'c-arduino-sistemas-embebidos',
    title: 'C++ y Arduino: Sistemas Embebidos',
    category: 'Programación',
    level: 'Intermedio',
    summary: 'Programación en C++ aplicada a microcontroladores: sensores, pantallas y lógica de control.',
    description: 'Basado en proyectos reales de ingeniería: matrices, cálculos estadísticos y manejo eficiente de memoria en placas Arduino UNO, incluyendo integración con pantallas LCD.',
    duration_hours: 22,
    accent: 'coral',
    syllabus: JSON.stringify([
      'Fundamentos de C++ para microcontroladores',
      'Manejo de memoria y buffers (char[], macro F())',
      'Matrices 2D aplicadas a problemas de ingeniería',
      'Entradas, sensores y pantallas LCD I2C',
      'Proyecto final: sistema de menú funcional en Arduino'
    ])
  },
  {
    slug: 'qa-fundamentos',
    title: 'Fundamentos de QA y Testing Manual',
    category: 'Programación',
    level: 'Principiante',
    summary: 'Aprende a diseñar casos de prueba, reportar bugs y pensar como un QA Engineer.',
    description: 'Un curso de entrada al mundo de la calidad de software: cómo detectar fallas antes que el usuario, documentarlas y comunicarlas a un equipo de desarrollo.',
    duration_hours: 14,
    accent: 'teal',
    syllabus: JSON.stringify([
      'El rol de QA dentro de un equipo de desarrollo',
      'Diseño de casos de prueba y criterios de aceptación',
      'Testing manual: exploratorio vs. estructurado',
      'Reporte de bugs efectivo',
      'Introducción a testing de APIs con Postman'
    ])
  },
  {
    slug: 'matematica-para-programadores',
    title: 'Matemática Aplicada para Programadores',
    category: 'Matemáticas',
    level: 'Intermedio',
    summary: 'Álgebra, funciones y cálculo básico explicados con ejemplos que después vas a usar programando.',
    description: 'La matemática que realmente aparece en desarrollo de software y ciencia de datos: funciones, tasas de cambio y estadística descriptiva, sin perder de vista su aplicación práctica.',
    duration_hours: 20,
    accent: 'amber',
    syllabus: JSON.stringify([
      'Funciones, dominio y rango aplicados a datos reales',
      'Razones de cambio y derivadas: intuición antes que fórmula',
      'Estadística descriptiva: medidas de tendencia y dispersión',
      'Matrices y su uso en programación',
      'Proyecto final: análisis numérico de un set de datos'
    ])
  },
  {
    slug: 'calculo-aplicado',
    title: 'Cálculo Aplicado a Problemas de Ingeniería',
    category: 'Matemáticas',
    level: 'Avanzado',
    summary: 'Razones relacionadas, optimización y modelado de problemas reales paso a paso.',
    description: 'Curso pensado para estudiantes de ingeniería que necesitan traducir un problema del mundo real a un modelo matemático resoluble, con ejemplos trabajados de principio a fin.',
    duration_hours: 16,
    accent: 'coral',
    syllabus: JSON.stringify([
      'Razones relacionadas: planteamiento de problemas',
      'Optimización de funciones',
      'Modelado de problemas de ingeniería',
      'Representación gráfica de resultados',
      'Casos resueltos paso a paso'
    ])
  },
  {
    slug: 'habilidades-empleabilidad',
    title: 'Portafolio y Empleabilidad Tech',
    category: 'Habilidades Profesionales',
    level: 'Principiante',
    summary: 'CV, LinkedIn y carta de presentación pensados para tu primera oportunidad en tecnología.',
    description: 'Un curso corto y accionable para construir tu marca profesional: qué mostrar, cómo redactarlo y cómo prepararte para procesos de selección en el sector tech.',
    duration_hours: 8,
    accent: 'amber',
    syllabus: JSON.stringify([
      'Diagnóstico FODA personal',
      'Construcción de un CV orientado a resultados',
      'Optimización de tu perfil de LinkedIn',
      'Carta de presentación efectiva',
      'Simulación de entrevista técnica inicial'
    ])
  },
  {
    slug: 'habilidades-blandas-equipo',
    title: 'Habilidades Blandas para Equipos Técnicos',
    category: 'Habilidades Blandas',
    level: 'Principiante',
    summary: 'Comunicación, trabajo en equipo y manejo del feedback en entornos de desarrollo.',
    description: 'Diseñado para quienes dominan lo técnico pero quieren fortalecer cómo se comunican, colaboran y reciben retroalimentación dentro de un equipo real.',
    duration_hours: 10,
    accent: 'teal',
    syllabus: JSON.stringify([
      'Comunicación efectiva en entornos remotos y presenciales',
      'Trabajo colaborativo con Git y control de versiones',
      'Manejo constructivo del feedback',
      'Organización y gestión del tiempo en proyectos',
      'Liderazgo situacional en equipos pequeños'
    ])
  }
];


// Inserta el catálogo si aún no existe (INSERT OR IGNORE por slug).
// Devuelve la cantidad de cursos verificados/insertados.
export async function insertCourses(pool) {
  for (const course of courses) {
    await pool.query(
      `INSERT INTO courses
        (slug, title, category, level, summary, description, duration_hours, syllabus, accent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO NOTHING`,
      [
        course.slug, course.title, course.category, course.level,
        course.summary, course.description, course.duration_hours,
        course.syllabus, course.accent
      ]
    );
  }
  return courses.length;
}
