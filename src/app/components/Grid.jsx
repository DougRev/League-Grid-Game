"use client";

import { useDrop } from "react-dnd";
import ClueCard from "./ClueCard";

export default function Grid({ onClueDrop }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "clue",
    drop: (item) => {
      onClueDrop(item.clue);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const clues = [
    "Champion with the title 'The Exile'",
    "Champion from Demacia",
    "Champion with 7 skins",
    "Champion who wields a scythe",
    "Champion with 0 mana",
    "Champion with 1,000 abilities (Kappa)",
    "Champion with global range",
    "Champion played as support",
    "Champion known for their ultimate",
    "Champion who is a yordle",
    "Champion with 3 letters in their name",
    "Champion from the Void",
    "Champion who is a marksman",
    "Champion with no resource bar",
    "Champion with a crowd-control ability",
    "Champion who transforms",
  ];

  return (
    <div
      ref={dropRef}
      className={`grid grid-cols-4 gap-4 p-4 ${
        isOver ? "bg-green-100" : ""
      }`}
    >
      {clues.map((clue, index) => (
        <ClueCard key={index} clue={clue} onClueDrop={onClueDrop} />
      ))}
    </div>
  );
}
