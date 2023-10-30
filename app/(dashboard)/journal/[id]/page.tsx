import { getUserByClerkId } from '@/utils/auth';
import Editor from '@/components/Editor';
import { prisma } from '@/utils/db';
import { type JournalEntry, type Analysis } from '@prisma/client';

type EntryPageParams = {
  id: string;
};

const getEntry = async (id: string): Promise<JournalEntry & { analysis: Analysis | null }> => {
  const user = await getUserByClerkId();
  const entry = prisma.journalEntry.findUniqueOrThrow({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });
  return entry;
};

const EntryPage = async ({ params }: { params: EntryPageParams }) => {
  const entry = await getEntry(params.id);

  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
