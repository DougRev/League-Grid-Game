// scripts/generateGrid.js
// Run with: node scripts/generateGrid.js

import fs from 'fs';
import path from 'path';
import readline from 'readline';

/**
 * Simple CSV parser.
 * Assumes a header row and that fields are separated by commas.
 */
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const header = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(val => val.trim());
    const obj = {};
    header.forEach((key, index) => {
      obj[key] = values[index] || '';
    });
    return obj;
  });
}

/**
 * Generates an array of clues for a given champion using several CSV fields.
 * Fields used: title, tags, partype, species, release year, region.
 * Returns only unique clues for that champion.
 */
function generateClues(champion) {
  const clues = [];
  
  if (champion.title) {
    clues.push(champion.title);
  }
  
  if (champion.tags) {
    const tagArr = champion.tags.split(';').map(s => s.trim());
    tagArr.forEach(tag => {
      if (tag) clues.push(tag);
    });
  }
  
  if (champion.partype) {
    clues.push(champion.partype);
  }
  
  if (champion.species) {
    clues.push(champion.species);
  }
  
  if (champion["release year"]) {
    clues.push(champion["release year"]);
  }
  
  if (champion.region) {
    clues.push(champion.region);
  }
  
  return Array.from(new Set(clues));
}

/**
 * Shuffles an array in place.
 */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Selects 4 champions from the pool that each have at least 4 clues.
 */
function select4Champions(champions) {
  const shuffled = shuffle([...champions]);
  const selected = [];
  for (const champ of shuffled) {
    const clues = generateClues(champ);
    if (clues.length >= 4) {
      selected.push(champ);
      if (selected.length === 4) break;
    }
  }
  if (selected.length < 4) {
    console.error("Could not find 4 champions with at least 4 clues each.");
    process.exit(1);
  }
  return selected;
}

/**
 * Builds a 4x4 grid puzzle using 4 champions.
 * Each row is built from one champion’s clues (the first 4 clues).
 * The solution for each row is the champion’s name.
 */
function generatePuzzle() {
  const selectedChampions = select4Champions(championsArray);
  
  // For each champion, generate its clue set and then take the first 4 clues.
  const grid = selectedChampions.map(champion => {
    const clues = generateClues(champion);
    return clues.slice(0, 4);
  });
  
  // Ensure that the grid is 4x4.
  if (grid.length !== 4 || grid.some(row => row.length !== 4)) {
    console.error("Error: The generated grid is not 4x4.");
    process.exit(1);
  }
  
  // The solution for each row is the champion's name.
  const solutions = selectedChampions.map(champ => champ.name);
  
  return { grid, solutions, gridChampions: selectedChampions };
}

/**
 * Prompts the user to press Enter to confirm.
 */
function promptConfirmation(promptText) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(promptText, () => {
      rl.close();
      resolve();
    });
  });
}

// Load champions.csv from the project root.
const championsFilePath = path.resolve(process.cwd(), 'champions.csv');
const csvContent = fs.readFileSync(championsFilePath, 'utf-8');
const championsArray = parseCSV(csvContent);

// Generate the puzzle.
const { grid, solutions, gridChampions } = generatePuzzle();

// Log detailed output.
console.log("Selected Champions (one per row):");
gridChampions.forEach(champ => {
  console.log(`- ${champ.name}`);
  console.log(`  Full Clues: ${JSON.stringify(generateClues(champ))}`);
});
console.log("\nGenerated 4x4 Grid of Clues (each row corresponds to one champion):");
grid.forEach((row, index) => {
  console.log(`Row ${index + 1}:`, row);
});
console.log("\nRow Solutions (champion names to be revealed when solved):", solutions);

// Build the puzzle object.
const puzzleData = {
  grid,            // The 4x4 grid of clues.
  solutions,       // Array of 4 champion names (one per row).
  gridChampions: gridChampions.map(champ => ({
    name: champ.name,
    clues: generateClues(champ)
  })),
  generatedAt: new Date().toISOString()
};

// Prompt for confirmation before writing.
promptConfirmation("\nReview the above output. Press Enter to confirm writing the puzzle data to puzzles.json (or Ctrl+C to abort): ")
  .then(() => {
    const outputFilePath = path.resolve(process.cwd(), 'puzzles.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(puzzleData, null, 2), 'utf-8');
    console.log(`\nPuzzle data successfully written to ${outputFilePath}`);
  });
