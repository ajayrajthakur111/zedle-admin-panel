// src/components/MyProfile/EditProfileModal.tsx
import { useState, type FC, type ChangeEvent } from "react";
import { ModalWrapper } from "./ModalWrapper";
import { Camera } from "lucide-react";
import Button from "../ui/Button";
import { useAdminStore, type AdminProfile } from "@/store/adminStore";
import { updateProfilePicture, updateProfile } from "@/api/authService";

// ---------------- EditProfileModal ----------------
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onBack,
}) => {
  const profile = useAdminStore((s) => s.profile) as AdminProfile;
  const setProfile = useAdminStore((s) => s.setProfile);

  // local address form state
  const [addressLine1, setAddressLine1] = useState(profile.currentAddress);
  const [addressLine2, setAddressLine2] = useState(
    `${profile.region}, ${profile.city} - ${profile.pin}`
  );
  const [isDefaultAddress, setIsDefaultAddress] = useState(
    profile.isDefaultAddress
  );
  const [isLoading, setIsLoading] = useState(false);

  if (isOpen && !profile) {
    return (
      <ModalWrapper
        isOpen={isOpen}
        title="Edit Profile"
        onClose={onClose}
        showBack
        onBack={onBack}
        maxW="max-w-lg"
      >
        <div className="p-6 text-center">Loading…</div>
      </ModalWrapper>
    );
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newAvatarUrl = await updateProfilePicture(file);
      console.log("Profile picture updated:", newAvatarUrl);
      setProfile({ ...profile, avatarUrl: newAvatarUrl });
    } catch (err) {
      console.error("Failed to update picture", err);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const [region, rest] = addressLine2.split(", ");
      const [city, pin] = rest.split(" - ");
      const updated = await updateProfile({
        currentAddress: addressLine1,
        region,
        city,
        pin,
        isDefaultAddress,
      });
      setProfile({ ...profile, ...updated });
      console.log("Profile updated:", updated);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      title="Edit Profile"
      onClose={onClose}
      showBack
      onBack={onBack}
      maxW="max-w-lg"
    >
      <div className="px-6 pb-6 h-[520px]">
        <div className="flex gap-4">
          {/* Readonly fields */}
          <div className="flex-1 space-y-2">
            {(
              [
                { label: "Full Name", value: profile.name },
                { label: "Contact No.", value: profile.phoneNumber },
                { label: "Email", value: profile.email },
                { label: "User ID", value: profile.empId },
                { label: "Joining Date", value: profile.joiningDate },
                {
                  label: "Preferred Language",
                  value: profile.preferredLanguage,
                },
              ] as const
            ).map(({ label, value }, idx) => (
              <div key={idx} className="relative">
                <label className="absolute -top-2 right-3 bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] text-primary-foreground hover:from-[var(--gradient-purple-hover-start)] hover:to-[var(--gradient-purple-hover-end)]  px-2 py-0.5 text-sm text-white rounded z-10">
                  {label}
                </label>
                <Button
                  variant="secondary"
                  className="w-full bg-white text-primary text-left py-2 justify-start"
                  disabled
                >
                  {value}
                </Button>
              </div>
            ))}
          </div>

          {/* Avatar upload */}
          <div className="flex flex-col items-center mt-10">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-2 border-white/40 overflow-hidden bg-gray-300">
                <img
                  src={
                    profile.avatarUrl ||
                    "https://dummyimage.com/600x400/000/fff&text=any+dummytText"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={28} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs rounded-full border border-white/30 text-white">
                Profile
              </span>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-[#8e1380] p-4 rounded-lg shadow-inner h-40 mt-4 space-y-2">
          <h3 className="text-white font-medium text-sm">Current Address</h3>
          <input
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-3/4 bg-white text-primary p-1.5 rounded focus:outline-none focus:ring-2 text-sm"
            placeholder="Address Line 1"
          />
          <input
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            className="w-3/4 bg-white text-primary p-1.5 rounded focus:outline-none focus:ring-2 text-sm"
            placeholder="Region, City - PIN"
          />
          <div className="flex items-center gap-2">
            <input
              id="defaultAddress"
              type="checkbox"
              checked={isDefaultAddress}
              onChange={(e) => setIsDefaultAddress(e.target.checked)}
              className="w-4 h-4 text-purple-400 bg-white/10 border-white/30 rounded focus:ring-purple-400 focus:ring-2"
            />
            <label
              htmlFor="defaultAddress"
              className="text-white text-sm cursor-pointer"
            >
              Default Address
            </label>
          </div>
          <Button
            onClick={handleUpdate}
            disabled={isLoading}
            className="mt-6 w-40 ml-24 text-white py-2 rounded font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};
