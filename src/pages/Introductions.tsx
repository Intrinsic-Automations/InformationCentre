import { useState } from "react";
import { Users, Send, Heart, MessageCircleMore, Pencil, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import introductionsHero from "@/assets/introductions-hero.jpg";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

interface Author {
  id: string;
  full_name: string;
  initials: string;
  avatar_url: string | null;
  role: string | null;
  department: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: Author | null;
}

interface Post {
  id: string;
  content: string;
  title: string | null;
  created_at: string;
  author_id: string;
  author: Author | null;
  likes: { id: string; user_id: string }[];
  comments: Comment[];
}

export default function Introductions() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["introductions-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            id,
            full_name,
            initials,
            avatar_url,
            role,
            department
          ),
          likes (
            id,
            user_id
          ),
          comments (
            id,
            content,
            created_at,
            author:profiles!comments_author_id_fkey (
              id,
              full_name,
              initials,
              avatar_url,
              role,
              department
            )
          )
        `)
        .eq("channel", "introductions")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });

  const createPost = useMutation({
    mutationFn: async (content: string) => {
      if (!profile?.id) throw new Error("You must be logged in");

      const { error } = await supabase.from("posts").insert({
        content,
        channel: "introductions",
        author_id: profile.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["introductions-posts"] });
      setNewPost("");
      toast.success("Introduction posted!");
    },
    onError: (error) => {
      toast.error("Failed to post: " + error.message);
    },
  });

  const updatePost = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { error } = await supabase
        .from("posts")
        .update({ content })
        .eq("id", postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["introductions-posts"] });
      setEditingPostId(null);
      setEditContent("");
      toast.success("Post updated!");
    },
    onError: (error) => {
      toast.error("Failed to update post: " + error.message);
    },
  });

  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      if (!profile?.id) throw new Error("You must be logged in");

      const post = posts.find((p) => p.id === postId);
      const existingLike = post?.likes.find((l) => l.user_id === profile.id);

      if (existingLike) {
        const { error } = await supabase.from("likes").delete().eq("id", existingLike.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("likes").insert({
          post_id: postId,
          user_id: profile.id,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["introductions-posts"] });
    },
    onError: (error) => {
      toast.error("Failed to update like: " + error.message);
    },
  });

  const addComment = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!profile?.id) throw new Error("You must be logged in");

      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        content,
        author_id: profile.id,
      });

      if (error) throw error;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["introductions-posts"] });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    },
    onError: (error) => {
      toast.error("Failed to add comment: " + error.message);
    },
  });

  const updateComment = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { error } = await supabase
        .from("comments")
        .update({ content })
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["introductions-posts"] });
      setEditingCommentId(null);
      setEditCommentContent("");
      toast.success("Comment updated!");
    },
    onError: (error) => {
      toast.error("Failed to update comment: " + error.message);
    },
  });

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    createPost.mutate(newPost.trim());
  };

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    addComment.mutate({ postId, content });
  };

  const handleStartEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent("");
  };

  const handleSaveEdit = (postId: string) => {
    if (!editContent.trim()) return;
    updatePost.mutate({ postId, content: editContent.trim() });
  };

  const handleStartEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const handleSaveEditComment = (commentId: string) => {
    if (!editCommentContent.trim()) return;
    updateComment.mutate({ commentId, content: editCommentContent.trim() });
  };

  const isAuthor = (post: Post) => {
    return post.author?.id === profile?.id;
  };

  const isCommentAuthor = (comment: Comment) => {
    return comment.author?.id === profile?.id;
  };

  const isLikedByUser = (post: Post) => {
    return post.likes.some((l) => l.user_id === profile?.id);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={introductionsHero}
          alt="Introductions banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Introductions</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col gap-6">
          {/* New Introduction Input */}
          {user ? (
            <Card className="bg-card">
              <CardContent className="p-4">
                <form onSubmit={handleSubmitPost} className="flex gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {profile?.initials || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Introduce yourself to the team..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={!newPost.trim() || createPost.isPending} className="gap-2">
                        <Send className="h-4 w-4" />
                        {createPost.isPending ? "Posting..." : "Post Introduction"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card">
              <CardContent className="p-4 text-center text-muted-foreground">
                Please log in to introduce yourself.
              </CardContent>
            </Card>
          )}

          {/* Introductions Feed */}
          {isLoading ? (
            <Card className="bg-card">
              <CardContent className="p-4 text-center text-muted-foreground">
                Loading introductions...
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card className="bg-card">
              <CardContent className="p-4 text-center text-muted-foreground">
                No introductions yet. Be the first to introduce yourself!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={post.author?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {post.author?.initials || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{post.author?.full_name || "Unknown"}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {post.author?.role && (
                            <Badge variant="secondary">{post.author.role}</Badge>
                          )}
                          {post.author?.department && (
                            <span className="text-xs text-muted-foreground">{post.author.department}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.created_at), "MMMM d, yyyy")}
                        </span>
                        {isAuthor(post) && editingPostId !== post.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleStartEdit(post)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingPostId === post.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="gap-1"
                          >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(post.id)}
                            disabled={!editContent.trim() || updatePost.isPending}
                            className="gap-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            {updatePost.isPending ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/80 mb-3 whitespace-pre-wrap">{post.content}</p>
                    )}

                    {/* Like and Comment buttons */}
                    {editingPostId !== post.id && (
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`gap-2 h-8 px-2 ${
                            isLikedByUser(post) ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                          }`}
                          onClick={() => toggleLike.mutate(post.id)}
                          disabled={!user}
                        >
                          <Heart className={`h-4 w-4 ${isLikedByUser(post) ? "fill-current" : ""}`} />
                          <span className="text-xs">{post.likes.length}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 h-8 px-2 text-muted-foreground hover:text-primary"
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageCircleMore className="h-4 w-4" />
                          <span className="text-xs">{post.comments.length}</span>
                        </Button>
                      </div>
                    )}

                    {/* Comments Section */}
                    {expandedComments.includes(post.id) && (
                      <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={comment.author?.avatar_url || undefined} />
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                                {comment.author?.initials || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-medium text-xs text-foreground">
                                    {comment.author?.full_name || "Unknown"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(comment.created_at), "MMM d")}
                                  </span>
                                </div>
                                {isCommentAuthor(comment) && editingCommentId !== comment.id && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-muted-foreground hover:text-foreground"
                                    onClick={() => handleStartEditComment(comment)}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              {editingCommentId === comment.id ? (
                                <div className="mt-1 space-y-2">
                                  <Input
                                    value={editCommentContent}
                                    onChange={(e) => setEditCommentContent(e.target.value)}
                                    className="h-8 text-xs"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSaveEditComment(comment.id);
                                      }
                                      if (e.key === "Escape") {
                                        handleCancelEditComment();
                                      }
                                    }}
                                  />
                                  <div className="flex gap-1 justify-end">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleCancelEditComment}
                                      className="h-6 px-2 text-xs gap-1"
                                    >
                                      <X className="h-3 w-3" />
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSaveEditComment(comment.id)}
                                      disabled={!editCommentContent.trim() || updateComment.isPending}
                                      className="h-6 px-2 text-xs gap-1"
                                    >
                                      <Check className="h-3 w-3" />
                                      {updateComment.isPending ? "Saving..." : "Save"}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-foreground/80">{comment.content}</p>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Add Comment Input */}
                        {user && (
                          <div className="flex gap-2 mt-2">
                            <Input
                              placeholder="Write a welcome message..."
                              className="h-8 text-xs"
                              value={commentInputs[post.id] || ""}
                              onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddComment(post.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              className="h-8 px-3"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim() || addComment.isPending}
                            >
                              <Send className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
