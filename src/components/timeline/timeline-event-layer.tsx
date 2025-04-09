import { Event } from "./timeline";
import { TimelineEvent } from "./timeline-event";

interface TimelineEventLayerProps {
  events: Event[];
  startDate: Date;
  endDate: Date | null;
  dayWidth: number;
  onUpdate?: (id: number, title: string) => void;
}

export function TimelineEventLayer({
  events,
  startDate,
  endDate,
  dayWidth,
  onUpdate,
}: TimelineEventLayerProps) {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {events.length > 0
        ? events.map((event) => (
            <TimelineEvent
              key={event.id}
              event={event}
              startDate={startDate}
              endDate={endDate}
              dayWidth={dayWidth}
              onUpdate={onUpdate}
            />
          ))
        : null}
    </div>
  );
}
