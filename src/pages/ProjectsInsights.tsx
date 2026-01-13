import { useState } from "react";
import { Lightbulb, BookOpen, Wrench, Target, ArrowRight, Plus, ChevronDown, ChevronUp, FileText, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import projectsInsightsHero from "@/assets/projects-insights-hero.jpg";
import { AuthorProfileCard } from "@/components/announcements/AuthorProfileCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type InsightCategory = "strategy" | "software_tip";

interface InsightDocument {
  id: string;
  name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
}

interface ProjectInsight {
  id: string;
  title: string;
  description: string;
  extended_content: string | null;
  category: InsightCategory;
  tags: string[];
  author_id: string;
  created_at: string;
  author: {
    id: string;
    full_name: string;
    initials: string | null;
    avatar_url: string | null;
    role: string | null;
    department: string | null;
    email: string | null;
    skills: string[] | null;
  } | null;
  documents: InsightDocument[];
}

function InsightCard({ item, isStrategy }: { item: ProjectInsight; isStrategy: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isStrategy ? Target : Wrench;

  const getDocumentUrl = (filePath: string) => {
    const { data } = supabase.storage.from("insight-documents").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const hasExpandedContent = item.extended_content || item.documents.length > 0;

  return (
    <Card className="bg-card hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isStrategy ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{isStrategy ? "Strategy" : "Software Tip"}</CardDescription>
            </div>
          </div>
          {item.author && <AuthorProfileCard author={item.author} />}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, i) => (
              <Badge key={i} variant={isStrategy ? "secondary" : "outline"} className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                {isOpen ? (
                  <>
                    Show Less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Learn More <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="mt-4 space-y-4">
            <Separator />
            
            {item.extended_content ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Detailed Information</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.extended_content}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Detailed Information</h4>
                <p className="text-sm text-muted-foreground italic">No additional details have been added yet.</p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </h4>
              {item.documents.length > 0 ? (
                <div className="space-y-2">
                  {item.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={getDocumentUrl(doc.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-sm truncate">{doc.name}</span>
                      <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No documents attached.</p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export default function ProjectsInsights() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [extendedContent, setExtendedContent] = useState("");
  const [category, setCategory] = useState<InsightCategory>("strategy");
  const [tagsInput, setTagsInput] = useState("");

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ["project-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_insights")
        .select(`
          *,
          author:profiles!project_insights_author_id_fkey (
            id,
            full_name,
            initials,
            avatar_url,
            role,
            department,
            email,
            skills
          ),
          documents:project_insight_documents (
            id,
            name,
            file_path,
            file_type,
            file_size
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ProjectInsight[];
    },
  });

  const createInsight = useMutation({
    mutationFn: async () => {
      if (!profile?.id) throw new Error("You must be logged in");
      
      const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      
      const { error } = await supabase.from("project_insights").insert({
        title,
        description,
        extended_content: extendedContent || null,
        category,
        tags,
        author_id: profile.id,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-insights"] });
      toast.success("Project insight created!");
      setIsDialogOpen(false);
      setTitle("");
      setDescription("");
      setExtendedContent("");
      setCategory("strategy");
      setTagsInput("");
    },
    onError: (error) => {
      toast.error("Failed to create insight: " + error.message);
    },
  });

  const strategies = insights.filter(i => i.category === "strategy");
  const softwareTips = insights.filter(i => i.category === "software_tip");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    createInsight.mutate();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={projectsInsightsHero}
          alt="Projects Insights banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Projects Insights</h1>
            </div>
          </div>
          
          {user && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Insight</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Project Insight</DialogTitle>
                  <DialogDescription>
                    Share your knowledge with the team. Your insights help everyone succeed.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Agile Sprint Planning Tips"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as InsightCategory)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strategy">Actionable Strategy</SelectItem>
                        <SelectItem value="software_tip">Practical Software Tip</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Summary *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief summary of the insight..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="extendedContent">Detailed Information</Label>
                    <Textarea
                      id="extendedContent"
                      value={extendedContent}
                      onChange={(e) => setExtendedContent(e.target.value)}
                      placeholder="Add more detailed information that will be shown when 'Learn More' is clicked..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g., Agile, Planning, Migration"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createInsight.isPending}>
                      {createInsight.isPending ? "Creating..." : "Create Insight"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading insights...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Lightbulb className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No insights yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Actionable Strategies Section */}
            {strategies.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Actionable Strategies</h2>
                </div>
                <div className="space-y-4">
                  {strategies.map((item) => (
                    <InsightCard key={item.id} item={item} isStrategy={true} />
                  ))}
                </div>
              </section>
            )}

            {/* Practical Software Tips Section */}
            {softwareTips.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Practical Software Tips</h2>
                </div>
                <div className="space-y-4">
                  {softwareTips.map((item) => (
                    <InsightCard key={item.id} item={item} isStrategy={false} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
