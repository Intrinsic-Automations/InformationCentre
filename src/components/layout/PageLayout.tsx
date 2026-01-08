import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ title, description, icon, children }: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-6 py-6">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
}
