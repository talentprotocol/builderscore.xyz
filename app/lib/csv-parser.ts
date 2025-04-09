export interface CSVRow {
  [key: string]: string | number;
}

export function parseCSV(csvData: string): CSVRow[] {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  
  const result: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length === headers.length) {
      const obj: CSVRow = {};
      for (let j = 0; j < headers.length; j++) {
        // Try to convert to number if possible, otherwise keep as string
        const value = currentLine[j];
        obj[headers[j]] = isNaN(Number(value)) ? value : Number(value);
      }
      result.push(obj);
    }
  }
  
  return result;
}

export function formatDate(dateString: string): string {
  // Convert date strings like "2025-03-31 12:00:00 UTC" to "Mar 31"
  try {
    // Format: "2025-03-31 12:00:00 UTC" to "2025-03-31T12:00:00Z"
    const parts = dateString.split(' ');
    if (parts.length >= 3) {
      const datePart = parts[0];
      const timePart = parts[1];
      const isoString = `${datePart}T${timePart}Z`;
      const date = new Date(isoString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Invalid Date";
      }
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    console.error("Unexpected date format:", dateString);
    return dateString;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
} 