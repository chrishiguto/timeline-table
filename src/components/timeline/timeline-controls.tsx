import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ViewRange = "1week" | "2weeks" | "1month";

const VIEW_OPTIONS = [
  { value: "1week", label: "1 week" },
  { value: "2weeks", label: "2 weeks" },
  { value: "1month", label: "1 month" },
];

interface TimelineControlsProps {
  viewRange: ViewRange;
  onViewRangeChange: (range: ViewRange) => void;
  onGoToPrevious: () => void;
  onGoToNext: () => void;
}

const TimelineControlsComponent = ({
  viewRange,
  onViewRangeChange,
  onGoToPrevious,
  onGoToNext,
}: TimelineControlsProps) => {
  return (
    <header className="flex items-center justify-end px-4 py-3 border-b">
      <div className="flex items-center gap-3">
        <Select
          value={viewRange}
          onValueChange={(value) => onViewRangeChange(value as ViewRange)}
          aria-label="Select view range"
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="View range" />
          </SelectTrigger>
          <SelectContent>
            {VIEW_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex" role="group" aria-label="Navigation controls">
          <Button
            variant="outline"
            size="icon"
            onClick={onGoToPrevious}
            aria-label="Previous period"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onGoToNext}
            aria-label="Next period"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export const TimelineControls = memo(TimelineControlsComponent);
