import { Bell, Pin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const announcements = [
  {
    title: "Q1 2024 All-Hands Meeting",
    date: "January 15, 2024",
    content: "Join us for our quarterly all-hands meeting where we'll discuss company updates, celebrate wins, and outline our goals for the upcoming quarter.",
    pinned: true,
    category: "Company",
  },
  {
    title: "New Training Modules Available",
    date: "January 10, 2024",
    content: "We've added new training modules covering advanced sales techniques and product updates. Check out the Learning section to get started.",
    pinned: true,
    category: "Training",
  },
  {
    title: "Holiday Schedule Update",
    date: "January 5, 2024",
    content: "Please review the updated holiday schedule for 2024. The calendar has been updated in the Resources section.",
    pinned: false,
    category: "HR",
  },
];

export default function Announcements() {
  return (
    <PageLayout
      title="Announcements"
      description="Stay informed with the latest updates and important notices."
      icon={<Bell className="h-5 w-5" />}
    >
      <div className="max-w-3xl space-y-4">
        {announcements.map((announcement, index) => (
          <Card key={index} className={announcement.pinned ? "border-primary/30 bg-card" : "bg-card"}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {announcement.pinned && (
                    <Pin className="h-4 w-4 text-primary" />
                  )}
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                </div>
                <Badge variant="secondary">{announcement.category}</Badge>
              </div>
              <CardDescription>{announcement.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
