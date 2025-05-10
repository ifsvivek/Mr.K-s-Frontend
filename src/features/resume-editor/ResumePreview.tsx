import { useState, useEffect } from "react";
import axios from "axios";

interface Template {
  id: string;
  name: string;
  path: string;
}

interface ResumePreviewProps {
  template: Template | null;
}

export default function ResumePreview({ template }: ResumePreviewProps) {
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch template URL when template changes
  useEffect(() => {
    if (template) {
      fetchTemplateUrl(template.id);
    } else {
      setTemplateUrl(null);
    }
  }, [template]);

  const fetchTemplateUrl = async (templateId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch the template download URL from your API
      const response = await axios.get(`http://localhost:5000/api/templateFile/singleTemplete/${templateId}`, {
        withCredentials: true,
      });

      // Assuming the response contains the download URL or path
      // Adjust this based on your actual API response structure
      const downloadUrl = `http://localhost:5000/api/templateFile/download/${templateId}`;
      setTemplateUrl(downloadUrl);
    } catch (err) {
      console.error("Failed to fetch template:", err);
      setError("Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p>Loading template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p>Please select a template</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        {templateUrl ? (
          <iframe 
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(templateUrl)}`}
            className="w-full h-full border-none"
            title="Template Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Template preview not available</p>
          </div>
        )}
      </div>
    </div>
  );
}