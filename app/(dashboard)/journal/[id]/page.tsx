import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

type EntryPageParams = {
  id: string;
};

const getEntry = async (id: string) => {
  const user = await getUserByClerkId();
  const entry = prisma.journalEntry.findUnique({
    where: { id, userId: user.id },
  });
};

const EntryPage = ({ params }: { params: EntryPageParams }) => {
  return <div>{params.id}</div>;
};

export default EntryPage;
