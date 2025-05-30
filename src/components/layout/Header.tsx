// src/components/Layout/Header.tsx
import React, { useEffect, useState } from "react"
import { Menu, Bell, User } from "lucide-react"
import { fetchNotifications, getProfile } from "@/api/authService"
import { useAdminStore } from "@/store/adminStore"
import NotificationModal from "../Notifications/NotificationModal"
import { MyProfileModal } from "../AdminProfile/MyProfileModal"
import { EditProfileModal } from "../AdminProfile/EditProfileModal"
import { LogoutConfirmModal } from "../AdminProfile/LogoutConfirmModal"
import { OtpVerificationModal } from "../AdminProfile/OtpVerificationModal"
import { ChangePasswordCard } from "../AdminProfile/ChangePasswordCard"
import { ModalWrapper } from "../AdminProfile/ModalWrapper"

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const [notifOpen, setNotifOpen] = useState(false)
  const [modal, setModal] = useState<"profile" | "edit" | "logout" | "otp" | "changePass" | null>(null)
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)

  const profile = useAdminStore((s) => s.profile)
  const phone = profile?.phoneNumber ?? ""

  // on mount: load profile
  useEffect(() => {
    getProfile()
  }, [])

  const handleBell = async () => {
    if (!notifOpen) {
      setLoading(true)
      try {
        const data = await fetchNotifications()
        setCount((data as { newComplaints: number }).newComplaints)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    setNotifOpen(!notifOpen)
  }

  const handleView = () => {
    console.log("→ /dashboard/complaints")
    setNotifOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] h-16 flex items-center justify-between px-4 shadow-lg">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-white hover:bg-white/10 transition"
        >
          <Menu size={20} color="white" />
        </button>

        <div className="text-lg font-semibold text-white">Zedle Logo</div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleBell}
            className="relative p-2 text-white rounded-lg hover:bg-white/10 transition"
          >
            <Bell size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          <div className="group flex flex-col items-center w-fit text-white relative">
            <button
              onClick={() => setModal("profile")}
              className="p-2 rounded-full transition-transform duration-200 group-hover:-translate-y-1.5 hover:py-0.5"
            >
              <User size={24} />
            </button>
            <span className="absolute top-full text-sm opacity-0 scale-90 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100">
              Profile
            </span>
          </div>
        </div>
      </header>

      <NotificationModal
        isOpen={notifOpen}
        loading={loading}
        count={count}
        onClose={() => setNotifOpen(false)}
        onView={handleView}
      />

      <MyProfileModal
        isOpen={modal === "profile"}
        onClose={() => setModal(null)}
        onEditAddress={() => setModal("edit")}
        onLogout={() => setModal("logout")}
        onGetOtp={() => setModal("otp")}
      />

      <EditProfileModal
        isOpen={modal === "edit"}
        onClose={() => setModal(null)}
        onBack={() => setModal("profile")}
      />

      <LogoutConfirmModal
        isOpen={modal === "logout"}
        onClose={() => setModal(null)}
        onConfirm={() => {
          /* logout logic */
          setModal(null)
        }}
      />

      <OtpVerificationModal
        isOpen={modal === "otp"}
        phone={phone}
        onClose={() => setModal(null)}
        onBack={() => setModal("profile")}
        onVerified={() => setModal("changePass")}
      />

      {modal === "changePass" && (
        <ModalWrapper
          isOpen
          title=""
          onClose={() => setModal(null)}
          maxW="max-w-md"
        >
          <ChangePasswordCard
            onDone={() => {
              console.log("Password changed successfully")
              setModal(null)
            }}
          />
        </ModalWrapper>
      )}
    </>
  )
}

export default Header
