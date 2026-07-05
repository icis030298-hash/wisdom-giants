const { execSync } = require('child_process');
const path = require('path');

function runCommand(command) {
  console.log(`\n=== Running: ${command} ===`);
  try {
    execSync(command, { stdio: 'inherit', encoding: 'utf8' });
    console.log(`=== Finished: ${command} ===\n`);
  } catch (err) {
    console.error(`=== Error during: ${command} ===`);
    console.error(err.message);
  }
}

async function main() {
  console.log("=== Starting Sequential Translation Pipeline (P0-3) ===");
  
  // 1. Thai
  runCommand('npx tsx scripts/translate-th.ts');
  
  // 2. Hausa
  runCommand('npx tsx scripts/translate-ha.ts');
  
  // 3. Greek
  runCommand('npx tsx scripts/translate-el.ts');
  
  // 4. Hebrew
  runCommand('npx tsx scripts/translate-hebrew.ts');
  
  // 5. Merge all translations into master JSON
  runCommand('npx tsx scripts/merge-translations.ts');
  
  console.log("=== Pipeline Finished! ===");
}

main().catch(err => {
  console.error("Pipeline fatal error:", err);
  process.exit(1);
});
