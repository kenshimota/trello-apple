"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { createBrowserStore } from "@/lib/browser-store";
import { cn } from "@/lib/cn";

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  done: boolean;
};

export type Day = {
  id: string;
  name: string;
  exercises: Exercise[];
};

const DEFAULT_DAYS: Day[] = [
  {
    id: "push",
    name: "Empuje",
    exercises: [
      { id: "bench", name: "Press banca", sets: 4, reps: "6-8", done: false },
      { id: "ohp", name: "Press militar", sets: 3, reps: "8-10", done: false },
    ],
  },
  {
    id: "pull",
    name: "Jalón",
    exercises: [
      { id: "row", name: "Remo con barra", sets: 4, reps: "8", done: false },
      { id: "pullup", name: "Dominadas", sets: 3, reps: "AMRAP", done: false },
    ],
  },
  {
    id: "legs",
    name: "Pierna",
    exercises: [
      { id: "squat", name: "Sentadilla", sets: 5, reps: "5", done: false },
      { id: "rdl", name: "Peso muerto rumano", sets: 3, reps: "10", done: false },
    ],
  },
];

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function GymBoard({ userId }: { userId: string }) {
  const storageKey = `gym.board.${userId}`;
  const store = useMemo(
    () => createBrowserStore<Day[]>(storageKey, DEFAULT_DAYS),
    [storageKey],
  );
  const days = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  const [addingTo, setAddingTo] = useState<string | null>(null);

  function update(updater: (prev: Day[]) => Day[]) {
    store.set(updater(store.getSnapshot()));
  }

  const stats = useMemo(() => {
    const total = days.reduce((sum, day) => sum + day.exercises.length, 0);
    const done = days.reduce(
      (sum, day) => sum + day.exercises.filter((e) => e.done).length,
      0,
    );
    return { total, done, days: days.length };
  }, [days]);

  function addDay() {
    update((prev) => [
      ...prev,
      { id: uid(), name: `Día ${prev.length + 1}`, exercises: [] },
    ]);
  }

  function renameDay(dayId: string, name: string) {
    update((prev) =>
      prev.map((day) => (day.id === dayId ? { ...day, name } : day)),
    );
  }

  function removeDay(dayId: string) {
    update((prev) => prev.filter((day) => day.id !== dayId));
  }

  function addExercise(dayId: string, exercise: Omit<Exercise, "id" | "done">) {
    update((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: [...day.exercises, { ...exercise, id: uid(), done: false }],
            }
          : day,
      ),
    );
  }

  function removeExercise(dayId: string, exerciseId: string) {
    update((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? { ...day, exercises: day.exercises.filter((e) => e.id !== exerciseId) }
          : day,
      ),
    );
  }

  function toggleExercise(dayId: string, exerciseId: string) {
    update((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.map((e) =>
                e.id === exerciseId ? { ...e, done: !e.done } : e,
              ),
            }
          : day,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-8">
        <Stat label="Días" value={stats.days} />
        <Stat label="Ejercicios" value={stats.total} />
        <Stat label="Completados" value={stats.done} tint />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {days.map((day) => (
          <DayColumn
            key={day.id}
            day={day}
            adding={addingTo === day.id}
            onStartAdd={() => setAddingTo(day.id)}
            onCancelAdd={() => setAddingTo(null)}
            onRename={(name) => renameDay(day.id, name)}
            onRemoveDay={() => removeDay(day.id)}
            onAddExercise={(exercise) => {
              addExercise(day.id, exercise);
              setAddingTo(null);
            }}
            onRemoveExercise={(id) => removeExercise(day.id, id)}
            onToggle={(id) => toggleExercise(day.id, id)}
          />
        ))}

        <button
          type="button"
          onClick={addDay}
          className="h-28 w-72 shrink-0 rounded-lg border border-dashed border-separator subheadline font-semibold text-tint transition-colors hover:bg-tint-soft"
        >
          Añadir día
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tint = false,
}: {
  label: string;
  value: number;
  tint?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span
        className={cn(
          "title-1 tabular-nums",
          tint ? "text-tint" : "text-label",
        )}
      >
        {value}
      </span>
      <span className="footnote text-secondary">{label}</span>
    </div>
  );
}

function DayColumn({
  day,
  adding,
  onStartAdd,
  onCancelAdd,
  onRename,
  onRemoveDay,
  onAddExercise,
  onRemoveExercise,
  onToggle,
}: {
  day: Day;
  adding: boolean;
  onStartAdd: () => void;
  onCancelAdd: () => void;
  onRename: (name: string) => void;
  onRemoveDay: () => void;
  onAddExercise: (exercise: Omit<Exercise, "id" | "done">) => void;
  onRemoveExercise: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <section className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-card p-4 shadow-sm">
      <header className="flex items-center gap-2">
        <input
          value={day.name}
          onChange={(e) => onRename(e.target.value)}
          aria-label="Nombre del día"
          className="min-w-0 flex-1 rounded-sm border border-transparent bg-transparent px-1 py-0.5 title-3 text-label transition-colors hover:border-separator focus:border-tint focus:outline-none"
        />
        <Badge color="neutral">{day.exercises.length}</Badge>
        <button
          type="button"
          onClick={onRemoveDay}
          aria-label={`Eliminar ${day.name}`}
          className="grid h-7 w-7 place-items-center rounded-full text-tertiary transition-colors hover:bg-fill hover:text-danger"
        >
          ×
        </button>
      </header>

      {day.exercises.length > 0 && (
        <div className="overflow-hidden rounded-md border border-separator">
          {day.exercises.map((exercise) => (
            <article
              key={exercise.id}
              className="group flex items-start gap-3 border-b border-separator bg-card p-3 last:border-b-0"
            >
              <Checkbox
                checked={exercise.done}
                onChange={() => onToggle(exercise.id)}
                label={exercise.name}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className={cn(
                    "headline",
                    exercise.done ? "text-tertiary line-through" : "text-label",
                  )}
                >
                  {exercise.name}
                </span>
                <span className="caption-1 text-secondary tabular-nums">
                  {exercise.sets} × {exercise.reps}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveExercise(exercise.id)}
                aria-label={`Eliminar ${exercise.name}`}
                className="grid h-7 w-7 place-items-center rounded-full text-tertiary opacity-0 transition-opacity hover:bg-fill hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
              >
                ×
              </button>
            </article>
          ))}
        </div>
      )}

      {day.exercises.length === 0 && !adding && (
        <p className="rounded-md bg-fill-secondary px-3 py-6 text-center subheadline text-tertiary">
          Sin ejercicios
        </p>
      )}

      {adding ? (
        <AddExerciseForm onAdd={onAddExercise} onCancel={onCancelAdd} />
      ) : (
        <button
          type="button"
          onClick={onStartAdd}
          className="rounded-md px-3 py-2 text-left subheadline font-semibold text-tint transition-colors hover:bg-tint-soft"
        >
          Añadir ejercicio
        </button>
      )}
    </section>
  );
}

function AddExerciseForm({
  onAdd,
  onCancel,
}: {
  onAdd: (exercise: Omit<Exercise, "id" | "done">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), sets: Number(sets) || 1, reps: reps.trim() || "—" });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <Input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del ejercicio"
        aria-label="Nombre del ejercicio"
      />
      <div className="flex gap-2">
        <Input
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          inputMode="numeric"
          placeholder="Series"
          aria-label="Series"
        />
        <Input
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
          aria-label="Repeticiones"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Añadir
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="mt-0.5 grid cursor-pointer place-items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={`Marcar ${label}`}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--tint)]",
          checked
            ? "border-tint bg-tint text-on-tint"
            : "border-separator text-transparent hover:border-tint",
        )}
      >
        <svg
          viewBox="0 0 12 12"
          className="h-3.5 w-3.5 fill-none stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 6.2 4.8 9 10 3" />
        </svg>
      </span>
    </label>
  );
}
