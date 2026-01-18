import { useState } from "react";
import { FolderKanban, Users, Clock, ChevronRight, Plus, Rocket, Search, FileText, PenTool, Server, Code, TestTube, Cog, FlaskConical, CloudUpload, RefreshCw, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import integrationHero from "@/assets/integration-hero.jpg";

// Timeline stages
const timelineStages = [
  { id: "kick_off", title: "Kick off", icon: Rocket, color: "bg-emerald-500" },
  { id: "discovery", title: "Discovery", icon: Search, color: "bg-blue-500" },
  { id: "sow", title: "SOW", icon: FileText, color: "bg-cyan-500" },
  { id: "hld", title: "High Level Design", icon: PenTool, color: "bg-purple-500" },
  { id: "environment", title: "Environment Set up", icon: Server, color: "bg-orange-500" },
  { id: "lld", title: "Low Level Design", icon: Code, color: "bg-pink-500" },
  { id: "development", title: "Development", icon: Cog, color: "bg-yellow-500" },
  { id: "testing_design", title: "Testing Design", icon: TestTube, color: "bg-teal-500" },
  { id: "implementation", title: "Implementation", icon: FlaskConical, color: "bg-rose-500" },
  { id: "integration_testing", title: "Integration Testing", icon: Server, color: "bg-violet-500" },
  { id: "uat", title: "UAT", icon: Users, color: "bg-amber-500" },
  { id: "production", title: "Production Deployment", icon: CloudUpload, color: "bg-green-500" },
  { id: "change_requests", title: "Change Requests", icon: RefreshCw, color: "bg-indigo-500" },
];

interface Project {
  id: string;
  name: string;
  status: string;
  type: string;
  stage: string | null;
  description: string | null;
  client_name: string | null;
  start_date: string | null;
  deadline: string | null;
  author_id: string | null;
  author?: {
    id: string;
    full_name: string;
    initials: string;
    avatar_url: string | null;
  };
  members?: ProjectMember[];
}

interface ProjectMember {
  id: string;
  profile_id: string;
  role: string | null;
  joined_at: string;
  profile?: {
    id: string;
    full_name: string;
    initials: string;
    avatar_url: string | null;
    role: string | null;
    department: string | null;
  };
}

interface Profile {
  id: string;
  full_name: string;
  initials: string;
  avatar_url: string | null;
  role: string | null;
  department: string | null;
}

export default function CurrentProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isManagingTeam, setIsManagingTeam] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    type: "Integration",
    description: "",
    client_name: "",
    start_date: "",
    deadline: "",
    stage: "kick_off",
  });

  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch active projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['current-projects'],
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
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });

  // Fetch project members for selected project
  const { data: projectMembers = [] } = useQuery({
    queryKey: ['project-members', selectedProject?.id],
    queryFn: async () => {
      if (!selectedProject?.id) return [];
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          *,
          profile:profiles!project_members_profile_id_fkey (
            id,
            full_name,
            initials,
            avatar_url,
            role,
            department
          )
        `)
        .eq('project_id', selectedProject.id);

      if (error) throw error;
      return data as ProjectMember[];
    },
    enabled: !!selectedProject?.id,
  });

  // Fetch all profiles for team management
  const { data: allProfiles = [] } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, initials, avatar_url, role, department')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      return data as Profile[];
    },
    enabled: isManagingTeam,
  });

  // Create project mutation
  const createProject = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("You must be logged in");

      const { error } = await supabase
        .from('projects')
        .insert({
          name: createForm.name,
          type: createForm.type,
          description: createForm.description,
          client_name: createForm.client_name || null,
          start_date: createForm.start_date || null,
          deadline: createForm.deadline || null,
          stage: createForm.stage,
          status: 'active',
          author_id: profile.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-projects'] });
      toast.success("Project created successfully");
      setIsCreating(false);
      setCreateForm({
        name: "",
        type: "Integration",
        description: "",
        client_name: "",
        start_date: "",
        deadline: "",
        stage: "kick_off",
      });
    },
    onError: (error) => {
      toast.error("Failed to create project: " + error.message);
    },
  });

  // Update project stage mutation
  const updateStage = useMutation({
    mutationFn: async ({ projectId, newStage }: { projectId: string; newStage: string }) => {
      const { error } = await supabase
        .from('projects')
        .update({ stage: newStage })
        .eq('id', projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-projects'] });
      toast.success("Project stage updated");
      if (selectedProject) {
        setSelectedProject({ ...selectedProject, stage: selectedProject.stage });
      }
    },
    onError: (error) => {
      toast.error("Failed to update stage: " + error.message);
    },
  });

  // Add team member mutation
  const addMember = useMutation({
    mutationFn: async ({ projectId, profileId, role }: { projectId: string; profileId: string; role: string }) => {
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          profile_id: profileId,
          role: role || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', selectedProject?.id] });
      toast.success("Team member added");
    },
    onError: (error) => {
      toast.error("Failed to add member: " + error.message);
    },
  });

  // Remove team member mutation
  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', selectedProject?.id] });
      toast.success("Team member removed");
    },
    onError: (error) => {
      toast.error("Failed to remove member: " + error.message);
    },
  });

  const isOwner = (project: Project) => profile?.id === project.author_id;

  const getStageIndex = (stage: string | null) => {
    if (!stage) return 0;
    return timelineStages.findIndex(s => s.id === stage);
  };

  const getStageInfo = (stage: string | null) => {
    return timelineStages.find(s => s.id === stage) || timelineStages[0];
  };

  const getProgressPercent = (stage: string | null) => {
    const index = getStageIndex(stage);
    return ((index + 1) / timelineStages.length) * 100;
  };

  const availableProfiles = allProfiles.filter(
    p => !projectMembers.some(m => m.profile_id === p.id)
  );

  const handleAddMember = (profileId: string) => {
    if (!selectedProject) return;
    addMember.mutate({ projectId: selectedProject.id, profileId, role: "Team Member" });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={integrationHero}
          alt="Current Projects banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Current Projects</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground">Track active projects and their progress through the solution timeline</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No active projects. Create one to get started!</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const stageInfo = getStageInfo(project.stage);
              const StageIcon = stageInfo.icon;
              const progress = getProgressPercent(project.stage);

              return (
                <Card 
                  key={project.id} 
                  className="bg-card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        {project.client_name && (
                          <CardDescription>{project.client_name}</CardDescription>
                        )}
                      </div>
                      <Badge variant="outline" className={
                        project.type === "Migration" ? "border-orange-500/50 text-orange-600" :
                        "border-blue-500/50 text-blue-600"
                      }>
                        {project.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description || "No description"}
                    </p>

                    {/* Current Stage */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stageInfo.color} text-white`}>
                        <StageIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{stageInfo.title}</p>
                        <Progress value={progress} className="h-1.5 mt-1" />
                      </div>
                    </div>

                    {/* Timeline info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project.start_date ? format(new Date(project.start_date), "MMM d, yyyy") : "No start date"}
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>

                    {/* Author */}
                    {project.author && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={project.author.avatar_url || undefined} alt={project.author.full_name} />
                          <AvatarFallback className="text-xs bg-primary/20 text-primary">
                            {project.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          Owner: <span className="font-medium text-foreground">{project.author.full_name}</span>
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedProject.name}</DialogTitle>
                    {selectedProject.client_name && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedProject.client_name}</p>
                    )}
                  </div>
                  <Badge variant="outline" className={
                    selectedProject.type === "Migration" ? "border-orange-500/50 text-orange-600" :
                    "border-blue-500/50 text-blue-600"
                  }>
                    {selectedProject.type}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Description */}
                {selectedProject.description && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                  </div>
                )}

                {/* Timeline Progress */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">Solution Timeline</h3>
                    {isOwner(selectedProject) && (
                      <Select
                        value={selectedProject.stage || "kick_off"}
                        onValueChange={(value) => {
                          updateStage.mutate({ projectId: selectedProject.id, newStage: value });
                          setSelectedProject({ ...selectedProject, stage: value });
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Move to stage..." />
                        </SelectTrigger>
                        <SelectContent>
                          {timelineStages.map((stage) => (
                            <SelectItem key={stage.id} value={stage.id}>
                              {stage.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Visual Timeline */}
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-purple-500 to-indigo-500 rounded-full" />
                    <div className="space-y-2">
                      {timelineStages.map((stage, index) => {
                        const Icon = stage.icon;
                        const currentIndex = getStageIndex(selectedProject.stage);
                        const isComplete = index < currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                          <div
                            key={stage.id}
                            className={`relative pl-12 py-2 ${isCurrent ? 'bg-muted/30 rounded-lg' : ''}`}
                          >
                            <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl ${
                              isComplete ? 'bg-primary' : isCurrent ? stage.color : 'bg-muted'
                            } ${isComplete || isCurrent ? 'text-white' : 'text-muted-foreground'} transition-all`}>
                              {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${isCurrent ? 'text-foreground' : isComplete ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                                {stage.title}
                              </span>
                              {isCurrent && (
                                <Badge variant="secondary" className="text-xs">Current</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Members ({projectMembers.length})
                    </h3>
                    {isOwner(selectedProject) && (
                      <Button variant="outline" size="sm" onClick={() => setIsManagingTeam(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Manage Team
                      </Button>
                    )}
                  </div>

                  {projectMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No team members assigned yet.</p>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {projectMembers.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.profile?.avatar_url || undefined} alt={member.profile?.full_name} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {member.profile?.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{member.profile?.full_name}</p>
                            <p className="text-xs text-muted-foreground">{member.role || member.profile?.role}</p>
                          </div>
                          {isOwner(selectedProject) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removeMember.mutate(member.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Owner */}
                {selectedProject.author && (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedProject.author.avatar_url || undefined} alt={selectedProject.author.full_name} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {selectedProject.author.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedProject.author.full_name}</p>
                      <p className="text-sm text-muted-foreground">Project Owner</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Team Management Dialog */}
      <Dialog open={isManagingTeam} onOpenChange={setIsManagingTeam}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Team Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Add Team Member</Label>
              <Select onValueChange={handleAddMember}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a team member to add..." />
                </SelectTrigger>
                <SelectContent>
                  {availableProfiles.length === 0 ? (
                    <SelectItem value="none" disabled>No available members</SelectItem>
                  ) : (
                    availableProfiles.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.full_name} - {p.role || "No role"}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Current Team</Label>
              <div className="space-y-2 mt-2">
                {projectMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs bg-primary/20 text-primary">
                          {member.profile?.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{member.profile?.full_name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeMember.mutate(member.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Enter project name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                value={createForm.client_name}
                onChange={(e) => setCreateForm({ ...createForm, client_name: e.target.value })}
                placeholder="Enter client name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Project Type</Label>
              <Select
                value={createForm.type}
                onValueChange={(value) => setCreateForm({ ...createForm, type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Integration">Integration</SelectItem>
                  <SelectItem value="Migration">Migration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stage">Starting Stage</Label>
              <Select
                value={createForm.stage}
                onValueChange={(value) => setCreateForm({ ...createForm, stage: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timelineStages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={createForm.start_date}
                  onChange={(e) => setCreateForm({ ...createForm, start_date: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={createForm.deadline}
                  onChange={(e) => setCreateForm({ ...createForm, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Describe the project..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button
                onClick={() => createProject.mutate()}
                disabled={!createForm.name || createProject.isPending}
              >
                {createProject.isPending ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
