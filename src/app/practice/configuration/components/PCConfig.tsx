"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

interface NetworkConfig {
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns: string;
}

interface Department {
  name: string;
  network: NetworkConfig;
  status: "connected" | "disconnected";
  subnet: string;
  allowedRange: {
    start: string;
    end: string;
  };
}

export default function PCConfig() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      name: "Marketing",
      network: {
        ipAddress: "",
        subnetMask: "",
        gateway: "",
        dns: "",
      },
      status: "disconnected",
      subnet: "192.168.1.0",
      allowedRange: {
        start: "192.168.1.10",
        end: "192.168.1.50",
      },
    },
    {
      name: "Engineering",
      network: {
        ipAddress: "",
        subnetMask: "",
        gateway: "",
        dns: "",
      },
      status: "disconnected",
      subnet: "192.168.2.0",
      allowedRange: {
        start: "192.168.2.10",
        end: "192.168.2.50",
      },
    },
  ]);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [configInput, setConfigInput] = useState<NetworkConfig>({
    ipAddress: "",
    subnetMask: "",
    gateway: "",
    dns: "",
  });
  const [configErrors, setConfigErrors] = useState<
    Partial<Record<keyof NetworkConfig, string>>
  >({});
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleDepartmentSelect = (dept: Department) => {
    setSelectedDepartment(dept);
    setConfigInput({
      ipAddress: "",
      subnetMask: "",
      gateway: "",
      dns: "",
    });
    setConfigErrors({});

    // Enhanced suggestions with detailed steps
    setSuggestions([
      `Steps to configure ${dept.name} Department:`,
      "1. IP Address Configuration:",
      `   • Must be within range: ${dept.allowedRange.start} - ${dept.allowedRange.end}`,
      `   • Must match subnet: ${dept.subnet.replace(".0", ".x")}`,
      "",
      "2. Subnet Mask:",
      "   • Must be: 255.255.255.0",
      "   • This creates a /24 network",
      "",
      "3. Default Gateway:",
      `   • Must be: ${dept.subnet.replace(".0", ".1")}`,
      "   • Gateway is the first usable IP in subnet",
      "",
      "4. DNS Server:",
      "   • Recommended: 8.8.8.8 (Google DNS)",
      "   • Alternative: 8.8.4.4",
      "",
      "Tips:",
      "• All IP addresses must be in correct format (xxx.xxx.xxx.xxx)",
      "• Values must be between 0 and 255",
      "• Gateway must be in the same subnet as the IP address",
    ]);
  };

  const validateIPAddress = (ip: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;

    const parts = ip.split(".").map(Number);
    return parts.every((part) => part >= 0 && part <= 255);
  };

  const validateIPRange = (ip: string, start: string, end: string): boolean => {
    const ipToNum = (ip: string): number => {
      return ip.split(".").reduce((sum, part) => sum * 256 + parseInt(part), 0);
    };

    const ipNum = ipToNum(ip);
    const startNum = ipToNum(start);
    const endNum = ipToNum(end);

    return ipNum >= startNum && ipNum <= endNum;
  };

  const validateSubnetMatch = (
    ip: string,
    subnet: string,
    mask: string
  ): boolean => {
    const ipParts = ip.split(".").map(Number);
    const subnetParts = subnet.split(".").map(Number);
    const maskParts = mask.split(".").map(Number);

    return ipParts.every(
      (part, i) => (part & maskParts[i]) === (subnetParts[i] & maskParts[i])
    );
  };

  const validateConfig = (
    config: NetworkConfig,
    dept: Department
  ): Record<keyof NetworkConfig, string> => {
    const errors: Record<keyof NetworkConfig, string> = {
      ipAddress: "",
      subnetMask: "",
      gateway: "",
      dns: "",
    };

    if (!validateIPAddress(config.ipAddress)) {
      errors.ipAddress = "Invalid IP address format";
      setSuggestions([
        "IP Address Format Help:",
        "• Must be in format: xxx.xxx.xxx.xxx",
        "• Each number must be between 0 and 255",
        `• Must be within range: ${dept.allowedRange.start} - ${dept.allowedRange.end}`,
        "• Example: 192.168.1.10",
      ]);
    } else if (
      !validateIPRange(
        config.ipAddress,
        dept.allowedRange.start,
        dept.allowedRange.end
      )
    ) {
      errors.ipAddress = `IP must be between ${dept.allowedRange.start} and ${dept.allowedRange.end}`;
    }

    if (!validateIPAddress(config.subnetMask)) {
      errors.subnetMask = "Invalid subnet mask format";
    }

    if (!validateIPAddress(config.gateway)) {
      errors.gateway = "Invalid gateway format";
    } else if (
      !validateSubnetMatch(config.gateway, dept.subnet, config.subnetMask)
    ) {
      errors.gateway = "Gateway must be in the same subnet";
    }

    if (!validateIPAddress(config.dns)) {
      errors.dns = "Invalid DNS format";
    }

    return errors;
  };

  const handleSaveConfig = () => {
    if (!selectedDepartment) return;

    const errors = validateConfig(configInput, selectedDepartment);
    const hasErrors = Object.values(errors).some((error) => error !== "");
    setConfigErrors(errors);

    if (!hasErrors) {
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) => {
          if (dept.name === selectedDepartment.name) {
            const isConnected = validateSubnetMatch(
              configInput.ipAddress,
              dept.subnet,
              configInput.subnetMask
            );

            // Enhanced feedback messages
            setSuggestions(
              isConnected
                ? [
                    "✅ Configuration Successful!",
                    `${dept.name} department is now connected to the network.`,
                    "",
                    "Current Configuration:",
                    `• IP Address: ${configInput.ipAddress}`,
                    `• Subnet Mask: ${configInput.subnetMask}`,
                    `• Gateway: ${configInput.gateway}`,
                    `• DNS: ${configInput.dns}`,
                    "",
                    "Next Steps:",
                    "• Configure the other department",
                    "• Or verify current configuration with 'show running-config'",
                  ]
                : [
                    "❌ Configuration Error!",
                    `${dept.name} department is not connected.`,
                    "",
                    "Common issues to check:",
                    "• Is the IP address in the correct range?",
                    "• Does the subnet mask match (255.255.255.0)?",
                    `• Is the gateway correct (${dept.subnet.replace(
                      ".0",
                      ".1"
                    )})?`,
                    "• Are all IP addresses properly formatted?",
                    "",
                    "Try again with the correct values.",
                  ]
            );

            return {
              ...dept,
              network: configInput,
              status: isConnected ? "connected" : "disconnected",
            };
          }
          return dept;
        })
      );
    }
  };
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  return (
    <div className="flex gap-6">
      {/* Left Side: Task and Configuration */}
      <div className="flex-1 space-y-6">
        {/* Task Description Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Network Configuration Task</CardTitle>
              <Button onClick={() => setIsNetworkModalOpen(true)}>
                Show the Network
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Configure the network settings for each department following these
              rules:
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-2 rounded bg-gray-800">
                  <strong>Marketing Department</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Subnet: 192.168.1.0/24</li>
                    <li>Valid IP Range: 192.168.1.10 - 192.168.1.50</li>
                    <li>Gateway should be: 192.168.1.1</li>
                  </ul>
                </div>
                <div className="p-2 rounded bg-gray-800">
                  <strong>Engineering Department</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Subnet: 192.168.2.0/24</li>
                    <li>Valid IP Range: 192.168.2.10 - 192.168.2.50</li>
                    <li>Gateway should be: 192.168.2.1</li>
                  </ul>
                </div>
              </div>
            </p>
          </CardContent>
        </Card>

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Department Network Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Select Department</Label>
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <button
                      key={dept.name}
                      onClick={() => handleDepartmentSelect(dept)}
                      className={`w-full p-4 rounded-lg text-left ${
                        selectedDepartment?.name === dept.name
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{dept.name}</span>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            dept.status === "connected"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {dept.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Subnet: {dept.subnet}/24
                      </div>
                      <div className="text-sm text-gray-400">
                        Range: {dept.allowedRange.start} -{" "}
                        {dept.allowedRange.end}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Network Configuration</Label>
                <div className="space-y-4">
                  <div>
                    <Label>IP Address</Label>
                    <input
                      type="text"
                      value={configInput.ipAddress}
                      onChange={(e) =>
                        setConfigInput({
                          ...configInput,
                          ipAddress: e.target.value,
                        })
                      }
                      className={`w-full mt-1 bg-gray-800 border rounded p-2 ${
                        configErrors.ipAddress
                          ? "border-red-500"
                          : "border-gray-700"
                      }`}
                      placeholder="e.g. 192.168.1.10"
                    />
                    {configErrors.ipAddress && (
                      <div className="text-sm text-red-500 mt-1">
                        {configErrors.ipAddress}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Subnet Mask</Label>
                    <input
                      type="text"
                      value={configInput.subnetMask}
                      onChange={(e) =>
                        setConfigInput({
                          ...configInput,
                          subnetMask: e.target.value,
                        })
                      }
                      className={`w-full mt-1 bg-gray-800 border rounded p-2 ${
                        configErrors.subnetMask
                          ? "border-red-500"
                          : "border-gray-700"
                      }`}
                      placeholder="e.g. 255.255.255.0"
                    />
                    {configErrors.subnetMask && (
                      <div className="text-sm text-red-500 mt-1">
                        {configErrors.subnetMask}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Default Gateway</Label>
                    <input
                      type="text"
                      value={configInput.gateway}
                      onChange={(e) =>
                        setConfigInput({
                          ...configInput,
                          gateway: e.target.value,
                        })
                      }
                      className={`w-full mt-1 bg-gray-800 border rounded p-2 ${
                        configErrors.gateway
                          ? "border-red-500"
                          : "border-gray-700"
                      }`}
                      placeholder="e.g. 192.168.1.1"
                    />
                    {configErrors.gateway && (
                      <div className="text-sm text-red-500 mt-1">
                        {configErrors.gateway}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>DNS Server</Label>
                    <input
                      type="text"
                      value={configInput.dns}
                      onChange={(e) =>
                        setConfigInput({ ...configInput, dns: e.target.value })
                      }
                      className={`w-full mt-1 bg-gray-800 border rounded p-2 ${
                        configErrors.dns ? "border-red-500" : "border-gray-700"
                      }`}
                      placeholder="e.g. 8.8.8.8"
                    />
                    {configErrors.dns && (
                      <div className="text-sm text-red-500 mt-1">
                        {configErrors.dns}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSaveConfig}
                    disabled={!selectedDepartment}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side: Help & Suggestions */}
      <Card className="w-1/4 h-full sticky top-0">
        <CardHeader>
          <CardTitle>Help & Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {!selectedDepartment && (
              <p className="text-sm text-gray-400">
                Select a department to begin configuration
              </p>
            )}
            {suggestions.map((suggestion, index) => (
              <p key={index} className="text-sm text-gray-400">
                {suggestion}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Network Diagram Modal */}
      <Dialog open={isNetworkModalOpen} onOpenChange={setIsNetworkModalOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-[90%] mx-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setIsNetworkModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <DialogHeader>
              <DialogTitle>
                {" "}
                <h3 className="text-orange-500">Network Diagram :</h3>
              </DialogTitle>
            </DialogHeader>
            <div>
              <img
                src="/images/practice/pc.png"
                alt="Network Diagram"
                className="w-1/1.8 h-auto rounded-lg mx-auto mb-3"
              />
              <p className="text-m text-gray-600">
                Assume that there is 1 router, 1 switche, 2 PCs. In this
                session, you will practice configuring PCs. The scenario is as
                follows: the router is connected to the switche and switch is
                connected to 2 PCs. Configure the IP addresses, subnet masks,
                and gateways for each PC according to the department's network
                rules. Ensure both PCs can communicate within their respective
                subnets and access their gateways for external connectivity.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
