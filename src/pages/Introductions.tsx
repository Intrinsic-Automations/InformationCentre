import { useState } from "react";
import { Users, Heart, MessageCircleMore, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import introductionsHero from "@/assets/introductions-hero.jpg";

interface Comment {
  user: string;
  initials: string;
  text: string;
  time: string;
}

interface Introduction {
  id: number;
  name: string;
  initials: string;
  role: string;
  location: string;
  intro: string;
  date: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

const initialIntroductions: Introduction[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    role: "Product Manager",
    location: "London, UK",
    intro: "Hi everyone! I'm Sarah, joining the product team. Previously worked at a fintech startup. Excited to collaborate with this amazing team!",
    date: "January 8, 2024",
    likes: 12,
    liked: false,
    comments: [
      { user: "Alex C.", initials: "AC", text: "Welcome Sarah! Looking forward to working with you!", time: "Jan 8" }
    ]
  },
  {
    id: 2,
    name: "Alex Chen",
    initials: "AC",
    role: "Software Engineer",
    location: "Singapore",
    intro: "Hello! I'm Alex, a full-stack developer with 5 years of experience. Love building scalable solutions and always up for a coffee chat!",
    date: "January 5, 2024",
    likes: 18,
    liked: false,
    comments: [
      { user: "Maria G.", initials: "MG", text: "Great to have you on the team Alex!", time: "Jan 5" },
      { user: "Sarah J.", initials: "SJ", text: "Welcome! Let's grab that coffee sometime!", time: "Jan 8" }
    ]
  },
  {
    id: 3,
    name: "Maria Garcia",
    initials: "MG",
    role: "Sales Director",
    location: "Madrid, Spain",
    intro: "Hola! Maria here, leading the EMEA sales team. Looking forward to connecting with everyone and driving growth together.",
    date: "January 3, 2024",
    likes: 24,
    liked: false,
    comments: []
  },
];

export default function Introductions() {
  const [introductions, setIntroductions] = useState<Introduction[]>(initialIntroductions);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const handleLike = (introId: number) => {
    setIntroductions(prev => prev.map(intro => {
      if (intro.id === introId) {
        return {
          ...intro,
          liked: !intro.liked,
          likes: intro.liked ? intro.likes - 1 : intro.likes + 1
        };
      }
      return intro;
    }));
  };

  const toggleComments = (introId: number) => {
    setExpandedComments(prev => 
      prev.includes(introId) 
        ? prev.filter(id => id !== introId)
        : [...prev, introId]
    );
  };

  const handleAddComment = (introId: number) => {
    const commentText = commentInputs[introId]?.trim();
    if (!commentText) return;

    setIntroductions(prev => prev.map(intro => {
      if (intro.id === introId) {
        return {
          ...intro,
          comments: [...intro.comments, {
            user: "You",
            initials: "YO",
            text: commentText,
            time: "Just now"
          }]
        };
      }
      return intro;
    }));
    setCommentInputs(prev => ({ ...prev, [introId]: "" }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={introductionsHero}
          alt="Introductions banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Introductions</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {introductions.map((person) => (
            <Card key={person.id} className="bg-card">
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
                <p className="text-sm text-foreground/80 mb-3">{person.intro}</p>
                
                {/* Like and Comment buttons */}
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`gap-2 h-8 px-2 ${person.liked ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}
                    onClick={() => handleLike(person.id)}
                  >
                    <Heart className={`h-4 w-4 ${person.liked ? "fill-current" : ""}`} />
                    <span className="text-xs">{person.likes}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 h-8 px-2 text-muted-foreground hover:text-primary"
                    onClick={() => toggleComments(person.id)}
                  >
                    <MessageCircleMore className="h-4 w-4" />
                    <span className="text-xs">{person.comments.length}</span>
                  </Button>
                </div>

                {/* Comments Section */}
                {expandedComments.includes(person.id) && (
                  <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
                    {person.comments.map((comment, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {comment.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-medium text-xs text-foreground">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-xs text-foreground/80">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Comment Input */}
                    <div className="flex gap-2 mt-2">
                      <Input 
                        placeholder="Write a welcome message..." 
                        className="h-8 text-xs"
                        value={commentInputs[person.id] || ""}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [person.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddComment(person.id);
                          }
                        }}
                      />
                      <Button 
                        size="sm" 
                        className="h-8 px-3"
                        onClick={() => handleAddComment(person.id)}
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
