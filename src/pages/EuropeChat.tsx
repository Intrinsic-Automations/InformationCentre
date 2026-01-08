import { Globe, Send } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const messages = [
  { user: "Hans M.", initials: "HM", message: "Guten Morgen! Looking forward to the quarterly review.", time: "8:00 AM" },
  { user: "Sophie L.", initials: "SL", message: "Bonjour! I'll share the presentation deck before the meeting.", time: "8:15 AM" },
  { user: "Marcus B.", initials: "MB", message: "Thanks Sophie! Let me know if you need any data from the UK team.", time: "8:30 AM" },
];

export default function EuropeChat() {
  return (
    <PageLayout
      title="Europe Chat"
      description="Connect with team members across Europe."
      icon={<Globe className="h-5 w-5" />}
    >
      <div className="flex flex-col h-[calc(100vh-220px)] max-w-3xl">
        <Card className="flex-1 overflow-auto bg-card">
          <CardContent className="p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
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
    </PageLayout>
  );
}
