import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PER_PAGE_OPTIONS } from "@/app/lib/constants";
import { cn, formatNumber } from "@/app/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function TablePagination({
  total,
  perPage,
  setPerPage,
  page,
  setPage,
  totalPages,
}: {
  total: number;
  perPage: number;
  setPerPage: (perPage: number) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}) {
  return (
    <div className="flex flex-1 items-center justify-between gap-2">
      <p className={cn("ml-1 text-xs", total === 1 ? "font-semibold" : "")}>
        {formatNumber(total)} Builder{total === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <p className="text-xs">Rows</p>

          <Select
            value={perPage.toString()}
            onValueChange={(value) => {
              setPerPage(parseInt(value));
            }}
          >
            <SelectTrigger className="button-style h-6 w-20 cursor-pointer p-2 text-xs">
              <SelectValue placeholder="123" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white text-xs text-neutral-800 dark:bg-neutral-800 dark:text-white">
              {PER_PAGE_OPTIONS.map((option) => (
                <SelectItem
                  key={option}
                  className="cursor-pointer bg-white text-xs hover:bg-neutral-100 focus:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  value={option.toString()}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-36 items-center justify-end gap-2">
          <p className="text-xs">
            Page {totalPages > 0 ? page : 0} of {formatNumber(totalPages)}
          </p>

          <Button
            className="button-style h-6 w-6"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            className="button-style h-6 w-6"
            size="sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
