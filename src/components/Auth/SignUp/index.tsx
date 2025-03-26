"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";
import { signUp } from "../firebaseConfig/authService";
interface SignUpModalProps {
  isOpen: boolean; // Add isOpen to the props interface
  onClose: () => void;
}
const SignUp = ({ isOpen, onClose }: SignUpModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Password validation
    if (formData.password.length < 7) {
      setError("Password must be at least 7 characters long.");
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.name);
      toast.success("Successfully registered!");
      onClose(); // Close the modal
      router.refresh(); // Refresh the page to update the UI
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("User with this email already exists.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkmode flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700">
        <div className="mb-8 text-center">
          <Logo />
        </div>

        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute left-0 w-full border-t border-gray-700"></div>
          <span className="relative bg-gray-800/50 px-4 text-white text-sm">
            Create Your Account
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
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
            />
          </div>
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
            {loading ? <Loader /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
