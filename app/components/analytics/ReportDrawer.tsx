"use client";

import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { InfoIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReportDrawerProps {
  report: string;
}

export default function ReportDrawer({ report }: ReportDrawerProps) {
  return (
    <div className="flex items-center justify-between">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="cursor-pointer border border-neutral-300 bg-white text-xs text-black hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800">
            <InfoIcon className="h-3 w-3" />
            View Ecosystem Report
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-[90%] overflow-y-auto bg-neutral-100 p-3 sm:max-w-2xl dark:bg-neutral-900"
          side="right"
        >
          <div className="p-3">
            <div className="markdown prose dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-a:text-blue-600 prose-p:my-2 prose-li:ml-4 prose-hr:my-4 max-w-none">
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
