"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";

// Demo users (in a real app, this would be in a database)
const DEMO_USERS = [
  { email: "user1@example.com", password: "password123", name: "User 1" },
  { email: "user2@example.com", password: "password456", name: "User 2" },
];

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowSignUpPrompt(false);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Find user by email
    const user = DEMO_USERS.find((u) => u.email === formData.email);

    if (!user) {
      setError("User does not exist");
      setShowSignUpPrompt(true);
      setLoading(false);
      return;
    }

    // Check password
    if (user.password !== formData.password) {
      setError("Incorrect password. Please try again.");
      setLoading(false);
      return;
    }

    // If validation passes, store user data in session storage
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        email: user.email,
        name: user.name,
        isAuthenticated: true,
      })
    );

    toast.success("Login successful");
    setLoading(false);
    onClose();
    router.refresh(); // Refresh the page to update authentication state
  };

  const handleSignUp = () => {
    onClose();
    setTimeout(() => {
      router.push("/");
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-sm p-8 rounded-3xl border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-8 text-center">
          <Logo />
        </div>

        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute left-0 w-full border-t border-gray-700"></div>
          <span className="relative bg-gray-800/50 px-4 text-white text-sm">
            Sign In to Access This Feature
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
            <p>{error}</p>
            {showSignUpPrompt && (
              <div className="mt-2 text-sm">
                <p className="text-gray-400">
                  Would you like to create an account?
                </p>
                <button
                  onClick={handleSignUp}
                  className="mt-2 text-orange-500 hover:text-orange-600 transition-colors duration-300"
                >
                  Sign Up Now
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setError(null);
                setShowSignUpPrompt(false);
              }}
              className="w-full rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setError(null);
              }}
              className="w-full rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-3 text-white font-medium hover:bg-orange-600 transition-colors duration-300"
          >
            Sign In {loading && <Loader />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Not a member yet?{" "}
            <button
              onClick={handleSignUp}
              className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
