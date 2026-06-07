import Head from "next/head";
import NoticeForm from "../../../components/NoticeForm";
import prisma from "../../../lib/prisma";

export default function EditNoticePage({ notice }) {
  const initial = {
    title: notice.title,
    body: notice.body,
    category: notice.category,
    priority: notice.priority,
    publishDate: notice.publishDate.slice(0, 10), // "YYYY-MM-DD"
    imageUrl: notice.imageUrl || "",
  };

  return (
    <>
      <Head>
        <title>Edit Notice · Notice Board</title>
      </Head>
      <NoticeForm initial={initial} noticeId={notice.id} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return { notFound: true };

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) return { notFound: true };

  return {
    props: {
      notice: JSON.parse(JSON.stringify(notice)),
    },
  };
}