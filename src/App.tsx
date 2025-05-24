import { useState, useEffect, useRef } from 'react';
import './App.css';
import CVSection from './components/CVSection';
import CVSectionWrapper from './components/CVSectionWrapper';
import DraggableContainer from './components/DraggableContainer';
import AddSectionButton from './components/AddSectionButton';
import PDFExportButton from './components/PDFExportButton';
import CustomizationPanel from './components/CustomizationPanel';
import type { CVData, SectionType, CVSectionItem, SectionData } from './types';
import { getDefaultCVData, createSection, saveCV, loadCV } from './services/cvService';

function App() {
  const [cvData, setCvData] = useState<CVData>(getDefaultCVData());
  const [isDragging, setIsDragging] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const cvContentRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = loadCV();
    if (savedData) {
      setCvData(savedData);
    }
  }, []);

  // Save to localStorage whenever cvData changes
  useEffect(() => {
    saveCV(cvData);
  }, [cvData]);

  // Handle adding a new section
  const handleAddSection = (type: SectionType, title: string) => {
    const newSection = createSection(
      type as SectionType,
      title,
      cvData.sections.length
    );

    setCvData({
      ...cvData,
      sections: [...cvData.sections, newSection],
    });
  };

  // Handle deleting a section
  const handleDeleteSection = (id: string) => {
    setCvData({
      ...cvData,
      sections: cvData.sections.filter((section) => section.id !== id),
    });
  };

  // Handle editing a section
  const handleEditSection = (id: string, updatedContent: SectionData) => {
    setCvData({
      ...cvData,
      sections: cvData.sections.map((section) =>
        section.id === id ? { ...section, content: updatedContent } : section
      ),
    });
  };

  // Handle updating CV title/subtitle
  const handleHeaderEdit = (field: 'title' | 'subtitle', value: string) => {
    setCvData({
      ...cvData,
      [field]: value,
    });
  };

  // Handle section resize
  const handleSectionResize = (id: string, width: number, height: number) => {
    setCvData({
      ...cvData,
      sections: cvData.sections.map((section) =>
        section.id === id ? { ...section, width, height } : section
      ),
    });
  };

  // Handle theme update
  const handleThemeUpdate = (theme: string) => {
    setCvData({
      ...cvData,
      theme
    });
  };

  // Reset to default data
  const handleResetData = () => {
    setCvData(getDefaultCVData());
  };

  // Toggle edit mode
  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Handle reordering sections
  const handleReorderSections = (reorderedItems: { id: string; order: number }[]) => {
    // Create a map of id -> order for easier access
    const orderMap = new Map<string, number>();
    reorderedItems.forEach(item => {
      orderMap.set(item.id, item.order);
    });

    // Update all sections with the new order
    setCvData({
      ...cvData,
      sections: cvData.sections.map(section => ({
        ...section,
        order: orderMap.get(section.id) ?? section.order,
      })),
    });
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
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleHeaderEdit('title', e.currentTarget.textContent || '')}
              >
                {cvData.title}
              </h1>
              <button
                className="text-zinc-400 hover:text-white"
                title="Edit title"
              >
                ✎
              </button>
            </div>
            <div className="flex items-center gap-2">
              <p
                className="text-zinc-400 cursor-pointer"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleHeaderEdit('subtitle', e.currentTarget.textContent || '')}
              >
                {cvData.subtitle}
              </p>
              <button
                className="text-zinc-400 hover:text-white"
                title="Edit subtitle"
              >
                ✎
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            {isEditMode && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={handleToggleEditMode}
              >
                Exit Edit Mode
              </button>
            )}
            <PDFExportButton contentRef={cvContentRef} filename={`${cvData.title.toLowerCase().replace(/\s+/g, '-')}.pdf`} />
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
                  onDelete={isEditMode ? handleDeleteSection : undefined}
                  onEdit={handleEditSection}
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
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
}

export default App;
