import { useTheme } from "@/app/context/ThemeContext";
import { ReactNode } from 'react';
import { formatDate } from "@/app/lib/utils";
import { 
  Award, 
  UserCheck, 
  Users,
  Code,
  Activity
} from "lucide-react";

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
  icon: ReactNode;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const { isDarkMode } = useTheme();
  const cardClass = `p-4 rounded-lg ${
    isDarkMode ? "bg-neutral-800 border border-neutral-800" : "bg-white border border-neutral-300"
  }`;
  
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
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Active Builders",
      value: metrics.activeDevs?.toLocaleString() || "0",
      description: "All time",
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      title: "Rewarded Builders",
      value: metrics.rewardedDevs?.toLocaleString() || "0",
      description: "All time",
      icon: <Award className="w-4 h-4" />,
    }
  ];
  
  const secondRowCards: CardData[] = [
    {
      title: "Builders with Active Smart Contracts",
      value: metrics.activeContractDevs?.toLocaleString() || "0",
      description: "All time",
      icon: <Activity className="w-4 h-4" />
    },
    {
      title: "Builders with Deployed Smart Contracts",
      value: metrics.deployedContractDevs?.toLocaleString() || "0",
      description: "All time",
      icon: <Code className="w-4 h-4" />
    }
  ];

  const renderCard = (card: CardData, index: number) => (
    <div key={index} className={cardClass}>
      <div className="flex justify-between items-start mb-2">
        <div className={`text-xs ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
          {card.title}
        </div>
        <div className={`${isDarkMode ? "text-neutral-300" : "text-neutral-600"}`}>
          {card.icon}
        </div>
      </div>
      <div className={`text-2xl font-semibold mb-1 ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
        {card.value}
      </div>
      <div className={`text-xs ${isDarkMode ? "text-neutral-500" : "text-neutral-400"}`}>
        {card.description}
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