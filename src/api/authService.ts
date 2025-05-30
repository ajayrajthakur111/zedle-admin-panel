// src/api/authService.ts
import axios, { AxiosError } from "axios";

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        // …any other fields your backend returns
    };
}

export interface RegisterPayload {
    email: string;
    password: string;
}

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Auto‐attach token if present
API.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function extractMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>;
        return axiosErr.response?.data?.message || axiosErr.message;
    }
    return (err as Error).message;
}

import { useAdminStore, type AdminProfile, } from '@/store/adminStore'
import setCookie from "@/utils/setCookie";
import getCookie from "@/utils/getCookie";

/**
 * 1) “login” → returns only a token
 * 2) “getProfile” → returns full admin data
 * 
 * Replace these sim mocks with real Axios calls later.
 */
export async function loginUser(email: string, password: string): Promise<string> {
    // simulate network latency
    await new Promise(res => setTimeout(res, 500))
    console.log(email, password)
    const dummyToken = 'dummy-token-xyz'
    setCookie('token', dummyToken)
    return dummyToken
}

export async function getProfile(): Promise<AdminProfile> {
    const token = getCookie('token')
    if (!token) throw new Error('No auth token present')

    // simulate network latency
    await new Promise(res => setTimeout(res, 500))

    const dummyProfile: AdminProfile = {
        id: '1',
        name: 'Alice Admin',
        email: 'alice.admin@example.com',
        phoneNumber: '+91-9876543210',
        empId: 'EMP-101',
        joiningDate: '2023-08-15',
        preferredLanguage: 'en',
        currentAddress: '123 MG Road, Bengaluru',
        isDefaultAddress: true,
        region: 'Karnataka',
        city: 'Bengaluru',
        pin: '560001',
        avatarUrl: "https://dummyimage.com/600x400/000/fff&text=Dogo"
    }

    useAdminStore.getState().setProfile(dummyProfile)
    return dummyProfile
}




export async function updateProfile(
    updates: Partial<
        Pick<
            AdminProfile,
            'currentAddress' | 'region' | 'city' | 'pin' | 'isDefaultAddress'
        >
    >
): Promise<Partial<AdminProfile>> {
    // in real: return (await api.put('/auth/profile', updates)).data
    console.log('Dummy updateProfile payload:', updates)
    return updates
}


export async function updateProfilePicture(file: File): Promise<string> {
    // in real: 
    // const form = new FormData()
    // form.append('avatar', file)
    // return (await api.post('/auth/profile/avatar', form)).data.url
    console.log('Dummy updateProfilePicture file:', file.name)
    return 'https://dummyimage.com/600x400/000/fff&text=new+avatar'
}
export function logout() {
    useAdminStore.getState().clearAdmin()
}



export async function sendOtp(
    phoneNumber: string
): Promise<{ success: true; message: string }> {
    // real: await api.post('/auth/otp', { phoneNumber });
    await new Promise((res) => setTimeout(res, 300))
    console.log('Dummy sendOtp called for:', phoneNumber)
    return {
        success: true,
        message: `OTP sent to ${phoneNumber} 454145`,
    }
}

export async function verifyOtp(
    otp: string
): Promise<{ success: true; message: string }> {
    await new Promise((res) => setTimeout(res, 300))
    console.log('Dummy verifyOtp called with:', otp)
    return {
        success: true,
        message: 'OTP verified (dummy)',
    }
}


export async function changePassword(
  newPassword: string
): Promise<{ success: true; message: string }> {
  await new Promise((res) => setTimeout(res, 300))
  console.log('Dummy changePassword called with:', newPassword)
  return {
    success: true,
    message: 'Password changed (dummy)',
  }
}



// GOOGLE LOGIN (redirect or popup flow)
export async function loginWithGoogle(): Promise<AuthResponse> {
    try {
        const { data } = await API.get<AuthResponse>("/auth/google");
        localStorage.setItem("token", data.token);
        return data;
    } catch (err) {
        throw new Error(extractMessage(err));
    }
}

// REGISTER
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
    try {
        const { data } = await API.post<AuthResponse>("/auth/register", payload);
        localStorage.setItem("token", data.token);
        return data;
    } catch (err) {
        throw new Error(extractMessage(err));
    }
}

// GOOGLE REGISTER (if your backend handles it separately)
export async function registerWithGoogle(): Promise<AuthResponse> {
    // likely same endpoint as loginWithGoogle
    return loginWithGoogle();
}



export const fetchNotifications = async () => {
    const res = { newComplaints: 3 }
    return res
}