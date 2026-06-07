import { useState } from "react";
import { useRouter } from "next/router";

const DEFAULT_FORM = {
  title: "",
  body: "",
  category: "General",
  priority: "Normal",
  publishDate: "",
  imageUrl: "",
};

export default function NoticeForm({ initial = {}, noticeId = null }) {
  const router = useRouter();
  const isEdit = Boolean(noticeId);
  const [form, setForm] = useState({ ...DEFAULT_FORM, ...initial });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");
    const url = isEdit ? `/api/notices/${noticeId}` : "/api/notices";
    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 422) {
        setErrors(data.errors || {});
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        setServerError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      router.push("/");
    } catch {
      setServerError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 ${
      errors[field]
        ? "border-red-400"
        : "border-gray-300 dark:border-gray-600 focus:border-indigo-400"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Notice" : "Add Notice"}
          </h1>
        </div>

        {serverError && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title{" "}
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                *
              </span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Notice title"
              className={inputClass("title")}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Body <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              rows={5}
              value={form.body}
              onChange={handleChange}
              placeholder="Detailed notice content"
              className={inputClass("body")}
            />
            {errors.body && (
              <p className="mt-1 text-xs text-red-500">{errors.body}</p>
            )}
          </div>

          {/* Category, Priority, Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass("category")}
              >
                <option value="General">General</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={inputClass("priority")}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publish Date <span className="text-red-500">*</span>
              </label>
              <input
                id="publishDate"
                name="publishDate"
                type="date"
                value={form.publishDate}
                onChange={handleChange}
                className={inputClass("publishDate")}
              />
              {errors.publishDate && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.publishDate}
                </p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={inputClass("imageUrl")}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save Changes"
                  : "Create Notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
