export default function Leaderboard() {
    const scores = ["Player1: 100", "Player2: 90"]; // Placeholder scores
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <ul className="list-disc list-inside">
          {scores.map((score, index) => (
            <li key={index}>{score}</li>
          ))}
        </ul>
      </div>
    );
  }
  