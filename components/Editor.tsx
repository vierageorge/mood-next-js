'use client';

import { updateEntry } from '@/utils/api';
import { type JournalEntry, type Analysis } from '@prisma/client';
import { useState } from 'react';
import { useAutosave } from 'react-autosave';

const Editor = ({ entry }: { entry: JournalEntry & { analysis: Analysis | null } }) => {
  const [value, setValue] = useState(entry?.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);
  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const data = await updateEntry(entry.id, _value);
      console.log(data);
      setAnalysis(data.analysis);
      setIsLoading(false);
    },
  });

  const { mood, subject, summary, color, negative } = analysis || {};

  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'True' : 'False' },
  ];

  return (
    <div className="h-full grid grid-cols-3">
      <div className="col-span-2 h-full">
        {isLoading && <div>...loading...</div>}
        <textarea
          className="w-full h-full p-8 text-xl outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="border-l border-black/10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                className="flex items-center justify-between px-2 py-4 border-b border-t border-black/10"
                key={item.name}
              >
                <span className="text-lg font-semibold mr-4">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Editor;
