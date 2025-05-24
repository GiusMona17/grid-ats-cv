import React from 'react';
import CVSection from './CVSection';
import { SectionData, CVSectionItem, SectionType } from '../types';

interface CVSectionWrapperProps {
  id: string;
  type: SectionType;
  title: string;
  content: SectionData;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, data: SectionData) => void;
  className?: string;
  isEditMode?: boolean;
  draggable?: boolean;
  'data-id'?: string;
}

const CVSectionWrapper: React.FC<CVSectionWrapperProps> = React.forwardRef<
  HTMLDivElement,
  CVSectionWrapperProps
>(({
  id,
  type,
  title,
  content,
  onDelete,
  onEdit,
  className = '',
  isEditMode = false,
  draggable,
  'data-id': dataId,
  ...rest
}, ref) => {
  return (
    <div
      ref={ref}
      className={`section-wrapper ${isEditMode && draggable ? 'cursor-move' : ''}`}
      {...rest}
    >
      {isEditMode && (
        <div className="drag-indicator">
          <span className="drag-handle">≡</span>
        </div>
      )}
      <CVSection
        id={id}
        type={type}
        title={title}
        content={content}
        onDelete={onDelete}
        onEdit={onEdit}
        className={className}
        isEditMode={isEditMode}
      />
    </div>
  );
});

CVSectionWrapper.displayName = 'CVSectionWrapper';

export default CVSectionWrapper;
