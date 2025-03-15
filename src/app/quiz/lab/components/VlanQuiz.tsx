"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VLANConfig from "@/app/practice/configuration/components/VLANConfig";

export default function VlanQuiz() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Network Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <img
              src="/images/network-diagram-vlan.png"
              alt="VLAN Network Diagram"
              className="w-full max-w-2xl"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Configure VLANs on Switch0, Switch1, and Switch2 to segment the
            network. All PCs are pre-configured with the following IP addresses:
            <ul className="list-disc pl-5 mt-2">
              <li>PC0: 192.168.1.10</li>
              <li>PC1: 192.168.1.11</li>
              <li>PC2: 192.168.1.12</li>
              <li>PC3: 192.168.1.13</li>
            </ul>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>VLAN Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <VLANConfig />
        </CardContent>
      </Card>
    </div>
  );
}
