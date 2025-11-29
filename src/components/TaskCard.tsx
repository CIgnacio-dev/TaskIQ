"use client";

import { useState } from "react";
import type { Task, TaskStatus } from "../utils/types";

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "Por hacer" },
  { value: "doing", label: "En progreso" },
  { value: "done", label: "Hecha" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

const PRIORITY_UI: Record<
  Task["priority"],
  { border: string; glow: string; tooltip: string }
> = {
  low: {
    border: "border-emerald-500/50",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.25)]",
    tooltip: "Prioridad baja: puedes hacerla cuando tengas tiempo libre.",
  },
  medium: {
    border: "border-amber-400/60",
    glow: "shadow-[0_0_15px_rgba(251,191,36,0.25)]",
    tooltip: "Prioridad media: importante, pero no bloqueante. Planifícala pronto.",
  },
  high: {
    border: "border-red-500/70",
    glow: "shadow-[0_0_18px_rgba(248,113,113,0.35)]",
    tooltip: "Prioridad alta: idealmente deberías enfocarte en esto hoy.",
  },
};

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdatePriority: (id: string, priority: Task["priority"]) => void;
  onRemove: (id: string) => void;
}

export function TaskCard({
  task,
  onUpdateStatus,
  onUpdateTitle,
  onUpdatePriority,
  onRemove,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  const priorityUi = PRIORITY_UI[task.priority];

  const handleBlur = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed) {
      setDraftTitle(task.title);
    } else if (trimmed !== task.title) {
      onUpdateTitle(task.id, trimmed);
    }
    setIsEditing(false);
  };

  return (
    <article
      className={`group rounded-lg border bg-slate-900/90 p-3 text-sm transition-all duration-200 ${priorityUi.border} ${priorityUi.glow}`}
    >
      <div className="flex items-start justify-between gap-2">
        {isEditing ? (
          <input
            className="w-full rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-100 outline-none border border-slate-600 focus:border-indigo-400"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            autoFocus
          />
        ) : (
          <h3
            className="font-medium text-slate-100 cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </h3>
        )}

        <button
          className="text-xs text-slate-500 hover:text-red-400"
          onClick={() => onRemove(task.id)}
          aria-label="Eliminar tarea"
        >
          ✕
        </button>
      </div>

      {/* Fila con badge de prioridad + tooltip */}
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 uppercase tracking-wide">
          <span
            className={`h-2 w-2 rounded-full ${
              task.priority === "low"
                ? "bg-emerald-400"
                : task.priority === "medium"
                ? "bg-amber-400"
                : "bg-red-400"
            }`}
          />
          <span className="text-slate-200 font-medium">
            {PRIORITY_LABELS[task.priority]}
          </span>
        </span>

        <div className="relative flex items-center gap-1">
          <span className="text-slate-500">Prioridad</span>
          <div className="relative">
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-[10px] text-slate-200 group-hover:border-slate-400">
              i
            </div>
            <div className="pointer-events-none absolute right-0 top-5 z-20 hidden w-56 rounded-md bg-slate-900/95 p-2 text-[11px] text-slate-100 shadow-xl ring-1 ring-slate-700 group-hover:block">
              {priorityUi.tooltip}
            </div>
          </div>
        </div>
      </div>

      {/* Selects de prioridad y estado */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <select
          className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-100 border border-slate-700"
          value={task.priority}
          onChange={(e) =>
            onUpdatePriority(task.id, e.target.value as Task["priority"])
          }
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-100 border border-slate-700"
          value={task.status}
          onChange={(e) =>
            onUpdateStatus(task.id, e.target.value as TaskStatus)
          }
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}
