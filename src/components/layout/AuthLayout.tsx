// src/components/layout/AuthLayout.tsx
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustrationSrc?: string;
  illustrationAlt?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  illustrationSrc,
  illustrationAlt = "Auth Illustration",
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-sm w-full">{children}</div>
      </div>

      {/* Right side: illustration (hidden on small screens) */}
      {illustrationSrc && (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center">
          <img
            src={illustrationSrc}
            alt={illustrationAlt}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
