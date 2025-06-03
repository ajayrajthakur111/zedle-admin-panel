// src/api/complaintsService.ts
export interface Complaint {
  complaintId: string;
  orderId: string;
  title: string;                // e.g. “Complaint 1” or “Order Delayed”
  description: string;
  raisedBy: string;             // e.g. “Rajkaml Rai”
  deliveryPersonName: string;   // e.g. “Kunal Raj”
  deliveryPersonPhone: string;  // e.g. “+91 998763882”
  raisedOn: string;             // ISO date string
  status: "Open" | "Resolved";
}

// For demo/mock purposes, we keep an in-memory array.
// In a real app, you’d replace these with real Axios calls.
const _mockComplaints: Complaint[] = [
  {
    complaintId: "C001",
    orderId: "ORD143",
    title: "Complaint 1",
    description: "Complaint Desc 1",
    raisedBy: "Rajkaml Rai",
    deliveryPersonName: "Kunal Raj",
    deliveryPersonPhone: "+91 998763882",
    raisedOn: "2025-04-21T00:00:00Z",
    status: "Open",
  },
  {
    complaintId: "C002",
    orderId: "ORD042",
    title: "Order Delayed",
    description: "Complaint Desc 2",
    raisedBy: "Lokesh P",
    deliveryPersonName: "Gagan Deep",
    deliveryPersonPhone: "+91 9876543210",
    raisedOn: "2025-04-19T00:00:00Z",
    status: "Open",
  },
  {
    complaintId: "C003",
    orderId: "ORD102",
    title: "Complaint 3",
    description: "Complaint Desc 3",
    raisedBy: "Tanmai Guna",
    deliveryPersonName: "Arun Tej",
    deliveryPersonPhone: "+91 9988776655",
    raisedOn: "2025-04-22T00:00:00Z",
    status: "Open",
  },
];

/**
 * Fetch all complaints (returns only those with status “Open”).
 */
export async function getAllComplaints(): Promise<Complaint[]> {
  // simulate network delay
  await new Promise((res) => setTimeout(res, 300));
  return _mockComplaints.filter((c) => c.status === "Open");
}

/**
 * “Resolve” a complaint by ID.
 * Updates the in-memory list and returns the updated item.
 */
export async function resolveComplaint(
  complaintId: string
): Promise<Complaint> {
  await new Promise((res) => setTimeout(res, 300));
  const idx = _mockComplaints.findIndex((c) => c.complaintId === complaintId);
  if (idx === -1) throw new Error("Complaint not found");
  _mockComplaints[idx] = { ..._mockComplaints[idx], status: "Resolved" };
  return _mockComplaints[idx];
}
