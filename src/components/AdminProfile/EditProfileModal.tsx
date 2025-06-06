// src/components/MyProfile/EditProfileModal.tsx
import { useState, type FC, type ChangeEvent } from "react";
import { ModalWrapper } from "./ModalWrapper";
import cameraIcon from "@/assets/profile/camera_icon.svg";
import Button from "../ui/Button";
import { useAdminStore, type AdminProfile } from "@/store/adminStore";
import { updateProfilePicture, updateProfile } from "@/api/authService";
import Input from "../ui/Input";

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
    >
      <div
        className="px-6 py-3 pb-6 h-[520px]"
        style={{
          maxWidth: "780px", // Adjust as needed for your layout, or remove if full-width
          margin: "auto", // For centering if max-width is set
          height: "560px",
        }}
      >
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 md:gap-y-0">
          {/* Fields Column */}
          <div className="flex flex-col gap-4 order-1 md:order-none">
            {" "}
            {/* Takes up remaining space */}
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
                <label className="absolute -top-2 right-3 bg-gradient-to-r from-[#711467] to-[#D725C5] px-2 py-0.5 text-xs text-white rounded z-10">
                  {label}
                </label>
                <Button
                  variant="secondary"
                  className="w-[300px] rounded text-primary text-sm text-left py-2 justify-start"
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
              <div className="w-36 h-36 rounded-full border-2 border-white/40 overflow-hidden bg-gray-300">
                <img
                  src={
                    profile.avatarUrl ||
                    "https://dummyimage.com/600x400/000/fff&text=any+dummytText"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={cameraIcon} alt="camera icon" />{" "}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <span className="absolute top-19.5 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-bold text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Profile
              </span>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-[#45103F30] p-4 rounded-lg shadow-inner h-40 mt-4 space-y-2 ">
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
            <Input
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
            className="mt-5 w-80 ml-18   text-white py-2 rounded-lg font-semibold"
            style={{
              background: "linear-gradient(90deg, #510052 0%, #800A5C 100%)",
            }}
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
