"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { KanbanColumn } from "../src/components/KanbanColumn";
import type { Task, TaskStatus } from "../src/utils/types";

const nowIso = () => new Date().toISOString();

const initialTasks: Task[] = [
  {
    id: nanoid(),
    title: "Configurar proyecto TaskIQ",
    status: "todo",
    priority: "high",
    tags: ["setup"],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: nanoid(),
    title: "Diseñar estructura del tablero",
    status: "doing",
    priority: "medium",
    tags: ["ui"],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: nanoid(),
    title: "Preparar README inicial",
    status: "done",
    priority: "low",
    tags: ["docs"],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (title: string, status: TaskStatus) => {
    const now = nowIso();
    const newTask: Task = {
      id: nanoid(),
      title,
      status,
      priority: "medium",
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status, updatedAt: nowIso() } : task
      )
    );
  };

  const updateTaskTitle = (id: string, title: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title, updatedAt: nowIso() } : task
      )
    );
  };

  const updateTaskPriority = (id: string, priority: Task["priority"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, priority, updatedAt: nowIso() } : task
      )
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">TaskIQ</h1>
          <p className="text-sm text-slate-400">
            Gestor de tareas minimalista con enfoque en productividad.
          </p>
        </header>

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
      </div>
    </main>
  );
}
