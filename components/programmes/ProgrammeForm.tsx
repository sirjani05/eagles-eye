"use client";

import { useState } from "react";
import { createProgramme, updateProgramme, deleteProgramme } from "@/lib/api/programmesApi";
import type { ProgrammeCreateInput, ProgrammeUpdateInput } from "@/types/index";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

const MODES = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-person" },
  { value: "hybrid", label: "Hybrid" },
];

type ModeValue = "online" | "in-person" | "hybrid";

interface ProgrammeFormProps {
  initial?: {
    title: string;
    description?: string;
    category?: string;
    level?: string;
    duration?: string;
    cost?: number;
    currency?: string;
    location?: string;
    mode?: string;
    status?: string;
  };
  onSuccess: () => void;
  isEdit?: boolean;
  programmeId?: string;
}

export function ProgrammeForm({
  initial,
  onSuccess,
  isEdit = false,
  programmeId,
}: ProgrammeFormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "",
    level: initial?.level ?? "",
    duration: initial?.duration ?? "",
    cost: String(initial?.cost ?? ""),
    currency: initial?.currency ?? "GBP",
    location: initial?.location ?? "",
    mode: (initial?.mode as ModeValue) ?? "online",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const input: ProgrammeCreateInput = {
      title: form.title,
      description: form.description || undefined,
      category: form.category || undefined,
      level: form.level || undefined,
      duration: form.duration || undefined,
      cost: form.cost ? Number(form.cost) : undefined,
      currency: form.currency || undefined,
      location: form.location || undefined,
      mode: form.mode as ModeValue,
    };

    try {
      if (isEdit && programmeId) {
        const updateInput: ProgrammeUpdateInput = {
          title: form.title,
          description: form.description || undefined,
          category: form.category || undefined,
          level: form.level || undefined,
          duration: form.duration || undefined,
          cost: form.cost ? Number(form.cost) : undefined,
          currency: form.currency || undefined,
          location: form.location || undefined,
          mode: form.mode as ModeValue,
        };
        const { error: err } = await updateProgramme(programmeId, updateInput);
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await createProgramme(input);
        if (err) throw new Error(err.message);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save programme.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !programmeId) return;
    if (!window.confirm("Are you sure you want to delete this programme?")) return;
    try {
      const { error: err } = await deleteProgramme(programmeId);
      if (err) throw new Error(err.message);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete programme.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/50 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Programme title"
          placeholder="e.g. Introduction to Data Analysis"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
        <Input
          label="Category"
          placeholder="e.g. Data & Analytics"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Level"
          placeholder="e.g. Beginner"
          value={form.level}
          onChange={(e) => handleChange("level", e.target.value)}
        />
        <div className="flex items-end">
          <label className="text-sm font-medium text-foreground/70 mr-2">Mode</label>
          <select
            value={form.mode}
            onChange={(e) => handleChange("mode", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Duration"
          placeholder="e.g. 6 weeks"
          value={form.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Input
            label="Cost"
            type="number"
            placeholder="0"
            value={form.cost}
            onChange={(e) => handleChange("cost", e.target.value)}
          />
          <Input
            label="Currency"
            placeholder="GBP"
            value={form.currency}
            onChange={(e) => handleChange("currency", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Location"
          placeholder="e.g. Online or London"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>
      <Input
        label="Description"
        as="textarea"
        rows={4}
        placeholder="Describe the programme..."
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <div className="flex items-center justify-between pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Update programme" : "Create programme"}
        </Button>
        {isEdit && (
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            Delete programme
          </Button>
        )}
        <Link href="/provider/dashboard" className="text-sm text-muted-foreground hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
