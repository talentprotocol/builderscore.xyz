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
  // Convert date strings like "2025-03-31 12:00:00 UTC" or "2025-03-31" to "Mar 31"
  try {
    let date: Date;
    
    // Check if format is "YYYY-MM-DD"
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = new Date(dateString);
    } 
    // Check if format is "YYYY-MM-DD HH:MM:SS UTC"
    else if (dateString.includes(' ')) {
      const parts = dateString.split(' ');
      if (parts.length >= 2) {
        const datePart = parts[0];
        const timePart = parts[1];
        const isoString = `${datePart}T${timePart}${parts.includes('UTC') ? 'Z' : ''}`;
        date = new Date(isoString);
      } else {
        // Fallback
        date = new Date(dateString);
      }
    } else {
      // Any other format, let the Date constructor try to parse it
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return dateString; // Return the original string instead of "Invalid Date"
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return the original string instead of "Invalid Date"
  }
} 