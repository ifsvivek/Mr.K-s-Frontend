import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Resume data types
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

export interface ResumeData {
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
  thumbnail: string; // URL to template preview image
  // ...other template properties
}

// Resume store
interface ResumeStore {
  resumes: Record<string, ResumeData>;
  currentResumeId: string | null;
  templates: Template[];
  currentTemplateId: string | null;

  // Actions
  createResume: () => string;
  updateResume: (resumeId: string, data: Partial<ResumeData>) => void;
  deleteResume: (resumeId: string) => void;
  setCurrentResume: (resumeId: string) => void;
  getCurrentResume: () => ResumeData | null;
  setCurrentTemplate: (templateId: string) => void;
  getCurrentTemplate: () => Template | null;
}

// Generate a simple unique ID
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Initial resume data
const initialResumeData: ResumeData = {
  personalInfo: {
    name: "John Doe",
    title: "Software Engineer",
    email: "john@example.com",
    phone: "123-456-7890",
    location: "New York, NY",
    summary: "Experienced software engineer with a passion for building clean, efficient, and user-friendly applications.",
  },
  experience: [
    {
      id: "exp1",
      title: "Senior Software Engineer",
      company: "Tech Company",
      location: "New York, NY",
      startDate: "2020-01",
      endDate: "Present",
      description: "Led development of various web applications using React and Node.js. Implemented CI/CD pipelines and improved application performance by 35%."
    },
    {
      id: "exp2",
      title: "Software Developer",
      company: "Startup Inc.",
      location: "San Francisco, CA",
      startDate: "2018-03",
      endDate: "2019-12",
      description: "Developed front-end interfaces using React and maintained backend APIs built with Express and MongoDB."
    }
  ],
  education: [
    {
      id: "edu1",
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of Technology",
      location: "Boston, MA",
      startDate: "2014-09",
      endDate: "2018-05",
      description: "GPA: 3.8/4.0. Relevant coursework included Data Structures, Algorithms, Web Development, and Database Systems."
    }
  ],
  skills: [
    { id: "skill1", name: "JavaScript", level: "Expert" },
    { id: "skill2", name: "React", level: "Expert" },
    { id: "skill3", name: "Node.js", level: "Advanced" },
    { id: "skill4", name: "TypeScript", level: "Advanced" },
    { id: "skill5", name: "HTML/CSS", level: "Expert" },
    { id: "skill6", name: "MongoDB", level: "Intermediate" },
    { id: "skill7", name: "Git", level: "Advanced" },
    { id: "skill8", name: "Docker", level: "Intermediate" },
  ],
  projects: [
    {
      id: "proj1",
      title: "E-commerce Platform",
      description: "Developed a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented features such as user authentication, product search, and payment processing.",
      link: "https://github.com/johndoe/ecommerce"
    }
  ],
  certifications: [
    {
      id: "cert1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2021-06",
      description: "Professional certification for AWS cloud development."
    }
  ]
};

// Templates data
const templateData: Template[] = [
  {
    id: "template-1",
    name: "Professional",
    category: "Modern",
    thumbnail: "https://placehold.co/300x400/e9e9e9/666666.png?text=Professional",
  },
  {
    id: "template-2",
    name: "Executive",
    category: "Classic",
    thumbnail: "https://placehold.co/300x400/e9e9e9/666666.png?text=Executive",
  },
  {
    id: "template-3",
    name: "Creative",
    category: "Modern",
    thumbnail: "https://placehold.co/300x400/e9e9e9/666666.png?text=Creative",
  },
];

// Create the store
export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: {},
      currentResumeId: null,
      templates: templateData,
      currentTemplateId: templateData[0].id,

      createResume: () => {
        const id = generateId();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [id]: { ...initialResumeData }
          },
          currentResumeId: id
        }));
        return id;
      },

      updateResume: (resumeId, data) => {
        set((state) => {
          if (!state.resumes[resumeId]) return state;

          return {
            resumes: {
              ...state.resumes,
              [resumeId]: {
                ...state.resumes[resumeId],
                ...data
              }
            }
          };
        });
      },

      deleteResume: (resumeId) => {
        set((state) => {
          const { [resumeId]: _, ...remaining } = state.resumes;

          // Update current resume if the deleted one was active
          let newCurrentId = state.currentResumeId;
          if (state.currentResumeId === resumeId) {
            const resumeIds = Object.keys(remaining);
            newCurrentId = resumeIds.length > 0 ? resumeIds[0] : null;
          }

          return {
            resumes: remaining,
            currentResumeId: newCurrentId
          };
        });
      },

      setCurrentResume: (resumeId) => {
        set({ currentResumeId: resumeId });
      },

      getCurrentResume: () => {
        const { resumes, currentResumeId } = get();

        // If there's a current resume, return it
        if (currentResumeId && resumes[currentResumeId]) {
          return resumes[currentResumeId];
        }

        // If no resumes exist, create one
        if (Object.keys(resumes).length === 0) {
          const newId = get().createResume();
          return resumes[newId];
        }

        // Otherwise, return the first available resume
        const firstId = Object.keys(resumes)[0];
        set({ currentResumeId: firstId });
        return resumes[firstId];
      },

      setCurrentTemplate: (templateId) => {
        set({ currentTemplateId: templateId });
      },

      getCurrentTemplate: () => {
        const { templates, currentTemplateId } = get();

        if (currentTemplateId) {
          const template = templates.find(t => t.id === currentTemplateId);
          if (template) return template;
        }

        // Default to first template
        return templates[0];
      }
    }),
    {
      name: 'resume-storage', // localStorage key
      partialize: (state) => ({
        resumes: state.resumes,
        currentResumeId: state.currentResumeId,
        currentTemplateId: state.currentTemplateId
      }),
    }
  )
);
