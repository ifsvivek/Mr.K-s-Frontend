import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from "@react-pdf/renderer";

// Register custom fonts (optional, for a real app you'd want to include these)
// Font.register({
//   family: "Roboto",
//   fonts: [
//     { src: "/fonts/Roboto-Regular.ttf" },
//     { src: "/fonts/Roboto-Bold.ttf", fontWeight: "bold" },
//   ],
// });

// Resume data types (same as in ResumeForm)
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

interface ResumePDFProps {
  resumeData: ResumeData;
  template: Template | null;
}

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  // Modern template styles
  modernHeader: {
    marginBottom: 20,
    borderBottom: "1pt solid #ccc",
    paddingBottom: 10,
  },
  modernName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modernTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  modernContactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 10,
    color: "#666",
    gap: 10,
  },
  modernSection: {
    marginBottom: 15,
  },
  modernSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottom: "0.5pt solid #eee",
    paddingBottom: 3,
  },
  modernItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  modernItemTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  modernItemSubtitle: {
    fontSize: 10,
    marginBottom: 3,
  },
  modernItemDate: {
    fontSize: 10,
    color: "#666",
  },
  modernItemDescription: {
    fontSize: 10,
    marginTop: 3,
    lineHeight: 1.5,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skill: {
    fontSize: 10,
  },
  // Classic template styles
  classicHeader: {
    marginBottom: 20,
    alignItems: "center",
  },
  classicName: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  classicTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  classicContactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 10,
    justifyContent: "center",
    gap: 10,
  },
  classicSection: {
    marginBottom: 15,
  },
  classicSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 8,
    borderBottom: "0.5pt solid #ccc",
    paddingBottom: 3,
  },
  // Creative template styles
  creativeContainer: {
    flexDirection: "row",
    height: "100%",
  },
  creativeSidebar: {
    width: "30%",
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: 15,
  },
  creativeMain: {
    width: "70%",
    padding: 15,
  },
  creativeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  creativeTitle: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  creativeContactLabel: {
    fontSize: 9,
    fontWeight: "bold",
  },
  creativeContactValue: {
    fontSize: 9,
  },
  creativeContactItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  creativeSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 8,
    borderBottom: "0.5pt solid #ccc",
    paddingBottom: 3,
  },
  creativeSidebarSectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottom: "0.5pt solid #3b5cad",
    paddingBottom: 3,
  },
});

// Format date helper
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

// Modern template component
const ModernResumePDF = ({ resumeData }: { resumeData: ResumeData }) => (
  <Page size="A4" style={styles.page}>
    {/* Header */}
    <View style={styles.modernHeader}>
      <Text style={styles.modernName}>{resumeData.personalInfo.name}</Text>
      <Text style={styles.modernTitle}>{resumeData.personalInfo.title}</Text>
      <View style={styles.modernContactInfo}>
        {resumeData.personalInfo.email && (
          <Text>{resumeData.personalInfo.email}</Text>
        )}
        {resumeData.personalInfo.phone && (
          <Text>{resumeData.personalInfo.phone}</Text>
        )}
        {resumeData.personalInfo.location && (
          <Text>{resumeData.personalInfo.location}</Text>
        )}
      </View>
    </View>

    {/* Summary */}
    {resumeData.personalInfo.summary && (
      <View style={styles.modernSection}>
        <Text style={styles.modernSectionTitle}>Professional Summary</Text>
        <Text style={styles.modernItemDescription}>{resumeData.personalInfo.summary}</Text>
      </View>
    )}

    {/* Experience */}
    {resumeData.experience.length > 0 && (
      <View style={styles.modernSection}>
        <Text style={styles.modernSectionTitle}>Experience</Text>
        {resumeData.experience.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 10 }}>
            <View style={styles.modernItemHeader}>
              <Text style={styles.modernItemTitle}>{exp.title}</Text>
              <Text style={styles.modernItemDate}>
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </Text>
            </View>
            <View style={styles.modernItemHeader}>
              <Text style={styles.modernItemSubtitle}>{exp.company}</Text>
              {exp.location && (
                <Text style={styles.modernItemSubtitle}>{exp.location}</Text>
              )}
            </View>
            <Text style={styles.modernItemDescription}>{exp.description}</Text>
          </View>
        ))}
      </View>
    )}

    {/* Education */}
    {resumeData.education.length > 0 && (
      <View style={styles.modernSection}>
        <Text style={styles.modernSectionTitle}>Education</Text>
        {resumeData.education.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 10 }}>
            <View style={styles.modernItemHeader}>
              <Text style={styles.modernItemTitle}>{edu.degree} in {edu.field}</Text>
              <Text style={styles.modernItemDate}>
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </Text>
            </View>
            <View style={styles.modernItemHeader}>
              <Text style={styles.modernItemSubtitle}>{edu.institution}</Text>
              {edu.location && (
                <Text style={styles.modernItemSubtitle}>{edu.location}</Text>
              )}
            </View>
            {edu.description && (
              <Text style={styles.modernItemDescription}>{edu.description}</Text>
            )}
          </View>
        ))}
      </View>
    )}

    {/* Skills */}
    {resumeData.skills.length > 0 && (
      <View style={styles.modernSection}>
        <Text style={styles.modernSectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {resumeData.skills.map((skill) => (
            <Text key={skill.id} style={styles.skill}>
              {skill.name} ({skill.level})
            </Text>
          ))}
        </View>
      </View>
    )}

    {/* Projects */}
    {resumeData.projects.length > 0 && (
      <View style={styles.modernSection}>
        <Text style={styles.modernSectionTitle}>Projects</Text>
        {resumeData.projects.map((project) => (
          <View key={project.id} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.modernItemTitle}>{project.title}</Text>
              {project.link && (
                <Text style={{ fontSize: 8, marginLeft: 5 }}>
                  ({project.link})
                </Text>
              )}
            </View>
            <Text style={styles.modernItemDescription}>{project.description}</Text>
          </View>
        ))}
      </View>
    )}

    {/* Certifications */}
    {resumeData.certifications.length > 0 && (
      <View style={styles.modernSection}>
        <Text style={styles.modernSectionTitle}>Certifications</Text>
        {resumeData.certifications.map((cert) => (
          <View key={cert.id} style={{ marginBottom: 8 }}>
            <View style={styles.modernItemHeader}>
              <Text style={styles.modernItemTitle}>{cert.name}</Text>
              <Text style={styles.modernItemDate}>{formatDate(cert.date)}</Text>
            </View>
            <Text style={styles.modernItemSubtitle}>{cert.issuer}</Text>
            {cert.description && (
              <Text style={styles.modernItemDescription}>{cert.description}</Text>
            )}
          </View>
        ))}
      </View>
    )}
  </Page>
);

// Classic template component
const ClassicResumePDF = ({ resumeData }: { resumeData: ResumeData }) => (
  <Page size="A4" style={styles.page}>
    {/* Header */}
    <View style={styles.classicHeader}>
      <Text style={styles.classicName}>{resumeData.personalInfo.name}</Text>
      <Text style={styles.classicTitle}>{resumeData.personalInfo.title}</Text>
      <View style={styles.classicContactInfo}>
        {resumeData.personalInfo.email && (
          <Text>{resumeData.personalInfo.email}</Text>
        )}
        {resumeData.personalInfo.phone && (
          <Text>{resumeData.personalInfo.phone}</Text>
        )}
        {resumeData.personalInfo.location && (
          <Text>{resumeData.personalInfo.location}</Text>
        )}
      </View>
    </View>

    {/* Summary */}
    {resumeData.personalInfo.summary && (
      <View style={styles.classicSection}>
        <Text style={styles.classicSectionTitle}>Summary</Text>
        <Text style={styles.modernItemDescription}>{resumeData.personalInfo.summary}</Text>
      </View>
    )}

    {/* Experience */}
    {resumeData.experience.length > 0 && (
      <View style={styles.classicSection}>
        <Text style={styles.classicSectionTitle}>Professional Experience</Text>
        {resumeData.experience.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 10 }}>
            <View style={styles.modernItemHeader}>
              <Text style={styles.modernItemTitle}>{exp.company}</Text>
              <Text style={styles.modernItemDate}>
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </Text>
            </View>
            <View style={styles.modernItemHeader}>
              <Text style={{ ...styles.modernItemSubtitle, fontStyle: "italic" }}>{exp.title}</Text>
              {exp.location && (
                <Text style={styles.modernItemSubtitle}>{exp.location}</Text>
              )}
            </View>
            <Text style={styles.modernItemDescription}>{exp.description}</Text>
          </View>
        ))}
      </View>
    )}

    {/* Education */}
    {resumeData.education.length > 0 && (
      <View style={styles.classicSection}>
        <Text style={styles.classicSectionTitle}>Education</Text>
        {resumeData.education.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 10 }}>
            <View style={styles.modernItemHeader}>
              <Text style={styles.modernItemTitle}>{edu.institution}</Text>
              <Text style={styles.modernItemDate}>
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </Text>
            </View>
            <Text style={{ ...styles.modernItemSubtitle, fontStyle: "italic" }}>
              {edu.degree} in {edu.field}
            </Text>
            {edu.location && (
              <Text style={styles.modernItemSubtitle}>{edu.location}</Text>
            )}
            {edu.description && (
              <Text style={styles.modernItemDescription}>{edu.description}</Text>
            )}
          </View>
        ))}
      </View>
    )}

    {/* Skills */}
    {resumeData.skills.length > 0 && (
      <View style={styles.classicSection}>
        <Text style={styles.classicSectionTitle}>Skills</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {resumeData.skills.map((skill, index) => (
            <View key={skill.id} style={{ width: "50%", paddingLeft: 10, marginBottom: 5 }}>
              <Text style={styles.skill}>• {skill.name} ({skill.level})</Text>
            </View>
          ))}
        </View>
      </View>
    )}

    {/* Projects */}
    {resumeData.projects.length > 0 && (
      <View style={styles.classicSection}>
        <Text style={styles.classicSectionTitle}>Projects</Text>
        {resumeData.projects.map((project) => (
          <View key={project.id} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.modernItemTitle}>{project.title}</Text>
              {project.link && (
                <Text style={{ fontSize: 8, marginLeft: 5 }}>
                  ({project.link})
                </Text>
              )}
            </View>
            <Text style={styles.modernItemDescription}>{project.description}</Text>
          </View>
        ))}
      </View>
    )}

    {/* Certifications */}
    {resumeData.certifications.length > 0 && (
      <View style={styles.classicSection}>
        <Text style={styles.classicSectionTitle}>Certifications</Text>
        {resumeData.certifications.map((cert) => (
          <View key={cert.id} style={{ marginBottom: 8 }}>
            <View style={styles.modernItemHeader}>
              <Text style={styles.modernItemTitle}>{cert.name}</Text>
              <Text style={styles.modernItemDate}>{formatDate(cert.date)}</Text>
            </View>
            <Text style={{ ...styles.modernItemSubtitle, fontStyle: "italic" }}>{cert.issuer}</Text>
            {cert.description && (
              <Text style={styles.modernItemDescription}>{cert.description}</Text>
            )}
          </View>
        ))}
      </View>
    )}
  </Page>
);

// Creative template component
const CreativeResumePDF = ({ resumeData }: { resumeData: ResumeData }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.creativeContainer}>
      {/* Sidebar */}
      <View style={styles.creativeSidebar}>
        {/* Name and title */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.creativeName}>{resumeData.personalInfo.name}</Text>
          <Text style={styles.creativeTitle}>{resumeData.personalInfo.title}</Text>
        </View>

        {/* Contact information */}
        <View style={{ marginBottom: 20 }}>
          {resumeData.personalInfo.email && (
            <View style={styles.creativeContactItem}>
              <Text style={styles.creativeContactLabel}>Email: </Text>
              <Text style={styles.creativeContactValue}>{resumeData.personalInfo.email}</Text>
            </View>
          )}
          {resumeData.personalInfo.phone && (
            <View style={styles.creativeContactItem}>
              <Text style={styles.creativeContactLabel}>Phone: </Text>
              <Text style={styles.creativeContactValue}>{resumeData.personalInfo.phone}</Text>
            </View>
          )}
          {resumeData.personalInfo.location && (
            <View style={styles.creativeContactItem}>
              <Text style={styles.creativeContactLabel}>Location: </Text>
              <Text style={styles.creativeContactValue}>{resumeData.personalInfo.location}</Text>
            </View>
          )}
        </View>

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.creativeSidebarSectionTitle}>Skills</Text>
            {resumeData.skills.map((skill) => (
              <View key={skill.id} style={{ marginBottom: 5 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 9 }}>{skill.name}</Text>
                  <Text style={{ fontSize: 8 }}>{skill.level}</Text>
                </View>
                <View style={{ backgroundColor: "#3b5cad", height: 3, marginTop: 2 }}>
                  <View
                    style={{
                      backgroundColor: "white",
                      height: "100%",
                      width:
                        skill.level === "Expert" ? "100%" :
                        skill.level === "Advanced" ? "75%" :
                        skill.level === "Intermediate" ? "50%" : "25%"
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <View>
            <Text style={styles.creativeSidebarSectionTitle}>Certifications</Text>
            {resumeData.certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 9, fontWeight: "bold" }}>{cert.name}</Text>
                <Text style={{ fontSize: 8 }}>
                  {cert.issuer} | {formatDate(cert.date)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.creativeMain}>
        {/* Summary */}
        {resumeData.personalInfo.summary && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.creativeSectionTitle}>About Me</Text>
            <Text style={{ fontSize: 10 }}>{resumeData.personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.creativeSectionTitle}>Work Experience</Text>
            {resumeData.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={styles.modernItemHeader}>
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>{exp.title}</Text>
                  <Text style={{ fontSize: 9, color: "#666" }}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </Text>
                </View>
                <View style={styles.modernItemHeader}>
                  <Text style={{ fontSize: 10, color: "#1e3a8a" }}>{exp.company}</Text>
                  {exp.location && (
                    <Text style={{ fontSize: 9, color: "#666" }}>{exp.location}</Text>
                  )}
                </View>
                <Text style={{ fontSize: 9, marginTop: 3 }}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.creativeSectionTitle}>Education</Text>
            {resumeData.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 10 }}>
                <View style={styles.modernItemHeader}>
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                    {edu.degree} in {edu.field}
                  </Text>
                  <Text style={{ fontSize: 9, color: "#666" }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                <Text style={{ fontSize: 10, color: "#1e3a8a" }}>{edu.institution}</Text>
                {edu.location && (
                  <Text style={{ fontSize: 9, color: "#666" }}>{edu.location}</Text>
                )}
                {edu.description && (
                  <Text style={{ fontSize: 9, marginTop: 3 }}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resumeData.projects.length > 0 && (
          <View>
            <Text style={styles.creativeSectionTitle}>Projects</Text>
            {resumeData.projects.map((project) => (
              <View key={project.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>{project.title}</Text>
                  {project.link && (
                    <Text style={{ fontSize: 8, marginLeft: 5, color: "#1e3a8a" }}>
                      ({project.link})
                    </Text>
                  )}
                </View>
                <Text style={{ fontSize: 9, marginTop: 3 }}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  </Page>
);

// Main Resume PDF component
const ResumePDF = ({ resumeData, template }: ResumePDFProps) => {
  const renderTemplate = () => {
    if (!template || template.category === "Modern") {
      return <ModernResumePDF resumeData={resumeData} />;
    }

    if (template.category === "Classic") {
      return <ClassicResumePDF resumeData={resumeData} />;
    }

    if (template.category === "Creative" || template.id === "template-3") {
      return <CreativeResumePDF resumeData={resumeData} />;
    }

    // Default to modern if no match
    return <ModernResumePDF resumeData={resumeData} />;
  };

  return (
    <Document>
      {renderTemplate()}
    </Document>
  );
};

// PDF Download Button component
const PDFDownloadButton = ({ resumeData, template }: ResumePDFProps) => {
  const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;

  return (
    <PDFDownloadLink
      document={<ResumePDF resumeData={resumeData} template={template} />}
      fileName={fileName}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      style={{
        textDecoration: 'none',
        cursor: 'pointer'
      }}
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Generating PDF...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
};

export { ResumePDF, PDFDownloadButton };
