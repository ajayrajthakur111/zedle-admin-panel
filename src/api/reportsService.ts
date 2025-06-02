// src/api/reportsService.ts
// ──────────────────────────────────────────────────────────────────────────────
// Dummy “API” calls for each report. Replace each `setTimeout`/`resolve` with
// axios/fetch logic when the real endpoints are ready.

export interface SalesRow {
    productName: string;
    unitsSold: number;
    unitPrice: number;
    totalPrice: number;
    deliveredLocation: string;
    deliveredOn: string;
    status: 'Delivered' | 'Pending' | 'Cancelled';
}

export interface TopSellingRow {
    productName: string;
    unitsSold: number;
    sku: string;
    category: string;
    imageLink: string;
}

export interface DeliveryPerfRow {
    agentId: string;
    name: string;
    mobileNumber: string;
    deliveryTime: 'On Time' | 'Delayed' | 'Highly Delayed' | 'Slightly Late';
    ratings: number; // 0–5
    earnings: number;
}

export interface RevenueBreakdown {
    category: string;
    totalRevenue: number;
}

// 1. Sales Report
export const fetchSalesReport = async (
    startDate: string,
    endDate: string,
    granularity: 'daily' | 'weekly' | 'monthly'
): Promise<{ rows: SalesRow[] }> => {
    console.log(startDate,endDate,granularity)
    return new Promise((res) =>
        setTimeout(
            () =>
                res({
                    rows: [
                        {
                            productName: 'Product 1',
                            unitsSold: 8,
                            unitPrice: 250,
                            totalPrice: 2000,
                            deliveredLocation: 'Noida',
                            deliveredOn: 'April 19,2025',
                            status: 'Delivered',
                        },
                        {
                            productName: 'Product 2',
                            unitsSold: 9,
                            unitPrice: 650,
                            totalPrice: 5850,
                            deliveredLocation: 'Nasik',
                            deliveredOn: 'April 19,2025',
                            status: 'Delivered',
                        },
                        {
                            productName: 'Product 3',
                            unitsSold: 15,
                            unitPrice: 150,
                            totalPrice: 2250,
                            deliveredLocation: 'Bandra',
                            deliveredOn: 'April 19,2025',
                            status: 'Delivered',
                        },
                        {
                            productName: 'Product 4',
                            unitsSold: 25,
                            unitPrice: 699,
                            totalPrice: 17475,
                            deliveredLocation: 'Dasna',
                            deliveredOn: 'April 19,2025',
                            status: 'Delivered',
                        },
                    ],
                }),
            300
        )
    );
};

// 2. Top‐Selling Product/Service Report
export const fetchTopSelling = async (
    startDate: string,
    endDate: string,
    searchTerm: string
): Promise<{ rows: TopSellingRow[]; totalPages: number }> => {
    console.log(startDate,endDate,searchTerm)
    return new Promise((res) =>
        setTimeout(
            () =>
                res({
                    rows: [
                        {
                            productName: 'Product 1',
                            unitsSold: 8952,
                            sku: 'PRD7839',
                            category: 'Category 1',
                            imageLink: '#',
                        },
                        {
                            productName: 'Product 3',
                            unitsSold: 7850,
                            sku: 'PRD2347',
                            category: 'Category 2',
                            imageLink: '#',
                        },
                        {
                            productName: 'Product 6',
                            unitsSold: 4852,
                            sku: 'PRD1327',
                            category: 'Category 1',
                            imageLink: '#',
                        },
                        {
                            productName: 'Service 2',
                            unitsSold: 4141,
                            sku: 'SRVC1407',
                            category: 'Category 3',
                            imageLink: '#',
                        },
                        {
                            productName: 'Product 12',
                            unitsSold: 4141,
                            sku: 'PRD9382',
                            category: 'Category 1',
                            imageLink: '#',
                        },
                    ],
                    totalPages: 3,
                }),
            300
        )
    );
};

// 3. Delivery Performance Report
export interface DeliveryPerfRow {
    agentId: string;
    name: string;
    mobileNumber: string;
    deliveryTime: "On Time" | "Slightly Late" | "Delayed" | "Highly Delayed";
    ratings: number;
    earnings: number;
}

// Simulate server-side filtering by deliveryTime
export const fetchDeliveryPerf = async (
    page: number,
    limit: number,
    deliveryTimeFilter?: string // e.g. "On Time" or "Delayed"
): Promise<{ rows: DeliveryPerfRow[]; totalPages: number }> => {
    // TODO: replace this mock with real API call:
    // e.g. return api.get('/admin/reports/delivery', { params: { page, limit, deliveryTime: deliveryTimeFilter } })
    const allData: DeliveryPerfRow[] = [
        {
            agentId: "A001",
            name: "Rahul Sharma",
            mobileNumber: "9876543210",
            deliveryTime: "On Time",
            ratings: 5,
            earnings: 3500,
        },
        {
            agentId: "A002",
            name: "Priya Singh",
            mobileNumber: "9123456780",
            deliveryTime: "Delayed",
            ratings: 3,
            earnings: 2100,
        },
        {
            agentId: 'DAG045',
            name: 'Rayan B',
            mobileNumber: '+91 9980377928',
            deliveryTime: 'On Time',
            ratings: 5,
            earnings: 1300,
        },
        {
            agentId: 'DAG044',
            name: 'John Charles',
            mobileNumber: '+91 9980377927',
            deliveryTime: 'On Time',
            ratings: 5,
            earnings: 1050,
        },
        {
            agentId: 'DAG043',
            name: 'Abhay Guna',
            mobileNumber: '+91 9980377926',
            deliveryTime: 'Highly Delayed',
            ratings: 2,
            earnings: 3200,
        },
        {
            agentId: 'DAG042',
            name: 'Kunal Raj',
            mobileNumber: '+91 9980377925',
            deliveryTime: 'Delayed',
            ratings: 3,
            earnings: 8960,
        },
        {
            agentId: 'DAG041',
            name: 'Jolly Stephen',
            mobileNumber: '+91 9980377924',
            deliveryTime: 'On Time',
            ratings: 5,
            earnings: 14900,
        },
        {
            agentId: 'DAG040',
            name: 'Gagan Deep',
            mobileNumber: '+91 9980377923',
            deliveryTime: 'Slightly Late',
            ratings: 4,
            earnings: 11250,
        },];

    // Perform a simple filter if deliveryTimeFilter is provided:
    const filtered = deliveryTimeFilter
        ? allData.filter((r) => r.deliveryTime === deliveryTimeFilter)
        : allData;

    const start = (page - 1) * limit;
    const pageRows = filtered.slice(start, start + limit);
    const totalPages = Math.ceil(filtered.length / limit);

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { rows: pageRows, totalPages };
};

// 4. Revenue Breakdown Report
export const fetchRevenueBreakdown = async (
    category: string
): Promise<{ totalRevenue: number }> => {
    return new Promise((res) =>
        setTimeout(
            () =>
                res({
                    totalRevenue: category === 'Grocery' ? 125000 : 345567,
                }),
            300
        )
    );
};
