import { useRef, useState, useEffect } from 'react';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  id,
  children,
  onDragStart,
  onDragEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Check if the drag handle was clicked
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      e.preventDefault();
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      onDragStart(id);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - startPosition.x,
          y: e.clientY - startPosition.y,
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd(id, position.x, position.y);

        // Reset position after dragging
        setPosition({ x: 0, y: 0 });
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, isDragging, onDragEnd, position.x, position.y, startPosition]);

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      style={{
        transform: isDragging ? `translate(${position.x}px, ${position.y}px)` : 'none',
        zIndex: isDragging ? 1000 : 1,
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {children}
      <div
        className="drag-handle absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white cursor-grab opacity-0 transition-opacity hover:opacity-100"
        title="Drag to reorder"
      >
        ≡
      </div>
    </div>
  );
};

export default DraggableSection;
