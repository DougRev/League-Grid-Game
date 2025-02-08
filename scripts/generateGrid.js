// scripts/generateGrid.js
// Run this script with Node.js: e.g., `node scripts/generateGrid.js`

import fs from 'fs';
import path from 'path';
import { generateClues } from '../src/lib/generateClues.js';

// Load champions.json from the project root.
const championsFilePath = path.resolve(process.cwd(), 'champions.json');
const championsData = JSON.parse(fs.readFileSync(championsFilePath, 'utf-8'));

// Convert champion data (which is an object) into an array.
const championsArray = Object.values(championsData.data);

/**
 * Selects a given number of champions from the array.
 * Here, we simply take the first `count` champions.
 * You could enhance this to randomize the selection.
 */
function selectChampions(array, count) {
  return array.slice(0, count);
}

/**
 * Builds the game grid and bonus champion clues.
 * - Uses 4 champions for the grid.
 * - Uses the 5th champion as the bonus champion.
 */
function generateGrid() {
  // Select 5 champions.
  const selectedChampions = selectChampions(championsArray, 5);
  
  // Use the first 4 champions for the grid.
  const gridChampions = selectedChampions.slice(0, 4);
  // The 5th champion will be our bonus champion.
  const bonusChampion = selectedChampions[4];

  // Generate clues for each grid champion.
  const clueSets = gridChampions.map(champion => generateClues(champion));
  // For simplicity, assume we use the first 4 clues from each champion.
  const trimmedClueSets = clueSets.map(set => set.slice(0, 4));

  // Flatten into a single array of 16 clues.
  const gridClues = trimmedClueSets.flat();

  // Ensure uniqueness: remove duplicates.
  const uniqueClues = Array.from(new Set(gridClues));

  // If there are more than 16 unique clues, take the first 16.
  if (uniqueClues.length < 16) {
    console.error(`Not enough unique clues generated (${uniqueClues.length}).`);
    process.exit(1);
  }
  const finalGridClues = uniqueClues.slice(0, 16);

  // Arrange the 16 clues into a 4x4 grid.
  const grid = [];
  for (let i = 0; i < 4; i++) {
    grid.push(finalGridClues.slice(i * 4, (i + 1) * 4));
  }

  // Generate bonus champion clues.
  const bonusClues = generateClues(bonusChampion);

  return { grid, gridChampions, bonusChampion, bonusClues };
}

// Run the grid generation and output the result.
const { grid, gridChampions, bonusChampion, bonusClues } = generateGrid();

console.log("Selected Grid Champions (for the 4x4 grid):");
gridChampions.forEach(champ => console.log(`- ${champ.name}`));

console.log("\nGenerated 4x4 Grid of Unique Clues:");
grid.forEach((row, index) => {
  console.log(`Row ${index + 1}:`, row);
});

console.log("\nBonus Champion:");
console.log(`- ${bonusChampion.name}`);
console.log("Bonus Champion's Clues:", bonusClues);
