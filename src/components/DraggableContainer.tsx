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

  console.log('🔄 DraggableContainer render:', { isEditMode, itemsCount: items.length });

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!isEditMode) {
      e.preventDefault();
      return;
    }

    console.log('🔄 Drag start:', id);
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';

    // Add visual feedback
    const element = e.target as HTMLElement;
    element.style.opacity = '0.5';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode || !draggedItemId) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropTargetId: string) => {
    if (!isEditMode) return;

    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    console.log('📦 Drop:', { draggedId, dropTargetId });

    if (draggedId === dropTargetId) {
      handleDragEnd();
      return;
    }

    // Find current items
    const currentItems = [...items].sort((a, b) => a.order - b.order);
    const draggedIndex = currentItems.findIndex(item => item.id === draggedId);
    const dropIndex = currentItems.findIndex(item => item.id === dropTargetId);

    if (draggedIndex === -1 || dropIndex === -1) {
      console.error('❌ Item non trovato:', { draggedId, dropTargetId });
      handleDragEnd();
      return;
    }

    // Reorder items
    const newItems = [...currentItems];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    // Update orders
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    }));

    console.log('✅ Reorder:', reorderedItems.map(item => item.id));
    onReorder(reorderedItems);
    handleDragEnd();
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (draggedItemId) {
      const element = document.querySelector(`[data-section-id="${draggedItemId}"]`) as HTMLElement;
      if (element) {
        element.style.opacity = '1';
      }
    }
    setDraggedItemId(null);
    console.log('🏁 Drag end');
  };

  // Enhanced children with drag handlers
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    const childId = child.props.id;
    if (!childId) return child;

    const isDragged = draggedItemId === childId;

    return React.cloneElement(child, {
      ...child.props,
      'data-section-id': childId,
      draggable: isEditMode,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, childId),
      onDragOver: handleDragOver,
      onDrop: (e: React.DragEvent) => handleDrop(e, childId),
      onDragEnd: handleDragEnd,
      style: {
        ...child.props.style,
        cursor: isEditMode ? 'move' : 'default',
        opacity: isDragged ? 0.5 : 1,
        transition: 'opacity 0.2s ease',
        border: isEditMode ? '2px dashed transparent' : 'none',
      },
      className: `${child.props.className || ''} ${isEditMode ? 'draggable-section' : ''}`,
    });
  });

  return (
    <div className="draggable-container">
      {isEditMode && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
          <p className="text-blue-800 text-sm">
            🔄 <strong>Modalità Drag & Drop attiva</strong><br />
            Trascina le sezioni per riordinarle. Stato: {draggedItemId ? `Trascinando ${draggedItemId}` : 'Pronto'}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {enhancedChildren}
      </div>
    </div>
  );
};

export default DraggableContainer;