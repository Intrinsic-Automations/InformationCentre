import { Trophy, Heart, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import winsHero from "@/assets/wins-hero.jpg";

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
    <div className="flex flex-col h-full">
      {/* Hero Banner with Title */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={winsHero}
          alt="Wins banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground">Wins</h1>
              <p className="text-sm md:text-base text-secondary-foreground/80 mt-1">
                Celebrate our team's achievements and milestones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
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
      </div>
    </div>
  );
}
