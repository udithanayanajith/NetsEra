// SignIn.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";
import { signIn } from "../firebaseConfig/authService";

interface SignInModalProps {
  isOpen: boolean; // Add isOpen to the props interface
  onClose: () => void;
}

function SignIn({ isOpen, onClose }: SignInModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(formData.email, formData.password);
      toast.success("Login successful!");
      onClose(); // Close the modal
      router.refresh(); // Refresh the page to update the UI
    } catch (error: any) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="modal-container w-full max-w-md bg-gray-800/60 backdrop-blur-sm p-8 rounded-3xl border border-gray-700 relative">
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
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-3 text-white font-medium hover:bg-orange-600 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? <Loader /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
