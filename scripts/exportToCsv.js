// scripts/exportToCsv.js
import fs from 'fs';
import path from 'path';

// Load your champions.json from the project root.
const championsFilePath = path.resolve(process.cwd(), 'champions.json');
const championsData = JSON.parse(fs.readFileSync(championsFilePath, 'utf-8'));

// Extract the data points you want.
// For example: id, name, title, tags (joined), partype, difficulty (from info)
const championsArray = Object.values(championsData.data);

const header = ['id', 'name', 'title', 'tags', 'partype', 'difficulty'];
const rows = championsArray.map(champ => {
  const id = champ.id;
  const name = champ.name;
  const title = champ.title;
  const tags = champ.tags ? champ.tags.join('; ') : '';
  const partype = champ.partype || '';
  const difficulty = champ.info?.difficulty || '';
  return [id, name, title, tags, partype, difficulty];
});

// Convert rows to CSV format.
const csvContent = [
  header.join(','),  // header row
  ...rows.map(row => row.map(field => `"${field}"`).join(','))  // wrap each field in quotes
].join('\n');

// Write CSV to a file.
const outputPath = path.resolve(process.cwd(), 'champions.csv');
fs.writeFileSync(outputPath, csvContent, 'utf-8');

console.log(`CSV file written to ${outputPath}`);
