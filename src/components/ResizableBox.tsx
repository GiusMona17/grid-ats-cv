import { useState, useRef, useEffect } from 'react';

interface ResizableBoxProps {
  id: string;
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  className?: string;
  isEditMode?: boolean;
  onDelete?: (id: string) => void;
  onResize?: (id: string, width: number, height: number) => void;
}

type ResizeHandlePosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top' | 'right' | 'bottom' | 'left';

const ResizableBox: React.FC<ResizableBoxProps> = ({
  id,
  children,
  initialWidth,
  initialHeight,
  minWidth = 200,
  minHeight = 100,
  className = '',
  isEditMode = false,
  onDelete,
  onResize,
}) => {
  const [width, setWidth] = useState<number | undefined>(initialWidth);
  const [height, setHeight] = useState<number | undefined>(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<ResizeHandlePosition | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !activeHandle || !boxRef.current) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      let newWidth = startPosRef.current.width;
      let newHeight = startPosRef.current.height;

      // Handle different resize directions
      if (activeHandle.includes('right')) {
        newWidth = Math.max(minWidth, startPosRef.current.width + deltaX);
      } else if (activeHandle.includes('left')) {
        newWidth = Math.max(minWidth, startPosRef.current.width - deltaX);
      }

      if (activeHandle.includes('bottom')) {
        newHeight = Math.max(minHeight, startPosRef.current.height + deltaY);
      } else if (activeHandle.includes('top')) {
        newHeight = Math.max(minHeight, startPosRef.current.height - deltaY);
      }

      setWidth(newWidth);
      setHeight(newHeight);

      if (onResize) {
        onResize(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setActiveHandle(null);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, id, minWidth, minHeight, onResize, activeHandle]);

  // Handle clicks outside the box to deselect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsSelected(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResizeStart = (e: React.MouseEvent, position: ResizeHandlePosition) => {
    e.preventDefault();
    e.stopPropagation();

    if (!boxRef.current) return;

    setIsResizing(true);
    setActiveHandle(position);
    setIsSelected(true);

    const currentWidth = width || boxRef.current.offsetWidth;
    const currentHeight = height || boxRef.current.offsetHeight;

    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: currentWidth,
      height: currentHeight
    };
  };

  const handleBoxClick = () => {
    if (isEditMode) {
      setIsSelected(true);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  // Style object for dynamic sizing
  const boxStyle: React.CSSProperties = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    minWidth: `${minWidth}px`,
    minHeight: `${minHeight}px`,
  };

  return (
    <div
      ref={boxRef}
      className={`resizable-box ${isSelected ? 'selected' : ''} ${isEditMode ? 'editing' : ''} ${className}`}
      style={boxStyle}
      onClick={handleBoxClick}
    >
      {isSelected && isEditMode && onDelete && (
        <div className="box-controls">
          <button
            className="control-button"
            onClick={handleDelete}
            title="Delete"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="w-full h-full">
        {children}
      </div>
      
      {isSelected && isEditMode && (
        <>
          <div
            className="resize-handle bottom-right"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          />
          <div
            className="resize-handle bottom-left"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div
            className="resize-handle top-right"
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div
            className="resize-handle top-left"
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          />
          <div
            className="resize-handle top"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
          />
          <div
            className="resize-handle right"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />
          <div
            className="resize-handle bottom"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          />
          <div
            className="resize-handle left"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />
        </>
      )}
    </div>
  );
};

export default ResizableBox;