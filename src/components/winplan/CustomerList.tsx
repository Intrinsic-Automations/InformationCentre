import { Building2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Customer } from "@/hooks/useWinPlanData";

interface CustomerListProps {
  customers: Customer[] | undefined;
  isLoading: boolean;
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string) => void;
}

export function CustomerList({
  customers,
  isLoading,
  selectedCustomerId,
  onSelectCustomer,
}: CustomerListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!customers?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No customers found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {customers.map((customer) => (
        <Card
          key={customer.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedCustomerId === customer.id
              ? "ring-2 ring-primary bg-primary/5"
              : "hover:bg-accent/50"
          }`}
          onClick={() => onSelectCustomer(customer.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {customer.company_name}
                  </h3>
                  {customer.industry && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {customer.industry}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {customer.author && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-7 w-7 border-2 border-background">
                        <AvatarImage src={customer.author.avatar_url || undefined} alt={customer.author.full_name || "Author"} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {customer.author.initials || "?"}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Added by {customer.author.full_name || "Unknown"}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
