import { Building2, ChevronRight, Globe, Mail, Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {customer.company_name}
                  </h3>
                  {customer.industry && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {customer.industry}
                    </Badge>
                  )}
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {customer.contact_name && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3" />
                        <span className="truncate">{customer.contact_name}</span>
                      </div>
                    )}
                    {customer.contact_email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{customer.contact_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
