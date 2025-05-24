import { useState } from 'react';
import { CVData } from '../types';
import { saveCV, loadCV, forceSave } from '../services/storageService';

interface DebugPanelProps {
  cvData: CVData;
  onDataChange: (data: CVData) => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ cvData, onDataChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<string>('');

  const handleTestSave = async () => {
    const success = await saveCV(cvData);
    const time = new Date().toLocaleTimeString();
    setLastSaveTime(time);
    alert(success ? `✅ Salvataggio riuscito alle ${time}` : '❌ Salvataggio fallito');
  };

  const handleTestLoad = async () => {
    const loadedData = await loadCV();
    if (loadedData) {
      onDataChange(loadedData);
      alert('✅ Dati caricati dal storage');
    } else {
      alert('❌ Nessun dato trovato nel storage');
    }
  };

  const handleClearStorage = () => {
    if (confirm('Vuoi cancellare tutti i dati salvati?')) {
      localStorage.clear();
      alert('✅ Storage cancellato');
    }
  };

  const handleViewStorage = () => {
    const data = localStorage.getItem('cv-data');
    if (data) {
      console.log('📦 Dati nel localStorage:', JSON.parse(data));
      alert('📦 Dati visualizzati nella console (F12)');
    } else {
      alert('📭 Nessun dato nel localStorage');
    }
  };

  const handleAddTestSection = () => {
    const newSection = {
      id: 'test-' + Date.now(),
      type: 'custom' as const,
      title: 'Test Section',
      content: { content: 'Questa è una sezione di test creata alle ' + new Date().toLocaleTimeString() },
      order: cvData.sections.length
    };

    onDataChange({
      ...cvData,
      sections: [...cvData.sections, newSection]
    });

    alert('✅ Sezione di test aggiunta');
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Non mostrare in produzione
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-full text-sm font-bold"
        title="Debug Panel"
      >
        🛠️
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg p-4 w-80 border">
          <h3 className="font-bold text-lg mb-3 text-gray-800">🛠️ Debug Panel</h3>
          
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTestSave}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
              >
                💾 Test Save
              </button>
              
              <button
                onClick={handleTestLoad}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
              >
                📥 Test Load
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleViewStorage}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded"
              >
                👁️ View Data
              </button>
              
              <button
                onClick={handleClearStorage}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
              >
                🗑️ Clear All
              </button>
            </div>

            <button
              onClick={handleAddTestSection}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded"
            >
              ➕ Add Test Section
            </button>

            <div className="pt-2 border-t">
              <p className="text-gray-600">
                <strong>Sections:</strong> {cvData.sections.length}
              </p>
              <p className="text-gray-600">
                <strong>Last Save:</strong> {lastSaveTime || 'N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;