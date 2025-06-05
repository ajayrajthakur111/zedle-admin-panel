// src/api/bookingsService.ts

// src/types/booking.ts

export type BookingStatus = "Pending" | "In-Progress" | "Completed";

export type BookingCategory = "Travel & Tourism" | "Enterprise Hub";

export interface Booking {
    bookingId: string;               // e.g. "BOK35"
    bookingTo: string;               // e.g. "Swiss Hotel Stay", "Airport Pickup"
    costPerPerson: string;           // e.g. "$22 / Person"
    bookedUser: string;               // customer name who did booking
    totalCost: number;               // e.g. 22 or 815
    totalMembers: number;            // e.g. 1 (for “/Person”), 3 (for “/ 3-Persons”)
    bookingOn: string;               // ISO date string, e.g. "2025-04-23T00:00:00.000Z"
    checkedInTime: string;           // ISO date/time or simple string e.g. "2025-04-23T14:00:00.000Z"
    vendorId: string;                // ID of the vendor, e.g. "VEND123"
    appointmentOn: string;           // ISO date/time of the actual appointment, e.g. "2025-04-23T16:00:00.000Z"
    category: BookingCategory;       // "Travel & Tourism" | "Enterprise Hub"
    location: {
        address: string
        city: string;
        country: string;
        state: string;
        pincode: number;
    }             // e.g. "New York, NY" or a full address
    checkoutTime: string;            // ISO date/time or string
    customerPhoneNumber: string;     // e.g. "+91 9989766765"
    customerBookingRate: string;             // 
    status: BookingStatus;           // "Pending" | "In-Progress" | "Completed"
    categoryImage: string;           // URL to a small thumbnail or category icon
    invoiceUrl: string;              // URL to a PDF invoice or receipt
}

export interface GetAllBookingsParams {
    page: number;
    limit: number;
    category?: BookingCategory;
    search?: string;
}

export interface PaginatedResult<T> {
    rows: T[];
    totalCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Replace with real Axios call later)
// ─────────────────────────────────────────────────────────────────────────────
const _allBookings: Booking[] = [
    {
        bookingId: "BOK35",
        bookingTo: "Swiss Hotel Stay",
        costPerPerson: "$22 / Person",
        bookedUser: "alpha man",
        totalCost: 22,
        totalMembers: 1,
        bookingOn: "2025-04-23T00:00:00.000Z",
        checkedInTime: "2025-04-23T14:00:00.000Z",
        vendorId: "VEND_AXT123",
        appointmentOn: "2025-04-23T16:00:00.000Z",
        category: "Travel & Tourism",
        location: {
            address: "Bahnhofstrasse 1",
            city: "Zurich",
            country: "Switzerland",
            state: "Zurich",
            pincode: 8001
        },
        checkoutTime: "2025-04-25T11:00:00.000Z",
        customerPhoneNumber: "+41 79 123 4567",
        customerBookingRate: "$22",
        status: "Completed",
        categoryImage: "https://example.com/images/travel_thumbnail.jpg",
        invoiceUrl: "https://example.com/invoices/BOK35.pdf",
    },
    {
        bookingId: "BOK34",
        bookingTo: "Airport Pickup",
        costPerPerson: "$12 / Person",
        totalCost: 12,
        bookedUser: "beta man",
        totalMembers: 1,
        bookingOn: "2025-04-20T00:00:00.000Z",
        checkedInTime: "2025-04-20T10:00:00.000Z",
        vendorId: "VEND_KUN234",
        appointmentOn: "2025-04-20T11:00:00.000Z",
        category: "Travel & Tourism",
        location: {
            address: "Terminal 1",
            city: "Berlin",
            country: "Germany",
            state: "Berlin",
            pincode: 13405
        },
        checkoutTime: "2025-04-20T12:00:00.000Z",
        customerPhoneNumber: "+49 30 1234 5678",
        customerBookingRate: "$12",
        status: "In-Progress",
        categoryImage: "https://example.com/images/airport_thumbnail.jpg",
        invoiceUrl: "https://example.com/invoices/BOK34.pdf",
    },
    {
        bookingId: "BOK33",
        bookingTo: "Nail Saloon",
        costPerPerson: "$65 / Person",
        totalCost: 65,
        bookedUser: "gama man",
        totalMembers: 1,
        bookingOn: "2025-04-20T00:00:00.000Z",
        checkedInTime: "2025-04-20T14:30:00.000Z",
        vendorId: "VEND_SYC789",
        appointmentOn: "2025-04-20T15:00:00.000Z",
        category: "Enterprise Hub",
        location: {
            address: "123 Beverly Hills",
            city: "Los Angeles",
            country: "USA",
            state: "California",
            pincode: 90210
        },
        checkoutTime: "2025-04-20T16:00:00.000Z",
        customerPhoneNumber: "+1 310 987 6543",
        customerBookingRate: "$65",
        status: "Completed",
        categoryImage: "https://example.com/images/enterprise_thumbnail.jpg",
        invoiceUrl: "https://example.com/invoices/BOK33.pdf",
    },
    {
        bookingId: "BOK32",
        bookingTo: "Bella Hotel Stay",
        costPerPerson: "$25 / Person",
        totalCost: 25,
        totalMembers: 1,
        bookedUser: "Raghav Taneja",
        bookingOn: "2025-04-17T00:00:00.000Z",
        checkedInTime: "2025-04-17T13:00:00.000Z",
        vendorId: "VEND_BYZ456",
        appointmentOn: "2025-04-17T15:00:00.000Z",
        category: "Travel & Tourism",
        location: {
            address: "Via del Corso 1",
            city: "Rome",
            country: "Italy",
            state: "Lazio",
            pincode: 184
        },
        checkoutTime: "2025-04-19T11:00:00.000Z",
        customerPhoneNumber: "+39 06 1234 5678",
        customerBookingRate: "$25",
        status: "Completed",
        categoryImage: "https://example.com/images/travel_thumbnail2.jpg",
        invoiceUrl: "https://example.com/invoices/BOK32.pdf",
    },
    {
        bookingId: "BOK31",
        bookingTo: "Skin Care",
        costPerPerson: "$48 / Person",
        totalCost: 48,
        totalMembers: 1,
        bookedUser: "Sagar wali",
        bookingOn: "2025-04-17T00:00:00.000Z",
        checkedInTime: "2025-04-17T16:00:00.000Z",
        vendorId: "VEND_SKIN201",
        appointmentOn: "2025-04-17T17:00:00.000Z",
        category: "Enterprise Hub",
        location: {
            address: "Bandra West",
            city: "Mumbai",
            country: "India",
            state: "Maharashtra",
            pincode: 400050
        },
        checkoutTime: "2025-04-17T18:30:00.000Z",
        customerPhoneNumber: "+91 98234 56789",
        customerBookingRate: "$48",
        status: "Completed",
        categoryImage: "https://example.com/images/enterprise_thumbnail2.jpg",
        invoiceUrl: "https://example.com/invoices/BOK31.pdf",
    },
    {
        bookingId: "BOK30",
        bookingTo: "Victoria Tour Package",
        costPerPerson: "$815 / 3-Persons",
        totalCost: 815,
        totalMembers: 3,
        bookedUser: "John Elia",
        bookingOn: "2025-04-15T00:00:00.000Z",
        checkedInTime: "2025-04-15T08:00:00.000Z",
        vendorId: "VEND_ABX333",
        appointmentOn: "2025-04-15T09:00:00.000Z",
        category: "Travel & Tourism",
        location: {
            address: "King's Parade",
            city: "Cambridge",
            country: "UK",
            state: "Cambridgeshire",
            pincode: 12345
        },
        checkoutTime: "2025-04-18T12:00:00.000Z",
        customerPhoneNumber: "+44 20 1234 5678",
        customerBookingRate: "$271.67",
        status: "Pending",
        categoryImage: "https://example.com/images/travel_thumbnail3.jpg",
        invoiceUrl: "https://example.com/invoices/BOK30.pdf",
    },
    {
        bookingId: "BOK29",
        bookingTo: "Hair Spa",
        costPerPerson: "$30 / Person",
        totalCost: 30,
        totalMembers: 1,
        bookingOn: "2025-04-14T00:00:00.000Z",
        checkedInTime: "2025-04-14T11:30:00.000Z",
        vendorId: "VEND_SYC789",
        appointmentOn: "2025-04-14T12:00:00.000Z",
        category: "Enterprise Hub",
        location: {
            address: "Market Street",
            city: "San Francisco",
            country: "USA",
            state: "California",
            pincode: 94105
        },
        checkoutTime: "2025-04-14T13:00:00.000Z",
        customerPhoneNumber: "+1 415 555 1234",
        bookedUser: "Robert Mccafe",
        customerBookingRate: "$30",
        status: "Completed",
        categoryImage: "https://example.com/images/enterprise_thumbnail3.jpg",
        invoiceUrl: "https://example.com/invoices/BOK29.pdf",
    },
];

const _sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getAllBookings(
    params: GetAllBookingsParams
): Promise<PaginatedResult<Booking>> {
    const { page, limit, category, search } = params;
    let filtered = [..._allBookings];

    // 1) Filter by category if provided
    if (category) {
        filtered = filtered.filter((b) => b.category === category);
    }

    // 2) Filter by search (on bookingId) if provided
    if (search) {
        filtered = filtered.filter((b) =>
            b.bookingId.toLowerCase().includes(search.toLowerCase())
        );
    }

    // 3) Paginate
    const startIndex = (page - 1) * limit;
    const rows = filtered.slice(startIndex, startIndex + limit);
    const totalCount = filtered.length;

    // Simulate a brief network delay
    await _sleep(300);

    return { rows, totalCount };
}

export async function getBookingById(bookingId: string): Promise<Booking> {
    // Simulate network delay
    await _sleep(200);

    const found = _allBookings.find((b) => b.bookingId === bookingId);
    if (!found) {
        throw new Error(`Booking with ID '${bookingId}' not found.`);
    }
    return found;
}