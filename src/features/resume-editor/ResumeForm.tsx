import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";

// Types for resume data
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

interface ResumeFormProps {
  resumeData: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
}

export default function ResumeForm({ resumeData, onChange }: ResumeFormProps) {
  const [expandedSection, setExpandedSection] = useState("personal-info");

  // Update personal info
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    onChange({
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  // Add a new experience entry
  const addExperience = () => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };

    onChange({
      experience: [...resumeData.experience, newExperience],
    });
  };

  // Update an experience entry
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const updatedExperience = resumeData.experience.map((exp) => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });

    onChange({
      experience: updatedExperience,
    });
  };

  // Remove an experience entry
  const removeExperience = (id: string) => {
    onChange({
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  // Add a new education entry
  const addEducation = () => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      degree: "",
      field: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };

    onChange({
      education: [...resumeData.education, newEducation],
    });
  };

  // Update an education entry
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updatedEducation = resumeData.education.map((edu) => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });

    onChange({
      education: updatedEducation,
    });
  };

  // Remove an education entry
  const removeEducation = (id: string) => {
    onChange({
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  // Add a new skill
  const addSkill = () => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: "",
      level: "Intermediate",
    };

    onChange({
      skills: [...resumeData.skills, newSkill],
    });
  };

  // Update a skill
  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    const updatedSkills = resumeData.skills.map((skill) => {
      if (skill.id === id) {
        return { ...skill, [field]: value };
      }
      return skill;
    });

    onChange({
      skills: updatedSkills,
    });
  };

  // Remove a skill
  const removeSkill = (id: string) => {
    onChange({
      skills: resumeData.skills.filter((skill) => skill.id !== id),
    });
  };

  // Add a new project
  const addProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: "",
      description: "",
      link: "",
    };

    onChange({
      projects: [...resumeData.projects, newProject],
    });
  };

  // Update a project
  const updateProject = (id: string, field: keyof Project, value: string) => {
    const updatedProjects = resumeData.projects.map((project) => {
      if (project.id === id) {
        return { ...project, [field]: value };
      }
      return project;
    });

    onChange({
      projects: updatedProjects,
    });
  };

  // Remove a project
  const removeProject = (id: string) => {
    onChange({
      projects: resumeData.projects.filter((project) => project.id !== id),
    });
  };

  // Add a new certification
  const addCertification = () => {
    const newCertification: Certification = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      description: "",
    };

    onChange({
      certifications: [...resumeData.certifications, newCertification],
    });
  };

  // Update a certification
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    const updatedCertifications = resumeData.certifications.map((cert) => {
      if (cert.id === id) {
        return { ...cert, [field]: value };
      }
      return cert;
    });

    onChange({
      certifications: updatedCertifications,
    });
  };

  // Remove a certification
  const removeCertification = (id: string) => {
    onChange({
      certifications: resumeData.certifications.filter((cert) => cert.id !== id),
    });
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
      <Accordion
        type="single"
        collapsible
        value={expandedSection}
        onValueChange={setExpandedSection}
        className="space-y-2"
      >
        {/* Personal Information */}
        <AccordionItem value="personal-info" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
            Personal Information
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-3">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                value={resumeData.personalInfo.name}
                onChange={(e) => updatePersonalInfo("name", e.target.value)}
                placeholder="e.g., John Doe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Professional Title
              </label>
              <Input
                id="title"
                value={resumeData.personalInfo.title}
                onChange={(e) => updatePersonalInfo("title", e.target.value)}
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                placeholder="e.g., john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <Input
                id="phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                placeholder="e.g., (123) 456-7890"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                value={resumeData.personalInfo.location}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                placeholder="e.g., New York, NY"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm font-medium">
                Professional Summary
              </label>
              <Textarea
                id="summary"
                value={resumeData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                placeholder="Write a brief overview of your professional background and key strengths..."
                className="min-h-24 resize-y"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience */}
        <AccordionItem value="experience" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
            Work Experience
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
            {resumeData.experience.map((exp) => (
              <Card key={exp.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">
                      {exp.title || exp.company || "New Experience"}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`exp-title-${exp.id}`} className="text-sm font-medium">
                      Job Title
                    </label>
                    <Input
                      id={`exp-title-${exp.id}`}
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`exp-company-${exp.id}`} className="text-sm font-medium">
                      Company
                    </label>
                    <Input
                      id={`exp-company-${exp.id}`}
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="e.g., Tech Company Inc."
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`exp-location-${exp.id}`} className="text-sm font-medium">
                      Location
                    </label>
                    <Input
                      id={`exp-location-${exp.id}`}
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      placeholder="e.g., New York, NY"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label htmlFor={`exp-startDate-${exp.id}`} className="text-sm font-medium">
                        Start Date
                      </label>
                      <Input
                        id={`exp-startDate-${exp.id}`}
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`exp-endDate-${exp.id}`} className="text-sm font-medium">
                        End Date
                      </label>
                      <Input
                        id={`exp-endDate-${exp.id}`}
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        placeholder="Present"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`exp-description-${exp.id}`} className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id={`exp-description-${exp.id}`}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      className="min-h-20 resize-y"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={addExperience}
            >
              <PlusCircle className="h-4 w-4" />
              Add Experience
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
            Education
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
            {resumeData.education.map((edu) => (
              <Card key={edu.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">
                      {edu.degree || edu.institution || "New Education"}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`edu-degree-${edu.id}`} className="text-sm font-medium">
                      Degree
                    </label>
                    <Input
                      id={`edu-degree-${edu.id}`}
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`edu-field-${edu.id}`} className="text-sm font-medium">
                      Field of Study
                    </label>
                    <Input
                      id={`edu-field-${edu.id}`}
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`edu-institution-${edu.id}`} className="text-sm font-medium">
                      Institution
                    </label>
                    <Input
                      id={`edu-institution-${edu.id}`}
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      placeholder="e.g., University of Technology"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`edu-location-${edu.id}`} className="text-sm font-medium">
                      Location
                    </label>
                    <Input
                      id={`edu-location-${edu.id}`}
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                      placeholder="e.g., Boston, MA"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label htmlFor={`edu-startDate-${edu.id}`} className="text-sm font-medium">
                        Start Date
                      </label>
                      <Input
                        id={`edu-startDate-${edu.id}`}
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`edu-endDate-${edu.id}`} className="text-sm font-medium">
                        End Date
                      </label>
                      <Input
                        id={`edu-endDate-${edu.id}`}
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`edu-description-${edu.id}`} className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id={`edu-description-${edu.id}`}
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                      placeholder="Additional information about your education..."
                      className="min-h-20 resize-y"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={addEducation}
            >
              <PlusCircle className="h-4 w-4" />
              Add Education
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
            Skills
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {resumeData.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                    placeholder="Skill name"
                    className="flex-1"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeSkill(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={addSkill}
            >
              <PlusCircle className="h-4 w-4" />
              Add Skill
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
            Projects
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
            {resumeData.projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">
                      {project.title || "New Project"}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`project-title-${project.id}`} className="text-sm font-medium">
                      Project Title
                    </label>
                    <Input
                      id={`project-title-${project.id}`}
                      value={project.title}
                      onChange={(e) => updateProject(project.id, "title", e.target.value)}
                      placeholder="e.g., E-commerce Website"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`project-description-${project.id}`} className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id={`project-description-${project.id}`}
                      value={project.description}
                      onChange={(e) => updateProject(project.id, "description", e.target.value)}
                      placeholder="Describe the project, technologies used, and your role..."
                      className="min-h-20 resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`project-link-${project.id}`} className="text-sm font-medium">
                      Project Link (optional)
                    </label>
                    <Input
                      id={`project-link-${project.id}`}
                      value={project.link || ""}
                      onChange={(e) => updateProject(project.id, "link", e.target.value)}
                      placeholder="e.g., https://github.com/username/project"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={addProject}
            >
              <PlusCircle className="h-4 w-4" />
              Add Project
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
            Certifications
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
            {resumeData.certifications.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">
                      {cert.name || "New Certification"}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeCertification(cert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`cert-name-${cert.id}`} className="text-sm font-medium">
                      Certification Name
                    </label>
                    <Input
                      id={`cert-name-${cert.id}`}
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      placeholder="e.g., AWS Certified Developer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`cert-issuer-${cert.id}`} className="text-sm font-medium">
                      Issuing Organization
                    </label>
                    <Input
                      id={`cert-issuer-${cert.id}`}
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`cert-date-${cert.id}`} className="text-sm font-medium">
                      Date
                    </label>
                    <Input
                      id={`cert-date-${cert.id}`}
                      type="month"
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`cert-description-${cert.id}`} className="text-sm font-medium">
                      Description (optional)
                    </label>
                    <Textarea
                      id={`cert-description-${cert.id}`}
                      value={cert.description}
                      onChange={(e) => updateCertification(cert.id, "description", e.target.value)}
                      placeholder="Additional information about the certification..."
                      className="min-h-20 resize-y"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={addCertification}
            >
              <PlusCircle className="h-4 w-4" />
              Add Certification
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
