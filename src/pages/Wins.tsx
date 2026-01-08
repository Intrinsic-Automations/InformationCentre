import { Trophy, Heart, MessageSquare, Info, Briefcase, Lightbulb, Users, Award, Handshake, FileText, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import winsHero from "@/assets/wins-hero.jpg";

const wins = [
  {
    user: "Sarah Mitchell",
    initials: "SM",
    title: "Landed My First $15K Client! 🎉",
    description: `After 3 months of consistent outreach, I finally closed my first major client!

**How I got this client:** Cold outreach via LinkedIn. Sent about 50 personalized messages over 2 weeks targeting marketing agencies. This one responded after I commented on their posts for a week first.

**What I'm building:** A complete CRM automation system using Make.com and Airtable. It will handle their lead nurturing, client onboarding, and reporting dashboards.

**Pricing strategy:** I used the value-based pricing approach from the eQ training. Estimated they'd save 20+ hours/month, so I priced at $15K for the initial build + $500/month retainer.

**Struggles overcome:** Almost gave up after the first 30 messages got no responses. Changed my approach to engage with their content first before pitching - that made all the difference.

**Helpful resources:** The "Cold Outreach Mastery" module and the pricing calculator template were game changers!`,
    likes: 89,
    comments: 23,
    date: "3 hours ago",
  },
  {
    user: "Marcus Chen",
    initials: "MC",
    title: "Breakthrough: From $0 to $5K MRR in 60 Days",
    description: `Finally hit my goal of $5K monthly recurring revenue!

**How I got these clients:** Mix of referrals (2 clients) and networking in local business groups (3 clients). Joined 3 BNI-style groups and positioned myself as "the automation guy."

**What I'm building:** Mostly small automation packages - email sequences, social media scheduling, and basic CRM setups. Nothing fancy, but solves real problems.

**Pricing strategy:** Started with a $997 setup fee + $500/month. After feedback here, I raised to $1,500 setup + $750/month. No pushback from clients!

**Key insight for others:** Don't underestimate local networking. Everyone talks about online, but face-to-face trust is still powerful. These clients signed faster than any cold outreach I've done.`,
    likes: 156,
    comments: 41,
    date: "1 day ago",
  },
  {
    user: "Jessica Park",
    initials: "JP",
    title: "Just Signed a 6-Month Retainer Contract! 📝",
    description: `Big win - converted a one-time project client into a 6-month retainer!

**How it happened:** Delivered a lead gen automation 2 months ago. Kept in touch, shared optimization tips, and when they mentioned scaling, I proposed a retainer for ongoing improvements.

**What I'm building:** Expanding their automation stack - adding AI-powered lead scoring, automated follow-ups, and a client portal.

**Pricing:** $3,500/month for 15 hours of work + priority support. Used the retainer proposal template from the resources section.

**Struggles:** Client initially wanted hourly billing. Had to demonstrate the value of predictable monthly costs for them and consistent income for me. The "retainer objection handling" script helped a lot!

**Tip for others:** Your best new clients are often your existing clients. Don't forget to nurture those relationships!`,
    likes: 72,
    comments: 18,
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
                  <h3 className="font-semibold text-foreground mb-3">{win.title}</h3>
                  <div className="text-sm text-foreground/80 mb-4 whitespace-pre-line prose prose-sm max-w-none">
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
