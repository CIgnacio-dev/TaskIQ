"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Task, TaskStatus } from "../utils/types";

interface TaskState {
  tasks: Task[];
  addTask: (title: string, status?: TaskStatus) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTaskTitle: (id: string, title: string) => void;
  removeTask: (id: string) => void;
}

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

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  addTask: (title, status = "todo") =>
    set((state) => {
      const now = nowIso();
      const newTask: Task = {
        id: nanoid(),
        title,
        status,
        priority: "medium",
        createdAt: now,
        updatedAt: now,
      };
      return { tasks: [newTask, ...state.tasks] };
    }),
  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status, updatedAt: nowIso() } : task
      ),
    })),
  updateTaskTitle: (id, title) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, title, updatedAt: nowIso() } : task
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}));
