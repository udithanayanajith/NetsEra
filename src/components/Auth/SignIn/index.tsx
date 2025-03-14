"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";

// Demo users (in a real app, this would be in a database)
const DEMO_USERS = [
  { email: "user1@example.com", password: "password123", name: "User 1" },
  { email: "user2@example.com", password: "password456", name: "User 2" },
];

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Find user by email
    const user = DEMO_USERS.find((u) => u.email === formData.email);

    if (!user) {
      toast.error("User does not exist. Please sign up first.");
      setLoading(false);
      return;
    }

    // Check password
    if (user.password !== formData.password) {
      toast.error("Incorrect password. Please try again.");
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
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-darkmode flex flex-col items-center justify-center px-2">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-sm p-8 rounded-3xl border border-gray-700">
        <div className="mb-8 text-center">
          <Logo />
        </div>

        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute left-0 w-full border-t border-gray-700"></div>
          <span className="relative bg-gray-800/50 px-4 text-white text-sm">
            Sign In to Access All Features
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              required
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
            <Link
              href="#"
              className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
              onClick={() => router.push("/")}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
