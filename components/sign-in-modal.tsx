"use client";

import { SetStateAction, useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AuthModal() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("signin"); // "signin" or "signup"

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setError("");
    setSuccess("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleTabChange = (tab: SetStateAction<string>) => {
    setActiveTab(tab);
    resetForm();
  };

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }

    if (activeTab === "signup") {
      if (!firstName || !lastName) {
        setError("First name and last name are required");
        return false;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        return false;
      }
    }

    return true;
  };

  const handleEmailLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Sign in failed");
      } else {
        setSuccess("Successfully signed in!");
        setTimeout(() => {
          setIsOpen(false);
          resetForm();
          // You might want to redirect or refresh the page here
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
      });

      if (result.error) {
        setError(result.error.message || "Sign up failed");
      } else {
        setSuccess("Account created successfully!");
        setTimeout(() => {
          setIsOpen(false);
          resetForm();
          // You might want to redirect or refresh the page here
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleAuth = async () => {
  //   try {
  //     await signIn.social({
  //       provider: "google",
  //       callbackURL: "/dashboard", // Redirect after successful login
  //     })
  //   } catch (err) {
  //     setError("Google authentication failed")
  //     console.error("Google auth error:", err)
  //   }
  // }

  return (
    <div className="flex items-center justify-center ">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="hover:cursor-pointer">
            Login
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gray-100 border-0 p-0">
          <div className="flex flex-col items-center px-8 py-6 space-y-6">
            {/* Social Login */}
            {/* <div className="flex space-x-4 w-full">
              <Button
                onClick={handleGoogleAuth}
                variant="outline"
                className="flex-1 h-12 bg-white border-gray-300 hover:bg-gray-50 rounded-none"
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="flex-1 h-12" disabled>
                Facebook
              </Button>
            </div> */}

            {/* Success Message */}
            {success && (
              <div className="w-full p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="w-full p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Sign In Form */}
            {activeTab === "signin" && (
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="signin-email"
                    className="text-sm font-medium text-black"
                  >
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="joe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white border-gray-300 placeholder:text-gray-400 rounded-none"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signin-password"
                    className="text-sm font-medium text-black"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-white border-gray-300 placeholder:text-gray-400 pr-10 rounded-none"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rounded-none"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleEmailLogin}
                  className="w-full h-12 bg-black text-white hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            )}

            {/* Sign Up Form */}
            {activeTab === "signup" && (
              <div className="w-full space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-black"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 bg-white border-gray-300 placeholder:text-gray-400 rounded-none"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-black"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 bg-white border-gray-300 placeholder:text-gray-400 rounded-none"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signup-email"
                    className="text-sm font-medium text-black"
                  >
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="joe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white border-gray-300 placeholder:text-gray-400 rounded-none"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signup-password"
                    className="text-sm font-medium text-black"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password (min 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-white border-gray-300 placeholder:text-gray-400 pr-10 rounded-none"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rounded-none"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirm-password"
                    className="text-sm font-medium text-black"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 bg-white border-gray-300 placeholder:text-gray-400 pr-10 rounded-none"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rounded-none"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleEmailSignup}
                  className="w-full h-12 bg-black text-white hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            )}

            <p className="text-sm text-gray-600">
              {activeTab === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => handleTabChange("signup")}
                    className="text-black font-medium underline"
                    disabled={loading}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => handleTabChange("signin")}
                    className="text-black font-medium underline"
                    disabled={loading}
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
