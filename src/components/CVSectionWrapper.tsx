import React from 'react';
import CVSection from './CVSection';
import { SectionData, SectionType } from '../types';

interface CVSectionWrapperProps {
  id: string;
  type: SectionType;
  title: string;
  content: SectionData;
  width?: number;
  height?: number;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, data: SectionData) => void;
  onResize?: (id: string, width: number, height: number) => void;
  className?: string;
  isEditMode?: boolean;
  draggable?: boolean;
  // Drag and drop props
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  style?: React.CSSProperties;
  'data-section-id'?: string;
}

const CVSectionWrapper: React.FC<CVSectionWrapperProps> = ({
  id,
  type,
  title,
  content,
  width,
  height,
  onDelete,
  onEdit,
  onResize,
  className = '',
  isEditMode = false,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  style,
  'data-section-id': dataSectionId,
  ...rest
}) => {
  return (
    <div
      className={`section-wrapper ${className}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      style={style}
      data-section-id={dataSectionId}
      {...rest}
    >
      {/* Drag indicator per edit mode */}
      {isEditMode && (
        <div className="drag-indicator" style={{ 
          position: 'absolute', 
          top: '8px', 
          left: '-24px', 
          fontSize: '18px', 
          color: '#3b82f6',
          cursor: 'move',
          zIndex: 10
        }}>
          ⋮⋮
        </div>
      )}
      
      <CVSection
        id={id}
        type={type}
        title={title}
        content={content}
        width={width}
        height={height}
        onDelete={onDelete}
        onEdit={onEdit}
        onResize={onResize}
        className="w-full"
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default CVSectionWrapper;