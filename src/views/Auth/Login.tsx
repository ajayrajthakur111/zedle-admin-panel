/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import { getProfile, loginUser, loginWithGoogle } from "@/api/authService";
import loginImage from '@/assets/LoginIllustration.svg'

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);
      console.log("Logged in:", user);
      await getProfile(); // step 2
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      console.log("Google user:", user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      illustrationSrc={loginImage}
      illustrationAlt="Login Illustration"
    >
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-left text-[#B72FA9]">
          Begin a Journey
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
            required
          />

          <Input
            label="Password"
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            disabled={isLoading}
            required
          />

          <div className="flex items-center justify-between my-4">
            <Checkbox
              label="Remember Me"
              id="remember-me"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={isLoading}
            />
            {/* Future: <Link to="/forgot-password">Forgot password?</Link> */}
          </div>

          <Button
            type="submit"
            variant="primarySolid"
            isLoading={isLoading}
            className="w-full mb-3"
          >
            Log In
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full mb-4"
            onClick={() => navigate("/auth/register")}
            disabled={isLoading}
          >
            Register
          </Button>

          <div className="relative m-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-primary  font-bold">OR</span>
            </div>
          </div>
          <div>
            <Button
              type="button"
              variant="secondary"
              isLoading={isLoading}
              onClick={handleGoogleLogin}
              className="w-full text-primary "
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
