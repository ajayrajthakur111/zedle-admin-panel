import { useState, type FC } from "react";
import { changePassword } from "@/api/authService";
import Button from "../ui/Button";

// ---------------- ChangePasswordCard ----------------
interface ChangePasswordCardProps {
  onDone: () => void;
}

export const ChangePasswordCard: FC<ChangePasswordCardProps> = ({ onDone }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setIsUpdating(true);
    try {
      const { message } = await changePassword(newPass);
      console.log(message); // "Password changed (dummy)"
      onDone();
    } catch (err) {
      console.error("Change password failed", err);
      setError("Failed to change password");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="        bg'[#45103F30],
 p-5 rounded-lg max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-white/80 mb-1 text-sm"
          >
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            className="w-full bg-white/15 p-3 rounded text-sm placeholder-white/50 focus:ring-1 focus:ring-white/50 text-white"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-white/80 mb-1 text-sm"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
            className="w-full bg-white/15 p-3 rounded text-sm placeholder-white/50 focus:ring-1 focus:ring-white/50 text-white"
          />
        </div>

        {error && <p className="text-sm text-gray">{error}</p>}

        <Button
          variant="primaryHorizontalGradient"
          type="submit"
          disabled={isUpdating}
          className={`w-full text-white text-sm font-bold py-4 rounded-lg uppercase tracking-wider transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed ${
            isUpdating ? " cursor-not-allowed" : ""
          }`}
          style={{
            background: "linear-gradient(90deg, #510052 0%, #800A5C 100%)",
          }}
        >
          {isUpdating ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
};
