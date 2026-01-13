import { useState } from "react";
import { Bell, Pin, Plus, AlertCircle, Pencil } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import announcementsHero from "@/assets/announcements-hero.jpg";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  author_id: string | null;
  published_at: string;
}

export default function Announcements() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Company");
  const [isPinned, setIsPinned] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as Announcement[];
    },
  });

  const createAnnouncement = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to post an announcement.");
      if (!profile?.id) throw new Error("Your profile is still loading. Please try again in a moment.");

      const { error } = await supabase.from("announcements").insert({
        title,
        content,
        category,
        is_pinned: isPinned,
        author_id: profile.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({
        title: "Announcement posted",
        description: "Your announcement has been published.",
      });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post announcement. You may not have permission.",
        variant: "destructive",
      });
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: async () => {
      if (!editingAnnouncement) return;
      const { error } = await supabase
        .from("announcements")
        .update({
          title,
          content,
          category,
          is_pinned: isPinned,
        })
        .eq("id", editingAnnouncement.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({
        title: "Announcement updated",
        description: "Your announcement has been updated.",
      });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update announcement.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
    setTitle("");
    setContent("");
    setCategory("Company");
    setIsPinned(false);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    setCategory(announcement.category);
    setIsPinned(announcement.is_pinned);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (editingAnnouncement) {
      updateAnnouncement.mutate();
    } else {
      createAnnouncement.mutate();
    }
  };

  const isSubmitting = createAnnouncement.isPending || updateAnnouncement.isPending;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={announcementsHero}
          alt="Announcements banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Announcements</h1>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) resetForm();
            else setIsDialogOpen(true);
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Post Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Post New Announcement"}</DialogTitle>
                <DialogDescription>
                  {editingAnnouncement ? "Update your announcement." : "Create a new announcement to share with the team."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your announcement..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Projects">Projects</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pinned"
                    checked={isPinned}
                    onCheckedChange={(checked) => setIsPinned(checked === true)}
                  />
                  <Label htmlFor="pinned" className="text-sm font-normal">
                    Pin this announcement
                  </Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (editingAnnouncement ? "Updating..." : "Posting...") : (editingAnnouncement ? "Update Announcement" : "Post Announcement")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Posting Guidelines */}
        <Alert className="mb-6 border-primary/30 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground/80">
            <span className="font-semibold">Posting Guidelines:</span> You can only post announcements that have been authorised by Alan and Gareth.
          </AlertDescription>
        </Alert>

        {/* Announcements List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="bg-card">
              <CardContent className="p-6 text-center text-muted-foreground">
                Loading announcements...
              </CardContent>
            </Card>
          ) : announcements.length === 0 ? (
            <Card className="bg-card">
              <CardContent className="p-6 text-center text-muted-foreground">
                No announcements yet. Be the first to post one!
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className={announcement.is_pinned ? "border-primary/30 bg-card" : "bg-card"}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {announcement.is_pinned && (
                        <Pin className="h-4 w-4 text-primary" />
                      )}
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {profile?.id === announcement.author_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Badge variant="secondary">{announcement.category}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {format(new Date(announcement.published_at), "MMMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{announcement.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
