"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StaticRouting from "@/app/practice/configuration/components/StaticRouting";

export default function StaticRoutingQuiz() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Network Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <img
              src="/images/network-diagram-static-routing.png"
              alt="Static Routing Network Diagram"
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
            Configure static routes between Router0 and Router1 to enable
            communication between the two networks.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Static Routing Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <StaticRouting />
        </CardContent>
      </Card>
    </div>
  );
}
