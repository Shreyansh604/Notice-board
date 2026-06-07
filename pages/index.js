import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import prisma from "../lib/prisma";
import NoticeCard from "../components/NoticeCard";

export default function Home({ initialNotices, toggleDark, dark }) {
  const [notices, setNotices] = useState(initialNotices);
  const router = useRouter();

  const handleDeleted = (deletedId) => {
    setNotices((prev) => prev.filter((n) => n.id !== deletedId));
  };

  return (
    <>
      <Head>
        <title>Notice Board</title>
        <meta name="description" content="Institutional Notice Board" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">📋 Notice Board</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Stay updated with the latest announcements</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDark}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {dark ? "☀️ Light" : "🌙 Dark"}
              </button>
              <Link
                href="/notices/new"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                + Add Notice
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <p className="text-gray-400 text-lg">No notices yet.</p>
              <Link
                href="/notices/new"
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                Create the first notice
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onDeleted={handleDeleted}
                  onView={() => router.push(`/notices/${notice.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });
  return {
    props: { initialNotices: JSON.parse(JSON.stringify(notices)) },
  };
}