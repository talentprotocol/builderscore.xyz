"use client";

import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { useTheme } from "@/app/context/ThemeContext";
import { InfoIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReportDrawerProps {
  report: string;
}

export default function ReportDrawer({ report }: ReportDrawerProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex justify-between items-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className={`bg-white hover:bg-neutral-100 border border-neutral-300 cursor-pointer text-xs text-black ${
              isDarkMode
                ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
                : ""
            }`}
          >
            <InfoIcon className="w-3 h-3" />
            View Ecosystem Report
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-[90%] sm:max-w-2xl overflow-y-auto p-3"
          side="right"
        >
          <div className="p-3">
            <div className="markdown prose dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-a:text-blue-600 prose-p:my-2 prose-li:ml-4 prose-hr:my-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {report}
              </ReactMarkdown>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
