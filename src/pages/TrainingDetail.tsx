import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, TrendingUp, Upload, FileText, Download, Trash2, Target, CheckCircle2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

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

interface TrainingCourse {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: "sales" | "generic";
  content: string;
  objectives: string[];
  duration: string;
  level: string;
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
];

export default function TrainingDetail() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const course = allCourses.find((c) => c.slug === slug && c.category === category);

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["training-documents", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hr_topic_documents")
        .select("*")
        .eq("topic_slug", `training-${slug}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const timestamp = Date.now();
      const filePath = `training-${slug}/${timestamp}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("hr-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("hr_topic_documents").insert({
        topic_slug: `training-${slug}`,
        document_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: `${(file.size / 1024).toFixed(1)} KB`,
      });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-documents", slug] });
      toast.success("Document uploaded successfully");
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      const { error: storageError } = await supabase.storage
        .from("hr-documents")
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("hr_topic_documents")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-documents", slug] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    },
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: async ({ id, description }: { id: string; description: string }) => {
      const { error } = await supabase
        .from("hr_topic_documents")
        .update({ description })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-documents", slug] });
      toast.success("Description updated");
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error("Failed to update description");
    },
  });

  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMutation.mutateAsync(file);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from("hr-documents")
      .download(filePath);

    if (error) {
      toast.error("Failed to download file");
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const backUrl = category === "sales" ? "/selling-training" : "/generic-training";
  const Icon = category === "sales" ? TrendingUp : BookOpen;
  const categoryLabel = category === "sales" ? "Sales Training" : "Generic Training";

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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                About This Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{course.content}</p>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">By the end of this course, you will be able to:</p>
              <ul className="space-y-3">
                {course.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Training Materials */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Training Materials
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Material"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading documents...</p>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-lg">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No training materials uploaded yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Upload PDFs, documents, presentations, or videos</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {documents.map((doc) => {
                    const getDefaultDescription = (fileName: string) => {
                      const ext = fileName.split('.').pop()?.toLowerCase();
                      if (ext === 'pdf') return 'PDF document containing course materials and reference guides.';
                      if (ext === 'pptx' || ext === 'ppt') return 'Presentation slides for training sessions and workshops.';
                      if (ext === 'docx' || ext === 'doc') return 'Word document with detailed course content and exercises.';
                      if (ext === 'xlsx' || ext === 'xls') return 'Spreadsheet with templates, data, or exercises.';
                      if (ext === 'mp4' || ext === 'webm' || ext === 'mov') return 'Video training content for visual learning.';
                      if (ext === 'mp3' || ext === 'wav') return 'Audio recording for on-the-go learning.';
                      return 'Training resource to support your learning journey.';
                    };

                    const isEditing = editingDocId === doc.id;
                    const displayDescription = doc.description || getDefaultDescription(doc.document_name);

                    return (
                      <div
                        key={doc.id}
                        className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{doc.document_name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{doc.file_size}</p>
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
                                      updateDescriptionMutation.mutate({ id: doc.id, description: editingDescription });
                                      setEditingDocId(null);
                                    }}
                                  >
                                    <Check className="h-3 w-3" />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="gap-1"
                                    onClick={() => setEditingDocId(null)}
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
                                      setEditingDocId(doc.id);
                                      setEditingDescription(doc.description || '');
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
                            onClick={() => handleDownload(doc.file_path, doc.document_name)}
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteMutation.mutate({ id: doc.id, filePath: doc.file_path })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
}
