"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { CSVRow } from "@/app/lib/csv-parser";

interface DataTableProps {
  data: CSVRow[];
  title: string;
  description: string;
}

export default function DataTable({
  data,
  title,
  description,
}: DataTableProps) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="col-span-4 rounded-lg border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-800">
      <div className="p-4">
        <div className="mb-1 text-lg font-semibold text-neutral-900 dark:text-white">
          {title}
        </div>
        <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-200 dark:border-neutral-700">
                {headers.map((header, index) => (
                  <TableHead
                    key={index}
                    className="whitespace-nowrap text-neutral-600 dark:text-neutral-300"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className="border-neutral-200 dark:border-neutral-700"
                  >
                    {headers.map((header, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className="text-neutral-700 dark:text-neutral-200"
                      >
                        {typeof row[header] === "number" &&
                        (header.toLowerCase().includes("percentage") ||
                          header.toLowerCase().includes("rate"))
                          ? `${row[header].toFixed(2)}%`
                          : String(row[header])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="py-4 text-center text-neutral-500 dark:text-neutral-400"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
