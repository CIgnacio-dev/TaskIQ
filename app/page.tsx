"use client";

import { useEffect, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import type { Task, TaskStatus } from "../src/utils/types";
import { KanbanColumn } from "../src/components/KanbanColumn";

interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Por hacer",
  doing: "En progreso",
  done: "Hechas",
};

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const STORAGE_TASKS_KEY = "taskiq-tasks-v1";
const STORAGE_ACTIVITY_KEY = "taskiq-activity-v1";

const nowIso = () => new Date().toISOString();

const initialTasks: Task[] = [
  {
    id: "seed-1",
    title: "Configurar proyecto TaskIQ",
    status: "todo",
    priority: "high",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "seed-2",
    title: "Diseñar estructura del tablero",
    status: "doing",
    priority: "medium",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "seed-3",
    title: "Preparar README inicial",
    status: "done",
    priority: "low",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (!isClient) return;

    try {
      const storedTasks = window.localStorage.getItem(STORAGE_TASKS_KEY);
      const storedActivity = window.localStorage.getItem(STORAGE_ACTIVITY_KEY);

      if (storedTasks) {
        const parsed = JSON.parse(storedTasks) as Task[];
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        } else {
          setTasks(initialTasks);
        }
      } else {
        setTasks(initialTasks);
      }

      if (storedActivity) {
        const parsed = JSON.parse(storedActivity) as ActivityItem[];
        if (Array.isArray(parsed)) {
          setActivity(parsed);
        }
      }
    } catch {
      setTasks(initialTasks);
    }
  }, [isClient]);

  // Guardar en localStorage (tasks)
  useEffect(() => {
    if (!isClient) return;
    window.localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
  }, [tasks, isClient]);

  // Guardar en localStorage (activity)
  useEffect(() => {
    if (!isClient) return;
    window.localStorage.setItem(STORAGE_ACTIVITY_KEY, JSON.stringify(activity));
  }, [activity, isClient]);

  // ---------------- Activity log ---------------- 

  const addActivity = (message: string) => {
    const entry: ActivityItem = {
      id: crypto.randomUUID(),
      message,
      timestamp: nowIso(),
    };

    setActivity((prev) => [entry, ...prev].slice(0, 50));
  };

  // ---------------- CRUD de tareas ----------------

  const addTask = (title: string, status: TaskStatus) => {
    const now = nowIso();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status,
      priority: "medium",
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [...prev, newTask]);
    addActivity(`🆕 Creada tarea "${title}" en ${STATUS_LABELS[status]}.`);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
  const prevTask = tasks.find((t) => t.id === id);
  if (!prevTask) return;
  if (prevTask.status === status) return;

  const now = nowIso();

  setTasks((prev) =>
    prev.map((task) =>
      task.id === id ? { ...task, status, updatedAt: now } : task
    )
  );

  addActivity(
    `🔁 "${prevTask.title}" movida de ${
      STATUS_LABELS[prevTask.status]
    } → ${STATUS_LABELS[status]}.`
  );
};


  const updateTaskTitle = (id: string, title: string) => {
  const prevTask = tasks.find((t) => t.id === id);
  if (!prevTask) return;
  if (prevTask.title === title) return;

  const now = nowIso();

  setTasks((prev) =>
    prev.map((task) =>
      task.id === id ? { ...task, title, updatedAt: now } : task
    )
  );

  addActivity(
    `✏️ Título actualizado: "${prevTask.title}" → "${title}".`
  );
};


  const updateTaskPriority = (id: string, priority: Task["priority"]) => {
  const prevTask = tasks.find((t) => t.id === id);
  if (!prevTask) return;
  if (prevTask.priority === priority) return;

  const now = nowIso();

  setTasks((prev) =>
    prev.map((task) =>
      task.id === id ? { ...task, priority, updatedAt: now } : task
    )
  );

  addActivity(
    `⚡ Prioridad de "${prevTask.title}" cambiada: ${
      PRIORITY_LABELS[prevTask.priority]
    } → ${PRIORITY_LABELS[priority]}.`
  );
};


  const removeTask = (id: string) => {
  const taskToDelete = tasks.find((t) => t.id === id);
  if (!taskToDelete) return;


  setTasks((prev) => prev.filter((task) => task.id !== id));


  addActivity(`🗑️ Eliminada tarea "${taskToDelete.title}".`);
};




  // ---------------- Drag & Drop ----------------

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const data = over.data?.current as
      | { type?: string; status?: TaskStatus }
      | undefined;

    if (!data || data.type !== "column" || !data.status) return;

    updateTaskStatus(String(active.id), data.status);
  };

  // ---------------- Render ----------------

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">TaskIQ</h1>
          <p className="text-sm text-slate-400">
            Tablero de productividad con prioridades, arrastre entre columnas y registro de actividad.
          </p>
        </header>

        {isClient && (
          <DndContext onDragEnd={handleDragEnd}>
            <section className="grid gap-4 md:grid-cols-3">
              <KanbanColumn
                status="todo"
                tasks={tasks}
                onAddTask={addTask}
                onUpdateTaskStatus={updateTaskStatus}
                onUpdateTaskTitle={updateTaskTitle}
                onUpdatePriority={updateTaskPriority}
                onRemoveTask={removeTask}
              />
              <KanbanColumn
                status="doing"
                tasks={tasks}
                onAddTask={addTask}
                onUpdateTaskStatus={updateTaskStatus}
                onUpdateTaskTitle={updateTaskTitle}
                onUpdatePriority={updateTaskPriority}
                onRemoveTask={removeTask}
              />
              <KanbanColumn
                status="done"
                tasks={tasks}
                onAddTask={addTask}
                onUpdateTaskStatus={updateTaskStatus}
                onUpdateTaskTitle={updateTaskTitle}
                onUpdatePriority={updateTaskPriority}
                onRemoveTask={removeTask}
              />
            </section>
          </DndContext>
        )}

        {/* Activity log */}
        <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm max-h-64 overflow-y-auto">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Activity log
            </h2>
            <span className="text-[11px] text-slate-500">
              Últimos {activity.length} eventos
            </span>
          </div>

          {activity.length === 0 ? (
            <p className="text-xs text-slate-500">
              No hay actividad registrada todavía. Crea, mueve o edita tareas para ver el historial.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {activity.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-start gap-2 text-[11px]"
                >
                  <span className="mt-0.5 text-[10px] text-slate-500 w-16 shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString("es-CL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-slate-100">{entry.message}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
