// src/api/ordersService.ts

import type { Category, Order } from "@/views/Orders/OrdersPage";

// A small sample of mock orders (with a few “agent = null” entries)
const mockOrders: Order[] = [
  {
    orderId: "ORD108",
    orderFor: "Mexican Burger",
    quantity: "5 Pc",
    orderOn: "2025-04-23T00:00:00.000Z",
    orderedUser: "Raghav Taneja",
    vendor: "GYX Cafe",
    agent: "Kunal Raj",
    status: "Completed",
    category: "Food Delivery",
   deliveryLocation:{
      address: "House No #15/B6, Near Street X",
      city: "Bhopal",
      country: "India",
      pincode: 465696,
      state: "MP"
    },
    customerMobile: "+91 9989766765",
    ratings:4,
    orderRate:"High",
    unitPrice: 500,
    totalPrice: 5 * 500,
  },
  {
    orderId: "ORD107",
    orderFor: "Fresh Mangos",
    quantity: "2 Kg",
    orderOn: "2025-04-20T00:00:00.000Z",
    orderedUser: "Bhupal Chandra",
    vendor: "Cyz Veggies Shop",
    agent: null, // Not Assigned
    status: "In Progress",
    category: "Grocery Delivery",
   deliveryLocation:{
      address: "House No #15/B6, Near Street X",
      city: "Bhopal",
      country: "India",
      pincode: 465696,
      state: "MP"
    },
    customerMobile: "+91 9989766765",
    unitPrice: 250,
     ratings:3,
    orderRate:"High",
    totalPrice: 2 * 250,
  },
  {
    orderId: "ORD106",
    orderFor: "Salsa Bread",
    quantity: "1 Pkt",
    orderOn: "2025-04-20T00:00:00.000Z",
    orderedUser: "Ram charan",
    vendor: "Tony Bakery",
    agent: "Gagan Deep",
    status: "Completed",
    category: "Grocery Delivery",
 deliveryLocation:{
      address: "House No #15/B6, Near Street X",
      city: "Bhopal",
      country: "India",
      pincode: 465696,
      state: "MP"
    },
    customerMobile: "+91 9989766765",
    unitPrice: 200,
     ratings:1,
    orderRate:"low",
    totalPrice: 1 * 200,
  },
  {
    orderId: "ORD105",
    orderFor: "Fresh Carrot",
    quantity: "3 Kg",
    orderOn: "2025-04-17T00:00:00.000Z",
    orderedUser: "Diwesh",
    vendor: "Cyz Veggies Shop",
    agent: "Rayan B",
    status: "Completed",
    category: "Grocery Delivery",
 deliveryLocation:{
      address: "House No #15/B6, Near Street X",
      city: "Bhopal",
      country: "India",
      pincode: 465696,
      state: "MP"
    },
    customerMobile: "+91 9989766765",
    unitPrice: 100,
     ratings:4,
    orderRate:"Medium",
    totalPrice: 3 * 100,
  },
  {
    orderId: "ORD104",
    orderFor: "Schezwan Sauce",
    quantity: "1 Pkt",
    orderOn: "2025-04-17T00:00:00.000Z",
    orderedUser: "Durga P",
    vendor: "Tony Bakery",
    agent: "Gagan Deep",
    status: "Completed",
    category: "Grocery Delivery",
     deliveryLocation:{
      address: "House No #15/B6, Near Street X",
      city: "Bhopal",
      country: "India",
      pincode: 465696,
      state: "MP"
    },
    customerMobile: "+91 9989766765",
    unitPrice: 150,
     ratings:4,
    orderRate:"High",
    totalPrice: 1 * 150,
  },
  {
    orderId: "ORD102",
    orderFor: "Natural Milk",
    quantity: "2 Pkt",
    orderOn: "2025-04-15T00:00:00.000Z",
    orderedUser: "Lokesh K",
    vendor: "Zvc Super Market",
    agent: "Arun Tej",
    status: "Pending",
    category: "Grocery Delivery",
    deliveryLocation:{
      address: "House No #15/B6, Near Street X",
      city: "Bhopal",
      country: "India",
      pincode: 465696,
      state: "MP"
    },
    customerMobile: "+91 9989766765",
    unitPrice: 50,
     ratings:4,
    orderRate:"Medium",
    totalPrice: 2 * 50,
    
  },
  {
    orderId: "ORD101",
    orderFor: "Periperi Sandwich",
    quantity: "2 Pc",
    orderOn: "2025-04-14T00:00:00.000Z",
    orderedUser: "Abhay Guna",
    vendor: "Zvc Super Market",
    agent: "Kunal Raj",
    status: "Completed",
    category: "Food Delivery",
    deliveryLocation:{
      address: "House No #15/B6, Near Street X",
      city: "Bhopal",
      country: "India",
      pincode: 465696,
      state: "MP"
    },
    customerMobile: "+91 9989766765",
    unitPrice: 120,
     ratings:2,
    orderRate:"High",
    totalPrice: 2 * 120,
  },
  // …you can add up to ~15–20 items to simulate pagination…
];

// Mock list of “available agents” for assignment
const mockAgents: string[] = [
  "Kunal Raj",
  "Gagan Deep",
  "Arun Tej",
  "Rayan B",
  "Surya Prathap",
  "Charan Raj",
];

export type TrackInfo = {
  lat: number;
  lng: number;
  eta: string; // e.g. “5 mins”
};

// Phase 1 stub: fetch orders with optional filters
export const getAllOrders = async (params: {
  page: number;
  limit: number;
  category?: Category;
  search?: string;
  onlyNotAssigned?: boolean;
  onlyOngoing?: boolean;
}): Promise<{ rows: Order[]; totalCount: number }> => {
  let filtered = [...mockOrders];

  // 1) Category filter
  if (params.category) {
    filtered = filtered.filter((o) => o.category === params.category);
  }

  // 2) Search by orderId
  if (params.search) {
    const term = params.search.toLowerCase();
    filtered = filtered.filter((o) =>
      o.orderId.toLowerCase().includes(term)
    );
  }

  // 3) “Not Assigned” filter
  if (params.onlyNotAssigned) {
    filtered = filtered.filter((o) => o.agent === null);
  }

  // 4) “Ongoing” filter (status = Pending, Accepted, In Progress)
  if (params.onlyOngoing) {
    filtered = filtered.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Accepted" ||
        o.status === "In Progress"
    );
  }

  // 5) Pagination
  const start = (params.page - 1) * params.limit;
  const pageRows = filtered.slice(start, start + params.limit);
  const totalCount = filtered.length;

  // simulate network delay
  await new Promise((r) => setTimeout(r, 200));
  return { rows: pageRows, totalCount };
};

// Phase 1 stub: fetch a single order
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const found = mockOrders.find((o) => o.orderId === orderId) || null;
  await new Promise((r) => setTimeout(r, 200));
  return found;
};

// Phase 1 stub: assign an order to an agent
export const assignOrderToAgent = async (
  orderId: string,
  agentName: string
): Promise<{ success: boolean }> => {
    console.log(orderId,agentName    )
  // (In Phase 2 you’d PUT to /orders/:id/assign)
  await new Promise((r) => setTimeout(r, 200));
  return { success: true };
};

// Phase 1 stub: track order (returns random lat/lng + ETA)
export const trackOrderById = async (
  orderId: string
): Promise<TrackInfo> => {
    console.log(orderId)
  await new Promise((r) => setTimeout(r, 200));
  return {
    lat: 28.6139 + Math.random() * 0.01, // random Delhi‐area coordinates
    lng: 77.2090 + Math.random() * 0.01,
    eta: `${5 + Math.floor(Math.random() * 10)} mins`,
  };
};

// Phase 1 stub: get list of active & verified agents (for dropdown)
export const getAvailableAgents = async (): Promise<string[]> => {
  await new Promise((r) => setTimeout(r, 200));
  return mockAgents;
};
