import Head from "next/head";
import NoticeForm from "../../components/NoticeForm";

export default function NewNoticePage() {
  return (
    <>
      <Head>
        <title>Add Notice · Notice Board</title>
      </Head>
      <NoticeForm />
    </>
  );
}
