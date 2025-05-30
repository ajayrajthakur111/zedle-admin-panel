// src/store/adminStore.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface AdminProfile {
    id: string
    name: string
    email: string
    phoneNumber: string
    empId: string
    joiningDate: string
    preferredLanguage: string
    currentAddress: string
    isDefaultAddress: boolean
    region: string
    city: string
    pin: string
    avatarUrl: string
}

interface AdminStore {
    token: string | null
    profile: AdminProfile | null
    setProfile: (profile: AdminProfile) => void
    clearAdmin: () => void
}

export const useAdminStore = create<AdminStore>()(
    persist(
        (set) => ({
            token: null,
            profile: null,
            setProfile: (profile) => set({ profile }),
            clearAdmin: () => set({ token: null, profile: null }),
        }),
        {
            name: 'admin-storage',       // key in localStorage
            storage: createJSONStorage(() => localStorage),
            // optionally you can whitelist just the keys you want to persist:
            // partialize: (state) => ({ token: state.token, profile: state.profile })
        }
    )
)
