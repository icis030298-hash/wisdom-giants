import * as fs from 'fs';
const filePath = 'src/data/giants.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Normalize line endings and remove BOM if present
content = content.replace(/^\uFEFF/, '');

// Ensure the first few lines are clean
const cleanHeader = `export interface Lesson {
  title: string;
  content: string;
}

export interface Giant {
  id: string;
  name: string;
  category: '성취' | '역경' | '지혜' | '창의';
  headline: string;
  shortDescription: string;
  slug: string;
  quote: string;
  pain: string;
  recovery: string;
  lessons: Lesson[];
  imageUrl: string;
  mbti: string;
  era: string;
}
`;

const giantsDataStart = content.indexOf('export const giantsData');
if (giantsDataStart !== -1) {
  const newContent = cleanHeader + '\n' + content.substring(giantsDataStart);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log("File fixed successfully.");
} else {
  console.log("Could not find giantsData.");
}
