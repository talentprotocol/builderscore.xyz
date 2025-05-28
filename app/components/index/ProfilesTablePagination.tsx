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
import { useEffect } from "react";

export default function TablePagination({
  total,
  perPage,
  setPerPage,
  page,
  setPage,
  totalPages,
  showPagination,
  showTotal,
}: {
  total: number;
  perPage: number;
  setPerPage: (perPage: number) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  showPagination: boolean;
  showTotal: boolean;
}) {
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  return (
    <div className="flex flex-1 items-center justify-between gap-2">
      <div className="ml-1 flex h-6 items-center">
        {showTotal && (
          <p className={cn("text-xs", total === 1 ? "font-semibold" : "")}>
            {formatNumber(total)} Builder{total === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {showPagination && (
        <div className="flex items-center gap-8 justify-self-end">
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
              <SelectContent className="dropdown-menu-style">
                {PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option}
                    className="dropdown-menu-item-style"
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
      )}
    </div>
  );
}
