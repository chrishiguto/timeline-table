import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  CollisionDetection,
} from "@dnd-kit/core";
import { ReactNode } from "react";

const leftEdgeCollisionDetection: CollisionDetection = ({
  collisionRect,
  droppableRects,
  droppableContainers,
}) => {
  const activeRect = collisionRect;
  if (!activeRect) {
    return [];
  }

  const leftEdgeRect = {
    ...activeRect,
    width: 1,
  };

  return droppableContainers
    .filter((container) => {
      const rect = droppableRects.get(container.id);
      if (!rect) {
        return false;
      }

      return (
        leftEdgeRect.left >= rect.left &&
        leftEdgeRect.left <= rect.right &&
        leftEdgeRect.top < rect.bottom &&
        leftEdgeRect.bottom > rect.top
      );
    })
    .map((container) => {
      return {
        id: container.id,
        data: { droppableContainer: container },
      };
    })
    .sort((a, b) => {
      const rectA = droppableRects.get(a.id);
      const rectB = droppableRects.get(b.id);

      if (!rectA || !rectB) {
        return 0;
      }

      return rectA.left - rectB.left;
    });
};

interface TimelineDndContextProps {
  children: ReactNode;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}

export function TimelineDndContext({
  children,
  onDragOver,
  onDragEnd,
}: TimelineDndContextProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={leftEdgeCollisionDetection}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      autoScroll={false}
    >
      {children}
    </DndContext>
  );
}
