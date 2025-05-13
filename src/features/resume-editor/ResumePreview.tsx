import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Modern worker import for Create React App
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ResumePreviewProps {
  pdfFile: File | null;
}

export default function ResumePreview({ pdfFile }: ResumePreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState(800);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Create object URL when file changes
  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url); // Clean up on unmount
    } else {
      setFileUrl(null);
    }
  }, [pdfFile]);

  // Adjust PDF width based on container size
  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('.pdf-container');
      if (container) {
        setPageWidth(Math.min(container.clientWidth - 40, 800));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error);
    setError("Failed to load PDF document");
    setLoading(false);
  }

  if (loading && !error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p>Loading PDF document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!pdfFile || !fileUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p>No PDF document selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-container flex flex-col h-full p-4 bg-gray-50">
      <div className="flex-1 overflow-auto flex justify-center">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-64">
                <p>Loading PDF document...</p>
              </div>
            }
            error={
              <div className="text-red-500 p-4">
                Failed to load PDF template
              </div>
            }
            options={{
              cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
              cMapPacked: true,
            }}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="mb-4 last:mb-0">
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  loading={
                    <div className="flex items-center justify-center h-64">
                      <p>Loading page {index + 1}...</p>
                    </div>
                  }
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
                {numPages && numPages > 1 && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    Page {index + 1} of {numPages}
                  </div>
                )}
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}