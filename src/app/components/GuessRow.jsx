"use client";

export default function GuessRow({ selectedClues, onRemoveClue, onSubmit }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-100">
      <div className="flex gap-4">
        {selectedClues.map((clue, index) => (
          <div
            key={index}
            className="border rounded p-2 bg-blue-200 cursor-pointer"
            onClick={() => onRemoveClue(clue)}
          >
            {clue}
          </div>
        ))}
      </div>
      <button
        onClick={onSubmit}
        className="mt-4 p-2 bg-green-500 text-white rounded"
        disabled={selectedClues.length < 4}
      >
        Submit Answer
      </button>
    </div>
  );
}
