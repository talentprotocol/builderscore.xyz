export default function RewardsHeader() {
  return (
    <div className="bg-neutral-900 p-4 space-y-4 rounded-lg">
      <div className="flex flex-col items-center justify-between">
        <h2 className="text-neutral-500 text-sm mb-2">Rewards This Week</h2>
        <p className="text-6xl font-mono font-semibold">$45.3</p>
      </div>

      <div className="flex justify-around border-t border-neutral-800 pt-4">
        <div className="flex flex-col items-center justify-between">
          <p className="text-neutral-500 text-sm">Your Rank</p>
          <p className="text-3xl font-mono font-semibold">#643</p>
        </div>

        <div className="flex flex-col items-center justify-between">
          <p className="text-neutral-500 text-sm">Builder Score</p>
          <p className="text-3xl font-mono font-semibold">127</p>
        </div>
      </div>
    </div>
  );
}
