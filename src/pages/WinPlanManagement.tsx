import { useState } from "react";
import { Target, Building2, ChevronLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerList } from "@/components/winplan/CustomerList";
import { CustomerDetails } from "@/components/winplan/CustomerDetails";
import { OpportunityList } from "@/components/winplan/OpportunityList";
import { OpportunityDetails } from "@/components/winplan/OpportunityDetails";
import {
  useCustomers,
  useCustomerDocuments,
  useOpportunities,
  useOpportunityInteractions,
  useOpportunityStakeholders,
} from "@/hooks/useWinPlanData";

const WinPlanManagement = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();
  const { data: documents, isLoading: isLoadingDocuments } = useCustomerDocuments(selectedCustomerId);
  const { data: opportunities, isLoading: isLoadingOpportunities } = useOpportunities(selectedCustomerId);
  const { data: interactions, isLoading: isLoadingInteractions } = useOpportunityInteractions(selectedOpportunityId);
  const { data: stakeholders, isLoading: isLoadingStakeholders } = useOpportunityStakeholders(selectedOpportunityId);

  const selectedCustomer = customers?.find((c) => c.id === selectedCustomerId);
  const selectedOpportunity = opportunities?.find((o) => o.id === selectedOpportunityId);

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setSelectedOpportunityId(null);
  };

  const handleBack = () => {
    if (selectedOpportunityId) {
      setSelectedOpportunityId(null);
    } else if (selectedCustomerId) {
      setSelectedCustomerId(null);
    }
  };

  return (
    <PageLayout
      title="Win Plan Management"
      icon={<Target className="h-5 w-5" />}
    >
      <div className="h-full flex flex-col">
        {/* Breadcrumb / Back Navigation */}
        {(selectedCustomerId || selectedOpportunityId) && (
          <div className="mb-4 flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Customers</span>
              {selectedCustomer && (
                <>
                  <span>/</span>
                  <span className="text-foreground font-medium">{selectedCustomer.company_name}</span>
                </>
              )}
              {selectedOpportunity && (
                <>
                  <span>/</span>
                  <span className="text-foreground font-medium">{selectedOpportunity.opportunity_name}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {!selectedCustomerId ? (
            /* Customer List View */
            <div className="h-full overflow-auto">
              <div className="mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Customers
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select a customer to view their details and opportunities
                </p>
              </div>
              <CustomerList
                customers={customers}
                isLoading={isLoadingCustomers}
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={handleSelectCustomer}
              />
            </div>
          ) : !selectedOpportunityId ? (
            /* Customer Details & Opportunities View */
            <div className="h-full overflow-hidden">
              <Tabs defaultValue="details" className="h-full flex flex-col">
                <TabsList className="shrink-0">
                  <TabsTrigger value="details">Customer Details</TabsTrigger>
                  <TabsTrigger value="opportunities">
                    Opportunities ({opportunities?.length || 0})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="flex-1 overflow-auto mt-4">
                  <CustomerDetails
                    customer={selectedCustomer}
                    documents={documents}
                    isLoadingDocuments={isLoadingDocuments}
                  />
                </TabsContent>
                <TabsContent value="opportunities" className="flex-1 overflow-auto mt-4">
                  <OpportunityList
                    opportunities={opportunities}
                    isLoading={isLoadingOpportunities}
                    selectedOpportunityId={selectedOpportunityId}
                    onSelectOpportunity={setSelectedOpportunityId}
                  />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            /* Opportunity Details View */
            <div className="h-full overflow-auto">
              <OpportunityDetails
                opportunity={selectedOpportunity}
                interactions={interactions}
                stakeholders={stakeholders}
                isLoadingInteractions={isLoadingInteractions}
                isLoadingStakeholders={isLoadingStakeholders}
              />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default WinPlanManagement;
