import ShowToolsButton from "@/app/components/index/ShowToolsButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { TABLE_CONTENT_HEIGHT } from "@/app/lib/constants";
import { getCommonPinningStyles } from "@/app/lib/data-table/data-table";
import { cn } from "@/app/lib/utils";
import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import Image from "next/image";

export default function ProfilesTable<TData>({
  table,
  title,
  description,
  isLoading,
  showTools,
  setShowTools,
}: {
  table: TanstackTable<TData>;
  title?: string;
  description?: string;
  isLoading?: boolean;
  showTools?: boolean;
  setShowTools?: (showTools: boolean) => void;
}) {
  return (
    <div className="card-style relative flex w-full flex-col overflow-auto">
      <ShowToolsButton showTools={showTools} setShowTools={setShowTools} />

      <div className="pointer-events-none absolute top-0 left-0 z-0 flex h-full w-full items-center justify-center">
        <Image
          src="/images/talent-protocol-logo.png"
          alt="Talent Protocol"
          width={1402}
          height={212}
          className="h-12 w-auto opacity-10"
        />
      </div>
      <div className="overflow-hidden">
        {(title || description) && (
          <div className="flex flex-col gap-1 p-2">
            {title && <p className="text-xs font-semibold">{title}</p>}
            {description && (
              <p className="max-w-xl text-xs text-neutral-500">{description}</p>
            )}
          </div>
        )}
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, headerIndex) => (
                  <TableHead
                    className="h-8 text-xs font-medium"
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: `${100 / table.getAllColumns().length}%`,
                      ...getCommonPinningStyles({ column: header.column }),
                      ...(headerGroup.headers.length === 2 && headerIndex === 1
                        ? { textAlign: "right" }
                        : {}),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="max-h-80">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-8 text-xs"
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                        ...(row.getVisibleCells().length === 2 &&
                        cellIndex === 1
                          ? { textAlign: "right" }
                          : {}),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className={cn("text-center text-xs", TABLE_CONTENT_HEIGHT)}
                >
                  {!isLoading && "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex w-full items-center justify-center bg-white/70 dark:bg-neutral-900/70">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400 dark:text-neutral-500" />
        </div>
      )}
    </div>
  );
}
