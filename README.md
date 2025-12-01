📘 TaskIQ — Productividad Inteligente con Drag & Drop y Activity Log

Un tablero Kanban moderno, elegante y rápido creado como parte de mi desafío "App Semanal".
TaskIQ te permite organizar tus tareas de manera visual, arrastrarlas entre columnas, priorizarlas y mantener un registro completo de tus acciones.

Ideal para desarrolladores, equipos pequeños o freelancers que quieren mantener el foco y visualizar su progreso.

🚀 Características principales
✔ Kanban con arrastrar y soltar (Drag & Drop)

Mueve tareas entre columnas: Por hacer → En progreso → Hechas

Basado en dnd-kit, fluido y sin bugs.

✔ Prioridades visuales

Cada tarjeta tiene un borde y brillo según prioridad:

🟢 Baja

🟡 Media

🔴 Alta

Incluye tooltip explicando cuándo usar cada prioridad.

✔ WIP Limit (Work In Progress)

La columna En progreso muestra advertencia si superas el límite recomendado de tareas activas.

✔ Edición inline

Haz clic en el título de la tarea para editarla sin abrir modales ni pantallas extras.

✔ Activity Log detallado

Cada acción queda registrada:

Crear

Mover

Cambiar título

Cambiar prioridad

Eliminar tareas

Incluye timestamp y limitador automático.

✔ Persistencia local

Tus tareas y actividad se guardan automáticamente en localStorage.

✔ UI moderna

Tema oscuro, bordes suaves, sombras dinámicas según prioridad y layout responsivo.

🧪 Tech Stack

Next.js 14+ (App Router)

React 18

TypeScript

dnd-kit (drag & drop)

TailwindCSS

localStorage para persistencia

📂 Estructura principal del proyecto
taskiq/
├── app/
│   └── page.tsx          → Lógica del tablero, CRUD y Activity Log
├── src/
│   ├── components/
│   │   ├── TaskCard.tsx  → UI y lógica de cada tarjeta
│   │   └── KanbanColumn.tsx
│   └── utils/
│       └── types.ts      → Tipos globales (Task, etc.)
└── public/

🧰 Cómo ejecutar el proyecto
1. Clonar el repo
git clone https://github.com/tuusuario/TaskIQ.git
cd TaskIQ

2. Instalar dependencias
npm install

3. Ejecutar en modo desarrollo
npm run dev

4. Abrir en el navegador

http://localhost:3000




🗺️ Roadmap / Mejoras futuras

Modo claro/oscuro automático

Tags/Categorías por tarea

Persistencia opcional en base de datos

Columnas personalizables

Animaciones más fluidas al arrastrar

✨ Créditos

Proyecto desarrollado por @CIgnacio-dev como parte del reto App Semanal.
¡Feedback y PRs son bienvenidos!

📄 Licencia

MIT License.