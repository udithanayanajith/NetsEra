"use client";
import Link from "next/link";
import Image from "next/image";

export const Learn = () => {
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Learn</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/learn/router">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300 h-full">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/component/router-icon.png"
                  alt="Router Configuration"
                  width={80}
                  height={80}
                  className="invert"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Router Configuration</h2>
              <p className="text-gray-300">
                Learn how to configure routers, understand routing protocols, and manage network traffic.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/learn/pc">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300 h-full">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/component/pc-icon.png"
                  alt="PC Configuration"
                  width={80}
                  height={80}
                  className="invert"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">PC Configuration</h2>
              <p className="text-gray-300">
                Learn how to set up network configurations on personal computers and troubleshoot common issues.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/learn/switch">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300 h-full">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/component/switch-icon.png"
                  alt="Switch Configuration"
                  width={80}
                  height={80}
                  className="invert"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Switch Configuration</h2>
              <p className="text-gray-300">
                Learn how to configure network switches, set up VLANs, and manage port security.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
    </>
  );
};
