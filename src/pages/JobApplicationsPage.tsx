import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useJobStore, type JobApplication, type JobStatus, STATUS_COLORS, STATUS_OPTIONS } from "@/lib/store/jobStore";
import { useResumeStore } from "@/lib/store/resumeStore";
import {
  Briefcase,
  CalendarCheck,
  Clock,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash
} from "lucide-react";
import { toast } from "sonner";

export default function JobApplicationsPage() {
  const navigate = useNavigate();
  const { jobs, addJob, updateJob, deleteJob, getJobsByStatus } = useJobStore();
  const { resumes } = useResumeStore();
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<string | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>('all');

  // Form state
  const [formData, setFormData] = useState<Omit<JobApplication, 'id'>>({
    company: "",
    position: "",
    location: "",
    postingUrl: "",
    resumeId: Object.keys(resumes)[0] || "",
    status: "applied",
    dateApplied: new Date().toISOString().split('T')[0],
    notes: ""
  });

  // Get all jobs as an array
  const allJobs = Object.values(jobs);

  // Filter jobs by selected status
  const filteredJobs = selectedStatus === 'all'
    ? allJobs
    : getJobsByStatus(selectedStatus);

  // Prepare to add a new job
  const handleAddJobClick = () => {
    setEditMode(false);
    setJobToEdit(null);
    // Reset form with default values
    setFormData({
      company: "",
      position: "",
      location: "",
      postingUrl: "",
      resumeId: Object.keys(resumes)[0] || "",
      status: "applied",
      dateApplied: new Date().toISOString().split('T')[0],
      notes: ""
    });
    setJobDialogOpen(true);
  };

  // Prepare to edit a job
  const handleEditClick = (job: JobApplication) => {
    setEditMode(true);
    setJobToEdit(job.id);
    // Fill form with job data
    setFormData({
      company: job.company,
      position: job.position,
      location: job.location,
      postingUrl: job.postingUrl || "",
      resumeId: job.resumeId,
      status: job.status,
      dateApplied: job.dateApplied,
      notes: job.notes || "",
      nextStep: job.nextStep,
      nextStepDate: job.nextStepDate,
      interviews: job.interviews,
      contactPerson: job.contactPerson
    });
    setJobDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit the form to add or update a job
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company || !formData.position) {
      toast.error("Company and position are required");
      return;
    }

    if (editMode && jobToEdit) {
      // Update existing job
      updateJob(jobToEdit, formData);
      toast.success("Job application updated");
    } else {
      // Add new job
      addJob(formData);
      toast.success("New job application added");
    }

    setJobDialogOpen(false);
  };

  // Prepare to delete a job
  const handleDeleteClick = (id: string) => {
    setJobToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Actually delete the job
  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete);
      setDeleteConfirmOpen(false);
      setJobToDelete(null);
      toast.success("Job application deleted");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Get resume name by ID
  const getResumeName = (resumeId: string) => {
    return resumes[resumeId]?.personalInfo.name || "Unknown Resume";
  };

  // Count jobs by status
  const jobCounts = STATUS_OPTIONS.reduce((acc, { value }) => {
    acc[value] = allJobs.filter(job => job.status === value).length;
    return acc;
  }, {} as Record<JobStatus, number>);

  const totalJobs = allJobs.length;

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground mt-1">
            Track your job applications and interviews
          </p>
        </div>
        <Button onClick={handleAddJobClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Job Application
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card
          className={`cursor-pointer ${selectedStatus === 'all' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setSelectedStatus('all')}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <Briefcase className="h-8 w-8 mx-auto text-gray-500 mb-2" />
              <p className="font-medium">All</p>
              <p className="text-2xl font-bold">{totalJobs}</p>
            </div>
          </CardContent>
        </Card>

        {STATUS_OPTIONS.map(({ value, label }) => (
          <Card
            key={value}
            className={`cursor-pointer ${selectedStatus === value ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedStatus(value)}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${STATUS_COLORS[value]} mb-2`}>
                  {value === 'wishlist' && <Briefcase className="h-4 w-4" />}
                  {value === 'applied' && <Clock className="h-4 w-4" />}
                  {value === 'interview' && <CalendarCheck className="h-4 w-4" />}
                  {value === 'offered' && <Briefcase className="h-4 w-4" />}
                  {value === 'rejected' && <Briefcase className="h-4 w-4" />}
                  {value === 'accepted' && <Briefcase className="h-4 w-4" />}
                </div>
                <p className="font-medium">{label}</p>
                <p className="text-2xl font-bold">{jobCounts[value] || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No job applications yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Add your first job application to start tracking your job search progress
          </p>
          <Button onClick={handleAddJobClick}>Add Job Application</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{job.position}</h3>
                      <div className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[job.status]}`}>
                        {STATUS_OPTIONS.find(option => option.value === job.status)?.label}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{job.company} • {job.location}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(job)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClick(job.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Applied On</p>
                    <p>{formatDate(job.dateApplied)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Resume Used</p>
                    <p>{getResumeName(job.resumeId)}</p>
                  </div>
                  {job.nextStep && (
                    <div>
                      <p className="text-muted-foreground">Next Step</p>
                      <p>{job.nextStep} {job.nextStepDate && `(${formatDate(job.nextStepDate)})`}</p>
                    </div>
                  )}
                </div>

                {job.notes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-muted-foreground mt-1">{job.notes}</p>
                  </div>
                )}

                {job.interviews && job.interviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Interviews:</p>
                    <div className="space-y-2">
                      {job.interviews.map((interview) => (
                        <div key={interview.id} className="text-sm bg-muted/30 p-2 rounded">
                          <div className="flex justify-between">
                            <p>{interview.type}</p>
                            <p>{formatDate(interview.date)}</p>
                          </div>
                          {interview.notes && (
                            <p className="text-muted-foreground mt-1">{interview.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {job.postingUrl && (
                  <div className="mt-4">
                    <Button variant="link" className="p-0 h-auto" onClick={() => window.open(job.postingUrl, '_blank')}>
                      View Job Posting
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Job Dialog */}
      <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Job Application" : "Add Job Application"}</DialogTitle>
            <DialogDescription>
              {editMode
                ? "Update details about this job application"
                : "Enter details about the job you're applying for"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Job title"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State or Remote"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateApplied">Date Applied</Label>
                  <Input
                    id="dateApplied"
                    name="dateApplied"
                    type="date"
                    value={formData.dateApplied}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumeId">Resume Used</Label>
                <Select
                  value={formData.resumeId}
                  onValueChange={(value) => handleSelectChange('resumeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(resumes).map(([id, resume]) => (
                      <SelectItem key={id} value={id}>
                        {resume.personalInfo.name || "Untitled Resume"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postingUrl">Job Posting URL</Label>
                <Input
                  id="postingUrl"
                  name="postingUrl"
                  value={formData.postingUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nextStep">Next Step</Label>
                  <Input
                    id="nextStep"
                    name="nextStep"
                    value={formData.nextStep || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., Phone Interview"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextStepDate">Next Step Date</Label>
                  <Input
                    id="nextStepDate"
                    name="nextStepDate"
                    type="date"
                    value={formData.nextStepDate || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleInputChange}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                {editMode ? "Update" : "Add"} Job Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              job application and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
