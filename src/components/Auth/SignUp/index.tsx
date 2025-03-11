"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import { useState } from "react";
import Loader from "@/components/Common/Loader";

// Demo users (in a real app, this would be in a database)
const DEMO_USERS = [
  { email: "user1@example.com", password: "password123", name: "User 1" },
  { email: "user2@example.com", password: "password456", name: "User 2" },
];

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Check if user already exists
    const existingUser = DEMO_USERS.find((u) => u.email === formData.email);
    if (existingUser) {
      toast.error(
        "User with this email already exists. Please sign in instead."
      );
      setLoading(false);
      return;
    }

    try {
      // If validation passes, store user data in session storage
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          isAuthenticated: true,
        })
      );

      // In a real app, we would also add the user to the database here
      DEMO_USERS.push({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      toast.success("Successfully registered");

      // Small delay to show the success message
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Refresh and redirect to the previous page or home
      router.refresh();
      router.back();
    } catch (error) {
      toast.error("Registration failed. Please try again.");
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
          >
            Sign Up {loading && <Loader />}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-400 text-sm">
            By creating an account you agree to our{" "}
            <Link
              href="/privacy"
              className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </p>
          <p className="text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => router.back()}
              className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
