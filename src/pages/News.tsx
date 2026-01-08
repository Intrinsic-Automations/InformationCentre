import { Newspaper, ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <PageLayout
      title="News"
      description="Industry news and updates relevant to our work."
      icon={<Newspaper className="h-5 w-5" />}
    >
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
    </PageLayout>
  );
}
