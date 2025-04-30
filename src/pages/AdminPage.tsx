import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import { AuthContext } from "@/Context/AuthContext";

const initialTemplates = [
  {
    id: "template-1",
    name: "Professional",
    category: "Modern",
    thumbnail: "https://placehold.co/300x400/e9e9e9/666666.png?text=Professional",
    createdAt: new Date("2023-01-15").toISOString(),
  },
  {
    id: "template-2",
    name: "Executive",
    category: "Classic",
    thumbnail: "https://placehold.co/300x400/e9e9e9/666666.png?text=Executive",
    createdAt: new Date("2023-02-20").toISOString(),
  },
  {
    id: "template-3",
    name: "Creative",
    category: "Modern",
    thumbnail: "https://placehold.co/300x400/e9e9e9/666666.png?text=Creative",
    createdAt: new Date("2023-03-10").toISOString(),
  },
];

export default function AdminPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    thumbnail: "",
  });

  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/admin/logout", {}, { withCredentials: true });
      logout(); // Clear context and local storage
      toast.success("Logged out successfully");
      window.location.href = "/admin-login"; // Redirect to login page
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTemplate.name.trim() || !newTemplate.category.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }

    const templateToAdd = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      category: newTemplate.category,
      thumbnail: newTemplate.thumbnail || "https://placehold.co/300x400/e9e9e9/666666.png?text=New+Template",
      createdAt: new Date().toISOString(),
    };

    setTemplates([...templates, templateToAdd]);

    setNewTemplate({
      name: "",
      category: "",
      thumbnail: "",
    });

    toast.success("Template added successfully");
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((template) => template.id !== id));
    toast.success("Template deleted successfully");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTemplate({
      ...newTemplate,
      [name]: value,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast.success("Template HTML uploaded successfully");
    }
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="templates">
        <TabsList className="mb-6">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="add-template">Add Template</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Category: {template.category}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                    Template Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newTemplate.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Professional Modern"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <Input
                    id="category"
                    name="category"
                    value={newTemplate.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Modern, Classic, Creative"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="thumbnail" className="text-sm font-medium">
                    Thumbnail URL (optional)
                  </label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    value={newTemplate.thumbnail}
                    onChange={handleInputChange}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="template-file" className="text-sm font-medium">
                    Template HTML File
                  </label>
                  <Input
                    id="template-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload the HTML template file that defines the resume layout.
                  </p>
                </div>

                <div className="pt-2">
                  <Button type="submit">Add Template</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure the resume builder settings.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="site-name" className="text-sm font-medium">
                    Site Name
                  </label>
                  <Input
                    id="site-name"
                    defaultValue="Resume Builder"
                    placeholder="Site Name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="max-resumes" className="text-sm font-medium">
                    Maximum Resumes Per User
                  </label>
                  <Input
                    id="max-resumes"
                    type="number"
                    defaultValue="10"
                    min="1"
                  />
                </div>

                <div className="pt-2">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
