import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { approvalSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get loan details by Rupeek loan ID
  app.get("/api/loans/:rupeekLoanId", async (req, res) => {
    try {
      const { rupeekLoanId } = req.params;
      const loanDetails = await storage.getLoanDetails(rupeekLoanId);
      
      if (!loanDetails) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      res.json(loanDetails);
    } catch (error) {
      console.error("Error fetching loan details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Manual approval override
  app.post("/api/loans/:rupeekLoanId/approve", async (req, res) => {
    try {
      const { rupeekLoanId } = req.params;
      
      // Validate request body
      const validationResult = approvalSchema.safeParse({
        ...req.body,
        loanId: rupeekLoanId,
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
      }
      
      const { comment, approvedBy } = validationResult.data;
      
      // Find the loan
      const loan = await storage.getLoanByRupeekId(rupeekLoanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      // Update loan status to manually approved
      const updatedLoan = await storage.updateLoanStatus(
        loan.id,
        "manually_approved",
        {
          approvalComment: comment,
          approvedBy: approvedBy,
          approvedAt: new Date(),
        }
      );
      
      if (!updatedLoan) {
        return res.status(500).json({ message: "Failed to update loan status" });
      }
      
      res.json({
        message: "Loan approved successfully",
        loan: updatedLoan,
      });
    } catch (error) {
      console.error("Error approving loan:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
