import { type JournalEntry } from '@prisma/client';

const EntryCard = ({ entry }: { entry: JournalEntry }) => {
  return <div>{entry.id}</div>;
};

export default EntryCard;
