import type { Event } from "@/components/timeline/timeline";

interface Lane {
  endDate: Date;
  eventId: number;
}

interface AssignmentResult {
  itemsWithLanes: Event[];
  laneCount: number;
}

export function assignLanes(events: Event[]): AssignmentResult {
  if (!events || events.length === 0) {
    return { itemsWithLanes: [], laneCount: 0 };
  }

  const sortedEvents = [...events].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  const lanes: Lane[] = [];

  const itemsWithLanes = sortedEvents.map((event) => {
    const laneIndex = findAvailableLane(lanes, event);

    lanes[laneIndex] = {
      endDate: event.endDate,
      eventId: event.id,
    };

    return { ...event, lane: laneIndex };
  });

  return {
    itemsWithLanes,
    laneCount: lanes.length,
  };
}

function findAvailableLane(lanes: Lane[], event: Event): number {
  for (let i = 0; i < lanes.length; i++) {
    if (lanes[i].endDate < event.startDate) {
      return i;
    }
  }

  lanes.push({ endDate: new Date(0), eventId: -1 });
  return lanes.length - 1;
}
