const fs = require('fs');

const out1 = JSON.parse(fs.readFileSync('./scratch/ha_agent_1_out_1.json'));
const out2 = JSON.parse(fs.readFileSync('./scratch/ha_agent_1_out_2.json'));
const out3 = JSON.parse(fs.readFileSync('./scratch/ha_agent_1_out_3.json'));

const combinedOut = { ...out1, ...out2, ...out3 };

// Save to scratch/ha_agent_1_out.json as requested
fs.writeFileSync('./scratch/ha_agent_1_out.json', JSON.stringify(combinedOut, null, 2));

// Merge with main file
const ha = JSON.parse(fs.readFileSync('./src/data/fact-layers/fact-layer-ha.json'));
Object.assign(ha, combinedOut);
fs.writeFileSync('./src/data/fact-layers/fact-layer-ha.json', JSON.stringify(ha, null, 2));
console.log("Merge completed successfully");
