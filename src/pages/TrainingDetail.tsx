import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, TrendingUp, Upload, FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  },
  {
    slug: "objection-handling",
    title: "Objection Handling",
    description: "Learn techniques to address and overcome common sales objections.",
    image: objectionImage,
    category: "sales",
    content: "Objection handling is when a prospect presents a concern about the product/service a salesperson is selling, and the salesperson responds in a way that alleviates those concerns and allows the deal to move forward.",
  },
  {
    slug: "enterprise-sales-strategy",
    title: "Enterprise Sales Strategy",
    description: "Strategies for complex enterprise sales cycles and stakeholder management.",
    image: enterpriseImage,
    category: "sales",
    content: "Enterprise sales involves selling products or services to large organizations. These deals are typically complex, involve multiple stakeholders, and have longer sales cycles. Success requires strategic account planning and relationship management.",
  },
  {
    slug: "spin-selling",
    title: "Spin Selling",
    description: "Master the SPIN methodology: Situation, Problem, Implication, and Need-Payoff questions.",
    image: spinImage,
    category: "sales",
    content: "SPIN Selling is a sales methodology based on asking the right questions. SPIN stands for Situation, Problem, Implication, and Need-Payoff. This approach helps salespeople understand the buyer's situation and guide them toward recognizing the value of a solution.",
  },
  // Generic Training
  {
    slug: "effective-communication",
    title: "Effective Communication",
    description: "Enhance your written and verbal communication skills.",
    image: communicationImage,
    category: "generic",
    content: "Effective communication is the process of exchanging ideas, thoughts, opinions, knowledge, and data so that the message is received and understood with clarity and purpose. This training covers both written and verbal communication techniques.",
  },
  {
    slug: "time-management-mastery",
    title: "Time Management Mastery",
    description: "Learn to prioritize tasks and manage your time effectively.",
    image: timeImage,
    category: "generic",
    content: "Time management is the process of organizing and planning how to divide your time between different activities. Good time management enables you to work smarter – not harder – so that you get more done in less time.",
  },
  {
    slug: "leadership-fundamentals",
    title: "Leadership Fundamentals",
    description: "Core leadership skills for emerging and experienced leaders.",
    image: leadershipImage,
    category: "generic",
    content: "Leadership fundamentals cover the essential skills needed to effectively lead teams and organizations. This includes communication, delegation, motivation, strategic thinking, and emotional intelligence.",
  },
  {
    slug: "v-model",
    title: "V-Model",
    description: "Learn the V-Model software development methodology for verification and validation.",
    image: vmodelImage,
    category: "generic",
    content: "The V-Model is a software development methodology that emphasizes the relationship between each phase of the development lifecycle and its associated testing phase. It provides a systematic approach to verification and validation.",
  },
  {
    slug: "assertion-skills",
    title: "Assertion Skills",
    description: "Develop confidence and assertiveness in professional communication and interactions.",
    image: assertionImage,
    category: "generic",
    content: "Assertion skills enable you to express your thoughts, feelings, and needs directly, honestly, and respectfully. This training helps you communicate more effectively while maintaining positive professional relationships.",
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">{course.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(backUrl)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {category === "sales" ? "Sales" : "Generic"} Training
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Course Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <p className="text-foreground">{course.content}</p>
              </CardContent>
            </Card>
          </div>

          {/* Training Materials */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Training Materials</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4" />
                  Upload
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
                  <p className="text-sm text-muted-foreground">Loading documents...</p>
                ) : documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No training materials uploaded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm truncate">{doc.document_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDownload(doc.file_path, doc.document_name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate({ id: doc.id, filePath: doc.file_path })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
