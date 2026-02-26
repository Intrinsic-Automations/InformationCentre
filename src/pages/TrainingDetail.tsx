import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, TrendingUp, FileText, Trash2, Target, CheckCircle2, Pencil, Check, X, Link2, Plus, ExternalLink, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/useRoles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTrainingContent } from "@/hooks/useTrainingContent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sales Training Courses
import consultativeImage from "@/assets/selling-consultative.jpg";
import objectionImage from "@/assets/selling-objection.jpg";
import enterpriseImage from "@/assets/selling-enterprise.jpg";
import spinImage from "@/assets/selling-spin.jpg";

// Generic Training Courses
import communicationImage from "@/assets/generic-communication.jpg";
import timeImage from "@/assets/generic-time.jpg";
import leadershipImage from "@/assets/generic-leadership.jpg";
import vmodelImage from "@/assets/generic-vmodel.jpg";
import assertionImage from "@/assets/generic-assertion.jpg";

// Analytics Suite Courses
import adaImage from "@/assets/analytics-ada.jpg";
import analyticsAdminImage from "@/assets/analytics-admin.jpg";
import analyticsFoundationImage from "@/assets/analytics-foundation.jpg";
import analyticsAdvancedImage from "@/assets/analytics-advanced.jpg";

interface TrainingCourse {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: "sales" | "generic" | "analytics";
  content: string;
  objectives: string[];
  duration: string;
  level: string;
}

interface TrainingResourceLink {
  id: string;
  topic_slug: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
}

const allCourses: TrainingCourse[] = [
  // Sales Training
  {
    slug: "consultative-selling",
    title: "Consultative Selling",
    description: "Master the art of understanding customer needs and providing solutions.",
    image: consultativeImage,
    category: "sales",
    content: "Consultative selling is a sales approach that prioritizes relationships and open dialogue to identify and provide solutions to a customer's needs. It focuses on creating value and trust with the prospect, exploring their needs before offering a solution.",
    objectives: [
      "Understand the core principles of consultative selling",
      "Learn to ask probing questions to uncover customer needs",
      "Develop skills to position solutions effectively",
      "Build long-term customer relationships based on trust",
    ],
    duration: "2 hours",
    level: "Intermediate",
  },
  {
    slug: "objection-handling",
    title: "Objection Handling",
    description: "Learn techniques to address and overcome common sales objections.",
    image: objectionImage,
    category: "sales",
    content: "Objection handling is when a prospect presents a concern about the product/service a salesperson is selling, and the salesperson responds in a way that alleviates those concerns and allows the deal to move forward.",
    objectives: [
      "Identify common types of sales objections",
      "Learn the LAER framework for handling objections",
      "Practice turning objections into opportunities",
      "Build confidence in high-pressure situations",
    ],
    duration: "1.5 hours",
    level: "Intermediate",
  },
  {
    slug: "enterprise-sales-strategy",
    title: "Enterprise Sales Strategy",
    description: "Strategies for complex enterprise sales cycles and stakeholder management.",
    image: enterpriseImage,
    category: "sales",
    content: "Enterprise sales involves selling products or services to large organizations. These deals are typically complex, involve multiple stakeholders, and have longer sales cycles. Success requires strategic account planning and relationship management.",
    objectives: [
      "Navigate complex organizational buying processes",
      "Map and engage multiple stakeholders effectively",
      "Develop strategic account plans",
      "Manage long sales cycles with milestone tracking",
    ],
    duration: "3 hours",
    level: "Advanced",
  },
  {
    slug: "spin-selling",
    title: "Spin Selling",
    description: "Master the SPIN methodology: Situation, Problem, Implication, and Need-Payoff questions.",
    image: spinImage,
    category: "sales",
    content: "SPIN Selling is a sales methodology based on asking the right questions. SPIN stands for Situation, Problem, Implication, and Need-Payoff. This approach helps salespeople understand the buyer's situation and guide them toward recognizing the value of a solution.",
    objectives: [
      "Master the four types of SPIN questions",
      "Learn when and how to use each question type",
      "Practice building questioning sequences",
      "Apply SPIN to real sales scenarios",
    ],
    duration: "2.5 hours",
    level: "Intermediate",
  },
  // Generic Training
  {
    slug: "effective-communication",
    title: "Effective Communication",
    description: "Enhance your written and verbal communication skills.",
    image: communicationImage,
    category: "generic",
    content: "Effective communication is the process of exchanging ideas, thoughts, opinions, knowledge, and data so that the message is received and understood with clarity and purpose. This training covers both written and verbal communication techniques.",
    objectives: [
      "Understand the principles of clear communication",
      "Improve active listening skills",
      "Craft clear and concise written messages",
      "Adapt communication style to different audiences",
    ],
    duration: "2 hours",
    level: "Beginner",
  },
  {
    slug: "time-management-mastery",
    title: "Time Management Mastery",
    description: "Learn to prioritize tasks and manage your time effectively.",
    image: timeImage,
    category: "generic",
    content: "Time management is the process of organizing and planning how to divide your time between different activities. Good time management enables you to work smarter – not harder – so that you get more done in less time.",
    objectives: [
      "Identify and eliminate time-wasting activities",
      "Learn prioritization frameworks (Eisenhower Matrix)",
      "Master scheduling and planning techniques",
      "Build sustainable productivity habits",
    ],
    duration: "1.5 hours",
    level: "Beginner",
  },
  {
    slug: "leadership-fundamentals",
    title: "Leadership Fundamentals",
    description: "Core leadership skills for emerging and experienced leaders.",
    image: leadershipImage,
    category: "generic",
    content: "Leadership fundamentals cover the essential skills needed to effectively lead teams and organizations. This includes communication, delegation, motivation, strategic thinking, and emotional intelligence.",
    objectives: [
      "Understand different leadership styles",
      "Develop delegation and empowerment skills",
      "Learn to motivate and inspire teams",
      "Build emotional intelligence as a leader",
    ],
    duration: "3 hours",
    level: "Intermediate",
  },
  {
    slug: "v-model",
    title: "V-Model",
    description: "Learn the V-Model software development methodology for verification and validation.",
    image: vmodelImage,
    category: "generic",
    content: "The V-Model is a software development methodology that emphasizes the relationship between each phase of the development lifecycle and its associated testing phase. It provides a systematic approach to verification and validation.",
    objectives: [
      "Understand the V-Model structure and phases",
      "Learn verification vs validation concepts",
      "Apply testing strategies at each development phase",
      "Implement quality assurance best practices",
    ],
    duration: "2 hours",
    level: "Intermediate",
  },
  {
    slug: "assertion-skills",
    title: "Assertion Skills",
    description: "Develop confidence and assertiveness in professional communication and interactions.",
    image: assertionImage,
    category: "generic",
    content: "Assertion skills enable you to express your thoughts, feelings, and needs directly, honestly, and respectfully. This training helps you communicate more effectively while maintaining positive professional relationships.",
    objectives: [
      "Understand the difference between assertive, passive, and aggressive communication",
      "Learn techniques to express yourself confidently",
      "Practice saying no professionally",
      "Handle difficult conversations with composure",
    ],
    duration: "1.5 hours",
    level: "Beginner",
  },
  // Analytics Suite
  {
    slug: "ada",
    title: "ADA",
    description: "Learn about ADA compliance and accessibility in analytics.",
    image: adaImage,
    category: "analytics",
    content: "ADA (Accessible Data Analytics) training covers the principles and practices of making analytics accessible to all users. This includes understanding accessibility standards, designing inclusive dashboards, and ensuring compliance with organizational accessibility policies.",
    objectives: [
      "Understand ADA accessibility standards in analytics",
      "Design inclusive and accessible dashboards",
      "Implement accessibility best practices in reporting",
      "Ensure compliance with organizational accessibility policies",
    ],
    duration: "2 hours",
    level: "Intermediate",
  },
  {
    slug: "admin",
    title: "Admin",
    description: "Administrative tools and user management training.",
    image: analyticsAdminImage,
    category: "analytics",
    content: "The Admin training module covers the administrative tools and capabilities within the analytics platform. Learn how to manage users, configure permissions, set up data sources, and maintain the analytics environment effectively.",
    objectives: [
      "Configure and manage user accounts and permissions",
      "Set up and maintain data source connections",
      "Manage platform settings and configurations",
      "Monitor system health and performance",
    ],
    duration: "2.5 hours",
    level: "Advanced",
  },
  {
    slug: "foundation",
    title: "Foundation",
    description: "Core fundamentals and essential analytics concepts.",
    image: analyticsFoundationImage,
    category: "analytics",
    content: "The Foundation course provides a comprehensive introduction to analytics fundamentals. It covers core concepts, basic reporting techniques, data interpretation, and essential tools needed to get started with the analytics platform.",
    objectives: [
      "Understand core analytics concepts and terminology",
      "Navigate the analytics platform confidently",
      "Create basic reports and visualizations",
      "Interpret data and draw meaningful insights",
    ],
    duration: "3 hours",
    level: "Beginner",
  },
  {
    slug: "advanced",
    title: "Advanced",
    description: "Advanced analytics techniques and data visualization.",
    image: analyticsAdvancedImage,
    category: "analytics",
    content: "The Advanced analytics course builds on foundation knowledge to cover complex data analysis techniques, advanced visualization methods, predictive analytics, and custom reporting capabilities within the platform.",
    objectives: [
      "Master advanced data analysis techniques",
      "Create complex and interactive visualizations",
      "Apply predictive analytics methodologies",
      "Build custom reports and automated dashboards",
    ],
    duration: "3.5 hours",
    level: "Advanced",
  },
];

export default function TrainingDetail() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const { isAdminOrModerator } = useRoles();
  const queryClient = useQueryClient();
  const linksQueryKey = ["training-resource-links", slug];
  const { content: dbContent, upsertContent } = useTrainingContent(slug);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<TrainingResourceLink | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDescription, setNewLinkDescription] = useState("");
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState("");
  const [editingObjectives, setEditingObjectives] = useState(false);
  const [objectivesDraft, setObjectivesDraft] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");

  const course = allCourses.find((c) => c.slug === slug && c.category === category);

  const { data: resourceLinks = [], isLoading: linksLoading } = useQuery({
    queryKey: linksQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_resource_links")
        .select("*")
        .eq("topic_slug", `training-${slug}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TrainingResourceLink[];
    },
    enabled: !!slug,
  });

  const addLinkMutation = useMutation({
    mutationFn: async ({ title, url, description }: { title: string; url: string; description: string }) => {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase.from("training_resource_links").insert({
        topic_slug: `training-${slug}`,
        title,
        url,
        description: description || null,
        created_by: profileData.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
      toast.success("Resource link added successfully");
      setAddDialogOpen(false);
      setNewLinkTitle("");
      setNewLinkUrl("");
      setNewLinkDescription("");
    },
    onError: (error) => {
      console.error("Add link error:", error);
      toast.error("Failed to add resource link");
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("training_resource_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onMutate: async (id: string) => {
      setDeleteDialogOpen(false);
      setLinkToDelete(null);

      await queryClient.cancelQueries({ queryKey: linksQueryKey });
      const previous = queryClient.getQueryData<TrainingResourceLink[]>(linksQueryKey);

      queryClient.setQueryData<TrainingResourceLink[]>(linksQueryKey, (old) => 
        (old ?? []).filter((link) => link.id !== id)
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
      toast.success("Resource link deleted successfully");
    },
    onError: (error, _id, ctx) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete resource link");
      if (ctx?.previous) {
        queryClient.setQueryData(linksQueryKey, ctx.previous);
      }
    },
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: async ({ id, description }: { id: string; description: string }) => {
      const { error } = await supabase
        .from("training_resource_links")
        .update({ description })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
      toast.success("Description updated");
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error("Failed to update description");
    },
  });

  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      toast.error("Please enter both a title and URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(newLinkUrl);
    } catch {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    addLinkMutation.mutate({
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
      description: newLinkDescription.trim(),
    });
  };

  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const backUrl = category === "sales" ? "/selling-training" : category === "analytics" ? "/eq-training/analytics-suite" : "/generic-training";
  const Icon = category === "sales" ? TrendingUp : BookOpen;
  const categoryLabel = category === "sales" ? "Sales Training" : category === "analytics" ? "Analytics Suite" : "Generic Training";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Hero Section with Image */}
        <div className="relative">
          <div className="h-48 md:h-64 overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          
          {/* Back Button - Floating */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 left-4 gap-2 shadow-lg"
            onClick={() => navigate(backUrl)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Course Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="gap-1">
                <Icon className="h-3 w-3" />
                {categoryLabel}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{course.title}</h1>
            <p className="text-muted-foreground mt-1 max-w-2xl">{course.description}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-6 py-6 space-y-6">
          {/* About This Course */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                About This Course
              </CardTitle>
              {isAdminOrModerator && !editingAbout && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAboutDraft(dbContent?.about_content || course.content);
                    setEditingAbout(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingAbout ? (
                <div className="space-y-3">
                  <Textarea
                    value={aboutDraft}
                    onChange={(e) => setAboutDraft(e.target.value)}
                    rows={5}
                    className="text-foreground"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        upsertContent.mutate(
                          { about_content: aboutDraft },
                          {
                            onSuccess: () => {
                              toast.success("About content updated");
                              setEditingAbout(false);
                            },
                            onError: () => toast.error("Failed to update"),
                          }
                        );
                      }}
                      disabled={upsertContent.isPending}
                    >
                      <Save className="h-4 w-4 mr-1" />Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingAbout(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-foreground leading-relaxed">
                  {dbContent?.about_content || course.content}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Learning Objectives
              </CardTitle>
              {isAdminOrModerator && !editingObjectives && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setObjectivesDraft(dbContent?.objectives?.length ? dbContent.objectives : [...course.objectives]);
                    setEditingObjectives(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingObjectives ? (
                <div className="space-y-3">
                  {objectivesDraft.map((obj, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={obj}
                        onChange={(e) => {
                          const updated = [...objectivesDraft];
                          updated[index] = e.target.value;
                          setObjectivesDraft(updated);
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => setObjectivesDraft(objectivesDraft.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Add new objective"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newObjective.trim()) {
                          e.preventDefault();
                          setObjectivesDraft([...objectivesDraft, newObjective.trim()]);
                          setNewObjective("");
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (newObjective.trim()) {
                          setObjectivesDraft([...objectivesDraft, newObjective.trim()]);
                          setNewObjective("");
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        upsertContent.mutate(
                          { objectives: objectivesDraft.filter((o) => o.trim()) },
                          {
                            onSuccess: () => {
                              toast.success("Objectives updated");
                              setEditingObjectives(false);
                            },
                            onError: () => toast.error("Failed to update"),
                          }
                        );
                      }}
                      disabled={upsertContent.isPending}
                    >
                      <Save className="h-4 w-4 mr-1" />Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingObjectives(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">By the end of this course, you will be able to:</p>
                  <ul className="space-y-3">
                    {(dbContent?.objectives?.length ? dbContent.objectives : course.objectives).map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          {/* Training Resources */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Training Resources
              </CardTitle>
              {isAdminOrModerator && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Link
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {linksLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading resources...</p>
              ) : resourceLinks.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-lg">
                  <Link2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No training resources added yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Add links to useful training materials, videos, and articles</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {resourceLinks.map((link) => {
                    const isEditing = editingLinkId === link.id;
                    const displayDescription = link.description || "Click to open this training resource.";

                    return (
                      <div
                        key={link.id}
                        className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                            <ExternalLink className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{link.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{link.url}</p>
                            {isEditing ? (
                              <div className="mt-2 space-y-2">
                                <Textarea
                                  value={editingDescription}
                                  onChange={(e) => setEditingDescription(e.target.value)}
                                  className="text-sm min-h-[60px]"
                                  placeholder="Enter description..."
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() => {
                                      updateDescriptionMutation.mutate({ id: link.id, description: editingDescription });
                                      setEditingLinkId(null);
                                    }}
                                  >
                                    <Check className="h-3 w-3" />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="gap-1"
                                    onClick={() => setEditingLinkId(null)}
                                  >
                                    <X className="h-3 w-3" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 group/desc">
                                <div className="flex items-start gap-2">
                                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                                    {displayDescription}
                                  </p>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 opacity-0 group-hover/desc:opacity-100 transition-opacity shrink-0"
                                    onClick={() => {
                                      setEditingLinkId(link.id);
                                      setEditingDescription(link.description || '');
                                    }}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={() => openExternalLink(link.url)}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open Link
                          </Button>
                          {isAdminOrModerator && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setLinkToDelete(link);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Link Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Training Resource Link</DialogTitle>
            <DialogDescription>
              Add a link to a useful training resource, video, article, or external material.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-title">Title *</Label>
              <Input
                id="link-title"
                placeholder="e.g., Sales Training Video"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com/resource"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-description">Description</Label>
              <Textarea
                id="link-description"
                placeholder="Brief description of what this resource covers..."
                value={newLinkDescription}
                onChange={(e) => setNewLinkDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLink} disabled={addLinkMutation.isPending}>
              {addLinkMutation.isPending ? "Adding..." : "Add Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to DELETE this link?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The resource link will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteLinkMutation.isPending}
              onClick={() => {
                if (linkToDelete) {
                  deleteLinkMutation.mutate(linkToDelete.id);
                }
              }}
            >
              {deleteLinkMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
