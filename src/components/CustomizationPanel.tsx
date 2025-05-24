import { useState, useRef } from 'react';

interface CustomizationPanelProps {
  onUpdateTheme: (theme: string) => void;
  onResetData: () => void;
  onToggleEditMode: () => void;
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isEditMode: boolean;
}
const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  onUpdateTheme,
  onResetData,
  onToggleEditMode,
  isEditMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'light', label: 'Light', color: '#ffffff', textColor: '#000000' },
    { id: 'dark', label: 'Dark', color: '#1e293b', textColor: '#ffffff' },
    { id: 'blue', label: 'Blue', color: '#1e40af', textColor: '#ffffff' },
    { id: 'teal', label: 'Teal', color: '#0d9488', textColor: '#ffffff' },
    { id: 'purple', label: 'Purple', color: '#7e22ce', textColor: '#ffffff' },
    { id: 'red', label: 'Red', color: '#b91c1c', textColor: '#ffffff' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 w-80' : 'max-h-0 w-0'
        }`}
      >
        <div className="p-4">
          <h3 className="font-medium mb-4">Customization Options</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  className="flex flex-col items-center p-2 border rounded hover:bg-gray-50"
                  onClick={() => onUpdateTheme(theme.id)}
                >
                  <div
                    className="w-8 h-8 rounded-full mb-1"
                    style={{ backgroundColor: theme.color }}
                  ></div>
                  <span className="text-xs">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Layout Options</label>
            <button
              className={`w-full py-2 px-3 rounded mb-2 ${
                isEditMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={onToggleEditMode}
            >
              {isEditMode ? 'Exit Editing Mode' : 'Enter Editing Mode'}
            </button>
          </div>

          <div className="pt-2 border-t">
            <button
              className="w-full py-2 bg-red-50 text-red-500 rounded hover:bg-red-100"
              onClick={() => {
                if (window.confirm('Reset to default data? This cannot be undone.')) {
                  onResetData();
                }
              }}
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      <button
        className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close options' : 'Open customization options'}
      >
        {isOpen ? '✕' : '⚙️'}
      </button>
    </div>
  );
};

export default CustomizationPanel;
