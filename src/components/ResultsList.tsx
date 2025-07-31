interface ResultsListProps {
  results: any[];
  onCandidateClick: (candidate: any) => void;
}

export default function ResultsList({ results, onCandidateClick }: ResultsListProps) {
  return (
    <div className="space-y-4">
      {results.map((r, index) => (
        <div
          key={index}
          onClick={() => onCandidateClick(r)}
          className="p-4 border rounded cursor-pointer hover:bg-accent"
        >
          <p><strong>Name:</strong> {r.name}</p>
          <p><strong>Score:</strong> {r.score}</p>
          <p><strong>Explanation:</strong> {r.explanation.slice(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}
