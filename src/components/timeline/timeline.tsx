import { useState, useEffect, useRef } from "react";
import { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { TimelineHeader } from "@/components/timeline/timeline-header";
import {
  addDays,
  differenceInDays,
  parseISO,
  format,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { TimelineControls, ViewRange } from "./timeline-controls";
import { TimelineDndContext } from "./timeline-dnd-context";
import { TimelineDayGrid } from "./timeline-day-grid";
import { TimelineEventLayer } from "./timeline-event-layer";
import { assignLanes } from "@/lib/assign-lanes";
import timelineItems from "../../timelineItems";

export type TimelineItemType = {
  id: string;
  name: string;
  color: string;
};

export interface Event {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  lane?: number;
}

const DAY_WIDTH = 60;
const COLOR_CLASSES = [
  "bg-blue-100 border-blue-200",
  "bg-green-100 border-green-200",
  "bg-purple-200 border-purple-300",
  "bg-orange-200 border-orange-300",
  "bg-yellow-100 border-yellow-200",
  "bg-pink-100 border-pink-200",
  "bg-indigo-100 border-indigo-200",
  "bg-red-100 border-red-200",
  "bg-blue-500 border-blue-600 text-white",
  "bg-green-500 border-green-600 text-white",
];

const convertTimelineItems = () => {
  return timelineItems.map((item, index) => ({
    id: item.id,
    title: item.name,
    startDate: parseISO(item.start),
    endDate: parseISO(item.end),
    color: COLOR_CLASSES[index % COLOR_CLASSES.length],
  }));
};

export function Timeline() {
  const [events, setEvents] = useState<Event[]>(convertTimelineItems());
  const [dates, setDates] = useState<Date[]>([]);
  const [viewRange, setViewRange] = useState<ViewRange>("2weeks");
  const [startDate, setStartDate] = useState<Date>(new Date(2021, 0, 15));
  const [eventsWithLanes, setEventsWithLanes] = useState<Event[]>([]);
  const [actualDayWidth, setActualDayWidth] = useState(DAY_WIDTH);
  const [hoveredDateRange, setHoveredDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const daysToShow =
      viewRange === "1week" ? 7 : viewRange === "2weeks" ? 14 : 30;
    const newDates: Date[] = [];

    for (let i = 0; i < daysToShow; i++) {
      const date = addDays(startDate, i);
      newDates.push(date);
    }

    setDates(newDates);
  }, [startDate, viewRange]);

  useEffect(() => {
    if (!gridContainerRef.current || dates.length === 0) return;

    const updateDayWidth = () => {
      const gridWidth = gridContainerRef.current?.offsetWidth || 0;

      const calculatedWidth = Math.floor(
        Math.max(DAY_WIDTH, gridWidth / dates.length)
      );

      setActualDayWidth(calculatedWidth);
    };

    updateDayWidth();

    const resizeObserver = new ResizeObserver(updateDayWidth);

    if (gridContainerRef.current) {
      resizeObserver.observe(gridContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [dates.length]);

  useEffect(() => {
    if (events.length === 0 || dates.length === 0) return;

    const rangeStart = dates[0];
    const rangeEnd = dates[dates.length - 1];

    const visibleEvents = events.filter((event) => {
      return event.endDate >= rangeStart && event.startDate <= rangeEnd;
    });

    const { itemsWithLanes } = assignLanes(visibleEvents);
    setEventsWithLanes(itemsWithLanes);
  }, [events, dates]);

  const findExactDate = (dateString: string): Date | undefined => {
    const parsedDate = parseISO(dateString);

    for (let i = 0; i < dates.length; i++) {
      if (isSameDay(dates[i], parsedDate)) {
        return dates[i];
      }
    }

    return undefined;
  };

  const calculateEventDateRange = (
    eventId: number,
    targetDateString: string
  ) => {
    let event: Event | undefined;
    for (let i = 0; i < events.length; i++) {
      if (events[i].id === eventId) {
        event = events[i];
        break;
      }
    }

    if (!event) return null;

    const targetDate = findExactDate(targetDateString);
    if (!targetDate) return null;

    const duration = differenceInDays(event.endDate, event.startDate);
    const endDate = addDays(targetDate, duration);

    return {
      start: format(targetDate, "yyyy-MM-dd"),
      end: format(endDate, "yyyy-MM-dd"),
    };
  };

  const isDateInHoveredRange = (dateString: string) => {
    if (!hoveredDateRange) return false;

    const date = parseISO(dateString);
    const startDate = parseISO(hoveredDateRange.start);
    const endDate = parseISO(hoveredDateRange.end);

    return isWithinInterval(date, { start: startDate, end: endDate });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      setHoveredDateRange(null);
      return;
    }

    const itemId = Number(active.id);
    const dateString = over.id as string;

    const range = calculateEventDateRange(itemId, dateString);
    setHoveredDateRange(range);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setHoveredDateRange(null);

    if (!over) return;

    const itemId = Number(active.id);
    const newDateString = over.id as string;

    const exactDate = findExactDate(newDateString);
    if (!exactDate) return;

    setEvents((prevEvents) =>
      prevEvents.map((item) => {
        if (item.id === itemId) {
          const duration = differenceInDays(item.endDate, item.startDate);

          const newEndDate = addDays(exactDate, duration);

          return {
            ...item,
            startDate: exactDate,
            endDate: newEndDate,
          };
        }
        return item;
      })
    );
  };

  const goToPrevious = () => {
    const daysToSubtract =
      viewRange === "1week" ? 7 : viewRange === "2weeks" ? 14 : 30;

    const newStartDate = addDays(startDate, -daysToSubtract);
    setStartDate(newStartDate);
  };

  const goToNext = () => {
    const daysToAdd =
      viewRange === "1week" ? 7 : viewRange === "2weeks" ? 14 : 30;

    const newStartDate = addDays(startDate, daysToAdd);
    setStartDate(newStartDate);
  };

  const handleUpdateEventTitle = (id: number, newTitle: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, title: newTitle } : event
      )
    );
  };

  const endDate = dates.length > 0 ? dates[dates.length - 1] : null;

  return (
    <div className="flex-1 flex flex-col">
      <TimelineControls
        viewRange={viewRange}
        onViewRangeChange={setViewRange}
        onGoToPrevious={goToPrevious}
        onGoToNext={goToNext}
      />

      <TimelineDndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div
          className="flex flex-1 h-full overflow-hidden"
          ref={scrollContainerRef}
        >
          <div className="min-w-full" ref={gridContainerRef}>
            <TimelineHeader dates={dates} dayWidth={actualDayWidth} />
            <div className="relative bg-white h-full">
              <TimelineDayGrid
                dates={dates}
                dayWidth={actualDayWidth}
                isDateInHoveredRange={isDateInHoveredRange}
              />

              <TimelineEventLayer
                events={eventsWithLanes}
                startDate={dates[0]}
                endDate={endDate}
                dayWidth={actualDayWidth}
                onUpdate={handleUpdateEventTitle}
              />
            </div>
          </div>
        </div>
      </TimelineDndContext>
    </div>
  );
}
