import { useRef, useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Event } from "./timeline";
import { differenceInDays, isAfter, isBefore, startOfDay } from "date-fns";
import { Input } from "@/components/ui/input";

interface TimelineEventProps {
  event: Event;
  startDate: Date;
  endDate: Date | null;
  dayWidth: number;
  onUpdate?: (id: number, title: string) => void;
}

export function TimelineEvent({
  event,
  startDate,
  endDate,
  dayWidth,
  onUpdate,
}: TimelineEventProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(event.title);

  const inputId = `event-input-${event.id}`;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: event.id,
      disabled: isEditing,
    });

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        const inputElement = document.getElementById(
          inputId
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
          inputElement.select();
        }
      }, 10);
    }
  }, [isEditing, inputId]);

  const getEventPosition = () => {
    const startDay = startOfDay(startDate);
    const eventStartDay = startOfDay(event.startDate);

    const isTruncatedStart = isBefore(eventStartDay, startDay);
    const calculationStartDate = isTruncatedStart ? startDay : eventStartDay;

    const startDiff = isTruncatedStart
      ? 0
      : differenceInDays(eventStartDay, startDay);

    const visibleEndDate =
      endDate && isAfter(event.endDate, endDate) ? endDate : event.endDate;

    const duration =
      differenceInDays(startOfDay(visibleEndDate), calculationStartDate) + 1;

    const left = startDiff * dayWidth;
    const width = duration * dayWidth;

    const isTruncatedEnd = endDate && isAfter(event.endDate, endDate);

    return {
      left,
      width,
      isTruncatedStart,
      isTruncatedEnd,
      startDay,
      shouldRender: !isAfter(startDay, event.endDate),
    };
  };

  const { left, width, isTruncatedStart, isTruncatedEnd, shouldRender } =
    getEventPosition();

  if (!shouldRender) {
    return null;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });
  };

  const dateRange = `${formatDate(event.startDate)} - ${formatDate(
    event.endDate
  )}`;

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    left: `${left}px`,
    width: `${width}px`,
    top: `${(event.lane || 0) * 60 + 8}px`,
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Double click event", onUpdate);
    if (onUpdate) {
      setIsEditing(true);
    }
  };

  const handleEventClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Click event");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveChanges();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const saveChanges = () => {
    if (editValue.trim() !== "" && editValue !== event.title && onUpdate) {
      onUpdate(event.id, editValue);
    } else {
      setEditValue(event.title);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(event.title);
    setIsEditing(false);
  };

  return (
    <div
      ref={containerRef}
      style={style}
      className={`absolute rounded-md border p-2 cursor-move ${
        event.color
      } shadow-sm overflow-hidden ${
        isTruncatedStart ? "rounded-l-none border-l-0" : ""
      } ${isTruncatedEnd ? "rounded-r-none border-r-0" : ""}`}
      onDoubleClick={handleDoubleClick}
      onClick={handleEventClick}
    >
      <div
        ref={setNodeRef}
        className="w-full h-full px-4"
        {...(isEditing ? {} : { ...listeners, ...attributes })}
      >
        {isEditing ? (
          <Input
            id={inputId}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveChanges}
            onKeyDown={handleKeyDown}
            className="h-7 px-1 bg-transparent border-none shadow-none focus-visible:ring-1 focus-visible:ring-offset-0"
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <div className="font-medium truncate">{event.title}</div>
        )}
        <div className="text-xs truncate">{dateRange}</div>
      </div>

      {isTruncatedEnd && (
        <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-r from-transparent to-gray-300 opacity-70" />
      )}

      {isTruncatedStart && (
        <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-l from-transparent to-gray-300 opacity-70" />
      )}
    </div>
  );
}
