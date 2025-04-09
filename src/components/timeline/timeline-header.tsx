import { useEffect, useRef, useState } from "react";

interface TimelineHeaderProps {
  dates: Date[];
  dayWidth: number;
}

export function TimelineHeader({ dates, dayWidth }: TimelineHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calculatedDayWidth, setCalculatedDayWidth] = useState(dayWidth);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDayWidth = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const newDayWidth =
        dates.length > 0 ? Math.floor(containerWidth / dates.length) : dayWidth;
      setCalculatedDayWidth(newDayWidth);
    };

    updateDayWidth();

    const resizeObserver = new ResizeObserver(updateDayWidth);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [dates.length, dayWidth]);

  return (
    <header
      className="sticky top-0 bg-background z-10 border-b"
      ref={containerRef}
    >
      <div className="w-full flex h-10 bg-slate-50">
        {dates.map((date) => {
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isToday = isSameDay(date, new Date());

          return (
            <div
              key={date.toISOString()}
              className={`flex-shrink-0 flex flex-col items-center justify-center text-center text-xs p-2 ${
                isWeekend ? "bg-muted/30" : ""
              } ${isToday ? "bg-blue-50 font-semibold" : ""}`}
              style={{ width: `${calculatedDayWidth}px` }}
            >
              <div className="text-muted-foreground">
                {date.toLocaleDateString("default", { weekday: "short" })}
              </div>
              <div className={`${isToday ? "text-blue-600" : "font-medium"}`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
