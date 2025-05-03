export interface CSVRow {
  [key: string]: string | number;
}

export function parseCSV(csvData: string): CSVRow[] {
  const lines = csvData.trim().split("\n");
  const headers = lines[0].split(",");

  const result: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");
    if (currentLine.length === headers.length) {
      const obj: CSVRow = {};
      for (let j = 0; j < headers.length; j++) {
        const value = currentLine[j];
        obj[headers[j]] = isNaN(Number(value)) ? value : Number(value);
      }
      result.push(obj);
    }
  }

  return result;
}
