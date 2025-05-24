import { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  text: string;
  onSave: (newText: string) => void;
  isEditMode: boolean;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  text,
  onSave,
  isEditMode,
  className = '',
  placeholder = 'Click to edit...',
  multiline = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(text);
  }, [text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    const commonProps = {
      ref: inputRef as any,
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setEditValue(e.target.value),
      onKeyDown: handleKeyDown,
      onBlur: handleSave,
      className: `border border-blue-500 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`,
      placeholder
    };

    return multiline ? (
      <div className="relative">
        <textarea
          {...commonProps}
          rows={3}
          className={`${commonProps.className} resize-vertical`}
        />
        <div className="text-xs text-gray-500 mt-1">
          Ctrl+Enter to save, Escape to cancel
        </div>
      </div>
    ) : (
      <input
        {...commonProps}
        type="text"
      />
    );
  }

  return (
    <span
      onClick={handleEdit}
      className={`${className} ${isEditMode ? 'cursor-pointer hover:bg-blue-50 rounded px-1' : ''} ${!text ? 'text-gray-400' : ''}`}
      title={isEditMode ? 'Click to edit' : ''}
    >
      {text || placeholder}
    </span>
  );
};

export default EditableText;