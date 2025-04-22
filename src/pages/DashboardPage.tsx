import { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useResumeStore } from "@/lib/store/resumeStore";
import { MoreHorizontal, Plus, FileText } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { resumes, createResume, deleteResume, getCurrentResume, setCurrentResume } = useResumeStore();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [resumeToRename, setResumeToRename] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  // Get all resumes as an array with their IDs
  const resumeList = Object.entries(resumes).map(([id, data]) => ({
    id,
    name: data.personalInfo.name || 'Untitled Resume',
    title: data.personalInfo.title || 'No Title',
    updatedAt: new Date().toLocaleDateString(), // In a real app, would track real timestamps
  }));

  // Handle creating a new resume
  const handleCreateResume = () => {
    const id = createResume();
    toast.success("New resume created");
    navigate(`/editor/${id}`);
  };

  // Open resume in editor
  const handleOpenResume = (id: string) => {
    setCurrentResume(id);
    navigate(`/editor/${id}`);
  };

  // Prepare to delete a resume
  const handleDeleteClick = (id: string) => {
    setResumeToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Actually delete the resume
  const confirmDelete = () => {
    if (resumeToDelete) {
      deleteResume(resumeToDelete);
      setDeleteConfirmOpen(false);
      setResumeToDelete(null);
      toast.success("Resume deleted");
    }
  };

  // Prepare to rename a resume
  const handleRenameClick = (id: string) => {
    setResumeToRename(id);
    const resumeName = resumes[id]?.personalInfo.name || '';
    setNewName(resumeName);
    setRenameDialogOpen(true);
  };

  // Actually rename the resume
  const confirmRename = () => {
    if (resumeToRename && newName.trim()) {
      const resumeData = resumes[resumeToRename];
      if (resumeData) {
        const updatedPersonalInfo = {
          ...resumeData.personalInfo,
          name: newName.trim()
        };

        // Update the resume with the new name
        deleteResume(resumeToRename); // Remove old version
        createResume(); // Create new with updated name

        setRenameDialogOpen(false);
        setResumeToRename(null);
        setNewName("");
        toast.success("Resume renamed");
      }
    }
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your resumes in one place
          </p>
        </div>
        <Button onClick={handleCreateResume} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Resume
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Resumes</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {resumeList.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first resume to get started
              </p>
              <Button onClick={handleCreateResume}>Create Resume</Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resumeList.map((resume) => (
                <Card key={resume.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="truncate">{resume.name}</CardTitle>
                    <CardDescription>{resume.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="h-32 flex items-center justify-center bg-muted/30">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </CardContent>
                  <CardFooter className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      Last updated: {resume.updatedAt}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenResume(resume.id)}
                      >
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRenameClick(resume.id)}
                          >
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(resume.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumeList.slice(0, 6).map((resume) => (
              <Card key={resume.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="truncate">{resume.name}</CardTitle>
                  <CardDescription>{resume.title}</CardDescription>
                </CardHeader>
                <CardContent className="h-32 flex items-center justify-center bg-muted/30">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Last updated: {resume.updatedAt}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenResume(resume.id)}
                  >
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              resume.
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

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
            <DialogDescription>
              Enter a new name for your resume
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Resume Name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
