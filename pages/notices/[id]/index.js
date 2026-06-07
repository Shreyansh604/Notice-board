import Head from "next/head";
import { useRouter } from "next/router";
import prisma from "../../../lib/prisma";

const CATEGORY_STYLES = {
  Exam: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  Event: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  General: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export default function ViewNotice({ notice }) {
  const router = useRouter();

  const publishDate = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <Head>
        <title>{notice.title} · Notice Board</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
        <div className="max-w-2xl mx-auto">

          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition mb-6 block"
          >
            ← Back to Notice Board
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">

            {notice.priority === "Urgent" && (
              <div className="bg-red-500 text-white text-sm font-semibold px-6 py-2 flex items-center gap-2">
                🔴 Urgent Notice
              </div>
            )}

            {notice.imageUrl && (
              <img
                src={notice.imageUrl}
                alt={notice.title}
                className="w-full h-56 object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            <div className="p-8 flex flex-col gap-5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_STYLES[notice.category]}`}>
                  {notice.category}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{publishDate}</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 dark:text-white leading-snug">
                {notice.title}
              </h1>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                {notice.body}
              </p>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => router.push(`/notices/${notice.id}/edit`)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  ✏️ Edit Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return { notFound: true };

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) return { notFound: true };

  return {
    props: { notice: JSON.parse(JSON.stringify(notice)) },
  };
}