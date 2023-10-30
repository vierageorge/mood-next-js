import { OpenAI } from 'langchain/llms/openai';
import { z } from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';
import { Analysis } from '@prisma/client';

const analysisSchema = z.object({
  mood: z.string().describe('the mood of the person that wrote the journal entry.'),
  subject: z.string().describe('the subject of the journal entry.'),
  negative: z.boolean().describe('is the journal entry negative? (i.e. does it contain negative emotions?'),
  summary: z.string().describe('quick summary of the entire entry.'),
  color: z
    .string()
    .describe('a hexadecimal color code that represents the mood of the entry. Example #0101fe for blue.'),
});
type AnalysisData = z.infer<typeof analysisSchema>;

const parser = StructuredOutputParser.fromZodSchema(analysisSchema);

const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the intructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyze = async (content: string): Promise<AnalysisData> => {
  const input = await getPrompt(content);
  const model = new OpenAI({
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  });

  const result = await model.call(input);

  try {
    return parser.parse(result);
  } catch (e) {
    console.log(e);
    return {
      mood: '-',
      subject: '-',
      summary: '-',
      color: '#fff',
      negative: false,
    };
  }
};
