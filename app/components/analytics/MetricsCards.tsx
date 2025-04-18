import { useTheme } from "@/app/context/ThemeContext";
import { ReactNode } from 'react';
import { formatDate } from "@/app/lib/utils";
import { 
  Award, 
  UserCheck, 
  Users,
  Code,
  Activity,
  HelpCircle
} from "lucide-react";
import { Tooltip } from 'react-tooltip';

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
  const cardClass = `p-4 rounded-lg ${
    isDarkMode ? "bg-neutral-800 border border-neutral-800" : "bg-white border border-neutral-300"
  } relative`;
  
  if (!metrics) {
    return (
      <div className={`${cardClass} mb-6`}>
        <div className={`text-center py-3 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
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
      tooltip: "Builders who meet all three requirements: have a Basename identity, Human Checkmark verification, and Builder Score ≥ 40.",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Active Builders",
      value: metrics.activeDevs?.toLocaleString() || "0",
      description: "All time",
      tooltip: "Eligible builders who have contributed to public repositories or have activity in verified contracts deployed by them on Base within the past week.",
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      title: "Rewarded Builders",
      value: metrics.rewardedDevs?.toLocaleString() || "0",
      description: "All time",
      tooltip: "Builders who received auto-rewards based on their verified contributions and Builder Score in a given week.",
      icon: <Award className="w-4 h-4" />,
    }
  ];
  
  const secondRowCards: CardData[] = [
    {
      title: "Builders with Active Smart Contracts",
      value: metrics.activeContractDevs?.toLocaleString() || "0",
      description: "All time",
      tooltip: "Number of smart contracts deployed to Base mainnet by the user that have at least 10 unique wallets interacting with them.",
      icon: <Activity className="w-4 h-4" />
    },
    {
      title: "Builders with Deployed Smart Contracts",
      value: metrics.deployedContractDevs?.toLocaleString() || "0",
      description: "All time",
      tooltip: "Total number of smart contracts the user has deployed to Base mainnet, regardless of activity level.",
      icon: <Code className="w-4 h-4" />
    }
  ];

  const renderCard = (card: CardData, index: number) => (
    <div key={index} className={cardClass}>
      <div className="flex justify-between items-start mb-2">
        <div className={`text-xs pr-10 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
          {card.title}
        </div>
        <div className={`absolute right-3.5 top-4 ${isDarkMode ? "text-neutral-300" : "text-neutral-600"}`}>
          {card.icon}
        </div>
      </div>
      <div className={`text-xl sm:text-2xl font-semibold mb-1 ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
        {card.value}
      </div>
      <div className={`text-xs ${isDarkMode ? "text-neutral-500" : "text-neutral-400"}`}>
        {card.description}
      </div>
      
      <div className="absolute bottom-2 right-2 text-xs">
        <HelpCircle 
          className={`w-3.5 h-3.5 ${isDarkMode ? "text-neutral-500 hover:text-neutral-300" : "text-neutral-400 hover:text-neutral-600"}`}
          data-tooltip-id={`tooltip-${index}`}
          data-tooltip-content={card.tooltip} 
        />
        <Tooltip 
          id={`tooltip-${index}`}
          className={`text-xs z-50 max-w-52 ${isDarkMode ? "bg-neutral-800 border border-neutral-800" : "bg-white border border-neutral-300"}`}
          noArrow={true}
          offset={5}
          style={{
            backgroundColor: isDarkMode ? "#404040" : "white",
            color: isDarkMode ? "white" : "#262626",
            border: isDarkMode ? "1px solid #404040" : "1px solid #d4d4d4",
            padding: "10px",
            borderRadius: "10px"
          }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className={`text-xs ml-1 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
          Last updated: {metrics.date ? formatDate(metrics.date) : "Date unavailable"}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-3">
        {firstRowCards.map(renderCard)}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {secondRowCards.map(renderCard)}
      </div>
    </div>
  );
}