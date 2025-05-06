import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Types for resume data (same as in ResumeForm)
interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: Template | null;
  onUpdate: (updatedData: ResumeData) => void;
  isEditable?: boolean;
  sectionHeadings: {
    summary: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
    certifications: string;
  };
  onSectionHeadingUpdate: (section: string, newHeading: string) => void;
}

const ResumePreview = ({
  resumeData,
  template,
  onUpdate,
  defaultEditMode = true,
  sectionHeadings,
  onSectionHeadingUpdate
}: ResumePreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editMode, setEditMode] = useState(defaultEditMode);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [localData, setLocalData] = useState<ResumeData>(resumeData);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempHeading, setTempHeading] = useState("");

  // Effect to calculate and update the number of pages
  useEffect(() => {
    if (previewRef.current) {
      const contentHeight = previewRef.current.scrollHeight;
      const pageHeight = 1056; // Roughly A4 height in pixels
      const calculatedPages = Math.ceil(contentHeight / pageHeight);
      setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
    }
  }, [localData, template]);

  // Update local data when props change
  useEffect(() => {
    setLocalData(resumeData);
  }, [resumeData]);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = (currentPage - 1) * 1056;
    }
  }, [currentPage]);

  // Format date from YYYY-MM to Month YYYY
  const formatDate = (dateString: string) => {
    if (dateString === "Present" || !dateString) {
      return "Present";
    }

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    } catch {
      return dateString;
    }
  };

  // Navigate to previous page
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Navigate to next page
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Save changes when exiting edit mode
      onUpdate(localData);
    }
  };

  // Start editing a field
  const startEditing = (id: string | null, field: string) => {
    setEditingId(id);
    setEditingField(field);
  };

  // Stop editing and save changes
  const stopEditing = () => {
    setEditingId(null);
    setEditingField(null);
    onUpdate(localData);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string | null, field: string) => {
    const value = e.target.value;
    
    if (id === null) {
      // Personal info field
      setLocalData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }));
    } else {
      // Array field (experience, education, etc.)
      const fieldType = field.split('.')[0] as keyof ResumeData;
      const subField = field.split('.')[1] as string;
      
      setLocalData(prev => ({
        ...prev,
        [fieldType]: Array.isArray(prev[fieldType]) 
          ? prev[fieldType].map((item: any) => 
              item.id === id ? { ...item, [subField]: value } : item
            )
          : prev[fieldType]
      }));
    }
  };

  // Handle section heading click
  const handleSectionHeadingClick = (section: keyof typeof sectionHeadings) => {
    setEditingSection(section);
    setTempHeading(sectionHeadings[section]);
  };

  // Handle heading change
  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempHeading(e.target.value);
  };

  // Handle heading blur
  const handleHeadingBlur = () => {
    if (editingSection && tempHeading.trim() !== "") {
      onSectionHeadingUpdate(editingSection, tempHeading);
    }
    setEditingSection(null);
  };

  // Render section heading
  const renderSectionHeading = (section: keyof typeof sectionHeadings) => {
    if (editingSection === section) {
      return (
        <input
          type="text"
          value={tempHeading}
          onChange={handleHeadingChange}
          onBlur={handleHeadingBlur}
          onKeyDown={(e) => e.key === "Enter" && handleHeadingBlur()}
          className="w-full px-2 py-1 text-lg font-bold border-b-2 border-primary focus:outline-none"
          autoFocus
        />
      );
    }
    return (
      <h2
        className="text-lg font-bold cursor-pointer hover:text-primary"
        onClick={() => handleSectionHeadingClick(section as keyof typeof sectionHeadings)}
      >
        {sectionHeadings[section]}
      </h2>
    );
  };

  // Render editable text
  const renderEditableText = (text: string, id: string | null, field: string) => {
    if (editMode && editingId === id && editingField === field) {
      return (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, id, field)}
          onBlur={stopEditing}
          autoFocus
          className="p-1 h-auto"
        />
      );
    }
    return (
      <span 
        onClick={() => editMode && startEditing(id, field)}
        className={`${editMode ? 'cursor-pointer hover:bg-gray-100 px-1 rounded' : ''}`}
      >
        {text}
      </span>
    );
  };

  // Render editable textarea
  const renderEditableTextarea = (text: string, id: string | null, field: string) => {
    if (editMode && editingId === id && editingField === field) {
      return (
        <Textarea
          value={text}
          onChange={(e) => handleInputChange(e, id, field)}
          onBlur={stopEditing}
          autoFocus
          className="p-1 h-auto min-h-[60px]"
        />
      );
    }
    return (
      <div 
        onClick={() => editMode && startEditing(id, field)}
        className={`${editMode ? 'cursor-pointer hover:bg-gray-100 px-1 rounded' : ''}`}
      >
        {text}
      </div>
    );
  };

  // Render the Modern template
  const renderModernTemplate = () => (
    <div className="bg-white text-black px-8 py-10 max-w-[800px] mx-auto shadow-sm">
      {/* Header */}
      <header className="border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-1">
          {renderEditableText(localData.personalInfo.name, null, 'name')}
        </h1>
        <p className="text-lg text-gray-600 mb-3">
          {renderEditableText(localData.personalInfo.title, null, 'title')}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {localData.personalInfo.email && (
            <div>{renderEditableText(localData.personalInfo.email, null, 'email')}</div>
          )}
          {localData.personalInfo.phone && (
            <div>{renderEditableText(localData.personalInfo.phone, null, 'phone')}</div>
          )}
          {localData.personalInfo.location && (
            <div>{renderEditableText(localData.personalInfo.location, null, 'location')}</div>
          )}
        </div>
      </header>

      {/* Summary */}
      {localData.personalInfo.summary && (
        <section className="mb-6">
          {renderSectionHeading("summary")}
          {renderEditableTextarea(localData.personalInfo.summary, null, 'summary')}
        </section>
      )}

      {/* Experience */}
      {localData.experience.length > 0 && (
        <section className="mb-6">
          {renderSectionHeading("experience")}
          <div className="space-y-4">
            {localData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-800">
                    {renderEditableText(exp.title, exp.id, 'experience.title')}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {renderEditableText(exp.startDate, exp.id, 'experience.startDate')} - {renderEditableText(exp.endDate, exp.id, 'experience.endDate')}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-gray-700">
                    {renderEditableText(exp.company, exp.id, 'experience.company')}
                  </p>
                  {exp.location && <p className="text-sm text-gray-600">
                    {renderEditableText(exp.location, exp.id, 'experience.location')}
                  </p>}
                </div>
                <p className="text-sm text-gray-700">
                  {renderEditableTextarea(exp.description, exp.id, 'experience.description')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {localData.education.length > 0 && (
        <section className="mb-6">
          {renderSectionHeading("education")}
          <div className="space-y-4">
            {localData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-800">
                    {renderEditableText(edu.degree, edu.id, 'education.degree')} in {renderEditableText(edu.field, edu.id, 'education.field')}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {renderEditableText(edu.startDate, edu.id, 'education.startDate')} - {renderEditableText(edu.endDate, edu.id, 'education.endDate')}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-gray-700">
                    {renderEditableText(edu.institution, edu.id, 'education.institution')}
                  </p>
                  {edu.location && <p className="text-sm text-gray-600">
                    {renderEditableText(edu.location, edu.id, 'education.location')}
                  </p>}
                </div>
                {edu.description && <p className="text-sm text-gray-700">
                  {renderEditableTextarea(edu.description, edu.id, 'education.description')}
                </p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {localData.skills.length > 0 && (
        <section className="mb-6">
          {renderSectionHeading("skills")}
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {localData.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-1">
                <span className="text-gray-800">
                  {renderEditableText(skill.name, skill.id, 'skills.name')}
                </span>
                <span className="text-xs text-gray-600">
                  ({renderEditableText(skill.level, skill.id, 'skills.level')})
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {localData.projects.length > 0 && (
        <section className="mb-6">
          {renderSectionHeading("projects")}
          <div className="space-y-3">
            {localData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-medium text-gray-800">
                    {renderEditableText(project.title, project.id, 'projects.title')}
                  </h3>
                  {project.link && (
                    <a href={project.link} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700">
                  {renderEditableTextarea(project.description, project.id, 'projects.description')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {localData.certifications.length > 0 && (
        <section>
          {renderSectionHeading("certifications")}
          <div className="space-y-3">
            {localData.certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-800">
                    {renderEditableText(cert.name, cert.id, 'certifications.name')}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {renderEditableText(cert.date, cert.id, 'certifications.date')}
                  </span>
                </div>
                <p className="text-gray-700">
                  {renderEditableText(cert.issuer, cert.id, 'certifications.issuer')}
                </p>
                {cert.description && <p className="text-sm text-gray-700">
                  {renderEditableTextarea(cert.description, cert.id, 'certifications.description')}
                </p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Choose the appropriate template based on the selected template
  const renderTemplate = () => {
    if (!template || template.category === "Modern") {
      return renderModernTemplate();
    } else if (template.category === "Classic") {
      return renderModernTemplate(); // Placeholder for Classic template
    } else if (template.category === "Creative" || template.id === "template-3") {
      return renderModernTemplate(); // Placeholder for Creative template
    }

    // Default to modern template if no match
    return renderModernTemplate();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Edit mode toggle button */}
      <div className="flex justify-end p-2 bg-gray-50 border-b">
        <Button
          variant={editMode ? "default" : "outline"}
          size="sm"
          onClick={toggleEditMode}
        >
          {editMode ? "Save Changes" : "Edit Resume"}
        </Button>
      </div>
      <div
        ref={previewRef}
        className="flex-1 overflow-auto bg-gray-100 p-4 relative"
        style={{
          // Only show content for the current page in a paginated view
          height: '100%',
          overflowY: 'auto'
        }}
      >
        {renderTemplate()}

        {/* Visual page break indicators (only shown in multi-page resumes) */}
        {totalPages > 1 && Array.from({ length: totalPages - 1 }).map((_, index) => (
          <div
            key={index}
            className="absolute left-0 right-0 border-b-2 border-dashed border-blue-400 z-10"
            style={{ top: `${(index + 1) * 1056}px` }}
          >
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 absolute -top-3 right-4 rounded">
              Page {index + 1} end
            </div>
          </div>
        ))}
      </div>

      {/* Page navigation controls (only shown in multi-page resumes) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous Page
          </Button>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next Page
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;