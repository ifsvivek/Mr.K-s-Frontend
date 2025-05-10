import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import ResumePreview from "@/features/resume-editor/ResumePreview";
import AiSuggestions from "@/features/resume-editor/AiSuggestions";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Template {
  _id: string;
  title: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

interface ResumeData {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
}

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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("My Resume");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, resumeRes] = await Promise.all([
          axios.get("http://localhost:5000/api/templateFile/all", {
            withCredentials: true,
          }),
          resumeId 
            ? axios.get(`http://localhost:5000/api/resumes/${resumeId}`, {
                withCredentials: true,
              })
            : Promise.resolve({ data: createDefaultResume() }),
        ]);

        setTemplates(templatesRes.data);
        setCurrentResume(resumeRes.data);

        const templateId = searchParams.get("template");
        if (templateId) {
          const template = templatesRes.data.find((t: { _id: string; }) => t._id === templateId);
          if (template) {
            setCurrentTemplate(template);
            toast.success(`${template.title} template loaded`);
          }
        }
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resumeId, searchParams]);

  const createDefaultResume = (): ResumeData => ({
    id: "new-resume",
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
  });

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t._id === templateId);
    if (template) {
      setCurrentTemplate(template);
      toast.success(`Template changed to ${template.title}`);
    }
  };

  const generateResumePDF = async (): Promise<Blob> => {
    const resumeElement = document.querySelector(".resume-preview-container");
    if (!resumeElement) throw new Error("Resume element not found");

    const canvas = await html2canvas(resumeElement as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return new Blob([pdf.output("blob")], { type: "application/pdf" });
  };

  const handleSaveResume = async () => {
    if (!currentResume || !currentTemplate) return;
    
    try {
      setIsSaving(true);
      
      // First save the resume data
      const resumeDataUrl = resumeId 
        ? `http://localhost:5000/api/resumes/${resumeId}`
        : "http://localhost:5000/api/resumes";
      
      const method = resumeId ? "put" : "post";
      
      const resumeResponse = await axios[method](
        resumeDataUrl, 
        { ...currentResume, title: resumeTitle },
        { withCredentials: true }
      );
      
      // Then generate and upload the PDF
      const pdfBlob = await generateResumePDF();
      
      const formData = new FormData();
      formData.append("file", pdfBlob, `${resumeTitle.replace(/\s+/g, '_')}.pdf`);
      formData.append("title", resumeTitle);

      // Upload the PDF to S3
      const uploadResponse = await axios.post(
        "http://localhost:5000/api/resumeFile/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // If this is a new resume, update the URL with the new ID
      if (!resumeId && resumeResponse.data.id) {
        navigate(`/resumes/${resumeResponse.data.id}/edit`, { replace: true });
      }
      
      toast.success("Resume saved and PDF uploaded successfully");
      return uploadResponse.data;
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save resume");
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (!currentResume) return;
    // Implementation of applying AI suggestions
    // ... (same as your previous implementation)
  };

  const handleResumeUpdate = (updatedData: ResumeData) => {
    setCurrentResume(updatedData);
  };

  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>;
  }

  if (!currentResume) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Resume not found</h2>
        <Button onClick={() => setCurrentResume(createDefaultResume())}>
          Create New Resume
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume Editor</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            className="border rounded px-3 py-1"
            placeholder="Resume title"
          />
          <Button 
            onClick={handleSaveResume} 
            className="gap-2"
            disabled={isSaving || !currentTemplate}
          >
            {isSaving ? "Saving..." : "Save Resume"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Templates</h3>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template._id}
                      className={`cursor-pointer border p-2 rounded hover:border-primary transition-colors ${
                        currentTemplate?._id === template._id
                          ? "border-primary"
                          : "border-border"
                      }`}
                      onClick={() => handleTemplateChange(template._id)}
                    >
                      <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center mb-2">
                        <div className="text-center p-2">
                          <p className="text-sm font-medium">{template.title}</p>
                        </div>
                      </div>
                      <p className="text-center text-sm font-medium">
                        {template.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

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
                    {currentTemplate && ` - ${currentTemplate.title} Template`}
                  </h2>
                </div>
                <div className="bg-white shadow-md rounded-md border p-2 flex-1 overflow-auto">
                  {currentTemplate ? (
                    <div className="resume-preview-container">
                      <ResumePreview
                        resumeData={currentResume}
                        template={{
                          id: currentTemplate._id,
                          name: currentTemplate.title,
                          thumbnail: currentTemplate.path,
                        }}
                        onUpdate={handleResumeUpdate}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p>Please select a template</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}