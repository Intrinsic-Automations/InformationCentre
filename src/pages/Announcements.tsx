import { Bell, Pin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import announcementsHero from "@/assets/announcements-hero.jpg";

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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-12 md:h-14 overflow-hidden">
        <img
          src={announcementsHero}
          alt="Announcements banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Announcements</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
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
      </div>
    </div>
  );
}
