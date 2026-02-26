import { useState, useRef } from "react";
import { Database, Search, Filter, Plus, Download, Trash2, Upload, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import solutionsDatabaseHero from "@/assets/solutions-database-hero.jpg";

const categories = ["Migration", "Integration", "Data", "Security", "Development", "Other"];

interface Solution {
  id: string;
  title: string;
  category: string;
  description: string | null;
  tags: string[] | null;
  document_url: string | null;
  author_id: string | null;
  created_at: string;
  author?: {
    id: string;
    full_name: string | null;
  };
}

export default function SolutionsDatabase() {
  const { profile } = useAuth();
  const { isAdminOrModerator } = useRoles();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch solutions
  const { data: solutions = [], isLoading } = useQuery({
    queryKey: ["solutions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solutions")
        .select("*, author:profiles!solutions_author_id_fkey(id, full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Solution[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (solution: Solution) => {
      // Delete file from storage if exists
      if (solution.document_url) {
        const filePath = solution.document_url.split("/solution-files/")[1];
        if (filePath) {
          await supabase.storage.from("solution-files").remove([filePath]);
        }
      }
      // Delete solution record
      const { error } = await supabase.from("solutions").delete().eq("id", solution.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions"] });
      toast({ title: "Solution deleted successfully" });
      setDeleteConfirmId(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting solution", description: error.message, variant: "destructive" });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !title || !category) return;

    setIsSubmitting(true);
    try {
      let documentUrl: string | null = null;

      // Upload file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${profile.user_id}/${Date.now()}-${selectedFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from("solution-files")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("solution-files")
          .getPublicUrl(fileName);

        documentUrl = urlData.publicUrl;
      }

      // Parse tags
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      // Insert solution
      const { error } = await supabase.from("solutions").insert({
        title,
        category,
        description: description || null,
        tags: tags.length > 0 ? tags : null,
        document_url: documentUrl,
        author_id: profile.id,
      });

      if (error) throw error;

      toast({ title: "Solution added successfully" });
      queryClient.invalidateQueries({ queryKey: ["solutions"] });

      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setTagsInput("");
      setSelectedFile(null);
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error adding solution", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (solution: Solution) => {
    if (!solution.document_url) return;

    try {
      const filePath = solution.document_url.split("/solution-files/")[1];
      if (!filePath) {
        window.open(solution.document_url, "_blank");
        return;
      }

      const { data, error } = await supabase.storage
        .from("solution-files")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({ title: "Error downloading file", description: error.message, variant: "destructive" });
    }
  };

  // Filter solutions
  const filteredSolutions = solutions.filter((solution) => {
    const matchesSearch =
      searchQuery === "" ||
      solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const isAuthor = (solution: Solution) => profile?.id === solution.author_id;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={solutionsDatabaseHero}
          alt="Solutions Database banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Solutions Database</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search solutions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isAdminOrModerator && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Add Solution
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Solution</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Solution name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the solution..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g., AWS, API, REST"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Attachment</Label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" /> Select File
                      </Button>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !title || !category}>
                      {isSubmitting ? "Adding..." : "Add Solution"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading solutions...</div>
          ) : filteredSolutions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No solutions match your search." : "No solutions yet. Add one to get started!"}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSolutions.map((solution) => (
                <Card key={solution.id} className="bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{solution.title}</CardTitle>
                        <CardDescription>{solution.category}</CardDescription>
                      </div>
                      {isAdminOrModerator && isAuthor(solution) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirmId(solution.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {solution.description && (
                      <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{solution.description}</p>
                    )}
                    {solution.tags && solution.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {solution.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {solution.document_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleDownload(solution)}
                      >
                        <Download className="h-4 w-4" /> Download
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to DELETE this solution?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the solution and any associated files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const solution = solutions.find((s) => s.id === deleteConfirmId);
                if (solution) deleteMutation.mutate(solution);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
