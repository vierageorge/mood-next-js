import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import NewEntryCard from '@/components/NewEntryCard';
import EntryCard from '@/components/EntryCard';
import { type JournalEntry } from '@prisma/client';

const getEntries = async (): Promise<JournalEntry[]> => {
  const user = await getUserByClerkId();

  return await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const JournalPage = async () => {
  const entries = await getEntries();
  console.log('Entries: ', entries);
  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="grid grid-cols-3 gap-4">
        <NewEntryCard />
        {entries.map((entry) => (
          <EntryCard entry={entry} key={entry.id} />
        ))}
      </div>
    </div>
  );
};

export default JournalPage;