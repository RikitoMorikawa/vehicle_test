// src/components/ui-parts/SortableView360Images.tsx
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Move } from "lucide-react";

// ドラッグ可能な個別のアイテム
interface SortableItemProps {
  id: string;
  index: number;
  url: string;
  onRemove: (index: number) => void;
}

// ドラッグ可能な個別のアイテム
function SortableItem({ url, index, id, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className={`h-24 border rounded-md overflow-hidden ${isDragging ? "border-red-500 shadow-lg" : "border-gray-200"}`} {...attributes} {...listeners}>
        <div className="absolute top-0 right-0 bg-white text-xs px-1 rounded-bl-md">{index + 1}</div>
        <img src={url} alt={`360ビュー ${index + 1}`} className="h-full w-full object-cover" draggable={false} />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-50 transition-opacity">
          <Move className="h-8 w-8 text-black" />
        </div>
      </div>
    </div>
  );
}

interface SortableView360ImagesProps {
  images: string[];
  onImagesReorder: (newImages: string[]) => void;
  onRemoveImage: (index: number) => void;
}

export default function SortableView360Images({ images, onImagesReorder, onRemoveImage }: SortableView360ImagesProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8ピクセル動かすとドラッグ開始
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (images.length === 0) {
    return null;
  }

  // 各アイテムに一意のIDを割り当て - インデックスベースのIDを使用
  const items = images.map((url, index) => ({ id: `item-${index}`, url }));

  function handleDragEnd(event: { active: any; over: any; }) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // 古いインデックスと新しいインデックスを特定
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      // 新しい順序の画像配列を作成
      const newImages = arrayMove(images, oldIndex, newIndex);

      // 親コンポーネントに新しい順序を通知
      console.log("Reordering images:", { oldIndex, newIndex, newImages });
      onImagesReorder(newImages);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-600">アップロード済み: {images.length}枚</p>
        <p className="text-xs text-gray-500 italic">ドラッグして順序を変更できます</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {items.map((item, index) => (
              <SortableItem key={item.id} id={item.id} url={item.url} index={index} onRemove={onRemoveImage} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
