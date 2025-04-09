import { useDroppable } from "@dnd-kit/core";
import { format } from "date-fns";

interface TimelineDayGridProps {
  dates: Date[];
  dayWidth: number;
  isDateInHoveredRange: (dateString: string) => boolean;
}

export function TimelineDayGrid({
  dates,
  dayWidth,
  isDateInHoveredRange,
}: TimelineDayGridProps) {
  return (
    <div className="absolute inset-0 z-0 flex pointer-events-none">
      {dates.map((date) => {
        const dateString = format(date, "yyyy-MM-dd");
        const isInHoveredRange = isDateInHoveredRange(dateString);

        return (
          <div
            key={`day-${date.toISOString()}`}
            className="h-full border-r"
            style={{ width: `${dayWidth}px` }}
          >
            <DroppableDay
              date={dateString}
              isInHoveredRange={isInHoveredRange}
            />
          </div>
        );
      })}
    </div>
  );
}

interface DroppableDayProps {
  date: string;
  isInHoveredRange: boolean;
}

export function DroppableDay({ date, isInHoveredRange }: DroppableDayProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: date,
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-full w-full pointer-events-auto ${
        isOver ? "bg-blue-100/50" : isInHoveredRange ? "bg-blue-100/30" : ""
      }`}
      data-date={date}
    />
  );
}
