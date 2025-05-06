import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

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

const categories = ["Modern", "Classic", "Professional", "Creative"];

export default function TemplatesPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token"); // token must be stored on login
        const res = await axios.get("http://localhost:5000/api/templateFile/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTemplates(res.data);
      } catch (err) {
        toast.error("Failed to fetch templates");
        console.error("Error fetching templates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0; // Category filtering placeholder
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategories, templates]);

  return (
    <div className="container py-10">
      <section className="flex flex-col items-center gap-6 py-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Resume Templates
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Choose from our collection of professional resume templates.
          All templates are fully customizable and ATS-friendly.
        </p>
      </section>

      <div className="mb-6 max-w-md mx-auto">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading templates...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center p-4">
                          <p className="font-medium mb-2">{template.title}</p>
                          <p className="text-sm text-muted-foreground">{template.filename}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {(template.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-medium">{template.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link to={`/editor?template=${template._id}`}>
                        <Button size="sm">Use Template</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTemplates.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground mt-10">
              No templates found.
            </p>
          )}
        </>
      )}
    </div>
  );
}
