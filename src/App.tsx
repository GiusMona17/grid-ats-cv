import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import CVSection from './components/CVSection';
import CVSectionWrapper from './components/CVSectionWrapper';
import DraggableContainer from './components/DraggableContainer';
import AddSectionButton from './components/AddSectionButton';
import PDFExportButton from './components/PDFExportButton';
import CustomizationPanel from './components/CustomizationPanel';
import LoginModal from './components/LoginModal';
import type { CVData, SectionType, CVSectionItem, SectionData } from './types';
import { getDefaultCVData, createSection } from './services/cvService';
import { saveCV, loadCV, exportCVToFile, importCVFromFile, forceSave } from './services/storageService';
import { checkAuthentication, logout, startSessionCheck } from './services/authService';

function App() {
  const [cvData, setCvData] = useState<CVData>(getDefaultCVData());
  const [isDragging, setIsDragging] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cvContentRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = checkAuthentication();
    setIsAuthenticated(authStatus);

    // Start session monitoring only if authenticated
    let cleanup: (() => void) | undefined;
    
    if (authStatus) {
      cleanup = startSessionCheck(() => {
        setIsAuthenticated(false);
        setIsEditMode(false);
        alert('Sessione scaduta. Effettua nuovamente il login.');
      });
    }

    return cleanup;
  }, [isAuthenticated]);

  // Load data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const savedData = await loadCV();
        if (savedData) {
          setCvData(savedData);
        }
      } catch (error) {
        console.error('Errore caricamento dati iniziali:', error);
      }
    };

    loadInitialData();
  }, []);

  // Save function with debouncing
  const debouncedSave = useCallback(async (data: CVData) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const success = await saveCV(data);
        if (!success) {
          console.error('❌ Salvataggio fallito');
        }
      } catch (error) {
        console.error('❌ Errore durante il salvataggio:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  }, []);

  // Save whenever cvData changes
  useEffect(() => {
    debouncedSave(cvData);
  }, [cvData, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Handle adding a new section
  const handleAddSection = (type: SectionType, title: string) => {
    const newSection = createSection(
      type as SectionType,
      title,
      cvData.sections.length
    );

    setCvData(prevData => ({
      ...prevData,
      sections: [...prevData.sections, newSection],
    }));
    
    console.log('➕ Sezione aggiunta:', title);
  };

  // Handle deleting a section
  const handleDeleteSection = (id: string) => {
    setCvData(prevData => ({
      ...prevData,
      sections: prevData.sections.filter((section) => section.id !== id),
    }));
    
    console.log('🗑️ Sezione eliminata:', id);
  };

  // Handle editing a section
  const handleEditSection = (id: string, updatedContent: SectionData) => {
    setCvData(prevData => ({
      ...prevData,
      sections: prevData.sections.map((section) =>
        section.id === id ? { ...section, content: updatedContent } : section
      ),
    }));
    
    console.log('✏️ Sezione modificata:', id);
  };

  // Handle updating CV title/subtitle
  const handleHeaderEdit = (field: 'title' | 'subtitle', value: string) => {
    setCvData(prevData => ({
      ...prevData,
      [field]: value,
    }));
    
    console.log('📝 Header modificato:', field, '=', value);
  };

  // Handle section resize
  const handleSectionResize = (id: string, width: number, height: number) => {
    setCvData(prevData => ({
      ...prevData,
      sections: prevData.sections.map((section) =>
        section.id === id ? { ...section, width, height } : section
      ),
    }));
    
    console.log('📏 Sezione ridimensionata:', id, `${width}x${height}`);
  };

  // Handle theme update
  const handleThemeUpdate = (theme: string) => {
    setCvData(prevData => ({
      ...prevData,
      theme
    }));
    
    console.log('🎨 Tema cambiato:', theme);
  };

  // Reset to default data
  const handleResetData = () => {
    setCvData(getDefaultCVData());
    console.log('🔄 Dati resettati');
  };

  // Handle login
  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setIsEditMode(false);
  };

  // Toggle edit mode (requires authentication)
  const handleToggleEditMode = () => {
    if (!isEditMode) {
      // Entering edit mode - check authentication
      if (!isAuthenticated) {
        setShowLoginModal(true);
        return;
      }
    }
    setIsEditMode(!isEditMode);
    console.log('🔧 Edit mode:', !isEditMode ? 'ON' : 'OFF');
  };

  // Handle successful login and enter edit mode
  const handleLoginSuccess = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setIsEditMode(true);
    }
  };

  // Handle reordering sections
  const handleReorderSections = (reorderedItems: { id: string; order: number }[]) => {
    // Create a map of id -> order for easier access
    const orderMap = new Map<string, number>();
    reorderedItems.forEach(item => {
      orderMap.set(item.id, item.order);
    });

    // Update all sections with the new order
    setCvData(prevData => ({
      ...prevData,
      sections: prevData.sections.map(section => ({
        ...section,
        order: orderMap.get(section.id) ?? section.order,
      })),
    }));
    
    console.log('🔄 Sezioni riordinate');
  };

  // Handle data export
  const handleExportData = () => {
    try {
      exportCVToFile(cvData);
      alert('✅ Dati esportati con successo!');
    } catch (error) {
      console.error('❌ Export fallito:', error);
      alert('❌ Errore durante l\'esportazione');
    }
  };

  // Handle data import
  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importCVFromFile(file);
      setCvData(importedData);
      alert('✅ Dati importati con successo!');
      console.log('📥 Dati importati');
    } catch (error) {
      console.error('❌ Import fallito:', error);
      alert('❌ Errore durante l\'importazione. Verifica che il file sia valido.');
    }

    // Reset file input
    event.target.value = '';
  };

  // Force save for debugging
  const handleForceSave = () => {
    forceSave(cvData);
    alert('💾 Salvataggio forzato eseguito - controlla la console');
  };

  // Set background color based on theme
  const getThemeStyles = () => {
    switch (cvData.theme) {
      case 'dark':
        return {
          background: '#1e293b',
          text: 'white',
          content: '#475569'
        };
      case 'blue':
        return {
          background: '#1e40af',
          text: 'white',
          content: '#3b82f6'
        };
      case 'teal':
        return {
          background: '#0d9488',
          text: 'white',
          content: '#5eead4'
        };
      case 'purple':
        return {
          background: '#7e22ce',
          text: 'white',
          content: '#c084fc'
        };
      case 'red':
        return {
          background: '#b91c1c',
          text: 'white',
          content: '#fca5a5'
        };
      default:
        return {
          background: '#18181b',
          text: 'white',
          content: 'white'
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div
      className="min-h-screen p-4 md:p-8 transition-all duration-300"
      style={{ backgroundColor: themeStyles.background }}
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-4xl font-bold cursor-pointer"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleHeaderEdit('title', e.currentTarget.textContent || '')}
              >
                {cvData.title}
              </h1>
              {isEditMode && (
                <button
                  className="text-zinc-400 hover:text-white"
                  title="Edit title"
                >
                  ✎
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p
                className="text-zinc-400 cursor-pointer"
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleHeaderEdit('subtitle', e.currentTarget.textContent || '')}
              >
                {cvData.subtitle}
              </p>
              {isEditMode && (
                <button
                  className="text-zinc-400 hover:text-white"
                  title="Edit subtitle"
                >
                  ✎
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3 items-center">
            {/* Indicatore salvataggio */}
            {isSaving && (
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                💾 Salvando...
              </div>
            )}
            
            {isEditMode && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={handleToggleEditMode}
              >
                Exit Edit Mode
              </button>
            )}
            
            {isAuthenticated && !isEditMode && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                onClick={handleToggleEditMode}
              >
                Edit Mode
              </button>
            )}

            {/* Debug button */}
            {process.env.NODE_ENV === 'development' && (
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                onClick={handleForceSave}
                title="Force Save (Debug)"
              >
                💾
              </button>
            )}

            {isAuthenticated && (
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                onClick={handleLogout}
                title="Logout"
              >
                🚪 Logout
              </button>
            )}

            <PDFExportButton 
              contentRef={cvContentRef} 
              filename={`${cvData.title.toLowerCase().replace(/\s+/g, '-')}.pdf`} 
            />
          </div>
        </header>

        <main
          id="cv-content"
          ref={cvContentRef}
          className="bg-white rounded-lg p-6 shadow-lg transition-all duration-300"
        >
          <DraggableContainer
            items={cvData.sections.map(s => ({ id: s.id, order: s.order }))}
            onReorder={handleReorderSections}
            isEditMode={isEditMode}
          >
            {cvData.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <CVSectionWrapper
                  key={section.id}
                  id={section.id}
                  type={section.type}
                  title={section.title}
                  content={section.content}
                  width={section.width}
                  height={section.height}
                  onDelete={isEditMode ? handleDeleteSection : undefined}
                  onEdit={handleEditSection}
                  onResize={handleSectionResize}
                  isEditMode={isEditMode}
                  draggable={isEditMode}
                />
              ))}
          </DraggableContainer>
        </main>

        <div className="mt-6">
          {isEditMode && <AddSectionButton onAddSection={handleAddSection} />}
        </div>

        <CustomizationPanel
          onUpdateTheme={handleThemeUpdate}
          onResetData={handleResetData}
          onToggleEditMode={handleToggleEditMode}
          onExportData={handleExportData}
          onImportData={handleImportData}
          isEditMode={isEditMode}
        />

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSuccess}
        />
      </div>
    </div>
  );
}

export default App;