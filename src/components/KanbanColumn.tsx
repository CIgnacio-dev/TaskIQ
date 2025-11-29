"use client";

import { useMemo, useState } from "react";
import type { Task, TaskStatus } from "../utils/types";
import { TaskCard } from "./TaskCard";


const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Por hacer",
  doing: "En progreso",
  done: "Hechas",
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (title: string, status: TaskStatus) => void;
  onUpdateTaskStatus: (id: string, status: TaskStatus) => void;
  onUpdateTaskTitle: (id: string, title: string) => void;
  onUpdatePriority: (id: string, priority: Task["priority"]) => void; // 👈 NUEVO
  onRemoveTask: (id: string) => void;
}


export function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onUpdateTaskTitle,
  onUpdatePriority, // 👈 aquí
  onRemoveTask,
}: KanbanColumnProps) {
  const [newTitle, setNewTitle] = useState("");

  const tasksForColumn = useMemo(
    () => tasks.filter((task) => task.status === status),
    [tasks, status]
  );

  const count = tasksForColumn.length;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), status);
    setNewTitle("");
  };

  return (
    <section className="flex flex-col gap-3 rounded-xl bg-slate-900/40 p-4 border border-slate-800">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
          {STATUS_LABELS[status]}
        </h2>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
          {count}
        </span>
      </header>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md bg-slate-900 px-2 py-1 text-sm text-slate-100 outline-none border border-slate-700 focus:border-indigo-400"
          placeholder="Nueva tarea..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          className="rounded-md px-2 text-sm bg-indigo-500 hover:bg-indigo-400 text-white font-medium"
          onClick={handleAdd}
        >
          +
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-2">
  {tasksForColumn.map((task) => (
    <TaskCard
      key={task.id}
      task={task}
      onUpdateStatus={onUpdateTaskStatus}
      onUpdateTitle={onUpdateTaskTitle}
      onUpdatePriority={onUpdatePriority}  // 👈 AQUÍ
      onRemove={onRemoveTask}
    />
  ))}

  {tasksForColumn.length === 0 && (
    <p className="text-xs text-slate-500 italic">
      Sin tareas en esta columna.
    </p>
  )}
</div>

    </section>
  );
}
