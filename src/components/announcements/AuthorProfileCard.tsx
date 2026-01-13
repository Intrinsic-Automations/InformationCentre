import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { User, Building, Briefcase, Sparkles, Mail } from "lucide-react";

interface Author {
  id: string;
  full_name: string;
  initials: string;
  avatar_url: string | null;
  role: string | null;
  department: string | null;
  email: string | null;
  skills: string[] | null;
}

interface AuthorProfileCardProps {
  author: Author | null;
}

export function AuthorProfileCard({ author }: AuthorProfileCardProps) {
  if (!author) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">Unknown Author</span>
      </div>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatar_url || undefined} alt={author.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {author.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground hover:underline">
            {author.full_name}
          </span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="flex gap-4">
          <Avatar className="h-14 w-14 shrink-0">
            <AvatarImage src={author.avatar_url || undefined} alt={author.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
              {author.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1.5 min-w-0">
            <h4 className="text-sm font-semibold">{author.full_name}</h4>
            {author.role && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Briefcase className="h-3 w-3 shrink-0" />
                <span className="truncate">{author.role}</span>
              </div>
            )}
            {author.department && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building className="h-3 w-3 shrink-0" />
                <span>{author.department}</span>
              </div>
            )}
            {author.email && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3 w-3 shrink-0" />
                <a href={`mailto:${author.email}`} className="truncate hover:underline hover:text-foreground">
                  {author.email}
                </a>
              </div>
            )}
          </div>
        </div>
        {author.skills && author.skills.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {author.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {author.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{author.skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
