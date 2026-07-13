const fs = require('fs');

const agentId = process.argv[2]; // e.g. 1, 2, or 3
const tempFile = `scratch/temp-agent${agentId}.json`;
const patchFile = `scratch/patch-agent${agentId}.json`;

if (!fs.existsSync(tempFile)) {
  console.log(`Error: ${tempFile} not found.`);
  process.exit(1);
}

const newData = JSON.parse(fs.readFileSync(tempFile, 'utf8'));
let patchData = {};
if (fs.existsSync(patchFile)) {
  patchData = JSON.parse(fs.readFileSync(patchFile, 'utf8'));
}

// newData is an array of objects: { slug, loc, title, description, content }
newData.forEach(item => {
  if (!patchData[item.slug]) patchData[item.slug] = {};
  patchData[item.slug][item.loc] = {
    title: item.title,
    description: item.description,
    content: item.content
  };
});

fs.writeFileSync(patchFile, JSON.stringify(patchData, null, 2));
console.log(`Merged ${newData.length} translations into ${patchFile}`);
