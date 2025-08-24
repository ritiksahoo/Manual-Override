import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, User, MapPin, Phone, CreditCard, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LoanDetails as LoanDetailsType } from "@shared/schema";

export default function LoanDetails() {
  const { rupeekLoanId } = useParams<{ rupeekLoanId: string }>();
  const [, setLocation] = useLocation();
  const [comment, setComment] = useState("");
  const [approverName, setApproverName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: loanDetails, isLoading, error } = useQuery<LoanDetailsType>({
    queryKey: ["loan", rupeekLoanId],
    queryFn: async () => {
      const response = await fetch(`/api/loans/${rupeekLoanId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch loan details");
      }
      return response.json();
    },
    enabled: !!rupeekLoanId,
  });

  const approvalMutation = useMutation({
    mutationFn: async ({ comment, approvedBy }: { comment: string; approvedBy: string }) => {
      const response = await fetch(`/api/loans/${rupeekLoanId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          approvedBy,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve loan");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Loan has been manually approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["loan", rupeekLoanId] });
      // Redirect back to sanctions page after successful approval
      setTimeout(() => {
        setLocation("/sanctions");
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApproval = () => {
    if (!comment.trim() || comment.length < 20) {
      toast({
        title: "Validation Error",
        description: "Comment must be at least 20 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!approverName.trim()) {
      toast({
        title: "Validation Error",
        description: "Approver name is required.",
        variant: "destructive",
      });
      return;
    }

    approvalMutation.mutate({
      comment: comment.trim(),
      approvedBy: approverName.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading loan details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !loanDetails) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Loan Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The loan with ID {rupeekLoanId} could not be found.
            </p>
            <Button onClick={() => setLocation("/sanctions")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sanctions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { loan, customer, branch } = loanDetails;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "manually_approved":
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <Button 
          onClick={() => setLocation("/sanctions")} 
          variant="outline" 
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sanctions
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loan Details</h1>
            <p className="text-gray-600 mt-1">Rupeek Loan ID: {loan.rupeekLoanId}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(loan.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Name</Label>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Father/Husband Name</Label>
              <p>{customer.fatherHusbandName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">DOB</Label>
                <p>{customer.dob}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Gender</Label>
                <p>{customer.gender}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">PAN Number</Label>
              <p className="font-mono">{customer.panNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <p>{customer.phone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Address</Label>
              <p className="text-sm whitespace-pre-line">{customer.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Pin Code</Label>
                <p>{customer.pinCode}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Marital Status</Label>
                <p>{customer.maritalStatus}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Annual Income</Label>
              <p>{formatAmount(customer.annualIncome)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Profession</Label>
                <p>{customer.profession}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Religion</Label>
                <p>{customer.religion}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Qualification</Label>
              <p>{customer.qualification}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-sm font-medium text-gray-500">Bank Details</Label>
              <div className="mt-2 space-y-2">
                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  {customer.bankName}
                </p>
                <p className="text-sm font-mono">{customer.accountNumber}</p>
                <p className="text-sm font-mono">{customer.ifscCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Loan Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Loan Date</Label>
              <p className="font-medium">{loan.loanDate}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Scheme Name</Label>
              <p>{loan.schemeName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                <p className="font-bold text-lg">{formatAmount(loan.totalAmount)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Disbursal Amount</Label>
                <p className="font-bold text-lg">{formatAmount(loan.disbursalAmount)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Interest Rate</Label>
                <p>{loan.interestRate}%</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Tenure</Label>
                <p>{loan.tenureMonths} months</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">LTV</Label>
                <p>{loan.ltv}%</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Per Gram Rate</Label>
                <p>₹{loan.perGramRate}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Rupeek Gold Rate</Label>
              <p>₹{loan.rupeekGoldRate}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Processing Fee</Label>
                <p>{formatAmount(loan.processingFee)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Disbursal Charges</Label>
                <p>{formatAmount(loan.disbursalCharges)}</p>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-sm font-medium text-gray-500">Gold Details</Label>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Gross Weight:</span>
                    <p className="font-medium">{loan.totalGrossWeight}g</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Net Weight:</span>
                    <p className="font-medium">{loan.totalNetWeight}g</p>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Adjustment:</span>
                  <p className="font-medium">{loan.totalAdjustment}g</p>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Jewelry Items</Label>
              <div className="mt-2 flex flex-wrap gap-1">
                {loan.jewelryItems.map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branch Information & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Branch Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Branch Name</Label>
                <p className="font-medium">{branch.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">SOL ID</Label>
                <p>{branch.solId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Address</Label>
                <p className="text-sm">{branch.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status and Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Loan Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                {getStatusBadge(loan.status)}
              </div>

              {loan.status === "rejected" && loan.rejectionReasons && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Rejection Reasons</Label>
                  <div className="mt-2 space-y-1">
                    {loan.rejectionReasons.map((reason, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-destructive">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loan.status === "manually_approved" && loan.approvalComment && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Approval Details</Label>
                  <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Manually Approved</p>
                        <p className="text-xs text-green-600">
                          by {loan.approvedBy} on {loan.approvedAt ? new Date(loan.approvedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">{loan.approvalComment}</p>
                  </div>
                </div>
              )}

              {loan.status === "rejected" && (
                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium text-gray-900 mb-4 block">Manual Override</Label>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="approver-name" className="text-sm font-medium">
                        Approver Name *
                      </Label>
                      <Input
                        id="approver-name"
                        value={approverName}
                        onChange={(e) => setApproverName(e.target.value)}
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="approval-comment" className="text-sm font-medium">
                        Approval Comment * (minimum 20 characters)
                      </Label>
                      <Textarea
                        id="approval-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Provide detailed justification for manual approval..."
                        className="mt-1 min-h-[100px]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {comment.length}/20 characters minimum
                      </p>
                    </div>
                    <Button
                      onClick={handleApproval}
                      disabled={approvalMutation.isPending || !comment.trim() || comment.length < 20 || !approverName.trim()}
                      className="w-full"
                    >
                      {approvalMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Loan Manually
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}