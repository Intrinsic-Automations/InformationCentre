import { Trophy, Heart, MessageSquare } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const wins = [
  {
    user: "James Wilson",
    initials: "JW",
    title: "Closed Enterprise Deal!",
    description: "Just signed our biggest enterprise client this quarter! Thanks to everyone who helped with the proposal. Team effort! 🎉",
    likes: 24,
    comments: 8,
    date: "2 hours ago",
  },
  {
    user: "Emily Zhang",
    initials: "EZ",
    title: "Product Launch Success",
    description: "Our new feature went live with zero downtime and amazing user feedback. Huge shoutout to the engineering team!",
    likes: 45,
    comments: 12,
    date: "1 day ago",
  },
  {
    user: "David Kumar",
    initials: "DK",
    title: "Customer Satisfaction Milestone",
    description: "We hit 95% customer satisfaction score this month! This is our highest ever. Keep up the great work everyone!",
    likes: 67,
    comments: 15,
    date: "2 days ago",
  },
];

export default function Wins() {
  return (
    <PageLayout
      title="Wins"
      description="Celebrate our team's achievements and milestones."
      icon={<Trophy className="h-5 w-5" />}
    >
      <div className="max-w-3xl space-y-4">
        {wins.map((win, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {win.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">{win.user}</CardTitle>
                  <span className="text-xs text-muted-foreground">{win.date}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-foreground mb-2">{win.title}</h3>
              <p className="text-sm text-foreground/80 mb-4">{win.description}</p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                  <Heart className="h-4 w-4" /> {win.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                  <MessageSquare className="h-4 w-4" /> {win.comments}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
