"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignIn from "./SignIn";
import { checkAuth, onAuthChange } from "./firebaseConfig/authService"; // Import onAuthStateChanged

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Listen for authentication state changes
    const unsubscribe = onAuthChange((user) => {
      if (!user) {
        setShowModal(true); // Show the SignIn modal if the user is not authenticated
      } else {
        setShowModal(false); // Hide the SignIn modal if the user is authenticated
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // Don't render anything on the server side
  if (!isClient) {
    return null;
  }

  // If the user is not authenticated, show the SignIn modal
  if (!checkAuth()) {
    return (
      <>
        {showModal && (
          <SignIn
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              router.push("/"); // Redirect to the home page after closing the modal
            }}
          />
        )}
      </>
    );
  }

  // If the user is authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
