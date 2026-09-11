import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ChapterView from "../../../components/chapter/ChapterView";
import { ApiError, getChapter } from "../../../lib/api";

export const dynamic = "force-dynamic";

interface ChapterPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const chapter = await getChapter(id);
    return { title: `${chapter.title} · Guía TES` };
  } catch {
    return { title: "Capítulo · Guía TES" };
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id } = await params;
  let chapter;
  try {
    chapter = await getChapter(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
  return <ChapterView chapter={chapter} />;
}
