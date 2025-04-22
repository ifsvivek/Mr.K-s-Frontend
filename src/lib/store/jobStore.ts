import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Job application types
export type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offered' | 'rejected' | 'accepted';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  postingUrl?: string;
  resumeId: string;
  status: JobStatus;
  dateApplied: string;
  nextStep?: string;
  nextStepDate?: string;
  notes?: string;
  interviews?: {
    id: string;
    date: string;
    type: string;
    notes?: string;
  }[];
  contactPerson?: {
    name: string;
    email?: string;
    phone?: string;
    role?: string;
  };
}

// Status display options
export const STATUS_COLORS: Record<JobStatus, string> = {
  wishlist: 'bg-gray-200 text-gray-800',
  applied: 'bg-blue-100 text-blue-800',
  interview: 'bg-purple-100 text-purple-800',
  offered: 'bg-amber-100 text-amber-800',
  rejected: 'bg-red-100 text-red-800',
  accepted: 'bg-green-100 text-green-800',
};

export const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' },
];

interface JobStore {
  jobs: Record<string, JobApplication>;
  selectedJobId: string | null;

  // Actions
  addJob: (job: Omit<JobApplication, 'id'>) => string;
  updateJob: (id: string, data: Partial<JobApplication>) => void;
  deleteJob: (id: string) => void;
  getJobsForResume: (resumeId: string) => JobApplication[];
  getJobsByStatus: (status: JobStatus) => JobApplication[];
  setSelectedJob: (id: string | null) => void;
  getSelectedJob: () => JobApplication | null;
  addInterviewToJob: (jobId: string, interview: Omit<JobApplication['interviews'][0], 'id'>) => void;
  updateJobStatus: (jobId: string, newStatus: JobStatus) => void;
}

// Generate a simple unique ID
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Create the store
export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: {},
      selectedJobId: null,

      addJob: (job) => {
        const id = generateId();
        set((state) => ({
          jobs: {
            ...state.jobs,
            [id]: {
              ...job,
              id,
              interviews: job.interviews || [],
            }
          },
          selectedJobId: id
        }));
        return id;
      },

      updateJob: (id, data) => {
        set((state) => {
          if (!state.jobs[id]) return state;

          return {
            jobs: {
              ...state.jobs,
              [id]: {
                ...state.jobs[id],
                ...data
              }
            }
          };
        });
      },

      deleteJob: (id) => {
        set((state) => {
          const { [id]: _, ...remaining } = state.jobs;

          // Update selected job if necessary
          let newSelectedId = state.selectedJobId;
          if (state.selectedJobId === id) {
            newSelectedId = null;
          }

          return {
            jobs: remaining,
            selectedJobId: newSelectedId
          };
        });
      },

      getJobsForResume: (resumeId) => {
        return Object.values(get().jobs).filter(job => job.resumeId === resumeId);
      },

      getJobsByStatus: (status) => {
        return Object.values(get().jobs).filter(job => job.status === status);
      },

      setSelectedJob: (id) => {
        set({ selectedJobId: id });
      },

      getSelectedJob: () => {
        const { jobs, selectedJobId } = get();
        if (!selectedJobId) return null;
        return jobs[selectedJobId] || null;
      },

      addInterviewToJob: (jobId, interview) => {
        set((state) => {
          const job = state.jobs[jobId];
          if (!job) return state;

          const newInterview = {
            ...interview,
            id: generateId()
          };

          const updatedInterviews = [
            ...(job.interviews || []),
            newInterview
          ];

          return {
            jobs: {
              ...state.jobs,
              [jobId]: {
                ...job,
                interviews: updatedInterviews
              }
            }
          };
        });
      },

      updateJobStatus: (jobId, newStatus) => {
        set((state) => {
          const job = state.jobs[jobId];
          if (!job) return state;

          return {
            jobs: {
              ...state.jobs,
              [jobId]: {
                ...job,
                status: newStatus
              }
            }
          };
        });
      }
    }),
    {
      name: 'job-application-storage',
      partialize: (state) => ({
        jobs: state.jobs,
        selectedJobId: state.selectedJobId
      }),
    }
  )
);
