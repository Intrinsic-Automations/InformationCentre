import { Trophy, Heart, MessageSquare, Info, Briefcase, Lightbulb, Users, Award, Handshake, FileText, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Posting Guidelines */}
          <Card className="lg:w-96 shrink-0 bg-card h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Posting Guidelines</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* What This Channel Is For */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">What This Channel Is For:</h4>
                <ul className="space-y-2">
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Briefcase className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">Sharing business achievements</span>
                      <p className="text-xs text-muted-foreground">New clients, revenue, successful projects</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Lightbulb className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">Celebrating breakthroughs</span>
                      <p className="text-xs text-muted-foreground">Overcoming challenges or implementing new strategies</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">Learning from others</span>
                      <p className="text-xs text-muted-foreground">Discover what's working and get inspired by real results</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Award className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">Community reputation</span>
                      <p className="text-xs text-muted-foreground">Demonstrate your expertise and success to the community</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Handshake className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">Building connections</span>
                      <p className="text-xs text-muted-foreground">Your wins may attract others seeking advice or collaboration</p>
                    </div>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Guidelines for Posting */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Guidelines for Posting:</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Trophy className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">Share meaningful wins only</span>
                      <p className="text-xs text-muted-foreground">Focus on significant business achievements, not routine activities</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">Include your journey details</span>
                      <p className="text-xs text-muted-foreground mb-1">(highly encouraged)</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 ml-2">
                        <li>• How did you get this client? (outreach method, referral, networking, etc.)</li>
                        <li>• What are you building for them? (specific solution, tools, outcomes)</li>
                        <li>• How did you determine pricing? (your pricing strategy and reasoning)</li>
                        <li>• What struggles did you overcome? (obstacles faced and how you solved them)</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <HelpCircle className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">Optional - mention helpful resources</span>
                      <p className="text-xs text-muted-foreground">What tools, strategies or eQ resources that helped you</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Lightbulb className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">Optional - offer insights</span>
                      <p className="text-xs text-muted-foreground">How other members might benefit from your experience</p>
                    </div>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Why Share Details */}
              <div className="bg-primary/5 rounded-lg p-3">
                <h4 className="font-semibold text-xs text-primary mb-1">Why Share Details?</h4>
                <p className="text-xs text-muted-foreground">
                  Your case study helps others understand the real process behind wins - from initial contact to project delivery. These insights are incredibly valuable for members working toward similar goals.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Wins Feed */}
          <div className="flex-1 max-w-3xl space-y-4">
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
    </div>
  );
}
