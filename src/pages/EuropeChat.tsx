import { useState } from "react";
import { Globe, Send, Info, Link, Users, MessageSquare, Heart, MessageCircleMore } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import europeChatHero from "@/assets/europe-chat-hero.jpg";

interface Comment {
  user: string;
  initials: string;
  text: string;
  time: string;
}

interface Message {
  id: number;
  user: string;
  initials: string;
  message: string;
  time: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

const initialMessages: Message[] = [
  { 
    id: 1,
    user: "Hans M.", 
    initials: "HM", 
    message: "Just shared my project proposal for the GDPR compliance automation! Would love some feedback on the implementation approach 🙏 https://docs.company.com/projects/gdpr-automation", 
    time: "8:00 AM",
    likes: 6,
    liked: false,
    comments: [
      { user: "Elena R.", initials: "ER", text: "Excellent approach! The data mapping section is very thorough.", time: "8:15 AM" }
    ]
  },
  { 
    id: 2,
    user: "Sophie L.", 
    initials: "SL", 
    message: "Reviewed it! The architecture looks solid. One suggestion - consider adding a dedicated audit trail module. Here's my localization project doc if anyone can take a look: https://docs.company.com/projects/multi-language-support", 
    time: "8:15 AM",
    likes: 4,
    liked: false,
    comments: []
  },
  { 
    id: 3,
    user: "Marcus B.", 
    initials: "MB", 
    message: "Great work on both! 👍 I'm putting together a project plan for the UK market expansion. Should I prioritize the payment gateway integration or the customer support localization first? Would appreciate input before the leadership meeting.", 
    time: "8:30 AM",
    likes: 3,
    liked: false,
    comments: []
  },
  { 
    id: 4,
    user: "Anna K.", 
    initials: "AK", 
    message: "@Marcus I'd recommend payment gateway first - it's critical for revenue flow. The support team can manage with translation tools initially. Happy to review the scope with you!", 
    time: "8:45 AM",
    likes: 5,
    liked: false,
    comments: []
  },
  { 
    id: 5,
    user: "Hans M.", 
    initials: "HM", 
    message: "Thanks everyone for the valuable feedback! Already incorporated the suggestions. Cross-regional collaboration like this really elevates our project quality 🚀", 
    time: "9:00 AM",
    likes: 9,
    liked: false,
    comments: []
  },
];

export default function EuropeChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const handleLike = (messageId: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          liked: !msg.liked,
          likes: msg.liked ? msg.likes - 1 : msg.likes + 1
        };
      }
      return msg;
    }));
  };

  const toggleComments = (messageId: number) => {
    setExpandedComments(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleAddComment = (messageId: number) => {
    const commentText = commentInputs[messageId]?.trim();
    if (!commentText) return;

    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          comments: [...msg.comments, {
            user: "You",
            initials: "YO",
            text: commentText,
            time: "Just now"
          }]
        };
      }
      return msg;
    }));
    setCommentInputs(prev => ({ ...prev, [messageId]: "" }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-32 md:h-40 overflow-hidden">
        <img
          src={europeChatHero}
          alt="Europe Chat banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-secondary-foreground">Europe Chat</h1>
              <p className="text-xs md:text-sm text-secondary-foreground/80 mt-1">
                Post, Engage, and get Feedback to Maximise your visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {/* Posting Guidelines */}
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Posting Guidelines</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-sm text-foreground mb-3">What This Channel is For:</h4>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Link className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Sharing your posts</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Drop links to your LinkedIn, Twitter, or other platform content
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Coordinating support</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Organize mutual engagement to increase reach and visibility
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Getting feedback</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Receive input on Project
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="flex flex-col">
            <Card className="bg-card">
              <CardContent className="p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {msg.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-sm text-foreground">{msg.user}</span>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm text-foreground/80 mt-1">{msg.message}</p>
                        
                        {/* Like and Comment buttons */}
                        <div className="flex items-center gap-4 mt-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`gap-2 h-8 px-2 ${msg.liked ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}
                            onClick={() => handleLike(msg.id)}
                          >
                            <Heart className={`h-4 w-4 ${msg.liked ? "fill-current" : ""}`} />
                            <span className="text-xs">{msg.likes}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2 h-8 px-2 text-muted-foreground hover:text-primary"
                            onClick={() => toggleComments(msg.id)}
                          >
                            <MessageCircleMore className="h-4 w-4" />
                            <span className="text-xs">{msg.comments.length}</span>
                          </Button>
                        </div>

                        {/* Comments Section */}
                        {expandedComments.includes(msg.id) && (
                          <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
                            {msg.comments.map((comment, idx) => (
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
                                placeholder="Write a comment..." 
                                className="h-8 text-xs"
                                value={commentInputs[msg.id] || ""}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [msg.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddComment(msg.id);
                                  }
                                }}
                              />
                              <Button 
                                size="sm" 
                                className="h-8 px-3"
                                onClick={() => handleAddComment(msg.id)}
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="flex gap-2 mt-4">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
