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

export default function SwitchConfiguration() {
  const [isOpen, setIsOpen] = useState(false);
  const [switchConfig, setSwitchConfig] = useState({
    vlan: "",
    portNumber: "",
    portMode: "",
  });
  const [error, setError] = useState<string | null>(null);

  const validateConfig = () => {
    const vlanNum = parseInt(switchConfig.vlan);
    const portNum = parseInt(switchConfig.portNumber);

    if (isNaN(vlanNum) || vlanNum < 1 || vlanNum > 4094) {
      setError("VLAN ID must be between 1 and 4094");
      return false;
    }

    if (isNaN(portNum) || portNum < 1 || portNum > 48) {
      setError("Port number must be between 1 and 48");
      return false;
    }

    if (!switchConfig.portMode) {
      setError("Port mode is required");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateConfig()) {
      setError(null);
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
          src="/images/component/switch-icon.png"
          alt="Switch Configuration"
          width={600}
          height={100}
          className="invert"
        />
        <p className="text-center mt-2 text-lg">Click to configure Switch</p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black border border-orange-500">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">
              Configure Switch
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the switch configuration details
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="VLAN ID (1-4094)"
              value={switchConfig.vlan}
              onChange={(e) =>
                setSwitchConfig({ ...switchConfig, vlan: e.target.value })
              }
              className="bg-gray-900 text-white border-orange-500 focus:border-orange-600"
            />
            <Input
              placeholder="Port Number (1-48)"
              value={switchConfig.portNumber}
              onChange={(e) =>
                setSwitchConfig({ ...switchConfig, portNumber: e.target.value })
              }
              className="bg-gray-900 text-white border-orange-500 focus:border-orange-600"
            />
            <Input
              placeholder="Port Mode (access/trunk)"
              value={switchConfig.portMode}
              onChange={(e) =>
                setSwitchConfig({
                  ...switchConfig,
                  portMode: e.target.value.toLowerCase(),
                })
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
              Configure Switch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
