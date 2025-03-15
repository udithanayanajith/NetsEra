"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RouterQuiz from "./components/RouterQuiz";
import StaticRoutingQuiz from "./components/StaticRoutingQuiz";
import VlanQuiz from "./components/VlanQuiz";

export default function LabQuizContent() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Network Lab Quiz</h1>
        <Link
          href="/"
          className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
        >
          ← Back to Home
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lab Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="router" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="router">Router Configuration</TabsTrigger>
              <TabsTrigger value="static-routing">Static Routing</TabsTrigger>
              <TabsTrigger value="vlan">VLAN Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="router" className="mt-6">
              <RouterQuiz />
            </TabsContent>

            <TabsContent value="static-routing" className="mt-6">
              <StaticRoutingQuiz />
            </TabsContent>

            <TabsContent value="vlan" className="mt-6">
              <VlanQuiz />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
