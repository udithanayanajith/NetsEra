"use client";
import { useState } from "react";
import Link from "next/link";
import PCConfiguration from "@/app/practice/PCConfiguration";
import RouterConfiguration from "@/app/practice/RouterConfiguration";
import SwitchConfiguration from "@/app/practice/SwitchConfiguration";

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState("pc");

  return (
    <div className="h-screen bg-darkmode text-white overflow-hidden">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md h-full px-4 py-4">
        <div className="flex justify-end">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-rows-[auto,auto,1fr] h-[calc(100vh-2rem)] gap-4">
          <h1 className="text-3xl font-bold text-white text-center">
            Network Practice Lab
          </h1>

          {/* Tabs */}
          <div className="flex justify-center">
            <div className="flex space-x-4 bg-gray-800/50 backdrop-blur-sm p-2 rounded-full border border-gray-700">
              <button
                onClick={() => setActiveTab("pc")}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeTab === "pc"
                    ? "bg-orange-500 text-white"
                    : "text-white hover:text-orange-500"
                }`}
              >
                PC Configuration
              </button>
              <button
                onClick={() => setActiveTab("router")}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeTab === "router"
                    ? "bg-orange-500 text-white"
                    : "text-white hover:text-orange-500"
                }`}
              >
                Router Configuration
              </button>
              <button
                onClick={() => setActiveTab("switch")}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeTab === "switch"
                    ? "bg-orange-500 text-white"
                    : "text-white hover:text-orange-500"
                }`}
              >
                Switch Configuration
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-[2fr,1fr] gap-4 h-[calc(100%-2rem)]">
            {/* Tab Content */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700">
              {activeTab === "pc" && <PCConfiguration />}
              {activeTab === "router" && <RouterConfiguration />}
              {activeTab === "switch" && <SwitchConfiguration />}
            </div>

            {/* Instructions Panel */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-3">Instructions</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Select a device type from the tabs above</li>
                <li>
                  Configure the network settings according to your requirements
                </li>
                <li>Follow the best practices for each device type</li>
                <li>Test your configuration using the provided tools</li>
                <li>
                  Review any error messages and make necessary adjustments
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
