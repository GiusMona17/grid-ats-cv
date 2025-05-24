import type React from 'react';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFExportButtonProps {
  contentRef: React.RefObject<HTMLElement>;
  filename?: string;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  contentRef,
  filename = 'cv-export.pdf'
}) => {
  const isGenerating = useRef(false);

  const handleExport = async () => {
    if (!contentRef.current || isGenerating.current) return;

    try {
      isGenerating.current = true;

      // Show loading state
      const button = document.getElementById('pdf-export-button');
      if (button) {
        button.innerText = 'Generating...';
        button.classList.add('opacity-70');
      }

      // Create a clone of the content to ensure we capture everything correctly
      const contentClone = contentRef.current.cloneNode(true) as HTMLElement;

      // Temporarily append to body with absolute positioning outside viewport
      contentClone.style.position = 'absolute';
      contentClone.style.left = '-9999px';
      contentClone.style.top = '0';
      contentClone.style.width = `${contentRef.current.offsetWidth}px`;
      document.body.appendChild(contentClone);

      // Ensure all images are loaded
      const images = contentClone.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // Generate canvas
      const canvas = await html2canvas(contentClone, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        // Fix for rendering issues
        onclone: (doc) => {
          const clonedContent = doc.querySelector('#cv-content') as HTMLElement;
          if (clonedContent) {
            clonedContent.style.transform = 'none';
            clonedContent.style.boxShadow = 'none';
          }
        }
      });

      // Remove the clone
      document.body.removeChild(contentClone);

      // Calculate PDF dimensions (A4 format)
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      isGenerating.current = false;

      // Reset button state
      const button = document.getElementById('pdf-export-button');
      if (button) {
        button.innerText = 'Download PDF';
        button.classList.remove('opacity-70');
      }
    }
  };

  return (
    <button
      id="pdf-export-button"
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      onClick={handleExport}
    >
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Download PDF
    </button>
  );
};

export default PDFExportButton;
