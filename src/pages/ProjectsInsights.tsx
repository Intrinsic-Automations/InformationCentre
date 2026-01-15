import { useState, useRef } from "react";
import { Lightbulb, BookOpen, Wrench, Target, ArrowRight, Plus, ChevronDown, ChevronUp, FileText, Download, Upload, X, Pencil } from "lucide-react";
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

interface PendingFile {
  file: File;
  id: string;
}

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

function InsightCard({ 
  item, 
  isStrategy, 
  currentProfileId,
  onEdit 
}: { 
  item: ProjectInsight; 
  isStrategy: boolean;
  currentProfileId?: string;
  onEdit: (item: ProjectInsight) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isStrategy ? Target : Wrench;
  const isAuthor = currentProfileId && item.author_id === currentProfileId;

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
          <div className="flex items-center gap-2">
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(item)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {item.author && <AuthorProfileCard author={item.author} />}
          </div>
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<ProjectInsight | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [extendedContent, setExtendedContent] = useState("");
  const [category, setCategory] = useState<InsightCategory>("strategy");
  const [tagsInput, setTagsInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (item: ProjectInsight) => {
    setEditingInsight(item);
    setTitle(item.title);
    setDescription(item.description);
    setExtendedContent(item.extended_content || "");
    setCategory(item.category);
    setTagsInput(item.tags?.join(", ") || "");
    setPendingFiles([]);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setExtendedContent("");
    setCategory("strategy");
    setTagsInput("");
    setPendingFiles([]);
    setEditingInsight(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles: PendingFile[] = Array.from(files).map(file => ({
      file,
      id: crypto.randomUUID(),
    }));
    
    setPendingFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setPendingFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

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
      
      setIsUploading(true);
      const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      
      // Create the insight first
      const { data: newInsight, error: insertError } = await supabase
        .from("project_insights")
        .insert({
          title,
          description,
          extended_content: extendedContent || null,
          category,
          tags,
          author_id: profile.id,
        })
        .select("id")
        .single();
      
      if (insertError) throw insertError;

      // Upload files and create document records
      for (const pendingFile of pendingFiles) {
        const fileExt = pendingFile.file.name.split(".").pop();
        const filePath = `${newInsight.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("insight-documents")
          .upload(filePath, pendingFile.file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        await supabase.from("project_insight_documents").insert({
          insight_id: newInsight.id,
          name: pendingFile.file.name,
          file_path: filePath,
          file_type: pendingFile.file.type || null,
          file_size: pendingFile.file.size,
          uploaded_by: profile.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-insights"] });
      toast.success("Project insight created!");
      setIsDialogOpen(false);
      resetForm();
      setIsUploading(false);
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error("Failed to create insight: " + error.message);
    },
  });

  const updateInsight = useMutation({
    mutationFn: async () => {
      if (!profile?.id || !editingInsight) throw new Error("You must be logged in");
      
      setIsUploading(true);
      const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      
      // Update the insight
      const { error: updateError } = await supabase
        .from("project_insights")
        .update({
          title,
          description,
          extended_content: extendedContent || null,
          category,
          tags,
        })
        .eq("id", editingInsight.id);
      
      if (updateError) throw updateError;

      // Upload any new files
      for (const pendingFile of pendingFiles) {
        const fileExt = pendingFile.file.name.split(".").pop();
        const filePath = `${editingInsight.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("insight-documents")
          .upload(filePath, pendingFile.file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        await supabase.from("project_insight_documents").insert({
          insight_id: editingInsight.id,
          name: pendingFile.file.name,
          file_path: filePath,
          file_type: pendingFile.file.type || null,
          file_size: pendingFile.file.size,
          uploaded_by: profile.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-insights"] });
      toast.success("Project insight updated!");
      setIsEditDialogOpen(false);
      resetForm();
      setIsUploading(false);
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error("Failed to update insight: " + error.message);
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    updateInsight.mutate();
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
                  
                  <div className="space-y-2">
                    <Label>Documents</Label>
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Add Documents
                      </Button>
                      
                      {pendingFiles.length > 0 && (
                        <div className="space-y-1 max-h-32 overflow-auto">
                          {pendingFiles.map((pf) => (
                            <div
                              key={pf.id}
                              className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm"
                            >
                              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="flex-1 truncate">{pf.file.name}</span>
                              <span className="text-muted-foreground text-xs shrink-0">
                                {formatFileSize(pf.file.size)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={() => removeFile(pf.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createInsight.isPending || isUploading}>
                      {createInsight.isPending || isUploading ? "Creating..." : "Create Insight"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project Insight</DialogTitle>
            <DialogDescription>
              Update your insight details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Agile Sprint Planning Tips"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
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
              <Label htmlFor="edit-description">Summary *</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of the insight..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-extendedContent">Detailed Information</Label>
              <Textarea
                id="edit-extendedContent"
                value={extendedContent}
                onChange={(e) => setExtendedContent(e.target.value)}
                placeholder="Add more detailed information..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., Agile, Planning, Migration"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Add More Documents</Label>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Add Documents
                </Button>
                
                {pendingFiles.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-auto">
                    {pendingFiles.map((pf) => (
                      <div
                        key={pf.id}
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="flex-1 truncate">{pf.file.name}</span>
                        <span className="text-muted-foreground text-xs shrink-0">
                          {formatFileSize(pf.file.size)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => removeFile(pf.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateInsight.isPending || isUploading}>
                {updateInsight.isPending || isUploading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
                    <InsightCard 
                      key={item.id} 
                      item={item} 
                      isStrategy={true} 
                      currentProfileId={profile?.id}
                      onEdit={handleEditClick}
                    />
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
                    <InsightCard 
                      key={item.id} 
                      item={item} 
                      isStrategy={false} 
                      currentProfileId={profile?.id}
                      onEdit={handleEditClick}
                    />
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
