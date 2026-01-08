import { MessageCircle, Send, Info, Link, Users, MessageSquare } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const messages = [
  { user: "Priya S.", initials: "PS", message: "Just posted my latest article on digital transformation trends! Would love some engagement 🙏 https://linkedin.com/in/priyas/posts/123", time: "9:00 AM" },
  { user: "Rahul M.", initials: "RM", message: "Done! Left a comment and shared it. Great insights on cloud migration, Priya! Here's my Twitter thread on API best practices if anyone can RT: https://twitter.com/rahulm/status/456", time: "9:05 AM" },
  { user: "Anita K.", initials: "AK", message: "Engaged with both! 👍 Quick question - I'm drafting a post about remote team productivity. Should I focus more on tools or culture? Would appreciate feedback before I publish.", time: "9:15 AM" },
  { user: "Vikram P.", initials: "VP", message: "@Anita I'd say culture first, then mention tools as enablers. That angle tends to get more engagement. Happy to review a draft if you want!", time: "9:22 AM" },
  { user: "Priya S.", initials: "PS", message: "Thanks everyone for the support! Already seeing 3x more impressions than usual. Let's keep this momentum going 🚀", time: "9:30 AM" },
];

export default function IndiaChat() {
  return (
    <PageLayout
      title="India Chat"
      description="Post, Engage, and get Feedback to Maximise your visibility."
      icon={<MessageCircle className="h-5 w-5" />}
    >
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)]">
        {/* Posting Guidelines */}
        <Card className="lg:w-80 shrink-0 bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Posting Guidelines</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold text-sm text-foreground mb-3">What This Channel is For:</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Link className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Sharing your posts</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Drop links to your LinkedIn, Twitter, or other platform content
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Coordinating support</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Organize mutual engagement to increase reach and visibility
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Getting feedback</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Receive input on Project
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 max-w-3xl">
          <Card className="flex-1 overflow-auto bg-card">
            <CardContent className="p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="flex gap-3">
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
    </PageLayout>
  );
}
