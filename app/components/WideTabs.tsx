import PulsingIndicator from "@/app/components/PulsingIndicator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

export function WideTabs({
  tabs,
  defaultTab,
}: {
  tabs: {
    label: string;
    value: string;
    content?: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
  }[];
  defaultTab: string;
}) {
  return (
    <Tabs defaultValue={defaultTab} className="gap-0">
      <TabsList className="border-bottom-style h-10 w-full rounded-none bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="dark:data-[state=active]:border-b-primary data-[state=active]:border-b-primary mb-[-1.5px] rounded-none border-0 text-xs data-[state=active]:mb-[-2.5px] data-[state=active]:border-b-1 data-[state=active]:shadow-none dark:text-white dark:data-[state=active]:bg-transparent"
            onClick={tab.onClick}
          >
            {tab.label}

            {tab.active && <PulsingIndicator className="mt-0.5 ml-1" />}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
