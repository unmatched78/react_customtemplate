// src/components/CrudPage.jsx
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function CrudPage({
  title,
  apiPath,
  columns,    // [{ key, header }]
  formFields, // [{ name, label, type, options?, required? }]
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  // 1) Fetch existing items
  const { data: items = [], isLoading } = useQuery({
    queryKey: [apiPath],
    queryFn: () => api.get(`/${apiPath}/`).then((r) => r.data),
  });

  // 2) Create / Update mutation
  const upsert = useMutation({
    mutationFn: (payload) =>
      editing
        ? api.put(`/${apiPath}/${editing.id}/`, payload)
        : api.post(`/${apiPath}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [apiPath] });
      setOpen(false);
      setEditing(null);
    },
  });

  // 3) Delete mutation
  const del = useMutation({
    mutationFn: (id) => api.delete(`/${apiPath}/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [apiPath] }),
  });

  // 4) Form state initialization
  const [form, setForm] = useState(
    formFields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
  );

  // 5) Open dialog with existing data or blank
  const openForm = (item) => {
    setForm(
      item || formFields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
    );
    setEditing(item || null);
    setOpen(true);
  };

  // 6) Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // translate sentinel 'none' to null if needed
    const payload = { ...form };
    formFields.forEach((f) => {
      if (f.type === "select" && payload[f.name] === "none") {
        payload[f.name] = null;
      }
    });
    upsert.mutate(payload);
  };

  return (
    <div className="p-6">
      {/* Header and New button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="solid">New {title.slice(0, -1)}</Button>
          </DialogTrigger>
          <DialogContent>
            {/* Hidden for screen readers */}
            <DialogTitle className="sr-only">
              {editing
                ? `Edit ${title.slice(0, -1)}`
                : `New ${title.slice(0, -1)}`}
            </DialogTitle>
            <h3 className="text-lg font-medium mb-2">
              {editing
                ? `Edit ${title.slice(0, -1)}`
                : `New ${title.slice(0, -1)}`}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formFields.map((f) => (
                <div key={f.name}>
                  <Label htmlFor={f.name}>{f.label}</Label>

                  {f.type === "select" ? (
                    <Select
                      value={form[f.name]}
                      onValueChange={(val) =>
                        setForm((prev) => ({ ...prev, [f.name]: val }))
                      }
                      required={!!f.required}
                    >
                      <SelectTrigger className="w-full">
                        {f.options.find((opt) => opt.value === form[f.name])
                          ?.label || (f.required ? "Select..." : "None")}
                      </SelectTrigger>
                      <SelectContent>
                        {f.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={f.name}
                      type={f.type || "text"}
                      value={form[f.name]}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          [f.name]: e.target.value,
                        }))
                      }
                      required={!!f.required}
                    />
                  )}
                </div>
              ))}

              <Button type="submit" variant="solid" disabled={upsert.isLoading}>
                {upsert.isLoading ? "Saving…" : "Save"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table of items */}
      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{item[col.key]}</TableCell>
                ))}
                <TableCell className="space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openForm(item)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => del.mutate(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
