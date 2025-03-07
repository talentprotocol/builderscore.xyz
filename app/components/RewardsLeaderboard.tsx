const LEADERBOARD_DATA = [
  { id: 1, username: "macedo", score: 819, rank: 2031 },
  { id: 2, username: "superanon", score: 87858, rank: 1 },
  { id: 3, username: "artbysalman", score: 82271, rank: 2 },
  { id: 4, username: "androidsixteen.eth", score: 81418, rank: 3 },
  { id: 5, username: "jessepollak", score: 78379, rank: 4 },
  { id: 6, username: "swampbot", score: 76000, rank: 5 },
  { id: 7, username: "cryptopunk", score: 75500, rank: 6 },
  { id: 8, username: "web3builder", score: 74800, rank: 7 },
  { id: 9, username: "defiwhale", score: 73900, rank: 8 },
  { id: 10, username: "nftcollector", score: 72000, rank: 9 },
  { id: 11, username: "daohacker", score: 71200, rank: 10 },
  { id: 12, username: "metaverse", score: 70500, rank: 11 },
  { id: 13, username: "chainmaster", score: 69800, rank: 12 },
  { id: 14, username: "blocksmith", score: 68900, rank: 13 },
  { id: 15, username: "tokenizer", score: 67500, rank: 14 },
]

export default function RewardsLeaderboard() {
  return (
    <div className="h-full flex flex-col mt-4">
      <h2 className="text-sm font-semibold mb-2">Leaderboard</h2>
      <div className="flex-auto space-y-3 overflow-y-auto h-0 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {LEADERBOARD_DATA.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-neutral-900 rounded-lg py-2 px-3 pr-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-800" />
              <div>
                <p className="text-white">{user.username}</p>
                <p className="text-neutral-400">{user.score.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-white">#{user.rank}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
