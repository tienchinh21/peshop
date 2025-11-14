"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import _ from "lodash";

interface ImageItem {
  id: string;
  url: string;
}

interface SortableImageListProps {
  images: ImageItem[];
  onReorder: (images: ImageItem[]) => void;
  onRemove: (id: string) => void;
}

interface SortableImageItemProps {
  image: ImageItem;
  onRemove: (id: string) => void;
  index: number;
}

function SortableImageItem({ image, onRemove, index }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
    >
      <Image
        src={image.url}
        alt={`Product image ${index + 1}`}
        fill
        className="object-cover"
      />
      
      <div className="absolute top-2 left-2 bg-white rounded px-2 py-1 text-xs font-medium shadow">
        {index + 1}
      </div>

      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 bg-white rounded p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shadow"
      >
        <GripVertical className="w-4 h-4 text-gray-600" />
      </div>

      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(image.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SortableImageList({
  images,
  onReorder,
  onRemove,
}: SortableImageListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = _.findIndex(images, (img) => img.id === active.id);
      const newIndex = _.findIndex(images, (img) => img.id === over.id);
      const reorderedImages = arrayMove(images, oldIndex, newIndex);
      onReorder(reorderedImages);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-4 gap-4">
          {_.map(images, (image, index) => (
            <SortableImageItem
              key={image.id}
              image={image}
              onRemove={onRemove}
              index={index}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

