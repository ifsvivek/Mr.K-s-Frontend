import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, Plus, FileText, User, Mail, Pencil, Save, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuthContext } from "@/Context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Resume {
  _id: string;
  updatedAt: string;
  data: {
    personalInfo: {
      name: string;
      title: string;
    };
  };
}

interface ResumeFile {
  _id: string;
  title: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  profession?: string;
  location?: string;
  phone?: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthContext();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeFiles, setResumeFiles] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [resumeToRename, setResumeToRename] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState<Partial<UserProfile>>({});
  const [activeTab, setActiveTab] = useState("resumes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumesRes, profileRes, filesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/resume/getAll", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/resumeFile/all", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        setResumes(resumesRes.data.resumes);
        setProfile(profileRes.data.user);
        setResumeFiles(filesRes.data);
      } catch (err) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleCreateResume = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/resume/create",
        {
          templateId: "65f1d3e8e0a7d3b1f4f5d8a9", // Replace with a valid template ID
          data: {
            personalInfo: {
              name: "Untitled Resume",
              title: "Your Profession",
            },
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setResumes([...resumes, res.data.newResume]);
      navigate(`/editor/${res.data.newResume._id}`);
      toast.success("New resume created");
    } catch (err) {
      console.error("Error creating resume:", err);
      toast.error("Failed to create resume");
    }
  };

  const handleOpenResume = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleDownloadResumeFile = (file: ResumeFile) => {
    window.open(file.path, '_blank');
  };

  const handleDeleteResumeFile = async (fileId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/resumeFile/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumeFiles(resumeFiles.filter(f => f._id !== fileId));
      toast.success("Resume file deleted");
    } catch (err) {
      toast.error("Failed to delete resume file");
    }
  };

  const handleDeleteClick = (id: string) => {
    setResumeToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/resume/delete/${resumeToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(resumes.filter(r => r._id !== resumeToDelete));
      setDeleteConfirmOpen(false);
      toast.success("Resume deleted");
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  const handleRenameClick = (id: string) => {
    const resume = resumes.find(r => r._id === id);
    if (resume) {
      setResumeToRename(id);
      setNewName(resume.data?.personalInfo?.name || '');
      setRenameDialogOpen(true);
    }
  };

  const confirmRename = async () => {
    try {
      const updatedData = {
        data: {
          personalInfo: {
            name: newName.trim(),
            title: resumes.find(r => r._id === resumeToRename)?.data?.personalInfo?.title || '',
          },
        },
      };

      const res = await axios.patch(
        `http://localhost:5000/api/resume/update/${resumeToRename}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResumes(resumes.map(r =>
        r._id === resumeToRename ? res.data.updatedResume : r
      ));
      setRenameDialogOpen(false);
      toast.success("Resume renamed");
    } catch (err) {
      toast.error("Failed to rename resume");
    }
  };

  const handleEditProfile = () => {
    setEditProfileData({
      name: profile?.name || '',
      email: profile?.email || '',
      profession: profile?.profession || '',
      location: profile?.location || '',
      phone: profile?.phone || ''
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/user/profile",
        editProfileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data.user);
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Panel */}
        <div className="lg:w-1/3">
          <Card className="sticky top-6">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Profile</CardTitle>
                {isEditingProfile ? (
                  <Button size="sm" onClick={handleSaveProfile} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleEditProfile} className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.avatar} />
                  <AvatarFallback>
                    {profile?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditingProfile ? (
                  <Input
                    value={editProfileData.name || ''}
                    onChange={(e) => setEditProfileData({...editProfileData, name: e.target.value})}
                    className="text-xl font-semibold text-center mb-2"
                  />
                ) : (
                  <h3 className="text-xl font-semibold">{profile?.name}</h3>
                )}
                {isEditingProfile ? (
                  <Input
                    value={editProfileData.profession || ''}
                    onChange={(e) => setEditProfileData({...editProfileData, profession: e.target.value})}
                    className="text-muted-foreground text-center"
                    placeholder="Your profession"
                  />
                ) : (
                  <p className="text-muted-foreground">{profile?.profession || 'No profession set'}</p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  {isEditingProfile ? (
                    <Input
                      value={editProfileData.email || ''}
                      onChange={(e) => setEditProfileData({...editProfileData, email: e.target.value})}
                    />
                  ) : (
                    <p>{profile?.email}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  {isEditingProfile ? (
                    <Input
                      value={editProfileData.phone || ''}
                      onChange={(e) => setEditProfileData({...editProfileData, phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  ) : (
                    <p>{profile?.phone || 'No phone number'}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  {isEditingProfile ? (
                    <Input
                      value={editProfileData.location || ''}
                      onChange={(e) => setEditProfileData({...editProfileData, location: e.target.value})}
                      placeholder="Location"
                    />
                  ) : (
                    <p>{profile?.location || 'No location set'}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage all your resumes and files
              </p>
            </div>
            <Button onClick={handleCreateResume} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Resume
            </Button>
          </div>

          <Tabs defaultValue="resumes" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="resumes">Resumes</TabsTrigger>
              <TabsTrigger value="files">Saved Files</TabsTrigger>
            </TabsList>

            {/* Resumes Tab */}
            <TabsContent value="resumes">
              {resumes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first resume to get started
                  </p>
                  <Button onClick={handleCreateResume}>Create Resume</Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {resumes.map((resume) => (
                    <Card key={resume._id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="truncate">
                          {resume.data?.personalInfo?.name || "Untitled Resume"}
                        </CardTitle>
                        <CardDescription>
                          {resume.data?.personalInfo?.title || "No Title"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-32 flex items-center justify-center bg-muted/30">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                      </CardContent>
                      <CardFooter className="flex items-center justify-between pt-2">
                        <div className="text-xs text-muted-foreground">
                          Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleOpenResume(resume._id)}>
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleRenameClick(resume._id)}>Rename</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(resume._id)}>
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

            {/* Files Tab */}
            <TabsContent value="files">
              {resumeFiles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved files yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Your saved resume PDFs will appear here
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {resumeFiles.map((file) => (
                    <Card key={file._id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="truncate">
                          {file.title || "Untitled File"}
                        </CardTitle>
                        <CardDescription>
                          {new Date(file.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-32 flex items-center justify-center bg-muted/30">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                      </CardContent>
                      <CardFooter className="flex items-center justify-between pt-2">
                        <div className="text-xs text-muted-foreground">
                          {Math.round(file.size / 1024)} KB
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => handleDownloadResumeFile(file)}
                            className="gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteResumeFile(file._id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>This will permanently delete the resume.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Rename Dialog */}
          <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Resume</DialogTitle>
                <DialogDescription>Enter a new name for the resume</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
                <Button onClick={confirmRename}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}