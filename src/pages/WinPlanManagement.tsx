import { useState } from "react";
import { Target, Building2, ChevronLeft, Plus, Pencil, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import winPlanHero from "@/assets/win-plan-hero.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerList } from "@/components/winplan/CustomerList";
import { CustomerDetails } from "@/components/winplan/CustomerDetails";
import { CustomerForm, CustomerFormData } from "@/components/winplan/CustomerForm";
import { OpportunityList } from "@/components/winplan/OpportunityList";
import { OpportunityForm, OpportunityFormData } from "@/components/winplan/OpportunityForm";
import { OpportunityDetails } from "@/components/winplan/OpportunityDetails";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useCustomerDocuments,
  useOpportunities,
  useCreateOpportunity,
  useOpportunityInteractions,
  useOpportunityStakeholders,
  useOpportunityActionSteps,
} from "@/hooks/useWinPlanData";

const getInitialFormData = (): CustomerFormData => ({
  company_name: "",
  industry: "",
  website: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  notes: "",
  status: "prospect",
});

const getInitialOpportunityFormData = (): OpportunityFormData => ({
  opportunity_name: "",
  deal_summary: "",
  value_proposition: "",
  compelling_reasons: "",
  key_issues: "",
  blockers: "",
  estimated_value: "",
  stage: "prospecting",
  probability: "",
  expected_close_date: "",
  industry: "",
  exec_owner: "",
  opportunity_owner: "",
  quarter_to_close: "",
  services_value: "",
  software_sales: "",
});

const WinPlanManagement = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [isAddOpportunityOpen, setIsAddOpportunityOpen] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>(getInitialFormData());
  const [opportunityFormData, setOpportunityFormData] = useState<OpportunityFormData>(getInitialOpportunityFormData());

  const { profile } = useAuth();
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();
  const { data: documents, isLoading: isLoadingDocuments } = useCustomerDocuments(selectedCustomerId);
  const { data: opportunities, isLoading: isLoadingOpportunities } = useOpportunities(selectedCustomerId);
  const { data: interactions, isLoading: isLoadingInteractions } = useOpportunityInteractions(selectedOpportunityId);
  const { data: stakeholders, isLoading: isLoadingStakeholders } = useOpportunityStakeholders(selectedOpportunityId);
  const { data: actionSteps, isLoading: isLoadingActionSteps } = useOpportunityActionSteps(selectedOpportunityId);
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const createOpportunity = useCreateOpportunity();

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

  const handleAddCustomer = () => {
    if (!profile?.id) return;
    createCustomer.mutate(
      {
        company_name: formData.company_name,
        industry: formData.industry || null,
        website: formData.website || null,
        contact_name: formData.contact_name || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        address: formData.address || null,
        notes: formData.notes || null,
        status: formData.status || null,
        // author_id is set automatically server-side
      },
      {
        onSuccess: () => {
          setIsAddCustomerOpen(false);
          setFormData(getInitialFormData());
        },
      }
    );
  };

  const handleEditCustomer = () => {
    if (!selectedCustomerId) return;
    updateCustomer.mutate(
      {
        id: selectedCustomerId,
        company_name: formData.company_name,
        industry: formData.industry || null,
        website: formData.website || null,
        contact_name: formData.contact_name || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        address: formData.address || null,
        notes: formData.notes || null,
        status: formData.status || null,
      },
      {
        onSuccess: () => {
          setIsEditCustomerOpen(false);
          setFormData(getInitialFormData());
        },
      }
    );
  };

  const openEditDialog = () => {
    if (selectedCustomer) {
      setFormData({
        company_name: selectedCustomer.company_name,
        industry: selectedCustomer.industry || "",
        website: selectedCustomer.website || "",
        contact_name: selectedCustomer.contact_name || "",
        contact_email: selectedCustomer.contact_email || "",
        contact_phone: selectedCustomer.contact_phone || "",
        address: selectedCustomer.address || "",
        notes: selectedCustomer.notes || "",
        status: selectedCustomer.status || "prospect",
      });
      setIsEditCustomerOpen(true);
    }
  };

  const handleAddOpportunity = () => {
    if (!selectedCustomerId) return;
    createOpportunity.mutate(
      {
        customer_id: selectedCustomerId,
        opportunity_name: opportunityFormData.opportunity_name,
        deal_summary: opportunityFormData.deal_summary || null,
        value_proposition: opportunityFormData.value_proposition || null,
        compelling_reasons: opportunityFormData.compelling_reasons || null,
        key_issues: opportunityFormData.key_issues || null,
        blockers: opportunityFormData.blockers || null,
        estimated_value: opportunityFormData.estimated_value ? parseFloat(opportunityFormData.estimated_value) : null,
        stage: opportunityFormData.stage || null,
        probability: opportunityFormData.probability ? parseInt(opportunityFormData.probability) : null,
        expected_close_date: opportunityFormData.expected_close_date || null,
        status: "active",
        industry: opportunityFormData.industry || null,
        exec_owner: opportunityFormData.exec_owner || null,
        opportunity_owner: opportunityFormData.opportunity_owner || null,
        quarter_to_close: opportunityFormData.quarter_to_close || null,
        services_value: opportunityFormData.services_value ? parseFloat(opportunityFormData.services_value) : null,
        software_sales: opportunityFormData.software_sales ? parseFloat(opportunityFormData.software_sales) : null,
      },
      {
        onSuccess: () => {
          setIsAddOpportunityOpen(false);
          setOpportunityFormData(getInitialOpportunityFormData());
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={winPlanHero}
          alt="Win Plan Management banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Win Plan Management</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            When you add a customer, you become the owner. For other users to view or manage a customer, you must assign them access via the Customer Details page.
          </AlertDescription>
        </Alert>
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
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Customers
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Select a customer to view their details and opportunities
                  </p>
                </div>
                <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                      <DialogDescription>
                        Add a new customer to track opportunities and win plans.
                      </DialogDescription>
                    </DialogHeader>
                    <CustomerForm
                      formData={formData}
                      onFormDataChange={setFormData}
                      onSubmit={handleAddCustomer}
                      onCancel={() => {
                        setIsAddCustomerOpen(false);
                        setFormData(getInitialFormData());
                      }}
                      isSubmitting={createCustomer.isPending}
                    />
                  </DialogContent>
                </Dialog>
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
                <div className="flex items-center justify-between mb-2">
                  <TabsList className="shrink-0">
                    <TabsTrigger value="details">Customer Details</TabsTrigger>
                    <TabsTrigger value="opportunities">
                      Opportunities ({opportunities?.length || 0})
                    </TabsTrigger>
                  </TabsList>
                  <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2" onClick={openEditDialog}>
                        <Pencil className="h-4 w-4" />
                        Edit Customer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Customer</DialogTitle>
                        <DialogDescription>
                          Update customer information.
                        </DialogDescription>
                      </DialogHeader>
                      <CustomerForm
                        formData={formData}
                        onFormDataChange={setFormData}
                        onSubmit={handleEditCustomer}
                        onCancel={() => {
                          setIsEditCustomerOpen(false);
                          setFormData(getInitialFormData());
                        }}
                        isSubmitting={updateCustomer.isPending}
                        isEditMode
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <TabsContent value="details" className="flex-1 overflow-auto mt-4">
                  <CustomerDetails
                    customer={selectedCustomer}
                    documents={documents}
                    isLoadingDocuments={isLoadingDocuments}
                  />
                </TabsContent>
                <TabsContent value="opportunities" className="flex-1 overflow-auto mt-4">
                  <div className="mb-4 flex justify-end">
                    <Dialog open={isAddOpportunityOpen} onOpenChange={setIsAddOpportunityOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Opportunity
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Opportunity</DialogTitle>
                          <DialogDescription>
                            Add a new opportunity for {selectedCustomer?.company_name}.
                          </DialogDescription>
                        </DialogHeader>
                        <OpportunityForm
                          formData={opportunityFormData}
                          onFormDataChange={setOpportunityFormData}
                          onSubmit={handleAddOpportunity}
                          onCancel={() => {
                            setIsAddOpportunityOpen(false);
                            setOpportunityFormData(getInitialOpportunityFormData());
                          }}
                          isSubmitting={createOpportunity.isPending}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
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
                actionSteps={actionSteps}
                isLoadingInteractions={isLoadingInteractions}
                isLoadingStakeholders={isLoadingStakeholders}
                isLoadingActionSteps={isLoadingActionSteps}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinPlanManagement;
