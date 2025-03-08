export default function RewardsHeader() {
  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800">
      <div className="flex flex-col items-center justify-between p-4">
        <h2 className="text-neutral-500 text-sm">Rewards This Week</h2>
        <p className="text-4xl font-mono font-semibold">$45.3</p>
      </div>

      <div className="flex justify-evenly border-t border-neutral-800 p-4">
        <div className="flex flex-col items-center justify-between">
          <p className="text-neutral-500 text-sm">Your Rank</p>
          <p className="text-xl font-mono font-semibold">#643</p>
        </div>

        <div className="flex flex-col items-center justify-between">
          <p className="text-neutral-500 text-sm">Builder Score</p>
          <p className="text-xl font-mono font-semibold">127</p>
        </div>
      </div>
    </div>
  );
}
