"use client";

import RouterConfig from "./components/RouterConfig";
import PCConfig from "./components/PCConfig";
import VLANConfig from "./components/VLANConfig";
import StaticRouting from "./components/StaticRouting";
import ErrorGuide from "./components/ErrorGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConfigurationPractice() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
        <div className="flex justify-end">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>

      <h1 className="text-3xl font-bold mb-6">Network Configuration Practice</h1>
      
      <Tabs defaultValue="router" className="space-y-6">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="router">Router Configuration</TabsTrigger>
          <TabsTrigger value="pc">PC Configuration</TabsTrigger>
          <TabsTrigger value="vlan">VLAN Configuration</TabsTrigger>
          <TabsTrigger value="routing">Static Routing</TabsTrigger>
          <TabsTrigger value="guide">Error Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="router">
          <RouterConfig />
        </TabsContent>

        <TabsContent value="pc">
          <PCConfig />
        </TabsContent>

        <TabsContent value="vlan">
          <VLANConfig />
        </TabsContent>

        <TabsContent value="routing">
          <StaticRouting />
        </TabsContent>

        <TabsContent value="guide">
          <ErrorGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}
