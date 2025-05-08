// src/pages/BookDemoPage.jsx
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as Popover from "@radix-ui/react-popover";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import api from "../api";

// Optional Error Boundary to catch render errors
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-600">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default function BookDemoPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    company: "",
    phone: "",
    datetime: "",
    message: "",
  });
  const [pickerOpen, setPickerOpen] = useState(false);

  // v5-style mutation config
  const mutation = useMutation({
    mutationFn: (data) => api.post("/book-demo/", data),
    onSuccess: () => {
      alert("Thanks—we’ve received your request and will be in touch!");
      setForm({
        full_name: "",
        email: "",
        company: "",
        phone: "",
        datetime: "",
        message: "",
      });
    },
    onError: () =>
      alert("Oops—something went wrong. Please try again later."),
  });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <ErrorBoundary>
      {/* 
        If you see 
          WebSocket connection to 'ws://localhost:5173/... failed' 
        it’s an HMR/dev‐server config issue—your code below is fine.
      */}
      <div className="max-w-md mx-auto my-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Book a Demo
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              required
              value={form.full_name}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
            />
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Acme Corp."
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Date/Time Picker */}
          <div>
            <Label>Preferred Date & Time</Label>
            <Popover.Root open={pickerOpen} onOpenChange={setPickerOpen}>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className="w-full flex justify-between items-center px-3 py-2 border rounded bg-white dark:bg-gray-700"
                >
                  {form.datetime
                    ? new Date(form.datetime).toLocaleString()
                    : "Select…"}
                  <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                </button>
              </Popover.Trigger>
              <Popover.Content
                side="bottom"
                align="start"
                sideOffset={5}
                className="p-4 bg-white dark:bg-gray-700 rounded shadow-md"
              >
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                  value={form.datetime}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, datetime: e.target.value }));
                    setPickerOpen(false);
                  }}
                />
              </Popover.Content>
            </Popover.Root>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={form.message}
              onChange={handleChange}
              placeholder="Any specific requirements?"
            />
          </div>

          {/* Submit */}
          <div className="text-right">
            <Button
              type="submit"
              disabled={mutation.isLoading}
              className="px-6 py-2"
            >
              {mutation.isLoading ? "Submitting…" : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
}
