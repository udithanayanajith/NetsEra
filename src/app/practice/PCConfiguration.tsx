"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PCConfiguration() {
  const [isOpen, setIsOpen] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateIP = (ip: string): boolean => {
    // Basic IP address validation
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) {
      setError("IP address must be in format: xxx.xxx.xxx.xxx");
      return false;
    }

    const octets = ip.split(".");
    for (let octet of octets) {
      const num = parseInt(octet);
      if (num < 0 || num > 255) {
        setError("Each number must be between 0 and 255");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateIP(ipAddress)) {
      // IP is valid, you can proceed with configuration
      setIsOpen(false);
      // Add success message or further processing here
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="cursor-pointer hover:opacity-80 transition-opacity text-white"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src="/images/component/pc-icon.png"
          alt="PC Configuration"
          width={400}
          height={100}
          className="invert" // Invert the PC icon to make it white
        />
        <p className="text-center mt-2 text-lg">Click to configure PC</p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black border border-orange-500">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">
              Configure PC IP Address
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the IP address for this PC in the format: xxx.xxx.xxx.xxx
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="192.168.1.1"
              value={ipAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setIpAddress(e.target.value);
                setError(null);
              }}
              className="bg-gray-900 text-white border-orange-500 focus:border-orange-600"
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300"
            >
              Configure
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
