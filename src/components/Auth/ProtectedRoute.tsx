"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";
import SignInModal from "./SignInModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isAuthenticated()) {
      setShowModal(true);
    }
  }, []);

  // Don't render anything on the server side
  if (!isClient) {
    return null;
  }

  if (!isAuthenticated()) {
    return (
      <>
        {showModal && (
          <SignInModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              router.push("/");
            }}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
