import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import editor components
import ResumeForm from "@/features/resume-editor/ResumeForm";
import ResumePreview from "@/features/resume-editor/ResumePreview";
import { PDFDownloadButton } from "@/features/pdf-generator/ResumePDF";

// Import Zustand store
import { useResumeStore, type ResumeData } from "@/lib/store/resumeStore";

// Import AI Suggestions component
import AiSuggestions from "@/features/resume-editor/AiSuggestions";

// Type for AI suggestion
interface AISuggestion {
  section: string;
  field?: string;
  itemId?: string;
  improvement: string;
}

export default function ResumeEditorPage() {
  const { resumeId } = useParams<{ resumeId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("edit");
  const [pdfDownloading, setPdfDownloading] = useState(false);

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
    } else {
      const resume = getCurrentResume();
      if (resume && resume.personalInfo.name) {
        // This is optional - only update URL if we want to
        // navigate(`/editor/${currentResumeId}`, { replace: true });
      }
    }
  }, [resumeId, getCurrentResume, navigate]);

  // Handle form data changes
  const handleFormChange = (newData: Partial<ResumeData>) => {
    if (currentResume) {
      updateResume(resumeId || 'default', newData);
    }
  };

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

  // Handle applying AI suggestions
  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (!currentResume) return;

    const { section, field, itemId, improvement } = suggestion;

    // For personal info updates (like summary)
    if (section === 'summary') {
      const updatedPersonalInfo = {
        ...currentResume.personalInfo,
        summary: improvement
      };

      updateResume(resumeId || 'default', {
        personalInfo: updatedPersonalInfo
      });

      toast.success("Summary updated with AI suggestion");
      return;
    }

    // For experience section updates
    if (section === 'experience' && field && itemId) {
      const updatedExperience = currentResume.experience.map(exp => {
        if (exp.id === itemId) {
          return { ...exp, [field]: improvement };
        }
        return exp;
      });

      updateResume(resumeId || 'default', {
        experience: updatedExperience
      });

      toast.success("Experience updated with AI suggestion");
      return;
    }

    // For education section updates
    if (section === 'education' && field && itemId) {
      const updatedEducation = currentResume.education.map(edu => {
        if (edu.id === itemId) {
          return { ...edu, [field]: improvement };
        }
        return edu;
      });

      updateResume(resumeId || 'default', {
        education: updatedEducation
      });

      toast.success("Education updated with AI suggestion");
      return;
    }

    // Generic skill suggestion (we'll just show a toast for now)
    if (section === 'skills') {
      toast.info(improvement);
      return;
    }

    toast.info("Suggestion applied");
  };

  // In case something went wrong and we don't have a resume
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
        <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
                  <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="m-0">
                  <ResumeForm
                    resumeData={currentResume}
                    onChange={handleFormChange}
                  />
                </TabsContent>

                <TabsContent value="templates" className="m-0">
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map(template => (
                      <div
                        key={template.id}
                        className={`cursor-pointer border p-2 rounded hover:border-primary transition-colors ${currentTemplate?.id === template.id ? 'border-primary' : 'border-border'}`}
                        onClick={() => handleTemplateChange(template.id)}
                      >
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="aspect-[3/4] w-full object-cover mb-2"
                        />
                        <p className="text-center text-sm font-medium">{template.name}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Suggestions Panel */}
          <div className="mt-6">
            <AiSuggestions
              resumeData={currentResume}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <div className="flex flex-col h-full">
                <div className="text-center mb-4">
                  <h2 className="text-lg font-medium">
                    Resume Preview
                    {currentTemplate && ` - ${currentTemplate.name} Template`}
                  </h2>
                </div>
                <div className="bg-white shadow-md rounded-md border p-2 flex-1 overflow-auto">
                  <ResumePreview
                    resumeData={currentResume}
                    template={currentTemplate}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}