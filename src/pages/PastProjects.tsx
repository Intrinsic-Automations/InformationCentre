import { useState } from "react";
import { History, CheckCircle2, ArrowRight, FileDown, Info, Wrench, AlertTriangle, Ticket, Pencil } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import pastProjectsHero from "@/assets/past-projects-hero.jpg";

interface DatabaseProject {
  id: string;
  name: string;
  status: string;
  type: string;
  description: string | null;
  summary: string | null;
  challenges: string | null;
  tools_used: string[] | null;
  tickets_raised: number | null;
  end_date: string | null;
  author_id: string | null;
  author?: {
    id: string;
    full_name: string;
    initials: string;
    avatar_url: string | null;
  };
}

export default function PastProjects() {
  const [selectedProject, setSelectedProject] = useState<DatabaseProject | null>(null);
  const [editingProject, setEditingProject] = useState<DatabaseProject | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    description: "",
    summary: "",
    challenges: "",
    tools_used: "",
    tickets_raised: 0,
  });
  
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch completed projects from database
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['past-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          author:profiles!projects_author_id_fkey (
            id,
            full_name,
            initials,
            avatar_url
          )
        `)
        .eq('status', 'completed')
        .order('end_date', { ascending: false });
      
      if (error) throw error;
      return data as DatabaseProject[];
    },
  });

  // Update project mutation
  const updateProject = useMutation({
    mutationFn: async (project: { id: string; updates: Partial<DatabaseProject> }) => {
      const { error } = await supabase
        .from('projects')
        .update({
          name: project.updates.name,
          type: project.updates.type,
          description: project.updates.description,
          summary: project.updates.summary,
          challenges: project.updates.challenges,
          tools_used: project.updates.tools_used,
          tickets_raised: project.updates.tickets_raised,
        })
        .eq('id', project.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['past-projects'] });
      toast.success("Project updated successfully");
      setEditingProject(null);
    },
    onError: (error) => {
      toast.error("Failed to update project: " + error.message);
    },
  });

  const handleEditClick = (project: DatabaseProject) => {
    setEditingProject(project);
    setEditForm({
      name: project.name,
      type: project.type,
      description: project.description || "",
      summary: project.summary || "",
      challenges: project.challenges || "",
      tools_used: project.tools_used?.join(", ") || "",
      tickets_raised: project.tickets_raised || 0,
    });
  };

  const handleSaveEdit = () => {
    if (!editingProject) return;
    
    updateProject.mutate({
      id: editingProject.id,
      updates: {
        name: editForm.name,
        type: editForm.type,
        description: editForm.description,
        summary: editForm.summary,
        challenges: editForm.challenges,
        tools_used: editForm.tools_used.split(",").map(t => t.trim()).filter(Boolean),
        tickets_raised: editForm.tickets_raised,
      },
    });
  };

  const isAuthor = (project: DatabaseProject) => {
    return profile?.id === project.author_id;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={pastProjectsHero}
          alt="Past Projects banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Past Projects</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Posting Guidelines */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Posting Guidelines</h3>
                <p className="text-sm text-muted-foreground">
                  Please upload a detailed overview of your project including key outcomes, challenges faced, and lessons learned. 
                  Don't forget to upload your <strong>End of Project Report</strong> documents to help the team learn from your experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No past projects found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id} className="bg-card">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>Completed {formatDate(project.end_date)}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={
                        project.type === "Migration" ? "border-orange-500/50 text-orange-600" :
                        project.type === "Integration" ? "border-blue-500/50 text-blue-600" :
                        "border-green-500/50 text-green-600"
                      }>
                        {project.type}
                      </Badge>
                      <Badge variant="default">Success</Badge>
                      {isAuthor(project) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditClick(project)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {/* Author info */}
                  {project.author && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/30">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={project.author.avatar_url || undefined} alt={project.author.full_name} />
                        <AvatarFallback className="text-xs bg-primary/20 text-primary">
                          {project.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        Uploaded by <span className="font-medium text-foreground">{project.author.full_name}</span>
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 mb-4">{project.description}</p>
                  
                  {/* Project Closure Summary */}
                  <div className="bg-muted/30 rounded-lg p-3 mb-4 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">Project Closure Summary</h4>
                      <a
                        href="#"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        Download Full Document
                      </a>
                    </div>
                    <p className="text-xs text-foreground/70 mb-2">{project.summary}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Challenges: </span>
                        <span className="text-foreground/80">{project.challenges}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tools: </span>
                        <span className="text-foreground/80">{project.tools_used?.join(", ")}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tickets Raised: </span>
                        <span className="text-primary font-medium">{project.tickets_raised}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Full Report <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Full Report Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <div>
                      <DialogTitle className="text-xl">{selectedProject.name}</DialogTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Completed {formatDate(selectedProject.end_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={
                      selectedProject.type === "Migration" ? "border-orange-500/50 text-orange-600" :
                      selectedProject.type === "Integration" ? "border-blue-500/50 text-blue-600" :
                      "border-green-500/50 text-green-600"
                    }>
                      {selectedProject.type}
                    </Badge>
                    <Badge variant="default">Success</Badge>
                  </div>
                </div>
              </DialogHeader>

              <Separator className="my-4" />

              {/* Project Overview */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Project Overview</h3>
                  <p className="text-sm text-foreground/80">{selectedProject.description}</p>
                </div>

                <Separator />

                {/* Project Closure Report */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Project Closure Report</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        Executive Summary
                      </h4>
                      <p className="text-sm text-foreground/80">{selectedProject.summary}</p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Challenges Faced
                      </h4>
                      <p className="text-sm text-foreground/80">{selectedProject.challenges}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-blue-500" />
                          Tools & Technologies
                        </h4>
                        <p className="text-sm text-foreground/80">{selectedProject.tools_used?.join(", ")}</p>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-purple-500" />
                          Tickets Raised
                        </h4>
                        <p className="text-2xl font-bold text-primary">{selectedProject.tickets_raised}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Download Section */}
                <div className="flex items-center justify-between bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Full Project Closure Document</h4>
                    <p className="text-xs text-muted-foreground">Download the complete project report with all details</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Project Type</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Migration">Migration</SelectItem>
                  <SelectItem value="Integration">Integration</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-summary">Executive Summary</Label>
              <Textarea
                id="edit-summary"
                value={editForm.summary}
                onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-challenges">Challenges Faced</Label>
              <Textarea
                id="edit-challenges"
                value={editForm.challenges}
                onChange={(e) => setEditForm({ ...editForm, challenges: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tools">Tools Used (comma-separated)</Label>
              <Input
                id="edit-tools"
                value={editForm.tools_used}
                onChange={(e) => setEditForm({ ...editForm, tools_used: e.target.value })}
                placeholder="e.g., Analytics Suite, Power BI, Azure"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tickets">Tickets Raised</Label>
              <Input
                id="edit-tickets"
                type="number"
                value={editForm.tickets_raised}
                onChange={(e) => setEditForm({ ...editForm, tickets_raised: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingProject(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={updateProject.isPending}>
                {updateProject.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
