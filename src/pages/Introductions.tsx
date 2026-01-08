import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import introductionsHero from "@/assets/introductions-hero.jpg";

const introductions = [
  {
    name: "Sarah Johnson",
    initials: "SJ",
    role: "Product Manager",
    location: "London, UK",
    intro: "Hi everyone! I'm Sarah, joining the product team. Previously worked at a fintech startup. Excited to collaborate with this amazing team!",
    date: "January 8, 2024",
  },
  {
    name: "Alex Chen",
    initials: "AC",
    role: "Software Engineer",
    location: "Singapore",
    intro: "Hello! I'm Alex, a full-stack developer with 5 years of experience. Love building scalable solutions and always up for a coffee chat!",
    date: "January 5, 2024",
  },
  {
    name: "Maria Garcia",
    initials: "MG",
    role: "Sales Director",
    location: "Madrid, Spain",
    intro: "Hola! Maria here, leading the EMEA sales team. Looking forward to connecting with everyone and driving growth together.",
    date: "January 3, 2024",
  },
];

export default function Introductions() {
  return (
    <div className="flex flex-col h-full">
      {/* Hero Banner with Title */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={introductionsHero}
          alt="Introductions banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground">Introductions</h1>
              <p className="text-sm md:text-base text-secondary-foreground/80 mt-1">
                Meet new team members and share your story.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl space-y-4">
          {introductions.map((person, index) => (
            <Card key={index} className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {person.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{person.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{person.role}</Badge>
                      <span className="text-xs text-muted-foreground">{person.location}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{person.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">{person.intro}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
