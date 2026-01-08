import { Newspaper, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import newsHero from "@/assets/news-hero.jpg";

const newsItems = [
  {
    title: "Industry Report: Digital Transformation Trends 2024",
    source: "Tech Insights",
    date: "January 12, 2024",
    summary: "A comprehensive look at the key digital transformation trends shaping enterprises this year.",
  },
  {
    title: "New Partnership Opportunities in APAC Region",
    source: "Business Weekly",
    date: "January 10, 2024",
    summary: "Exploring emerging markets and partnership possibilities across the Asia-Pacific region.",
  },
  {
    title: "Best Practices for Remote Team Collaboration",
    source: "HR Today",
    date: "January 8, 2024",
    summary: "Expert insights on building effective remote work cultures and collaboration strategies.",
  },
];

export default function News() {
  return (
    <div className="flex flex-col h-full">
      {/* Hero Banner with Title */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={newsHero}
          alt="News banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Newspaper className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground">News</h1>
              <p className="text-sm md:text-base text-secondary-foreground/80 mt-1">
                Industry news and updates relevant to our work.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl space-y-4">
          {newsItems.map((item, index) => (
            <Card key={index} className="bg-card hover:bg-card/80 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.source} • {item.date}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-end justify-between gap-4">
                <p className="text-sm text-foreground/80">{item.summary}</p>
                <Button variant="ghost" size="sm" className="gap-2 shrink-0">
                  Read <ExternalLink className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
