import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';
import { analyze } from '@/utils/ai';

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
  const id = params.id;
  const { content } = await request.json();
  const user = await getUserByClerkId();
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    data: {
      content,
    },
  });

  const { mood, subject, summary, color, negative } = await analyze(updatedEntry.content);

  const updatedAnalysis = await prisma.analysis.update({
    where: {
      entryId: updatedEntry.id,
    },
    data: {
      mood,
      subject,
      summary,
      color,
      negative,
    },
  });

  return NextResponse.json({ data: { ...updatedEntry, analysis: updatedAnalysis } });
};
