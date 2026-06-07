import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../src/data/giants.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log("Original content length:", content.length);

// Regex explanation: Match a closing curly brace, followed by optional spaces, a comma,
// followed by whitespace (newlines/spaces), followed by a standalone comma, and then whitespace and opening curly brace
// In giants.ts:
//   },
// ,
//   {
// Let's replace "},\n,\n  {" or similar duplicate commas.
// Actually, let's target: `},\n,` or `},\r\n,`
// We can use a regex to replace `},\s*,\s*{` with `},\n  {` or similar, but to be extremely safe:
// Let's find `},` followed by any whitespace, then `,` followed by any whitespace and `{`.
const regex = /},\s*,\s*{/g;

const matches = content.match(regex);
console.log("Found matches of duplicate commas:", matches ? matches.length : 0);

if (matches && matches.length > 0) {
  // Replace all duplicates
  content = content.replace(regex, '},\n  {');
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Successfully removed duplicate commas!");
} else {
  console.log("No duplicate commas found with the regex.");
}
