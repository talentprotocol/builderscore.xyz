import { useSponsor } from "@/app/context/SponsorContext";
import { useTheme } from "@/app/context/ThemeContext";
import { formatDate } from "@/app/lib/utils";
import {
  Activity,
  Award,
  Code,
  HelpCircle,
  UserCheck,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import { Tooltip } from "react-tooltip";

interface Metrics {
  date: string;
  eligibleDevs: number;
  activeDevs: number;
  rewardedDevs: number;
  activeContractDevs: number;
  deployedContractDevs: number;
}

interface MetricsCardsProps {
  metrics: Metrics | undefined;
}

interface CardData {
  title: string;
  value: string;
  description: string;
  tooltip: string;
  icon: ReactNode;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const { isDarkMode } = useTheme();
  const { selectedSponsor } = useSponsor();

  if (!metrics) {
    return (
      <div className="relative mb-6 rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800">
        <div className="py-3 text-center text-neutral-500 dark:text-neutral-400">
          Metrics data is currently unavailable
        </div>
      </div>
    );
  }

  const firstRowCards: CardData[] = [
    {
      title: "Eligible Builders",
      value: metrics.eligibleDevs?.toLocaleString() || "0",
      description: "This week",
      tooltip:
        "Builders who meet all pre-requirements to be eligible for Builder Rewards.",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Active Builders",
      value: metrics.activeDevs?.toLocaleString() || "0",
      description: "All time",
      tooltip: `Eligible builders who have contributed to public repositories or have activity in verified contracts deployed by them on ${selectedSponsor?.name} within the past week.`,
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      title: "Rewarded Builders",
      value: metrics.rewardedDevs?.toLocaleString() || "0",
      description: "All time",
      tooltip:
        "Builders who received auto-rewards based on their verified contributions and Builder Score in a given week.",
      icon: <Award className="h-4 w-4" />,
    },
  ];

  const secondRowCards: CardData[] = [
    {
      title: "Builders with Active Smart Contracts",
      value: metrics.activeContractDevs?.toLocaleString() || "0",
      description: "All time",
      tooltip: `Number of smart contracts deployed to ${selectedSponsor?.name} mainnet by the user that have at least 10 unique wallets interacting with them.`,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      title: "Builders with Deployed Smart Contracts",
      value: metrics.deployedContractDevs?.toLocaleString() || "0",
      description: "All time",
      tooltip: `Total number of smart contracts the user has deployed to ${selectedSponsor?.name} mainnet, regardless of activity level.`,
      icon: <Code className="h-4 w-4" />,
    },
  ];

  const renderCard = (card: CardData, index: number) => (
    <div
      key={index}
      className="relative rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="pr-10 text-xs text-neutral-500 dark:text-neutral-400">
          {card.title}
        </div>
        <div className="absolute top-4 right-3.5 text-neutral-600 dark:text-neutral-300">
          {card.icon}
        </div>
      </div>
      <div className="mb-1 text-xl font-semibold text-neutral-900 sm:text-2xl dark:text-white">
        {card.value}
      </div>
      <div className="text-xs text-neutral-400 dark:text-neutral-500">
        {card.description}
      </div>

      <div className="absolute right-2 bottom-2 text-xs">
        <HelpCircle
          className="hover:secondary-text-style h-3.5 w-3.5 text-neutral-400 dark:hover:text-neutral-300"
          data-tooltip-id={`tooltip-${index}`}
          data-tooltip-content={card.tooltip}
        />
        <Tooltip
          id={`tooltip-${index}`}
          className="z-50 max-w-52 rounded-lg border border-neutral-300 bg-white p-2.5 text-xs text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
          noArrow={true}
          offset={5}
          style={{
            backgroundColor: isDarkMode ? "#404040" : "white",
            color: isDarkMode ? "white" : "#262626",
            padding: "10px",
            borderRadius: "10px",
          }}
          border={isDarkMode ? "1px solid #404040" : "1px solid #d4d4d4"}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="ml-1 text-xs text-neutral-500 dark:text-neutral-400">
          Last updated:{" "}
          {metrics.date ? formatDate(metrics.date) : "Date unavailable"}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-3">
        {firstRowCards.map(renderCard)}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {secondRowCards.map(renderCard)}
      </div>
    </div>
  );
}
