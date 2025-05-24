import React, { useState, ReactNode } from 'react';

interface DraggableItem {
  id: string;
  order: number;
}

interface DraggableContainerProps {
  children: ReactNode;
  items: DraggableItem[];
  onReorder: (items: DraggableItem[]) => void;
  isEditMode: boolean;
}

const DraggableContainer: React.FC<DraggableContainerProps> = ({
  children,
  items,
  onReorder,
  isEditMode
}) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Handle dragging start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);

    // Add some visual feedback
    setTimeout(() => {
      const element = document.getElementById(`section-${id}`);
      if (element) {
        element.style.opacity = '0.6';
      }
    }, 0);
  };

  // Handle dragging over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const dragId = e.dataTransfer.getData('text/plain');

    if (dragId === dropId || !isEditMode) return;

    // Find the items in the array
    const draggedItem = items.find(item => item.id === dragId);
    const dropItem = items.find(item => item.id === dropId);

    if (!draggedItem || !dropItem) return;

    // Swap the orders
    const draggedOrder = draggedItem.order;
    const dropOrder = dropItem.order;

    // Create a new array with updated orders
    const reorderedItems = items.map(item => {
      if (item.id === dragId) {
        return { ...item, order: dropOrder };
      }
      if (item.id === dropId) {
        return { ...item, order: draggedOrder };
      }
      return item;
    });

    // Update parent
    onReorder(reorderedItems);

    // Reset opacity
    const element = document.getElementById(`section-${dragId}`);
    if (element) {
      element.style.opacity = '1';
    }

    setDraggedItemId(null);
  };

  // Handle end of dragging
  const handleDragEnd = () => {
    if (draggedItemId) {
      const element = document.getElementById(`section-${draggedItemId}`);
      if (element) {
        element.style.opacity = '1';
      }
    }
    setDraggedItemId(null);
  };

  // Create child elements with drag props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // Get the id from child props
      const childId = child.props.id;

      if (!childId) return child;

      // Add drag handlers
      return React.cloneElement(child, {
        ...child.props,
        id: `section-${childId}`,
        draggable: isEditMode,
        onDragStart: (e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, childId),
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: (e: React.DragEvent<HTMLDivElement>) => handleDrop(e, childId),
        onDragEnd: handleDragEnd,
      });
    }
    return child;
  });

  return (
    <div className="draggable-container">
      {childrenWithProps}
    </div>
  );
};

export default DraggableContainer;
