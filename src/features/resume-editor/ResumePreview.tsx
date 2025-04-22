import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
}

export default function ResumePreview({ resumeData, template }: ResumePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Effect to calculate and update the number of pages
  useEffect(() => {
    if (previewRef.current) {
      // In a real implementation, this would be more sophisticated
      // to accurately detect content overflow and page breaks
      const contentHeight = previewRef.current.scrollHeight;
      const pageHeight = 1056; // Roughly A4 height in pixels
      const calculatedPages = Math.ceil(contentHeight / pageHeight);
      setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
    }
  }, [resumeData, template]);

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

  // Render the Modern template
  const renderModernTemplate = () => (
    <div className="bg-white text-black px-8 py-10 max-w-[800px] mx-auto shadow-sm">
      {/* Header */}
      <header className="border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-1">{resumeData.personalInfo.name}</h1>
        <p className="text-lg text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {resumeData.personalInfo.email && (
            <div>{resumeData.personalInfo.email}</div>
          )}
          {resumeData.personalInfo.phone && (
            <div>{resumeData.personalInfo.phone}</div>
          )}
          {resumeData.personalInfo.location && (
            <div>{resumeData.personalInfo.location}</div>
          )}
        </div>
      </header>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Professional Summary</h2>
          <p className="text-gray-700">{resumeData.personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1">Experience</h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-800">{exp.title}</h3>
                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-gray-700">{exp.company}</p>
                  {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                </div>
                <p className="text-sm text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1">Education</h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-800">{edu.degree} in {edu.field}</h3>
                  <span className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                </div>
                {edu.description && <p className="text-sm text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {resumeData.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-1">
                <span className="text-gray-800">{skill.name}</span>
                <span className="text-xs text-gray-600">({skill.level})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1">Projects</h2>
          <div className="space-y-3">
            {resumeData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-medium text-gray-800">{project.title}</h3>
                  {project.link && (
                    <a href={project.link} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1">Certifications</h2>
          <div className="space-y-3">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-800">{cert.name}</h3>
                  <span className="text-sm text-gray-600">{formatDate(cert.date)}</span>
                </div>
                <p className="text-gray-700">{cert.issuer}</p>
                {cert.description && <p className="text-sm text-gray-700">{cert.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Render the Classic template
  const renderClassicTemplate = () => (
    <div className="bg-white text-black px-8 py-10 max-w-[800px] mx-auto shadow-sm">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">{resumeData.personalInfo.name}</h1>
        <p className="text-lg mb-3">{resumeData.personalInfo.title}</p>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm">
          {resumeData.personalInfo.email && (
            <div>{resumeData.personalInfo.email}</div>
          )}
          {resumeData.personalInfo.phone && (
            <div>{resumeData.personalInfo.phone}</div>
          )}
          {resumeData.personalInfo.location && (
            <div>{resumeData.personalInfo.location}</div>
          )}
        </div>
      </header>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase text-center mb-2 border-b border-gray-300 pb-1">Summary</h2>
          <p>{resumeData.personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase text-center mb-4 border-b border-gray-300 pb-1">Professional Experience</h2>
          <div className="space-y-5">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.company}</h3>
                  <span className="text-sm">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="italic">{exp.title}</p>
                  {exp.location && <p className="text-sm">{exp.location}</p>}
                </div>
                <p className="text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase text-center mb-4 border-b border-gray-300 pb-1">Education</h2>
          <div className="space-y-5">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{edu.institution}</h3>
                  <span className="text-sm">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="italic">{edu.degree} in {edu.field}</p>
                {edu.location && <p className="text-sm mb-1">{edu.location}</p>}
                {edu.description && <p className="text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase text-center mb-3 border-b border-gray-300 pb-1">Skills</h2>
          <ul className="list-disc pl-5 grid grid-cols-2 gap-1">
            {resumeData.skills.map((skill) => (
              <li key={skill.id} className="text-sm">{skill.name} <span className="text-gray-600">({skill.level})</span></li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase text-center mb-4 border-b border-gray-300 pb-1">Projects</h2>
          <div className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold">{project.title}</h3>
                  {project.link && (
                    <a href={project.link} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      ({project.link})
                    </a>
                  )}
                </div>
                <p className="text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications.length > 0 && (
        <section>
          <h2 className="text-lg font-bold uppercase text-center mb-4 border-b border-gray-300 pb-1">Certifications</h2>
          <div className="space-y-4">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{cert.name}</h3>
                  <span className="text-sm">{formatDate(cert.date)}</span>
                </div>
                <p className="italic">{cert.issuer}</p>
                {cert.description && <p className="text-sm">{cert.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Render the Creative template
  const renderCreativeTemplate = () => (
    <div className="bg-white text-black max-w-[800px] mx-auto shadow-sm">
      <div className="grid grid-cols-3 min-h-full">
        {/* Sidebar */}
        <div className="bg-blue-900 text-white p-6">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold mb-1">{resumeData.personalInfo.name}</h1>
            <p className="text-sm mb-3">{resumeData.personalInfo.title}</p>
          </div>

          <div className="space-y-1 mb-6 text-sm">
            {resumeData.personalInfo.email && (
              <div className="flex gap-2 items-center">
                <span className="font-bold">Email:</span>
                <span>{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex gap-2 items-center">
                <span className="font-bold">Phone:</span>
                <span>{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.location && (
              <div className="flex gap-2 items-center">
                <span className="font-bold">Location:</span>
                <span>{resumeData.personalInfo.location}</span>
              </div>
            )}
          </div>

          {/* Skills in sidebar */}
          {resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-md font-bold mb-3 border-b border-blue-700 pb-1">Skills</h2>
              <div className="space-y-2">
                {resumeData.skills.map((skill) => (
                  <div key={skill.id} className="text-sm">
                    <div className="flex justify-between">
                      <span>{skill.name}</span>
                      <span className="text-xs">{skill.level}</span>
                    </div>
                    <div className="w-full bg-blue-700 h-1.5 mt-1">
                      <div
                        className="bg-white h-full"
                        style={{
                          width: skill.level === "Expert" ? "100%" :
                                 skill.level === "Advanced" ? "75%" :
                                 skill.level === "Intermediate" ? "50%" : "25%"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in sidebar */}
          {resumeData.certifications.length > 0 && (
            <div>
              <h2 className="text-md font-bold mb-3 border-b border-blue-700 pb-1">Certifications</h2>
              <div className="space-y-3">
                {resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="text-sm">
                    <h3 className="font-bold">{cert.name}</h3>
                    <p className="text-xs">{cert.issuer} | {formatDate(cert.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 p-6">
          {/* Summary */}
          {resumeData.personalInfo.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-900 mb-2 border-b border-gray-200 pb-1">About Me</h2>
              <p className="text-sm">{resumeData.personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-900 mb-3 border-b border-gray-200 pb-1">Work Experience</h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold">{exp.title}</h3>
                      <span className="text-xs text-gray-600">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-sm text-blue-900 font-medium">{exp.company}</p>
                      {exp.location && <p className="text-xs text-gray-600">{exp.location}</p>}
                    </div>
                    <p className="text-xs">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-900 mb-3 border-b border-gray-200 pb-1">Education</h2>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                      <span className="text-xs text-gray-600">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-blue-900 font-medium">{edu.institution}</p>
                    {edu.location && <p className="text-xs text-gray-600 mb-1">{edu.location}</p>}
                    {edu.description && <p className="text-xs">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resumeData.projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-900 mb-3 border-b border-gray-200 pb-1">Projects</h2>
              <div className="space-y-3">
                {resumeData.projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-bold">{project.title}</h3>
                      {project.link && (
                        <a href={project.link} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      )}
                    </div>
                    <p className="text-xs">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  // Choose the appropriate template based on the selected template
  const renderTemplate = () => {
    if (!template || template.category === "Modern") {
      return renderModernTemplate();
    } else if (template.category === "Classic") {
      return renderClassicTemplate();
    } else if (template.category === "Creative" || template.id === "template-3") {
      return renderCreativeTemplate();
    }

    // Default to modern template if no match
    return renderModernTemplate();
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={previewRef}
        className="flex-1 overflow-auto bg-gray-100 p-4 relative"
        style={{
          // Only show content for the current page in a paginated view
          // In a real implementation, this would use proper pagination logic
          scrollTop: (currentPage - 1) * 1056
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
}
