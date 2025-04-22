import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const templates = [
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
  {
    id: "template-4",
    name: "Minimalist",
    category: "Modern",
    thumbnail: "https://placehold.co/300x400/e9e9e9/666666.png?text=Minimalist",
  },
  {
    id: "template-5",
    name: "Corporate",
    category: "Professional",
    thumbnail: "https://placehold.co/300x400/e9e9e9/666666.png?text=Corporate",
  },
  {
    id: "template-6",
    name: "Bold",
    category: "Creative",
    thumbnail: "https://placehold.co/300x400/e9e9e9/666666.png?text=Bold",
  },
];

const categories = ["Modern", "Classic", "Professional", "Creative"];

export default function TemplatesPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(template.category);
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategories]);

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

      {/* Search Input */}
      <div className="mb-6 max-w-md mx-auto">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            className="rounded-full"
            size="sm"
            onClick={() => toggleCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                  <Link to={`/editor?template=${template.id}`}>
                    <Button size="sm">Use Template</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTemplates.length === 0 && (
        <p className="text-center text-muted-foreground mt-10">
          No templates found.
        </p>
      )}
    </div>
  );
}
