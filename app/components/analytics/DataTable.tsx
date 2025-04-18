"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { useTheme } from "@/app/context/ThemeContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";

interface DataTableProps {
  data: CSVRow[];
  title: string;
  description: string;
}

export default function DataTable({ data, title, description }: DataTableProps) {
  const { isDarkMode } = useTheme();
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  
  const cardClass = `rounded-lg ${
    isDarkMode ? "bg-neutral-800 border border-neutral-800" : "bg-white border border-neutral-300"
  }`;
  
  const titleClass = `text-lg font-semibold mb-1 ${isDarkMode ? "text-white" : "text-neutral-900"}`;
  const descriptionClass = `text-sm mb-4 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`;
  
  return (
    <div className={`${cardClass} col-span-4`}>
      <div className="p-4">
        <div className={titleClass}>{title}</div>
        <div className={descriptionClass}>{description}</div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className={isDarkMode ? "border-neutral-700" : "border-neutral-200"}>
                {headers.map((header, index) => (
                  <TableHead 
                    key={index} 
                    className={`whitespace-nowrap ${
                      isDarkMode ? "text-neutral-300" : "text-neutral-600"
                    }`}
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
                    className={isDarkMode ? "border-neutral-700" : "border-neutral-200"}
                  >
                    {headers.map((header, colIndex) => (
                      <TableCell 
                        key={colIndex}
                        className={isDarkMode ? "text-neutral-200" : "text-neutral-700"}
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
                    className={`text-center py-4 ${
                      isDarkMode ? "text-neutral-400" : "text-neutral-500"
                    }`}
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