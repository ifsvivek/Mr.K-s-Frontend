import React from 'react';

// Helper function to format date from YYYY-MM format to a readable format
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const [year, month] = dateString.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (e) {
    return dateString; // Return the original string if parsing fails
  }
};

interface ResumePreviewProps {
  resumeData?: {
    personalInfo?: {
      name?: string;
      title?: string;
      email?: string;
      phone?: string;
      location?: string;
      summary?: string;
    };
    experience?: Array<{
      id: string;
      title: string;
      company: string;
      startDate?: string;
      endDate?: string;
      location?: string;
      description: string;
    }>;
    education?: Array<{
      id: string;
      degree: string;
      field: string;
      institution: string;
      startDate?: string;
      endDate?: string;
      location?: string;
      description?: string;
    }>;
    skills?: Array<{
      id: string;
      name: string;
      level: string;
    }>;
  };
  template?: {
    id: string;
    name: string;
    thumbnail: string;
    category?: string;
  };
  onUpdate: (data: any) => void;
}

export default function ResumePreview({ resumeData, template, onUpdate }: ResumePreviewProps) {
  if (!resumeData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No resume data available</p>
      </div>
    );
  }

  const { personalInfo = {}, experience = [], education = [], skills = [] } = resumeData;

  return (
    <div className="bg-white text-black p-8 shadow-lg max-w-4xl mx-auto">
      {/* Header / Personal Info */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{personalInfo?.name || 'Your Name'}</h1>
        <p className="text-xl text-gray-600 mb-2">{personalInfo?.title || 'Professional Title'}</p>
        <div className="text-sm text-gray-600 space-y-1">
          {personalInfo?.email && <p>{personalInfo.email}</p>}
          {personalInfo?.phone && <p>{personalInfo.phone}</p>}
          {personalInfo?.location && <p>{personalInfo.location}</p>}
        </div>
        {personalInfo?.summary && (
          <p className="mt-4 text-sm text-gray-700">{personalInfo.summary}</p>
        )}
      </header>

      {/* Experience Section */}
      {experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4 border-b pb-2">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => exp && (
              <div key={exp.id} className="mb-4">
                <h3 className="text-lg font-semibold">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {exp.startDate && formatDate(exp.startDate)} {exp.endDate && `- ${formatDate(exp.endDate)}`}
                </p>
                {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                <p className="mt-2 text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4 border-b pb-2">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => edu && (
              <div key={edu.id} className="mb-4">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.field}</p>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {edu.startDate && formatDate(edu.startDate)} {edu.endDate && `- ${formatDate(edu.endDate)}`}
                </p>
                {edu.location && <p className="text-sm text-gray-500">{edu.location}</p>}
                {edu.description && (
                  <p className="mt-2 text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4 border-b pb-2">Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill) => skill && (
              <div key={skill.id} className="flex items-center justify-between">
                <span className="text-gray-700">{skill.name}</span>
                <span className="text-sm text-gray-500">{skill.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}