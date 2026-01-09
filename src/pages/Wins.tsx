import { Trophy, Heart, MessageSquare, Info, Briefcase, Lightbulb, Users, Award, Handshake, FileText, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import winsHero from "@/assets/wins-hero.jpg";

const wins = [
  {
    user: "Rachel Torres",
    initials: "RT",
    title: "Healthcare Integration Project Goes Live! 🏥",
    description: `Huge milestone - our healthcare client's patient portal integration is now live and running smoothly!

**The client:** Regional hospital network with 12 facilities across 3 states.

**What we built:** Full EHR integration connecting their legacy systems to a modern patient portal. Patients can now view records, schedule appointments, and message providers - all in one place.

**Key challenges overcome:** Legacy system APIs were poorly documented. Our team spent 3 weeks reverse-engineering the data flows. Shoutout to the engineering team for their persistence!

**Business impact:** Client reports 40% reduction in phone call volume and patient satisfaction scores up 25%.

**Team recognition:** Special thanks to the integration squad - this was a true team effort across engineering, QA, and project management.`,
    likes: 89,
    comments: 23,
    date: "3 hours ago",
  },
  {
    user: "David Okonkwo",
    initials: "DO",
    title: "Q4 Revenue Target Exceeded by 15%! 📈",
    description: `Thrilled to announce we've closed Q4 with revenue 15% above our target!

**The wins that got us here:**
• Closed 3 new enterprise accounts in November
• Renewed our largest client with a 2-year extension
• Expanded into the APAC region with our first Singapore client

**What made the difference:** The new sales methodology we implemented in September is paying off. Deal cycles shortened by an average of 2 weeks.

**Lessons learned:** Investing in pre-sales technical support made a huge difference for complex deals. Clients felt more confident when our engineers joined discovery calls.

**Looking ahead:** This momentum sets us up for an ambitious but achievable Q1 target.`,
    likes: 156,
    comments: 41,
    date: "1 day ago",
  },
  {
    user: "Priya Sharma",
    initials: "PS",
    title: "Migration Project Completed 2 Weeks Early! ⚡",
    description: `Our largest cloud migration project just wrapped up - 2 weeks ahead of schedule!

**The project:** Migrating a financial services client from on-premise infrastructure to Azure cloud.

**Scope:** 200+ applications, 15TB of data, and zero tolerance for downtime during trading hours.

**How we did it:** Our phased migration approach and weekend cutover windows kept the client operational throughout. Automation scripts reduced manual work by 60%.

**Challenges faced:** Discovered 30+ undocumented legacy integrations during discovery. Had to build custom connectors on the fly.

**Client feedback:** "Your team's communication and transparency made this the smoothest migration we've ever experienced."

**Kudos to:** The entire infrastructure team and our tireless project managers!`,
    likes: 72,
    comments: 18,
    date: "2 days ago",
  },
];

export default function Wins() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={winsHero}
          alt="Wins banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Wins</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Posting Guidelines */}
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Posting Guidelines</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
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

                {/* Guidelines for Posting */}
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-3">Guidelines for Posting:</h4>
                  <ul className="space-y-2">
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
                        <span className="text-xs font-medium text-foreground">Include your journey details (highly encouraged)</span>
                        <ul className="text-xs text-muted-foreground space-y-0.5 ml-2 mt-1">
                          <li>• How did you get this client?</li>
                          <li>• What are you building for them?</li>
                          <li>• What struggles did you overcome?</li>
                        </ul>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <HelpCircle className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground">Optional - mention helpful resources</span>
                        <p className="text-xs text-muted-foreground">What tools or strategies helped you</p>
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
              </div>

              {/* Why Share Details */}
              <div className="bg-primary/5 rounded-lg p-3 mt-4">
                <h4 className="font-semibold text-xs text-primary mb-1">Why Share Details?</h4>
                <p className="text-xs text-muted-foreground">
                  Your case study helps others understand the real process behind wins - from initial contact to project delivery. These insights are incredibly valuable for members working toward similar goals.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Wins Feed */}
          <div className="space-y-4">
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
                  <h3 className="font-semibold text-foreground mb-3">{win.title}</h3>
                  <div className="text-sm text-foreground/80 mb-4 whitespace-pre-line">
                    {win.description}
                  </div>
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
