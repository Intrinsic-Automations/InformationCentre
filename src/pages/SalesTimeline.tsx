import { 
  TrendingUp,
  FileSignature,
  Users,
  Target,
  Presentation,
  Calculator,
  Wrench,
  ShoppingCart,
  Calendar,
  CheckCircle2,
  FileQuestion,
  Quote,
  Truck,
  Trophy,
  XCircle,
  ClipboardList,
  Handshake,
  DollarSign,
  FileText,
  UserCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import salesTimelineHero from "@/assets/sales-training-hero.jpg";

interface TimelineStep {
  title: string;
  subtitle?: string;
  subItems: { text: string; indent?: boolean }[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const timelineSteps: TimelineStep[] = [
  { 
    title: "Lead/Plow", 
    subtitle: "Initial Discovery Phase",
    subItems: [
      { text: "NDA in place" },
      { text: "Customer needs and problems" },
      { text: "What is the opportunity/size of it" },
      { text: "Who are the key stakeholders/decision makers" },
    ], 
    icon: Target, 
    color: "bg-blue-500" 
  },
  { 
    title: "Solution Proposed/SOW", 
    subtitle: "Building the Value Proposition",
    subItems: [
      { text: "Demonstration/POC" },
      { text: "What is the ROM Costs" },
      { text: "Is there a need for a workshop? (migration)" },
      { text: "Do you understand the customer's buying process?" },
      { text: "What are the sign off levels", indent: true },
      { text: "What is the customer's compelling event, if there is one" },
      { text: "Gradient to compelling event", indent: true },
      { text: "Share eQ MLA and start eQ sign off process" },
    ], 
    icon: Presentation, 
    color: "bg-violet-500" 
  },
  { 
    title: "Formal Approval/Grow", 
    subtitle: "Securing Customer Commitment",
    subItems: [
      { text: "Demonstration/POC" },
      { text: "What is the ROM Costs" },
      { text: "Is there a need for a workshop? (migration)" },
      { text: "Do you understand the customer's buying process?" },
      { text: "What are the sign off levels", indent: true },
      { text: "What is the customer's compelling event, if there is one" },
      { text: "Gradient to compelling event", indent: true },
      { text: "Has there been formal approval from the customer to give a quotation?" },
      { text: "Identification of an actual project and budget" },
    ], 
    icon: Handshake, 
    color: "bg-purple-500" 
  },
  { 
    title: "Quotation/Harvest", 
    subtitle: "Formalizing the Proposal",
    subItems: [
      { text: "An RFP (Request for Proposal)" },
      { text: "Quotation has been given" },
      { text: "Delivery/Resources team need to know of potential close" },
    ], 
    icon: Quote, 
    color: "bg-orange-500" 
  },
  { 
    title: "Won", 
    subtitle: "Deal Closed Successfully",
    subItems: [
      { text: "Purchase order has been accepted" },
      { text: "LSDA (License Software Declaration Agreement) needs to be signed and returned by customer" },
      { text: "Delivery team needs to be stood up - does Francis know?" },
    ], 
    icon: Trophy, 
    color: "bg-emerald-500" 
  },
  { 
    title: "Lost", 
    subtitle: "Deal Not Successful",
    subItems: [
      { text: "Has a review been done as to why this got lost?" },
    ], 
    icon: XCircle, 
    color: "bg-red-500" 
  },
];

export default function SalesTimeline() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={salesTimelineHero}
          alt="Sales Timeline banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Sales Timeline</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-2">Sales Journey Milestones</h2>
                <p className="text-muted-foreground text-sm">
                  Track your opportunity through each stage and ensure you have the key information needed at each milestone.
                </p>
              </div>
              
              <div className="relative">
                {/* Gradient vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 via-orange-500 to-emerald-500 rounded-full" />

                <div className="space-y-6">
                  {timelineSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div 
                        key={index} 
                        className="relative pl-14 group animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Icon marker */}
                        <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl ${step.color} text-white shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content card */}
                        <div className="bg-muted/30 rounded-lg p-4 border border-border/30 transition-all duration-200 group-hover:bg-muted/50 group-hover:border-primary/30 group-hover:shadow-md">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                            {step.subtitle && (
                              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {step.subtitle}
                              </span>
                            )}
                          </div>
                          
                          {step.subItems.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                What to know at this stage:
                              </p>
                              <ul className="space-y-1.5">
                                {step.subItems.map((subItem, subIndex) => (
                                  <li 
                                    key={subIndex} 
                                    className={`flex items-start gap-2 text-sm text-muted-foreground ${subItem.indent ? 'ml-5' : ''}`}
                                  >
                                    <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${subItem.indent ? 'text-primary/60' : 'text-primary'}`} />
                                    <span>{subItem.text}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
