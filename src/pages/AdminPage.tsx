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
  name: string;
  description: string;
  thumbnail: string;
  structure: string;
  style: string;
  createdBy: {
    name: string;
    email: string;
  };
}

export default function AdminPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { admin, logout } = useContext(AuthContext);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    thumbnail: "",
    structure: "",
    style: ""
  });

  // Fetch templates from database
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/template/getAll", {
          withCredentials: true,
        });
        setTemplates(res.data.templates);
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

    if (!newTemplate.name.trim() || !newTemplate.description.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newTemplate.name);
      formData.append('description', newTemplate.description);
      formData.append('thumbnail', newTemplate.thumbnail);
      formData.append('structure', newTemplate.structure);
      formData.append('style', newTemplate.style);

      const response = await axios.post(
        "http://localhost:5000/api/template/create",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setTemplates([...templates, response.data.newTemplate]);
      setNewTemplate({
        name: "",
        description: "",
        thumbnail: "",
        structure: "",
        style: ""
      });
      toast.success("Template created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create template");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/template/delete/${id}`, {
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
        thumbnail: e.target.files[0]
      });
      toast.success("Thumbnail uploaded");
    }
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
          <TabsTrigger value="templates">Templates</TabsTrigger>
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
                    <CardTitle>{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="aspect-[3/4] w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created by: {template.createdBy?.name}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-4">
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
              <CardTitle>Add New Template</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTemplate} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Template Name*
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newTemplate.name}
                    onChange={handleInputChange}
                    placeholder="Template name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description*
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newTemplate.description}
                    onChange={handleInputChange}
                    placeholder="Template description"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="thumbnail" className="text-sm font-medium">
                    Thumbnail*
                  </label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="structure" className="text-sm font-medium">
                    Structure (HTML)
                  </label>
                  <Textarea
                    id="structure"
                    name="structure"
                    value={newTemplate.structure}
                    onChange={handleInputChange}
                    placeholder="HTML structure"
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="style" className="text-sm font-medium">
                    Style (CSS)
                  </label>
                  <Textarea
                    id="style"
                    name="style"
                    value={newTemplate.style}
                    onChange={handleInputChange}
                    placeholder="CSS styles"
                    rows={6}
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit">Create Template</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}