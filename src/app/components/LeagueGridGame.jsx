"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";
import Button from "./Button";

export default function LeagueGridGame() {
  // We'll store the puzzle data loaded from puzzles.json.
  const [puzzleData, setPuzzleData] = useState(null);
  // Also keep local state for tracking row solving status.
  const [rowStatus, setRowStatus] = useState(
    Array.from({ length: 4 }, () => ({ solved: false, near: false }))
  );
  const [bonusStatuses, setBonusStatuses] = useState(
    Array.from({ length: 4 }, () => ({ solved: false, near: false }))
  );

  // Fetch the puzzle data on component mount.
  useEffect(() => {
    // Adjust the URL to where your puzzles.json is hosted.
    // For example, if you put puzzles.json in your public folder:
    //   '/puzzles.json'
    // Or use the raw GitHub URL if hosted on GitHub:
    //   'https://raw.githubusercontent.com/yourusername/your-repo/main/puzzles.json'
    fetch("/puzzles.json")
      .then((res) => res.json())
      .then((data) => {
        setPuzzleData(data);
      })
      .catch((err) => console.error("Error loading puzzle data:", err));
  }, []);

  // If the puzzle data hasn't loaded yet, show a loading indicator.
  if (!puzzleData) {
    return <div className="min-h-screen flex items-center justify-center">Loading puzzle...</div>;
  }

  // Destructure the puzzle data.
  const { grid, solutions } = puzzleData;
  
  // --- Drag & Drop Handlers (unchanged) ---
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

  // Swap two tiles in the grid and then check solutions.
  const [gridState, setGridState] = useState(grid);
  const handleSwap = (fromIndex, toIndex) => {
    const newGrid = [...gridState];
    [newGrid[fromIndex], newGrid[toIndex]] = [newGrid[toIndex], newGrid[fromIndex]];
    setGridState(newGrid);
    checkSolution(newGrid);
  };

  // Check the rows against their solution sets.
  const checkSolution = (currentGrid) => {
    const newRowStatus = [];
    // Create rows from the flat grid.
    const rows = [
      currentGrid.slice(0, 4),
      currentGrid.slice(4, 8),
      currentGrid.slice(8, 12),
      currentGrid.slice(12, 16),
    ];
    rows.forEach((row, rowIndex) => {
      // Here, the correct solution for each row is simply the champion's name.
      // In your puzzleData, solutions is an array of 4 champion names.
      const correctSolution = solutions[rowIndex];
      // Define a check: For example, if all clues match the champion's clues,
      // you could set solved = true.
      // For this example, let's simply mark the row as solved if the row has been rearranged correctly.
      // (You would implement your own validation logic here.)
      // For demonstration, if the row contains any clue that is exactly equal to the champion's name (case-insensitive), mark it solved.
      const matchCount = row.filter((clue) => clue.toLowerCase() === correctSolution.toLowerCase()).length;
      if (matchCount === 1) {
        newRowStatus.push({ solved: true, near: false });
      } else {
        newRowStatus.push({ solved: false, near: false });
      }
    });
    setRowStatus(newRowStatus);

    // Bonus champion logic is not applicable now.
    // We'll leave bonusStatuses as is or remove bonus display.
  };

  // Determine overall bonus status indicators (if needed)
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
          // Base background for rows.
          const baseBg = "bg-gray-700";
          let rowStyle = baseBg;
          if (rowStatus[rowIndex]?.solved) {
            // You might use a specific color per row/solution.
            rowStyle = rowColors[rowIndex];
          } else if (rowStatus[rowIndex]?.near) {
            rowStyle = `${baseBg} border-4 border-yellow-400`;
          }
  
          // Extract the four tiles for this row.
          const rowTiles = gridState.slice(rowIndex * 4, rowIndex * 4 + 4);
  
          return (
            <div
              key={rowIndex}
              className={`grid grid-cols-4 gap-2 p-2 mb-2 ${rowStyle} rounded-lg`}
              style={{ width: "320px", height: "80px" }}
            >
              {rowTiles.map((tile, colIndex) => {
                // For simplicity, we won't change bonus highlighting here.
                const index = rowIndex * 4 + colIndex;
                return (
                  <Card
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                    className="flex items-center justify-center cursor-move shadow-lg rounded-lg bg-gray-800"
                  >
                    {tile}
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Row Solutions: Reveal the champion's name for each solved row */}
      <div className="flex flex-col items-center">
        {solutions.map((solution, index) => (
          <p key={index} className="text-xl font-bold">
            {rowStatus[index]?.solved ? `Row ${index + 1} Solved: ${solution}` : `Row ${index + 1}: (unsolved)`}
          </p>
        ))}
      </div>

      <div className="mt-4">
        <Button className="px-4 py-2 rounded-lg font-bold bg-gray-500">
          Submit All Answers
        </Button>
      </div>
    </div>
  );
}
