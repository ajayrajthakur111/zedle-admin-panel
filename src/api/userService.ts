// src/api/userService.ts

export interface User {
    userId: string;               // e.g. "USR083"
    name: string;                 // e.g. "Joseph Steph"
    email: string;                // e.g. "example1@gmail.com"
    mobileNumber: string;         // e.g. "+91 9989278372"
    joiningDate: string;          // ISO date, e.g. "2024-10-09"
    preferredLanguage: string;    // e.g. "English"
    userImage: string;            // URL to avatar
    currentAddress: string;       // e.g. "#13/5 House, Near Street, Region, City - PIN"
    isDefaultAddress: boolean;    // true if this is default
    isBlocked: boolean;           // true if user is currently blocked
    policyViolated: boolean
}

export interface GetAllUsersParams {
    page: number;
    limit: number;
    search?: string;
    blockedOnly?: boolean; // if true, return only blocked users; if false or undefined, return only active users
}

export interface PaginatedResult<T> {
    rows: T[];
    totalCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Replace with real API calls when ready)
// ─────────────────────────────────────────────────────────────────────────────
const _allUsers: User[] = [
    {
        userId: "USR083",
        name: "Joseph Steph",
        email: "example1@gmail.com",
        mobileNumber: "+91 9989278372",
        joiningDate: "2024-10-09",
        preferredLanguage: "English",
        userImage: "https://randomuser.me/api/portraits/men/32.jpg",
        currentAddress: "#13/5 House, Near Street Name, Region, City - PIN",
        isDefaultAddress: true,
        isBlocked: false,
        policyViolated: false
    },
    {
        userId: "USR466",
        name: "Michael John",
        email: "example12@gmail.com",
        mobileNumber: "+91 6389278212",
        joiningDate: "2024-08-15",
        preferredLanguage: "Hindi",
        userImage: "https://randomuser.me/api/portraits/men/44.jpg",
        currentAddress: "#22/8 Lane, Some Area, Some City - PIN",
        isDefaultAddress: false,
        isBlocked: false,
        policyViolated: true
    },
    {
        userId: "USR741",
        name: "Sunny John",
        email: "example31@gmail.com",
        mobileNumber: "+91 8889278372",
        joiningDate: "2024-06-20",
        preferredLanguage: "English",
        userImage: "https://randomuser.me/api/portraits/men/56.jpg",
        currentAddress: "#5/10 Colony, Another Region, City - PIN",
        isDefaultAddress: false,
        isBlocked: true,
        policyViolated: true

    },
    {
        userId: "USR423",
        name: "Stephen",
        email: "example74@gmail.com",
        mobileNumber: "+91 9685922782",
        joiningDate: "2024-03-01",
        preferredLanguage: "Hindi",
        userImage: "https://randomuser.me/api/portraits/men/72.jpg",
        currentAddress: "#19/4 Street, Region, City - PIN",
        isDefaultAddress: false,
        isBlocked: false,
        policyViolated: false
    },
    {
        userId: "USR580",
        name: "James",
        email: "example7@gmail.com",
        mobileNumber: "+91 9874927832",
        joiningDate: "2023-12-11",
        preferredLanguage: "English",
        userImage: "https://randomuser.me/api/portraits/men/85.jpg",
        currentAddress: "#7/3 Avenue, Region, City - PIN",
        isDefaultAddress: false,
        isBlocked: false,
        policyViolated: false
    },
    {
        userId: "USR783",
        name: "Edward",
        email: "example96@gmail.com",
        mobileNumber: "+1 6689278172",
        joiningDate: "2023-11-02",
        preferredLanguage: "French",
        userImage: "https://randomuser.me/api/portraits/men/90.jpg",
        currentAddress: "#45/6 Road, Region, City - PIN",
        isDefaultAddress: false,
        isBlocked: false,
        policyViolated: false
    },
    {
        userId: "USR703",
        name: "Mathew",
        email: "example45@gmail.com",
        mobileNumber: "+91 9989278372",
        joiningDate: "2022-05-22",
        preferredLanguage: "English",
        userImage: "https://randomuser.me/api/portraits/men/99.jpg",
        currentAddress: "#13/5 House, Near Street Name, Region, City - PIN",
        isDefaultAddress: true,
        isBlocked: true,
        policyViolated: true
    },
    // …add more mock users as needed…
];
// src/api/userService.ts


export interface GetAllUsersParams {
    page: number;
    limit: number;
    search?: string;
    blockedOnly?: boolean;
}

export interface PaginatedResult<T> {
    rows: T[];
    totalCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA (Replace with real API calls)
// ─────────────────────────────────────────────────────────────────────────────
// const _allUsers: User[] = [
//   {
//     _id: "1",
//     userId: "USR083",
//     name: "Joseph Steph",
//     email: "example1@gmail.com",
//     mobileNumber: "+91 9989278372",
//     joiningDate: "2024-10-09T00:00:00.000Z",
//     preferredLanguage: "English",
//     userImage: "https://randomuser.me/api/portraits/men/32.jpg",
//     currentAddress: {
//       line1: "#13/5 House, Near Street Name,",
//       line2: "Region, City – PIN",
//     },
//     isDefaultAddress: true,
//     isBlocked: false,
//     policyViolated: false,
//   },
//   {
//     _id: "2",
//     userId: "USR466",
//     name: "Michael John",
//     email: "example12@gmail.com",
//     mobileNumber: "+91 6389278212",
//     joiningDate: "2024-08-15T00:00:00.000Z",
//     preferredLanguage: "Hindi",
//     userImage: "https://randomuser.me/api/portraits/men/44.jpg",
//     currentAddress: {
//       line1: "#22/8 Lane, Some Area,",
//       line2: "Some City – PIN",
//     },
//     isDefaultAddress: false,
//     isBlocked: false,
//     policyViolated: false,
//   },
//   {
//     _id: "3",
//     userId: "USR703",
//     name: "Mathew",
//     email: "example45@gmail.com",
//     mobileNumber: "+91 9989278372",
//     joiningDate: "2022-05-22T00:00:00.000Z",
//     preferredLanguage: "English",
//     userImage: "https://randomuser.me/api/portraits/men/99.jpg",
//     currentAddress: {
//       line1: "#13/5 House, Near Street Name,",
//       line2: "Region, City – PIN",
//     },
//     isDefaultAddress: true,
//     isBlocked: true,
//     policyViolated: true, // <-- this user violated policy
//   },
//   // …add more mock users as needed…
// ];

// simulate network latency
const _sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Fetches a paginated list of users. 
 * If `blockedOnly` is true, returns only users with `isBlocked === true`.
 * If `blockedOnly` is false or undefined, returns only users with `isBlocked === false`.
 * The `search` parameter filters on userId, name, or email.
 */
export async function getAllUsers(
    params: GetAllUsersParams
): Promise<PaginatedResult<User>> {
    const { page, limit, search, blockedOnly } = params;
    let filtered = [..._allUsers];

    // 1) Filter by blockedOnly
    filtered = filtered.filter((u) =>
        blockedOnly === true ? u.isBlocked === true : u.isBlocked === false
    );

    // 2) If search is provided, filter on userId/name/email
    if (search) {
        const lower = search.toLowerCase();
        filtered = filtered.filter(
            (u) =>
                u.userId.toLowerCase().includes(lower) ||
                u.name.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower)
        );
    }

    // 3) Paginate
    const startIndex = (page - 1) * limit;
    const rows = filtered.slice(startIndex, startIndex + limit);
    const totalCount = filtered.length;

    await _sleep(300);
    return { rows, totalCount };
}

/**
 * Fetch a single user by ID, or throw if not found.
 */
export async function getUserById(userId: string): Promise<User> {
    await _sleep(200);
    const found = _allUsers.find((u) => u.userId === userId);
    if (!found) {
        throw new Error(`User with ID ${userId} not found.`);
    }
    return found;
}

/**
 * Block a user (set isBlocked=true). Returns the updated user.
 */
export async function blockUser(userId: string): Promise<User> {
    await _sleep(200);
    const idx = _allUsers.findIndex((u) => u.userId === userId);
    if (idx === -1) {
        throw new Error(`User ${userId} not found.`);
    }
    _allUsers[idx].isBlocked = true;
    return _allUsers[idx];
}

/**
 * Unblock a user (set isBlocked=false). Returns the updated user.
 */
export async function unblockUser(userId: string): Promise<User> {
    await _sleep(200);
    const idx = _allUsers.findIndex((u) => u.userId === userId);
    if (idx === -1) {
        throw new Error(`User ${userId} not found.`);
    }
    _allUsers[idx].isBlocked = false;
    return _allUsers[idx];
}

/**
 * Delete a user permanently. Returns nothing.
 */
export async function deleteUser(userId: string): Promise<void> {
    await _sleep(200);
    const idx = _allUsers.findIndex((u) => u.userId === userId);
    if (idx === -1) {
        throw new Error(`User ${userId} not found.`);
    }
    _allUsers.splice(idx, 1);
}
