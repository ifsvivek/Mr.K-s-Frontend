import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { AuthContext } from "@/Context/AuthContext";

interface Template {
  _id: string;
  title: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

export default function AdminPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { admin, logout } = useContext(AuthContext);

  const [newTemplate, setNewTemplate] = useState({
    title: "",
    file: null as File | null
  });

  // Fetch templates from database
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/templateFile/all", {
          withCredentials: true,
        });
        setTemplates(res.data);
      } catch (err) {
        toast.error("Failed to fetch templates");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTemplate.title.trim() || !newTemplate.file) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newTemplate.title);
      if (newTemplate.file) {
        formData.append('file', newTemplate.file);
      }

      const response = await axios.post(
        "http://localhost:5000/api/templateFile/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setTemplates([...templates, response.data]);
      setNewTemplate({
        title: "",
        file: null
      });
      toast.success("Resume template uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload template");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/templateFile/delete/${id}`, {
        withCredentials: true,
      });
      setTemplates(templates.filter(template => template._id !== id));
      toast.success("Template deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete template");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTemplate({ ...newTemplate, [name]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTemplate({
        ...newTemplate,
        file: e.target.files[0]
      });
      toast.success("PDF file selected");
    }
  };

  const handlePreviewTemplate = (path: string) => {
    window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(path)}`, '_blank');
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Logged in as: {admin?.name}</span>
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates">
        <TabsList className="mb-6">
          <TabsTrigger value="templates">Resume Templates</TabsTrigger>
          <TabsTrigger value="add-template">Add Template</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No templates found</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template._id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        {template.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded on: {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Size: {(template.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewTemplate(template.path)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template._id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add-template">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Add New Resume Template</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTemplate} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Template Title*
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={newTemplate.title}
                    onChange={handleInputChange}
                    placeholder="Template title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="file" className="text-sm font-medium">
                    PDF File*
                  </label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit">Upload Template</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}