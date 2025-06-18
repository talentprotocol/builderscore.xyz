import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";

interface ProfilesChartDateOptionsProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  dateInterval: string;
  onDateIntervalChange: (value: string) => void;
}

export default function ProfilesChartDateOptions({
  dateRange,
  onDateRangeChange,
  dateInterval,
  onDateIntervalChange,
}: ProfilesChartDateOptionsProps) {
  const dateRangeOptions = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "180d", label: "180D" },
    { value: "365d", label: "365D" },
    { value: "max", label: "Max" },
  ];

  const dateSizeOptions = [
    { value: "d", label: "D" },
    { value: "w", label: "W" },
    { value: "m", label: "M" },
    { value: "q", label: "Q" },
    { value: "y", label: "Y" },
  ];

  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        variant="outline"
        type="single"
        className="toggle-group-style h-8"
        value={dateRange}
        onValueChange={(value) => value && onDateRangeChange(value)}
      >
        {dateRangeOptions.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
            className="toggle-group-item-style"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <ToggleGroup
        variant="outline"
        type="single"
        className="toggle-group-style h-8"
        value={dateInterval}
        onValueChange={(value) => value && onDateIntervalChange(value)}
      >
        {dateSizeOptions.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
            className="toggle-group-item-style"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
