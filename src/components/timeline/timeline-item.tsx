import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { TimelineItemType } from "./timeline";

interface TimelineItemProps {
  item: TimelineItemType;
}

export function TimelineItem({ item }: TimelineItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${item.color} rounded-md p-2 border shadow-sm cursor-move`}
    >
      <div className="text-sm font-medium truncate">{item.name}</div>
    </div>
  );
}
