"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RouterQuiz() {
  const [showPcConfig, setShowPcConfig] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white">
            Configure the network as shown in the diagram. Assign IP addresses
            to PCs and laptops, and configure the router to enable communication
            between all devices.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Network Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <img
              src="/images/network-diagram-router.png"
              alt="Router Network Diagram"
              className="w-full max-w-2xl"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
