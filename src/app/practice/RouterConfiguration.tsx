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

export default function RouterConfiguration() {
  const [isOpen, setIsOpen] = useState(false);
  const [routerConfig, setRouterConfig] = useState({
    ipAddress: "",
    subnetMask: "",
    gateway: "",
  });
  const [error, setError] = useState<string | null>(null);

  const validateIP = (ip: string): boolean => {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) {
      return false;
    }

    const octets = ip.split(".");
    for (let octet of octets) {
      const num = parseInt(octet);
      if (num < 0 || num > 255) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateIP(routerConfig.ipAddress)) {
      setError("Invalid IP address format");
      return;
    }
    if (!validateIP(routerConfig.subnetMask)) {
      setError("Invalid subnet mask format");
      return;
    }
    if (!validateIP(routerConfig.gateway)) {
      setError("Invalid gateway format");
      return;
    }

    setError(null);
    setIsOpen(false);
    // Add success message or further processing here
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="cursor-pointer hover:opacity-80 transition-opacity text-white"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src="/images/component/router-icon.png"
          alt="Router Configuration"
          width={400}
          height={100}
          className="invert"
        />
        <p className="text-center mt-2 text-lg">Click to configure Router</p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black border border-orange-500">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">
              Configure Router
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the router configuration details
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="IP Address (e.g., 192.168.1.1)"
              value={routerConfig.ipAddress}
              onChange={(e) =>
                setRouterConfig({ ...routerConfig, ipAddress: e.target.value })
              }
              className="bg-gray-900 text-white border-orange-500 focus:border-orange-600"
            />
            <Input
              placeholder="Subnet Mask (e.g., 255.255.255.0)"
              value={routerConfig.subnetMask}
              onChange={(e) =>
                setRouterConfig({ ...routerConfig, subnetMask: e.target.value })
              }
              className="bg-gray-900 text-white border-orange-500 focus:border-orange-600"
            />
            <Input
              placeholder="Default Gateway"
              value={routerConfig.gateway}
              onChange={(e) =>
                setRouterConfig({ ...routerConfig, gateway: e.target.value })
              }
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
              Configure Router
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
