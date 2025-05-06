import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import components
import ResumePreview from "@/features/resume-editor/ResumePreview";
import { PDFDownloadButton } from "@/features/pdf-generator/ResumePDF";
import AiSuggestions from "@/features/resume-editor/AiSuggestions";

// Import Zustand store
import { useResumeStore } from "@/lib/store/resumeStore";

// Type for AI suggestion
interface AISuggestion {
  section: string;
  field: string | null;
  itemId: string | null;
  improvement: string;
}

export default function ResumeEditorPage() {
  const { resumeId } = useParams<{ resumeId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [pdfDownloading, setPdfDownloading] = useState(false);

  // Add section headings state
  const [sectionHeadings, setSectionHeadings] = useState({
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications"
  });

  // Add section heading update handler
  const handleSectionHeadingUpdate = (section: string, newHeading: string) => {
    setSectionHeadings(prev => ({
      ...prev,
      [section]: newHeading
    }));
  };

  // Get state and actions from Zustand store
  const {
    getCurrentResume,
    updateResume,
    createResume,
    templates,
    getCurrentTemplate,
    setCurrentTemplate
  } = useResumeStore();

  // Get current resume and template
  const currentResume = getCurrentResume();
  const currentTemplate = getCurrentTemplate();

  // Effect to load the template from URL parameters
  useEffect(() => {
    const templateId = searchParams.get("template");
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setCurrentTemplate(template.id);
        toast.success(`${template.name} template loaded`);
      }
    }
  }, [searchParams, templates, setCurrentTemplate]);

  // Effect to handle resumeId from URL
  useEffect(() => {
    if (resumeId) {
      const resume = getCurrentResume();
      if (!resume) {
        navigate("/editor", { replace: true });
      }
    }
  }, [resumeId, getCurrentResume, navigate]);

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    setCurrentTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      toast.success(`Template changed to ${template.name}`);
    }
  };

  // Handle PDF download
  const handleSaveResume = () => {
    setPdfDownloading(true);
    setTimeout(() => {
      setPdfDownloading(false);
      toast.success("Resume saved successfully");
    }, 1000);
  };

  // Handle AI suggestions
  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (!currentResume) return;
    const { section, field, itemId, improvement } = suggestion;

    // Handle different section updates
    switch (section) {
      case 'summary':
        updateResume(resumeId ?? 'default', {
          personalInfo: { ...currentResume.personalInfo, summary: improvement }
        });
        toast.success("Summary updated with AI suggestion");
        break;

      case 'experience':
        if (field && itemId) {
          const updatedExperience = currentResume.experience.map(exp => 
            exp.id === itemId ? { ...exp, [field]: improvement } : exp
          );
          updateResume(resumeId ?? 'default', { experience: updatedExperience });
          toast.success("Experience updated with AI suggestion");
        }
        break;

      case 'education':
        if (field && itemId) {
          const updatedEducation = currentResume.education.map(edu =>
            edu.id === itemId ? { ...edu, [field]: improvement } : edu
          );
          updateResume(resumeId ?? 'default', { education: updatedEducation });
          toast.success("Education updated with AI suggestion");
        }
        break;

      case 'skills':
        toast.info(improvement);
        break;

      default:
        toast.info("Suggestion applied");
    }
  };

  if (!currentResume) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Resume not found</h2>
        <p className="mb-6">We couldn't find the resume you're looking for.</p>
        <Button onClick={() => createResume()}>Create New Resume</Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume Editor</h1>
        <div className="flex items-center gap-4">
          <PDFDownloadButton
            resumeData={currentResume}
            template={currentTemplate}
          />
          <Button
            onClick={handleSaveResume}
            disabled={pdfDownloading}
            className="gap-2"
          >
            {pdfDownloading ? "Saving..." : "Save Resume"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Template Selection Panel */}
<div className="col-span-3">
  <Card className="mb-6">
    <CardContent className="p-4">
      <h3 className="font-medium mb-4">Choose Template</h3>
      <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {templates.map(template => (
          <button
            key={template.id}
            className={`relative w-full text-left rounded-lg border-2 overflow-hidden transition-all
            ${currentTemplate?.id === template.id ? 'border-primary' : 'border-border hover:border-primary/50'}`}
            onClick={() => handleTemplateChange(template.id)}
            onKeyDown={(e) => e.key === 'Enter' && handleTemplateChange(template.id)}
            aria-label={`Select ${template.name} template`}
          >
            <img 
              src={template.thumbnail} 
              alt={template.name}
              className="w-full h-40 object-cover"
              loading="lazy" // Add lazy loading for better performance
            />
            <div className="p-2 bg-background/90 absolute bottom-0 w-full">
              <p className="text-sm font-medium">{template.name}</p>
            </div>
          </button>
        ))}
      </div>
    </CardContent>
  </Card>
</div>

        {/* Resume Editor */}
        <div className="col-span-9">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col">
                <div className="text-center mb-4">
                  <h2 className="text-lg font-medium">
                    {currentTemplate?.name} Template
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on any section to edit directly
                  </p>
                </div>
                <div className="bg-white shadow-md rounded-md border p-2 h-[calc(100vh-400px)] overflow-auto">
                  <ResumePreview
                    resumeData={currentResume}
                    template={currentTemplate}
                    onUpdate={(newData) => updateResume(resumeId ?? 'default', newData)}
                    isEditable={true}
                    sectionHeadings={sectionHeadings}
                    onSectionHeadingUpdate={handleSectionHeadingUpdate}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions Panel - Below Template Editor */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">AI Suggestions</h3>
                <Button variant="ghost" size="sm">
                  Refresh Suggestions
                </Button>
              </div>
              <div className="h-48 overflow-y-auto">
                <AiSuggestions
                  resumeData={currentResume}
                  onApplySuggestion={handleApplySuggestion}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}