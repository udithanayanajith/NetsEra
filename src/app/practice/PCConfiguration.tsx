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
import config from "@/app/practice/config.json";

export default function PCConfiguration() {
  const [isOpen, setIsOpen] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [subnetMask, setSubnetMask] = useState("");
  const [gateway, setGateway] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [suggestions, setSuggestions] = useState<{ [key: string]: string }>({});
  const [instructions, setInstructions] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null); // Track focused field

  // Extract PC configuration fields from the new JSON
  const pcFields = config.devices.pc.interfaces[0]; // Assuming the first interface is for PC

  const validateField = (field: string, value: string) => {
    const fieldConfig = config.devices.pc.interfaces.find(
      (f) => f.name.toLowerCase() === field.toLowerCase()
    );
    if (!fieldConfig) return;

    const regex =
      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!regex.test(value)) {
      setErrors((prev) => ({ ...prev, [field]: "Invalid IP address format." }));
      setSuggestions((prev) => ({
        ...prev,
        [field]: "Example: 192.168.1.1",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setSuggestions((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Update instructions based on the focused field and input value
  const updateInstructions = (field: string, value: string) => {
    let newInstructions: string[] = [];

    switch (field) {
      case "IP Address":
        newInstructions = [
          value
            ? "IP Address entered. Proceed to enter the subnet mask."
            : "Please enter the IP address for the PC. Example: 192.168.1.1",
        ];
        break;
      case "Subnet Mask":
        newInstructions = [
          value
            ? "Subnet Mask entered. Proceed to enter the default gateway."
            : "Please enter the subnet mask for the PC. Example: 255.255.255.0",
        ];
        break;
      case "Gateway":
        newInstructions = [
          value
            ? "Default Gateway entered. Click 'Configure PC' to save the settings."
            : "Please enter the default gateway for the PC. Example: 192.168.1.254",
        ];
        break;
      default:
        newInstructions = [
          "Welcome! Start by entering the IP address for the PC.",
        ];
        break;
    }

    setInstructions(newInstructions);
  };

  const handleInputChange = (field: string, value: string) => {
    // Update the corresponding state
    switch (field) {
      case "IP Address":
        setIpAddress(value);
        break;
      case "Subnet Mask":
        setSubnetMask(value);
        break;
      case "Gateway":
        setGateway(value);
        break;
      default:
        break;
    }

    // Validate the field
    validateField(field, value);

    // Update instructions based on the focused field and input value
    updateInstructions(field, value);
  };

  const handleSubmit = () => {
    validateField("IP Address", ipAddress);
    validateField("Subnet Mask", subnetMask);
    validateField("Gateway", gateway);

    if (Object.values(errors).every((error) => !error)) {
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
          className="invert"
        />
        <p className="text-center mt-2 text-lg">Click to configure PC</p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black border border-orange-500 w-full max-w-6xl">
          <div className="flex gap-3">
            {/* Left Side: Configuration Form */}
            <div className="w-3/4">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">
                  Configure PC
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enter the IP address, subnet mask, and gateway for this PC.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 mt-4">
                <Input
                  placeholder="IP Address (e.g., 192.168.1.1)"
                  value={ipAddress}
                  onChange={(e) =>
                    handleInputChange("IP Address", e.target.value)
                  }
                  onFocus={() => setFocusedField("IP Address")}
                  className="bg-gray-900 text-white border-orange-500 focus:border-orange-600"
                />
                {errors["IP Address"] && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors["IP Address"]}</AlertDescription>
                  </Alert>
                )}
                {suggestions["IP Address"] && (
                  <div className="text-sm text-gray-400">
                    {suggestions["IP Address"]}
                  </div>
                )}

                <Input
                  placeholder="Subnet Mask (e.g., 255.255.255.0)"
                  value={subnetMask}
                  onChange={(e) =>
                    handleInputChange("Subnet Mask", e.target.value)
                  }
                  onFocus={() => setFocusedField("Subnet Mask")}
                  className="bg-gray-900 text-white border-orange-500 focus:border-orange-600"
                />
                {errors["Subnet Mask"] && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors["Subnet Mask"]}</AlertDescription>
                  </Alert>
                )}
                {suggestions["Subnet Mask"] && (
                  <div className="text-sm text-gray-400">
                    {suggestions["Subnet Mask"]}
                  </div>
                )}

                <Input
                  placeholder="Default Gateway (e.g., 192.168.1.254)"
                  value={gateway}
                  onChange={(e) => handleInputChange("Gateway", e.target.value)}
                  onFocus={() => setFocusedField("Gateway")}
                  className="bg-gray-900 text-white border-orange-500 focus:border-orange-600"
                />
                {errors["Gateway"] && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors["Gateway"]}</AlertDescription>
                  </Alert>
                )}
                {suggestions["Gateway"] && (
                  <div className="text-sm text-gray-400">
                    {suggestions["Gateway"]}
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-300"
                >
                  Configure PC
                </Button>
              </div>
            </div>

            {/* Right Side: Live Instructions Box */}
            <div className="w-1/4 h-96 bg-gray-800 text-white p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Live Instructions</h3>
              <ul className="list-disc list-inside">
                {instructions.map((step, index) => (
                  <li key={index} className="text-sm text-blue-400">
                    {step}
                  </li>
                ))}
              </ul>

              {/* Display Errors and Suggestions */}
              {focusedField && errors[focusedField] && (
                <div className="text-sm text-red-400 mt-4">
                  <h4 className="font-medium text-gray-400">Error</h4>
                  <p>{errors[focusedField]}</p>
                </div>
              )}
              {focusedField && suggestions[focusedField] && (
                <div className="text-sm text-green-400 mt-4">
                  <h4 className="font-medium text-gray-400">Suggestion</h4>
                  <p>{suggestions[focusedField]}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
