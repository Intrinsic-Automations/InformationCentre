import { useState } from "react";
import { Globe, Send, Info, Link, Users, MessageSquare, Heart, MessageCircleMore, Pencil, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import europeChatHero from "@/assets/europe-chat-hero.jpg";
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

export default function EuropeChat() {
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
    queryKey: ["europe-posts"],
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
        .eq("channel", "europe_chat")
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
        channel: "europe_chat",
        author_id: profile.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["europe-posts"] });
      setNewPost("");
      toast.success("Post created!");
    },
    onError: (error) => {
      toast.error("Failed to create post: " + error.message);
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
      queryClient.invalidateQueries({ queryKey: ["europe-posts"] });
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
      queryClient.invalidateQueries({ queryKey: ["europe-posts"] });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    },
    onError: (error) => {
      toast.error("Failed to add comment: " + error.message);
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
      queryClient.invalidateQueries({ queryKey: ["europe-posts"] });
      setEditingPostId(null);
      setEditContent("");
      toast.success("Post updated!");
    },
    onError: (error) => {
      toast.error("Failed to update post: " + error.message);
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
      queryClient.invalidateQueries({ queryKey: ["europe-posts"] });
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

  const isCommentAuthor = (comment: Comment) => {
    return comment.author?.id === profile?.id;
  };

  const isLikedByUser = (post: Post) => {
    return post.likes.some((l) => l.user_id === profile?.id);
  };

  const isAuthor = (post: Post) => {
    return post.author?.id === profile?.id;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={europeChatHero}
          alt="Europe Chat banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Europe Chat</h1>
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
              <h4 className="font-semibold text-sm text-foreground mb-3">What This Channel is For:</h4>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Link className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Sharing your posts</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Drop links to your LinkedIn, Twitter, or other platform content
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Coordinating support</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Organize mutual engagement to increase reach and visibility
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">Getting feedback</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Receive input on Project
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Post Input */}
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
                      placeholder="Share something with the Europe team..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={!newPost.trim() || createPost.isPending} className="gap-2">
                        <Send className="h-4 w-4" />
                        {createPost.isPending ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card">
              <CardContent className="p-4 text-center text-muted-foreground">
                Please log in to post in this channel.
              </CardContent>
            </Card>
          )}

          {/* Posts Feed */}
          <div className="flex flex-col">
            {isLoading ? (
              <Card className="bg-card">
                <CardContent className="p-4 text-center text-muted-foreground">
                  Loading posts...
                </CardContent>
              </Card>
            ) : posts.length === 0 ? (
              <Card className="bg-card">
                <CardContent className="p-4 text-center text-muted-foreground">
                  No posts yet. Be the first to share!
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card">
                <CardContent className="p-4 space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {post.author?.initials || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="flex items-baseline gap-2">
                              <span className="font-medium text-sm text-foreground">
                                {post.author?.full_name || "Unknown"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(post.created_at), "MMM d, h:mm a")}
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
                          
                          {editingPostId === post.id ? (
                            <div className="mt-2 space-y-2">
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
                            <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap">{post.content}</p>
                          )}

                          {/* Like and Comment buttons */}
                          <div className="flex items-center gap-4 mt-3">
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

                          {/* Comments Section */}
                          {expandedComments.includes(post.id) && (
                            <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
                              {post.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-2">
                                  <Avatar className="h-6 w-6 shrink-0">
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
                                          {format(new Date(comment.created_at), "MMM d, h:mm a")}
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
                                          className="h-7 text-xs"
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              handleSaveEditComment(comment.id);
                                            } else if (e.key === "Escape") {
                                              handleCancelEditComment();
                                            }
                                          }}
                                        />
                                        <div className="flex gap-1 justify-end">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-xs"
                                            onClick={handleCancelEditComment}
                                          >
                                            <X className="h-3 w-3 mr-1" />
                                            Cancel
                                          </Button>
                                          <Button
                                            size="sm"
                                            className="h-6 px-2 text-xs"
                                            onClick={() => handleSaveEditComment(comment.id)}
                                            disabled={!editCommentContent.trim() || updateComment.isPending}
                                          >
                                            <Check className="h-3 w-3 mr-1" />
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
                                    placeholder="Write a comment..."
                                    className="h-8 text-xs"
                                    value={commentInputs[post.id] || ""}
                                    onChange={(e) =>
                                      setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleAddComment(post.id);
                                      }
                                    }}
                                  />
                                  <Button size="sm" className="h-8 px-3" onClick={() => handleAddComment(post.id)}>
                                    <Send className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}