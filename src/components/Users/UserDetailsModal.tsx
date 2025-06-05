/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Users/UserDetailsModal.tsx

import React, { useState, useEffect, type ChangeEvent } from "react";
import { X, Pencil, MapPin,  } from "lucide-react";
import { getUserById, type User } from "@/api/userService";

interface EditableUserData {
  name: string;
  mobileNumber: string;
  email: string;
  joiningDate: string;
  preferredLanguage: string;
  addressLine1: string;
  addressLine2: string;
}

interface UserDetailsModalProps {
  userId: string;
  onClose: () => void;
}

const InfoFieldDisplay: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="bg-[#a32aa3] rounded-md px-4 py-2.5 text-sm text-white text-left min-h-[38px] flex items-center">
    {children}
  </div>
);

const EditField: React.FC<{
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  name: string;
  isTextArea?: boolean;
}> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  name,
  isTextArea = false,
}) => {
  const commonProps = {
    name,
    value,
    onChange,
    placeholder,
    className:
      "w-full bg-transparent text-white text-sm placeholder-white/60 focus:outline-none",
  };
  return (
    <div className="bg-[#a32aa3] rounded-md px-4 py-2.5 min-h-[38px] flex items-center">
      {isTextArea ? (
        <textarea
          {...commonProps}
          rows={1}
          style={{ resize: "none", overflowY: "hidden" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
};

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  userId,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Toggle between view vs. edit mode
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Editable fields
  const [editableData, setEditableData] = useState<EditableUserData>({
    name: "",
    mobileNumber: "",
    email: "",
    joiningDate: "",
    preferredLanguage: "",
    addressLine1: "",
    addressLine2: "",
  });

  // Format ISO date to "DD-MM-YYYY" for display
  const formatDateForDisplay = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // If you had an actual save API, you would call it here.
  // For now, we just close edit mode and leave the mock data alone.
  const handleSaveChanges = () => {
    // In a real app, send `editableData` to backend, await the result,
    // then re-fetch `getUserById(userId)` to refresh `user`.
    // For this mock, just close edit mode:
    setIsEditMode(false);
  };

  // Load user
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const u = await getUserById(userId);
        setUser(u);
        // Pre‐populate editableData
        setEditableData({
          name: u.name,
          mobileNumber: u.mobileNumber,
          email: u.email,
          joiningDate: formatDateForDisplay(u.joiningDate),
          preferredLanguage: u.preferredLanguage,
          addressLine1: u.currentAddress,
          addressLine2: u.currentAddress,
        });
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Update edit fields if `user` changes (or if toggling modes)
  useEffect(() => {
    if (user) {
      setEditableData({
        name: user.name,
        mobileNumber: user.mobileNumber,
        email: user.email,
        joiningDate: formatDateForDisplay(user.joiningDate),
        preferredLanguage: user.preferredLanguage,
        addressLine1: user.currentAddress,
        addressLine2: user.currentAddress,
      });
    }
  }, [user, isEditMode]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 font-sans">
      <div className="bg-gradient-to-br from-[#D100D1] to-[#8A008A] w-full max-w-[380px] rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="flex justify-center items-center pt-5 pb-4 px-5 relative">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? "Edit Details" : "User Details"}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-opacity"
            aria-label="Close modal"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-3.5 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-[#a32aa3]/80 scrollbar-track-transparent">
          {loading ? (
            <div className="flex items-center justify-center text-white py-20 h-full">
              Loading...
            </div>
          ) : error ? (
            <p className="text-center text-red-300 py-20 h-full">{error}</p>
          ) : !user ? (
            <p className="text-center text-gray-300 py-20 h-full">
              User not found.
            </p>
          ) : (
            <>
              <div className="flex justify-between items-start space-x-3 relative">
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="absolute top-2 -right-4 -translate-y-1/2 text-white hover:text-gray-200 transition-opacity"
                    aria-label="Edit details"
                  >
                    <Pencil size={16} strokeWidth={2} />
                  </button>
                )}

                <div className="space-y-2 w-[calc(100%-108px)] shrink-0">
                  {isEditMode ? (
                    <>
                      <EditField
                        name="name"
                        value={editableData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                      />
                      <EditField
                        name="mobileNumber"
                        value={editableData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="Mobile Number"
                        type="tel"
                      />
                      <EditField
                        name="email"
                        value={editableData.email}
                        onChange={handleInputChange}
                        placeholder="Email ID"
                        type="email"
                      />
                      <EditField
                        name="joiningDate"
                        value={editableData.joiningDate}
                        onChange={handleInputChange}
                        placeholder="Joining Date (DD-MM-YYYY)"
                      />
                      <EditField
                        name="preferredLanguage"
                        value={editableData.preferredLanguage}
                        onChange={handleInputChange}
                        placeholder="Preferred Language"
                      />
                    </>
                  ) : (
                    <>
                      <InfoFieldDisplay>
                        Name: {user.name}
                      </InfoFieldDisplay>
                      <InfoFieldDisplay>
                        Mobile Number: {user.mobileNumber}
                      </InfoFieldDisplay>
                      <InfoFieldDisplay>
                        Email ID: {user.email}
                      </InfoFieldDisplay>
                      <InfoFieldDisplay>
                        Joining Date: {formatDateForDisplay(
                          user.joiningDate
                        )}
                      </InfoFieldDisplay>
                      <InfoFieldDisplay>
                        Preferred Language: {user.preferredLanguage}
                      </InfoFieldDisplay>
                    </>
                  )}
                </div>

                <div className="flex flex-col items-center w-[96px] shrink-0 pt-0.5">
                  <img
                    src={user.userImage}
                    alt={user.name}
                    className="w-[90px] h-[90px] object-cover rounded-full border-[3px] border-white/60"
                  />
                  <span className="mt-2.5 text-[10px] text-white/80 tracking-wide">
                    User ID
                  </span>
                  <div className="mt-[3px] px-4 py-[3px] bg-[#7b1b7b] text-white text-[11px] font-semibold rounded-md">
                    {user.userId}
                  </div>
                </div>
              </div>

              <div className="bg-[#7b1b7b] rounded-xl p-4 mt-1">
                <h4 className="font-semibold text-[15px] text-white mb-2 ml-0.5">
                  Current Address
                </h4>
                {isEditMode ? (
                  <div className="space-y-2">
                    <EditField
                      name="addressLine1"
                      value={editableData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="House, Street Name"
                      isTextArea
                    />
                    <EditField
                      name="addressLine2"
                      value={editableData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Region, City - PIN"
                      isTextArea
                    />
                  </div>
                ) : (
                  <>
                    <div className="bg-[#a32aa3] rounded-md px-3.5 py-2.5 text-[13px] text-white leading-snug">
                      <p>{user.currentAddress}</p>
                      {/* <p>{user.currentAddress.line2}</p> */}
                    </div>
                    {user.isDefaultAddress && (
                      <div className="flex items-center text-xs text-white mt-2.5 ml-0.5">
                        <MapPin size={16} className="text-green-400 mr-1.5" />
                        <span className="font-normal">Default Address</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {isEditMode && (
                <div className="flex justify-center pt-3">
                  <button
                    onClick={handleSaveChanges}
                    className="bg-white text-[#8A008A] font-semibold px-8 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
