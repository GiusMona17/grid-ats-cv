import { useState } from 'react';
import { SectionType } from '../types';

interface AddSectionButtonProps {
  onAddSection: (type: SectionType, title: string) => void;
}

const AddSectionButton: React.FC<AddSectionButtonProps> = ({ onAddSection }) => {
  const [showMenu, setShowMenu] = useState(false);

  const sectionTypes = [
    { type: 'profile', label: 'Profile' },
    { type: 'experience', label: 'Experience' },
    { type: 'skills', label: 'Skills' },
    { type: 'education', label: 'Education' },
    { type: 'interests', label: 'Interests' },
    { type: 'apps', label: 'Apps' },
    { type: 'custom', label: 'Custom Section' },
  ];

  return (
    <div className="relative my-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        onClick={() => setShowMenu(!showMenu)}
      >
        <span>Add Section</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {showMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 w-64">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Choose section type</h3>
            <div className="space-y-1">
              {sectionTypes.map((section) => (
                <button
                  key={section.type}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                  onClick={() => {
                    onAddSection(section.type, section.label);
                    setShowMenu(false);
                  }}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSectionButton;
