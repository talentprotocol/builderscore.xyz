import { useTheme } from "@/app/context/ThemeContext";
import { ReactNode } from 'react';

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
    isDarkMode ? "bg-neutral-800" : "bg-white border border-neutral-200"
  }`;
  
  // If metrics data is not available, display a message
  if (!metrics) {
    return (
      <div className={`${cardClass} mb-6`}>
        <div className={`text-center py-3 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
          Metrics data is currently unavailable
        </div>
      </div>
    );
  }
  
  // First row cards
  const firstRowCards: CardData[] = [
    {
      title: "Eligible Developers",
      value: metrics.eligibleDevs?.toLocaleString() || "0",
      description: "Unique, latest period only",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      )
    },
    {
      title: "Active Developers",
      value: metrics.activeDevs?.toLocaleString() || "0",
      description: "Unique, accumulated all time",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
  ];
  
  // Second row cards
  const secondRowCards: CardData[] = [
    {
      title: "Rewarded Developers",
      value: metrics.rewardedDevs?.toLocaleString() || "0",
      description: "Unique, accumulated all time",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Devs with Active Contracts",
      value: metrics.activeContractDevs?.toLocaleString() || "0",
      description: "Base Mainnet active contracts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Devs with Deployed Contracts",
      value: metrics.deployedContractDevs?.toLocaleString() || "0",
      description: "Base Mainnet contracts deployed",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      )
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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-neutral-800"}`}>
          Program Metrics
        </h2>
        <div className={`text-xs ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
          {metrics.date ? formatDate(metrics.date) : "Date unavailable"}
        </div>
      </div>
      
      {/* First row - 2 cards (50% width each) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {firstRowCards.map(renderCard)}
      </div>
      
      {/* Second row - 3 cards (33% width each) */}
      <div className="grid grid-cols-3 gap-4">
        {secondRowCards.map(renderCard)}
      </div>
    </div>
  );
}

// Safely format the date from format like "2025-04-17 10:00:00 UTC"
function formatDate(dateString: string): string {
  try {
    if (!dateString) return "Date unavailable";
    
    // Handle format like "2025-04-17 10:00:00 UTC"
    const parts = dateString.split(' ');
    if (parts.length >= 2) {
      const [year, month, day] = parts[0].split('-').map(num => parseInt(num));
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return dateString; // Return original if parsing fails
      }
      
      const date = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
      
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    return dateString; // Return original if format is unexpected
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original on error
  }
} 