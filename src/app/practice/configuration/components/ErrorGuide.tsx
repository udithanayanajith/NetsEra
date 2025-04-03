"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorGuideItem {
  error: string;
  description: string;
  solution: string;
  category: "router" | "switch" | "pc";
  commands?: string[];
}

export default function ErrorGuide() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ErrorGuideItem["category"] | "all"
  >("all");

  const errorGuides: ErrorGuideItem[] = [
    {
      error: "No IP Connectivity",
      description: "Unable to ping or connect to other devices in the network",
      solution:
        "1. Verify IP address configuration\n2. Check subnet mask\n3. Confirm default gateway\n4. Ensure physical connectivity\n5. Verify VLAN assignments",
      category: "pc",
      commands: [
        "ipconfig /all",
        "ping <gateway-ip>",
        "tracert <destination-ip>",
        "nslookup <domain-name>",
      ],
    },
    {
      error: "Interface Down",
      description: "Router interface shows as administratively down",
      solution:
        "1. Enter interface configuration mode\n2. Use 'no shutdown' command\n3. Verify cable connections\n4. Check interface status with 'show interfaces'",
      category: "router",
      commands: [
        "show interfaces",
        "configure terminal",
        "interface <interface-name>",
        "no shutdown",
      ],
    },
    {
      error: "VLAN Mismatch",
      description: "Devices in same VLAN cannot communicate",
      solution:
        "1. Verify VLAN configurations on switch\n2. Check port assignments\n3. Ensure trunk ports are properly configured\n4. Verify VLAN database consistency",
      category: "switch",
      commands: [
        "show vlan",
        "show interfaces trunk",
        "show interfaces status",
        "show running-config interface <interface-name>",
      ],
    },
    {
      error: "Routing Table Issues",
      description: "Routes not appearing in routing table",
      solution:
        "1. Verify network statements\n2. Check static route configuration\n3. Confirm next-hop reachability\n4. Validate subnet masks",
      category: "router",
      commands: [
        "show ip route",
        "show ip protocols",
        "ping <next-hop-ip>",
        "show running-config | include ip route",
      ],
    },
    {
      error: "DNS Resolution Failure",
      description: "Unable to resolve domain names",
      solution:
        "1. Verify DNS server configuration\n2. Check DNS server reachability\n3. Validate DNS service status\n4. Test with multiple domains",
      category: "pc",
      commands: [
        "nslookup <domain-name>",
        "ipconfig /displaydns",
        "ipconfig /flushdns",
        "ping <dns-server-ip>",
      ],
    },
    {
      error: "Trunk Port Issues",
      description: "VLANs not propagating across switches",
      solution:
        "1. Check trunk mode on both ends\n2. Verify allowed VLANs\n3. Confirm native VLAN matches\n4. Check encapsulation type",
      category: "switch",
      commands: [
        "show interfaces trunk",
        "show vlan",
        "show running-config interface <interface-name>",
        "show cdp neighbors detail",
      ],
    },
  ];

  const filteredGuides = errorGuides.filter((guide) => {
    const matchesSearch =
      guide.error.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded p-2"
                placeholder="Search for errors..."
              />
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value as ErrorGuideItem["category"] | "all"
                  )
                }
                className="bg-gray-800 border border-gray-700 rounded p-2"
              >
                <option value="all">All Categories</option>
                <option value="router">Router</option>
                <option value="switch">Switch</option>
                <option value="pc">PC</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredGuides.map((guide, index) => (
                <div
                  key={index}
                  className="border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{guide.error}</h3>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        {
                          router: "bg-blue-500",
                          switch: "bg-green-500",
                          pc: "bg-yellow-500",
                          general: "bg-gray-500",
                        }[guide.category]
                      }`}
                    >
                      {guide.category.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{guide.description}</p>
                  <div className="bg-gray-800 p-4 rounded">
                    <h4 className="text-sm font-semibold mb-2">Solution:</h4>
                    {guide.solution.split("\n").map((step, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1">
                        <div className="flex-shrink-0">•</div>
                        <div>{step}</div>
                      </div>
                    ))}
                  </div>
                  {guide.commands && (
                    <div className="mt-4 bg-black p-4 rounded font-mono text-sm">
                      <h4 className="text-sm font-semibold mb-2 font-sans">
                        Useful Commands:
                      </h4>
                      {guide.commands.map((cmd, i) => (
                        <div key={i} className="text-green-400 mb-1">
                          $ {cmd}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
