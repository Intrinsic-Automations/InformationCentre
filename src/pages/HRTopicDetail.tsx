import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowLeft, File, FileSpreadsheet, FileImage } from "lucide-react";
import infoResourcesHero from "@/assets/generic-training-hero.jpg";

// Define files for each HR topic
const topicFiles: Record<string, { name: string; type: string; size: string }[]> = {
  "absence-management": [
    { name: "Return to Work Record Form.docx", type: "doc", size: "45 KB" },
    { name: "Wellness Assessment and Action Plan.docx", type: "doc", size: "62 KB" },
  ],
  "appraisals": [
    { name: "Annual Appraisal Form.docx", type: "doc", size: "78 KB" },
    { name: "Performance Review Guidelines.pdf", type: "pdf", size: "156 KB" },
    { name: "Self-Assessment Template.docx", type: "doc", size: "45 KB" },
    { name: "Goal Setting Worksheet.xlsx", type: "excel", size: "92 KB" },
    { name: "Mid-Year Review Checklist.pdf", type: "pdf", size: "67 KB" },
  ],
  "employee-benefits-info": [
    { name: "Benefits Overview 2024.pdf", type: "pdf", size: "312 KB" },
    { name: "Healthcare Plan Details.pdf", type: "pdf", size: "189 KB" },
    { name: "Pension Scheme Guide.pdf", type: "pdf", size: "267 KB" },
    { name: "Employee Discounts List.xlsx", type: "excel", size: "156 KB" },
    { name: "Benefits Enrollment Form.docx", type: "doc", size: "89 KB" },
  ],
  "employee-exit": [
    { name: "Exit Interview Template.docx", type: "doc", size: "56 KB" },
    { name: "Offboarding Checklist.pdf", type: "pdf", size: "78 KB" },
    { name: "Final Pay Information.pdf", type: "pdf", size: "123 KB" },
    { name: "Equipment Return Form.docx", type: "doc", size: "34 KB" },
    { name: "Reference Request Policy.pdf", type: "pdf", size: "89 KB" },
  ],
  "induction": [
    { name: "New Starter Checklist.pdf", type: "pdf", size: "145 KB" },
    { name: "Company Handbook.pdf", type: "pdf", size: "2.3 MB" },
    { name: "IT Setup Guide.docx", type: "doc", size: "178 KB" },
    { name: "Health & Safety Induction.pdf", type: "pdf", size: "234 KB" },
    { name: "First Week Schedule Template.docx", type: "doc", size: "67 KB" },
  ],
  "job-descriptions": [
    { name: "Job Description Template.docx", type: "doc", size: "45 KB" },
    { name: "Role Competency Framework.pdf", type: "pdf", size: "189 KB" },
    { name: "Grading Structure Guide.pdf", type: "pdf", size: "156 KB" },
    { name: "Job Evaluation Criteria.xlsx", type: "excel", size: "112 KB" },
    { name: "Sample Job Descriptions.zip", type: "other", size: "1.2 MB" },
  ],
  "performance-management": [
    { name: "Performance Improvement Plan.docx", type: "doc", size: "67 KB" },
    { name: "Capability Procedure.pdf", type: "pdf", size: "234 KB" },
    { name: "One-to-One Meeting Template.docx", type: "doc", size: "38 KB" },
    { name: "Performance Metrics Guide.pdf", type: "pdf", size: "178 KB" },
    { name: "Feedback Framework.pdf", type: "pdf", size: "145 KB" },
  ],
  "probation": [
    { name: "Probation Policy.pdf", type: "pdf", size: "123 KB" },
    { name: "Probation Review Form.docx", type: "doc", size: "56 KB" },
    { name: "Probation Extension Letter.docx", type: "doc", size: "34 KB" },
    { name: "Probation Success Criteria.pdf", type: "pdf", size: "89 KB" },
    { name: "Manager's Probation Guide.pdf", type: "pdf", size: "167 KB" },
  ],
  "recruiting": [
    { name: "Recruitment Process Guide.pdf", type: "pdf", size: "245 KB" },
    { name: "Interview Question Bank.xlsx", type: "excel", size: "189 KB" },
    { name: "Candidate Assessment Form.docx", type: "doc", size: "78 KB" },
    { name: "Offer Letter Template.docx", type: "doc", size: "56 KB" },
    { name: "Onboarding Checklist.pdf", type: "pdf", size: "134 KB" },
  ],
  "training": [
    { name: "Training Request Form.docx", type: "doc", size: "45 KB" },
    { name: "Training Catalogue 2024.pdf", type: "pdf", size: "1.8 MB" },
    { name: "Learning & Development Policy.pdf", type: "pdf", size: "178 KB" },
    { name: "Training Evaluation Form.docx", type: "doc", size: "56 KB" },
    { name: "Personal Development Plan.xlsx", type: "excel", size: "134 KB" },
  ],
};

const topicTitles: Record<string, string> = {
  "absence-management": "Absence Management",
  "appraisals": "Appraisals",
  "employee-benefits-info": "Employee Benefits Info",
  "employee-exit": "Employee Exit",
  "induction": "Induction",
  "job-descriptions": "Job Descriptions",
  "performance-management": "Performance Management",
  "probation": "Probation",
  "recruiting": "Recruiting",
  "training": "Training",
};

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileText className="h-5 w-5 text-destructive" />;
    case "doc":
      return <File className="h-5 w-5 text-primary" />;
    case "excel":
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    case "image":
      return <FileImage className="h-5 w-5 text-purple-600" />;
    default:
      return <File className="h-5 w-5 text-muted-foreground" />;
  }
}

export default function HRTopicDetail() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const navigate = useNavigate();

  const files = topicSlug ? topicFiles[topicSlug] || [] : [];
  const title = topicSlug ? topicTitles[topicSlug] || "Resources" : "Resources";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={infoResourcesHero}
          alt={`${title} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">{title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate("/info-resources")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Info & Resources
          </Button>

          {/* Files List */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Available Documents
              </h2>
              
              {files.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No documents available for this topic.
                </p>
              ) : (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{file.size}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          // Placeholder for download functionality
                          console.log(`Downloading: ${file.name}`);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
