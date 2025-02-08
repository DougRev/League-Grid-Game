"use client";

import React, { useState } from "react";
import Card from "./Card";
import Button from "./Button";

// --- Data ---
// The initial grid order (feel free to randomize/shuffle this as needed)
const initialGrid = [
  "Mage", "Noxus", "Darkin", "Jungle",
  "Top", "ADC", "Tank", "Mid",
  "Support", "Freljord", "Assassin", "Shurima",
  "Demacia", "Void", "Yordle", "Marksman",
];

// Each row’s correct set (order does not matter)
const solutionGrid = [
  ["Mage", "Darkin", "Jungle", "Noxus"],
  ["Top", "Tank", "Mid", "ADC"],
  ["Support", "Assassin", "Freljord", "Shurima"],
  ["Demacia", "Void", "Yordle", "Marksman"],
];

// Bonus champion solution (the 5th champion)
const bonusSolution = ["Mage", "Tank", "Freljord", "Marksman"];

// Colors for solved rows (using Tailwind classes)
const rowColors = [
  "bg-purple-600", // Row 1
  "bg-blue-600",   // Row 2
  "bg-red-600",    // Row 3
  "bg-orange-500", // Row 4
];

// Color for a solved bonus champion column
const bonusSolvedColor = "bg-green-600";

// Helper: Compare two arrays regardless of order
const arraysEqualSorted = (a, b) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

export default function LeagueGridGame() {
  // grid state: a flat array of 16 clues
  const [grid, setGrid] = useState(initialGrid);

  // rowStatus: one entry per row with properties { solved, near }
  const [rowStatus, setRowStatus] = useState(
    Array.from({ length: 4 }, () => ({ solved: false, near: false }))
  );

  // bonusStatuses: one entry per column (0-3) with properties { solved, near }
  const [bonusStatuses, setBonusStatuses] = useState(
    Array.from({ length: 4 }, () => ({ solved: false, near: false }))
  );

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("tileIndex", index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("tileIndex"), 10);
    if (!isNaN(fromIndex) && fromIndex !== dropIndex) {
      handleSwap(fromIndex, dropIndex);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Swap two tiles in the grid and then check solutions
  const handleSwap = (fromIndex, toIndex) => {
    const newGrid = [...grid];
    [newGrid[fromIndex], newGrid[toIndex]] = [newGrid[toIndex], newGrid[fromIndex]];
    setGrid(newGrid);
    checkSolution(newGrid);
  };

  // Check the rows against their solution sets and also check each column for the bonus champion.
  const checkSolution = (currentGrid) => {
    const newRowStatus = [];
    // Create rows from the flat grid
    const rows = [
      currentGrid.slice(0, 4),
      currentGrid.slice(4, 8),
      currentGrid.slice(8, 12),
      currentGrid.slice(12, 16),
    ];
    rows.forEach((row, rowIndex) => {
      const correctSet = solutionGrid[rowIndex];
      // Count how many clues in the row are in the correct set
      const matchCount = row.filter((clue) => correctSet.includes(clue)).length;
      if (matchCount === 4) newRowStatus.push({ solved: true, near: false });
      else if (matchCount === 3) newRowStatus.push({ solved: false, near: true });
      else newRowStatus.push({ solved: false, near: false });
    });

    // Check each column for bonus champion solution
    const newBonusStatuses = [];
    for (let col = 0; col < 4; col++) {
      // Extract column: positions col, col+4, col+8, col+12
      const colTiles = [
        currentGrid[col],
        currentGrid[col + 4],
        currentGrid[col + 8],
        currentGrid[col + 12],
      ];
      const matchCount = colTiles.filter((tile) => bonusSolution.includes(tile)).length;
      if (matchCount === 4 && arraysEqualSorted(colTiles, bonusSolution)) {
        newBonusStatuses.push({ solved: true, near: false });
      } else if (matchCount === 3) {
        newBonusStatuses.push({ solved: false, near: true });
      } else {
        newBonusStatuses.push({ solved: false, near: false });
      }
    }

    setRowStatus(newRowStatus);
    setBonusStatuses(newBonusStatuses);
  };

  // Determine overall bonus status indicators (for display below the grid)
  const bonusSolvedColumns = bonusStatuses
    .map((status, idx) => (status.solved ? idx + 1 : null))
    .filter((v) => v !== null);
  const bonusNearColumns = bonusStatuses
    .map((status, idx) => (status.near ? idx + 1 : null))
    .filter((v) => v !== null);

  // --- Rendering ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">League of Legends Grid Game</h1>
      
      <div className="mb-6">
        {Array.from({ length: 4 }).map((_, rowIndex) => {
          // Base background for rows
          const baseBg = "bg-gray-700";
          // Row style based on solved or near status:
          let rowStyle = baseBg;
          if (rowStatus[rowIndex]?.solved) {
            rowStyle = rowColors[rowIndex];
          } else if (rowStatus[rowIndex]?.near) {
            rowStyle = `${baseBg} border-4 border-yellow-400`;
          }
  
          // Extract the four tiles for this row
          const rowTiles = grid.slice(rowIndex * 4, rowIndex * 4 + 4);
  
          return (
            <div
              key={rowIndex}
              className={`grid grid-cols-4 gap-2 p-2 mb-2 ${rowStyle} rounded-lg`}
              style={{ width: "320px", height: "80px" }}
            >
              {rowTiles.map((tile, colIndex) => {
                const bonusStatusForCol = bonusStatuses[colIndex] || { solved: false, near: false };
                // If the bonus champion for this column is solved, override the tile background.
                const tileBg = bonusStatusForCol.solved ? bonusSolvedColor : "bg-gray-800";
                // If the bonus champion is near-solved (and not solved), add a gold ring.
                const bonusHighlight =
                  bonusStatusForCol.near && !bonusStatusForCol.solved
                    ? "ring-4 ring-yellow-400"
                    : "";
                const index = rowIndex * 4 + colIndex;
                return (
                  <Card
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                    className={`flex items-center justify-center cursor-move shadow-lg rounded-lg ${tileBg} ${bonusHighlight}`}
                  >
                    {tile}
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bonus Champion Indicator */}
      <div className="flex flex-col items-center">
        {bonusSolvedColumns.length > 0 ? (
          <p className="text-green-400 font-bold">
            Bonus Champion Revealed in Column
            {bonusSolvedColumns.length > 1
              ? "s: " + bonusSolvedColumns.join(", ")
              : ": " + bonusSolvedColumns[0]}
          </p>
        ) : bonusNearColumns.length > 0 ? (
          <p className="text-yellow-400 font-bold">
            Bonus Champion (Nearly Solved) in Column
            {bonusNearColumns.length > 1
              ? "s: " + bonusNearColumns.join(", ")
              : ": " + bonusNearColumns[0]}
          </p>
        ) : (
          <p className="text-gray-400">Bonus Champion Not Yet Revealed</p>
        )}
      </div>

      <div className="mt-4">
        <Button className="px-4 py-2 rounded-lg font-bold bg-gray-500">
          Submit All Answers
        </Button>
      </div>
    </div>
  );
}
