const fs = require('fs');

try {
  const g50 = JSON.parse(fs.readFileSync('scripts/new-giants-50.json', 'utf8'));
  console.log('new-giants-50.json count:', Array.isArray(g50) ? g50.length : Object.keys(g50).length);
  if (Array.isArray(g50)) {
    console.log('First 3 slugs in new-giants-50.json:', g50.slice(0, 3).map(g => g.slug));
  } else {
    console.log('Keys in new-giants-50.json:', Object.keys(g50).slice(0, 5));
  }
} catch (e) {
  console.log('Error reading new-giants-50.json:', e.message);
}

try {
  const g59 = JSON.parse(fs.readFileSync('scripts/new-giants-59.json', 'utf8'));
  console.log('new-giants-59.json count:', Array.isArray(g59) ? g59.length : Object.keys(g59).length);
  if (Array.isArray(g59)) {
    console.log('First 3 slugs in new-giants-59.json:', g59.slice(0, 3).map(g => g.slug));
  } else {
    console.log('Keys in new-giants-59.json:', Object.keys(g59).slice(0, 5));
  }
} catch (e) {
  console.log('Error reading new-giants-59.json:', e.message);
}
