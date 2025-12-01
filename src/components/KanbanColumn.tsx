"use client";

import { useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Task, TaskStatus } from "../utils/types";
import { TaskCard } from "./TaskCard";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Por hacer",
  doing: "En progreso",
  done: "Hechas",
};

const WIP_LIMITS: Record<TaskStatus, number> = {
  todo: 999,
  doing: 3,
  done: 999,
};

export interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (title: string, status: TaskStatus) => void;
  onUpdateTaskStatus: (id: string, status: TaskStatus) => void;
  onUpdateTaskTitle: (id: string, title: string) => void;
  onUpdatePriority: (id: string, priority: Task["priority"]) => void;
  onRemoveTask: (id: string) => void;
}

export function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onUpdateTaskTitle,
  onUpdatePriority,
  onRemoveTask,
}: KanbanColumnProps) {
  const [newTitle, setNewTitle] = useState("");

  const tasksForColumn = useMemo(
    () => tasks.filter((task) => task.status === status),
    [tasks, status]
  );

  const count = tasksForColumn.length;
  const wipLimit = WIP_LIMITS[status];
  const isOverLimit = count > wipLimit;

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: {
      type: "column",
      status,
    },
  });

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), status);
    setNewTitle("");
  };

  return (
    <section
      ref={setNodeRef}
      className={`flex flex-col gap-3 rounded-xl border p-4 transition-colors ${
        isOver
          ? "border-indigo-500 bg-slate-900"
          : "border-slate-800 bg-slate-900/40"
      }`}
    >
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            {STATUS_LABELS[status]}
          </h2>
          {status === "doing" && (
            <p className="mt-0.5 text-[11px] text-slate-500">
              Límite recomendado: {wipLimit}
            </p>
          )}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            isOverLimit
              ? "bg-red-500/20 text-red-300"
              : "bg-slate-800 text-slate-300"
          }`}
        >
          {count}
        </span>
      </header>

      {isOverLimit && status === "doing" && (
        <p className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/40 rounded-md px-2 py-1">
          Demasiadas tareas en progreso. Reduce el WIP para mejorar el foco.
        </p>
      )}

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
            onUpdatePriority={onUpdatePriority}
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
