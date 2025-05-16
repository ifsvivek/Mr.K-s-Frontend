import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { BrainCircuit, CheckCircle2, MessageSquarePlus, RefreshCw } from "lucide-react";

// Types for resume data (simplified for this component)
interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    description: string;
    [key: string]: any;
  }>;
  education: Array<{
    id: string;
    degree: string;
    field: string;
    institution: string;
    description: string;
    [key: string]: any;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  [key: string]: any;
}

interface SuggestionItem {
  id: string;
  text: string;
  section: string;
  field: string | null;
  itemId: string | null;
  improvement: string;
}

interface AiSuggestionsProps {
  resumeData: ResumeData;
  onApplySuggestion: (suggestion: SuggestionItem) => void;
}

export default function AiSuggestions({ resumeData, onApplySuggestion }: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Generate suggestions based on the resume data
  const generateSuggestions = () => {
    setIsGenerating(true);

    // In a real implementation, this would make an API call to an AI service
    setTimeout(() => {
      const newSuggestions = generateFakeSuggestions(resumeData);
      setSuggestions(newSuggestions);
      setIsGenerating(false);
      toast.success("AI suggestions generated");
    }, 1500);
  };

  // Apply a specific suggestion
  const handleApplySuggestion = (suggestion: SuggestionItem) => {
    onApplySuggestion(suggestion);

    // Remove the suggestion from the list after applying
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));

    toast.success("Suggestion applied");
  };

  // Filter suggestions by section
  const filteredSuggestions = selectedSection
    ? suggestions.filter(s => s.section === selectedSection)
    : suggestions;

  // Count suggestions by section
  const summaryCount = suggestions.filter(s => s.section === 'summary').length;
  const experienceCount = suggestions.filter(s => s.section === 'experience').length;
  const educationCount = suggestions.filter(s => s.section === 'education').length;
  const skillsCount = suggestions.filter(s => s.section === 'skills').length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          <span>AI Resume Assistant</span>
        </CardTitle>
        <CardDescription>Get AI-powered suggestions to improve your resume</CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquarePlus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No suggestions yet</h3>
            <p className="text-muted-foreground mb-6">
              Generate suggestions to improve your resume content and make it stand out.
            </p>
            <Button
              onClick={generateSuggestions}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4" />
                  Generate Suggestions
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSection === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSection(null)}
                className="text-xs"
              >
                All ({suggestions.length})
              </Button>
              {summaryCount > 0 && (
                <Button
                  variant={selectedSection === 'summary' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSection('summary')}
                  className="text-xs"
                >
                  Summary ({summaryCount})
                </Button>
              )}
              {experienceCount > 0 && (
                <Button
                  variant={selectedSection === 'experience' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSection('experience')}
                  className="text-xs"
                >
                  Experience ({experienceCount})
                </Button>
              )}
              {educationCount > 0 && (
                <Button
                  variant={selectedSection === 'education' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSection('education')}
                  className="text-xs"
                >
                  Education ({educationCount})
                </Button>
              )}
              {skillsCount > 0 && (
                <Button
                  variant={selectedSection === 'skills' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSection('skills')}
                  className="text-xs"
                >
                  Skills ({skillsCount})
                </Button>
              )}
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-medium capitalize mb-1">
                        {suggestion.section}
                        {suggestion.field && ` (${suggestion.field})`}
                      </p>
                      <p className="text-sm text-muted-foreground">{suggestion.text}</p>

                      {/* Improvement content with popover */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-xs">
                            View suggestion
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Suggested improvement:</h4>
                            <p className="text-sm">{suggestion.improvement}</p>
                            <Button
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => handleApplySuggestion(suggestion)}
                            >
                              Apply Suggestion
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {suggestions.length > 0 && (
        <CardFooter>
          <Button
            className="w-full gap-2"
            variant="outline"
            onClick={generateSuggestions}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Regenerate Suggestions
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// Function to generate fake suggestions (simulating AI response)
function generateFakeSuggestions(resumeData: ResumeData): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];

  // Summary suggestions
  if (resumeData?.personalInfo?.summary) {
    if (resumeData.personalInfo.summary.length < 200) {
      suggestions.push({
        id: `sugg-${Date.now()}-1`,
        section: 'summary',
        field: null,
        itemId: null,
        text: 'Your professional summary is quite brief. Consider expanding it to highlight your key strengths and career achievements.',
        improvement: 'Experienced software engineer with a passion for building clean, efficient, and user-friendly applications. With over 5 years of experience in full-stack development, I have successfully delivered multiple web applications that improved business processes by 35%. Skilled in modern JavaScript frameworks, cloud services, and agile methodologies.'
      });
    }

    if (!resumeData?.personalInfo?.summary?.includes('skills') && !resumeData?.personalInfo?.summary?.includes('expertise')) {
      suggestions.push({
        id: `sugg-${Date.now()}-2`,
        section: 'summary',
        field: null,
        itemId: null,
        text: 'Your summary doesn\'t mention your key skills or areas of expertise. Adding these can make your profile more targeted.',
        improvement: resumeData.personalInfo.summary + ' My expertise includes frontend development with React, backend services with Node.js, and database management with MongoDB and SQL.'
      });
    }
  }

  // Experience suggestions
  resumeData.experience?.forEach((exp, index) => {
    if (exp.description.length < 100) {
      suggestions.push({
        id: `sugg-${Date.now()}-exp-${index}`,
        section: 'experience',
        field: 'description',
        itemId: exp.id,
        text: `The description for your role at ${exp.company} could be more detailed.`,
        improvement: exp.description + ' Led cross-functional teams to implement new features that increased user engagement by 25%. Collaborated with stakeholders to gather requirements and deliver solutions that exceeded expectations. Implemented automated testing that reduced bug reports by 40%.'
      });
    }

    if (!exp.description.match(/\b(improved|increased|reduced|achieved|developed|implemented)\b/i)) {
      suggestions.push({
        id: `sugg-${Date.now()}-exp-action-${index}`,
        section: 'experience',
        field: 'description',
        itemId: exp.id,
        text: 'Try using more action verbs and quantifiable achievements in your experience description.',
        improvement: exp.description.replace(/^/, 'Implemented ')
      });
    }
  });

  // Education suggestions
  resumeData.education?.forEach((edu, index) => {
    if (!edu.description || edu.description.length < 50) {
      suggestions.push({
        id: `sugg-${Date.now()}-edu-${index}`,
        section: 'education',
        field: 'description',
        itemId: edu.id,
        text: 'Consider adding more details about your education, such as relevant coursework or achievements.',
        improvement: (edu.description || '') + ' Completed coursework in advanced algorithms, machine learning, and software engineering principles. Participated in research projects and hackathons, winning the university\'s annual coding competition.'
      });
    }
  });

  // Skills suggestions
  if ((resumeData.skills?.length ?? 0) < 8) {
    suggestions.push({
      id: `sugg-${Date.now()}-skills`,
      section: 'skills',
      field: null,
      itemId: null,
      text: 'Adding more skills will make your resume more comprehensive and help with ATS (Applicant Tracking Systems).',
      improvement: 'Consider adding these relevant skills: AWS, CI/CD, Docker, RESTful APIs, GraphQL, and Agile methodology.'
    });
  }

  const techSkills = resumeData.skills?.filter(skill =>
    ['javascript', 'react', 'node', 'angular', 'vue', 'python', 'java', 'c#', 'html', 'css'].includes(skill.name.toLowerCase())
  ) ?? [];

  if (techSkills.length < 3) {
    suggestions.push({
      id: `sugg-${Date.now()}-tech-skills`,
      section: 'skills',
      field: null,
      itemId: null,
      text: 'Your resume could benefit from more technical skills relevant to your field.',
      improvement: 'Consider adding popular technical skills like React, TypeScript, Node.js, and cloud services (AWS/Azure).'
    });
  }

  // Randomize suggestions order a bit to make it feel more natural
  return shuffleArray(suggestions).slice(0, 8); // Return max 8 suggestions
}

// Helper to shuffle array items for more natural-looking suggestions
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
