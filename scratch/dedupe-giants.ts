import * as fs from 'fs';
const filePath = 'src/data/giants.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// I'll use a more surgical approach. 
// I'll find the first instance of '알렉산더 대왕' (id 6) and see what's before it.
// The duplicates seem to be inserted before id 6.

const alexanderIndex = content.indexOf("id: '6', name: '알렉산더 대왕'");
if (alexanderIndex !== -1) {
  // Find the start of the object for id 6
  let startOf6 = content.lastIndexOf('{', alexanderIndex);
  
  // Find the end of the previous object (Genghis Khan duplicate or something)
  let before6 = content.substring(0, startOf6);
  
  // We want to keep up to the end of the FIRST Genghis Khan (id 5)
  const first5Index = content.indexOf("id: '5', name: '징기스칸'");
  const first5End = content.indexOf('},', content.indexOf('mbti: \'ENTJ\'', first5Index)) + 2;
  
  const header = content.substring(0, first5End);
  const tail = content.substring(startOf6);
  
  const newContent = header + '\n' + tail;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log("Deduplication complete.");
} else {
  console.log("Could not find Alexander the Great.");
}
