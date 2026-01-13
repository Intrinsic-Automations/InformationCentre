import { useState } from "react";
import { Trophy, Heart, MessageCircleMore, Info, Briefcase, Lightbulb, Users, Award, Handshake, FileText, HelpCircle, Send, Pencil, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import winsHero from "@/assets/wins-hero.jpg";
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

export default function Wins() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["wins-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            id,
            full_name,
            initials,
            avatar_url
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
              avatar_url
            )
          )
        `)
        .eq("channel", "wins")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });

  const createPost = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!profile?.id) throw new Error("You must be logged in");

      const { error } = await supabase.from("posts").insert({
        title,
        content,
        channel: "wins",
        author_id: profile.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wins-posts"] });
      setNewPost("");
      setNewTitle("");
      toast.success("Win posted!");
    },
    onError: (error) => {
      toast.error("Failed to post: " + error.message);
    },
  });

  const updatePost = useMutation({
    mutationFn: async ({ postId, title, content }: { postId: string; title: string; content: string }) => {
      const { error } = await supabase
        .from("posts")
        .update({ title, content })
        .eq("id", postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wins-posts"] });
      setEditingPostId(null);
      setEditContent("");
      setEditTitle("");
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
      queryClient.invalidateQueries({ queryKey: ["wins-posts"] });
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
      queryClient.invalidateQueries({ queryKey: ["wins-posts"] });
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
      queryClient.invalidateQueries({ queryKey: ["wins-posts"] });
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
    if (!newTitle.trim() || !newPost.trim()) return;
    createPost.mutate({ title: newTitle.trim(), content: newPost.trim() });
  };

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    addComment.mutate({ postId, content });
  };

  const handleStartEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title || "");
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent("");
    setEditTitle("");
  };

  const handleSaveEdit = (postId: string) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    updatePost.mutate({ postId, title: editTitle.trim(), content: editContent.trim() });
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

          {/* New Win Input */}
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
                    <Input
                      placeholder="Win title (e.g., 'New Enterprise Client Signed! 🎉')"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Share the details of your win... What happened? How did you do it? What did you learn?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={!newTitle.trim() || !newPost.trim() || createPost.isPending} className="gap-2">
                        <Send className="h-4 w-4" />
                        {createPost.isPending ? "Posting..." : "Share Win"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card">
              <CardContent className="p-4 text-center text-muted-foreground">
                Please log in to share your wins.
              </CardContent>
            </Card>
          )}

          {/* Wins Feed */}
          {isLoading ? (
            <Card className="bg-card">
              <CardContent className="p-4 text-center text-muted-foreground">
                Loading wins...
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card className="bg-card">
              <CardContent className="p-4 text-center text-muted-foreground">
                No wins shared yet. Be the first to celebrate a success!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {post.author?.initials || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-base">{post.author?.full_name || "Unknown"}</CardTitle>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.created_at), "MMMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
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
                  </CardHeader>
                  <CardContent>
                    {editingPostId === post.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Win title"
                        />
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[100px] resize-none"
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
                            disabled={!editTitle.trim() || !editContent.trim() || updatePost.isPending}
                            className="gap-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            {updatePost.isPending ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-foreground mb-3">{post.title}</h3>
                        <div className="text-sm text-foreground/80 mb-4 whitespace-pre-wrap">
                          {post.content}
                        </div>
                      </>
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
                              placeholder="Congratulate or ask a question..."
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
