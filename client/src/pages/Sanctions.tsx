import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";

// Sample data for different loan statuses
const sampleLoans = {
  initiated: [
    {
      rupeekLoanId: "7001911",
      customerName: "Rajesh Kumar",
      amount: 500000,
      date: "20 Apr 2024",
      branch: "Jayanagar"
    },
    {
      rupeekLoanId: "7001912",
      customerName: "Priya Sharma",
      amount: 750000,
      date: "21 Apr 2024",
      branch: "Koramangala"
    }
  ],
  approved: [
    {
      rupeekLoanId: "7001913",
      customerName: "Amit Patel",
      amount: 600000,
      date: "19 Apr 2024",
      branch: "Indiranagar",
      approvedBy: "John Doe",
      approvedAt: "22 Apr 2024"
    }
  ],
  rejected: [
    {
      rupeekLoanId: "7001910",
      customerName: "Kiran Kempegowda",
      amount: 708654,
      date: "18 Apr 2024",
      branch: "Jayanagar",
      rejectionReasons: ["Insufficient income verification documents", "Jewelry valuation below minimum threshold"]
    },
    {
      rupeekLoanId: "7001914",
      customerName: "Sunita Reddy",
      amount: 450000,
      date: "17 Apr 2024",
      branch: "Whitefield",
      rejectionReasons: ["Credit score does not meet policy requirements"]
    }
  ]
};

export default function Sanctions() {
  const [activeTab, setActiveTab] = useState("rejected");

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Bank Branch Sanctions</h1>
        <p className="text-gray-600 mt-2">Manage loan applications by status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
          <CardDescription>
            Review and manage loan applications across different stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="initiated">Initiated</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="initiated" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#6c757d] hover:bg-[#6c757d]">
                    <TableHead className="text-white">Loan ID</TableHead>
                    <TableHead className="text-white">Customer Name</TableHead>
                    <TableHead className="text-white">Amount</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Branch</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleLoans.initiated.map((loan) => (
                    <TableRow key={loan.rupeekLoanId}>
                      <TableCell className="font-medium">{loan.rupeekLoanId}</TableCell>
                      <TableCell>{loan.customerName}</TableCell>
                      <TableCell>{formatAmount(loan.amount)}</TableCell>
                      <TableCell>{loan.date}</TableCell>
                      <TableCell>{loan.branch}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Initiated</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/loan/${loan.rupeekLoanId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#6c757d] hover:bg-[#6c757d]">
                    <TableHead className="text-white">Loan ID</TableHead>
                    <TableHead className="text-white">Customer Name</TableHead>
                    <TableHead className="text-white">Amount</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Branch</TableHead>
                    <TableHead className="text-white">Approved By</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleLoans.approved.map((loan) => (
                    <TableRow key={loan.rupeekLoanId}>
                      <TableCell className="font-medium">{loan.rupeekLoanId}</TableCell>
                      <TableCell>{loan.customerName}</TableCell>
                      <TableCell>{formatAmount(loan.amount)}</TableCell>
                      <TableCell>{loan.date}</TableCell>
                      <TableCell>{loan.branch}</TableCell>
                      <TableCell>{loan.approvedBy}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">Approved</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/loan/${loan.rupeekLoanId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#6c757d] hover:bg-[#6c757d]">
                    <TableHead className="text-white">Loan ID</TableHead>
                    <TableHead className="text-white">Customer Name</TableHead>
                    <TableHead className="text-white">Amount</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Branch</TableHead>
                    <TableHead className="text-white">Rejection Reasons</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleLoans.rejected.map((loan) => (
                    <TableRow key={loan.rupeekLoanId}>
                      <TableCell className="font-medium">{loan.rupeekLoanId}</TableCell>
                      <TableCell>{loan.customerName}</TableCell>
                      <TableCell>{formatAmount(loan.amount)}</TableCell>
                      <TableCell>{loan.date}</TableCell>
                      <TableCell>{loan.branch}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {loan.rejectionReasons.slice(0, 2).map((reason, index) => (
                            <div key={index} className="text-sm text-red-600 mb-1">
                              • {reason}
                            </div>
                          ))}
                          {loan.rejectionReasons.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{loan.rejectionReasons.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Rejected</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/loan/${loan.rupeekLoanId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}