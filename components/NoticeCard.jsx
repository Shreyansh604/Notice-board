import { useState } from "react";
import { useRouter } from "next/router";

const CATEGORY_STYLES = {
  Exam: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  Event: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  General: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export default function NoticeCard({ notice, onDeleted, onView }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
      if (res.ok) onDeleted(notice.id);
      else alert("Failed to delete notice.");
    } catch {
      alert("Network error.");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const publishDate = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border flex flex-col overflow-hidden transition hover:shadow-md ${
      notice.priority === "Urgent"
        ? "border-red-400"
        : "border-gray-200 dark:border-gray-700"
    }`}>

      {/* Top bar — always present for alignment */}
      {notice.priority === "Urgent" ? (
        <div className="bg-red-500 text-white text-xs font-semibold px-4 py-1.5 flex items-center gap-1">
          🔴 Urgent
        </div>
      ) : (
        <div className="py-1.5 px-4 invisible text-xs">placeholder</div>
      )}

      {/* Clickable area */}
      <div
        className="flex flex-col flex-1 cursor-pointer"
        onClick={onView}
      >
        {/* Image */}
        {notice.imageUrl && (
          <img
            src={notice.imageUrl}
            alt={notice.title}
            className="w-full h-40 object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}

        {/* Body */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[notice.category]}`}>
              {notice.category}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{publishDate}</span>
          </div>
          <h2 className="text-base font-bold text-gray-800 dark:text-white leading-snug">{notice.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 line-clamp-3">{notice.body}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5">
        {!confirming ? (
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/notices/${notice.id}/edit`)}
              className="flex-1 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:hover:bg-indigo-900 transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="flex-1 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 transition"
            >
              🗑️ Delete
            </button>
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 flex flex-col gap-2">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium text-center">Delete this notice?</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}