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

export default function ProfilesTable<TData>({
  table,
  isLoading,
}: {
  table: TanstackTable<TData>;
  isLoading?: boolean;
}) {
  return (
    <div className="relative flex w-full flex-col overflow-auto">
      <div className="card-style-transparent overflow-hidden">
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
