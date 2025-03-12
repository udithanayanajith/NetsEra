"use client";
import Link from "next/link";
import Image from "next/image";

export default function RouterLearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/learn" className="text-blue-500 hover:text-blue-400 mr-2">
          ← Back to Learn
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-6">Router Configuration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">What is a Router?</h2>
            <p className="text-gray-300 mb-4">
              A router is a networking device that forwards data packets between computer networks. 
              Routers perform the traffic directing functions on the Internet. A data packet is typically 
              forwarded from one router to another through the networks that constitute an internetwork 
              until it reaches its destination node.
            </p>
            <p className="text-gray-300 mb-4">
              Routers are located at gateways, the places where two or more networks connect. 
              They use headers and forwarding tables to determine the best path for forwarding the packets, 
              and they use protocols such as ICMP to communicate with each other and configure the best route between any two hosts.
            </p>
            <div className="flex justify-center my-6">
              <Image 
                src="/images/component/router-icon.png" 
                alt="Router Diagram"
                width={500}
                height={300}
                className="rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/images/component/router-icon.png";
                  e.currentTarget.className = "rounded-lg invert w-40 h-40";
                }}
              />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Basic Router Configuration Steps</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-4">
              <li className="pl-2">
                <span className="font-semibold">Access the router CLI</span>: Connect to the router using a console cable or SSH.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Enter privileged mode</span>: Type <code className="bg-gray-700 px-2 py-1 rounded">enable</code> to enter privileged mode.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Enter configuration mode</span>: Type <code className="bg-gray-700 px-2 py-1 rounded">configure terminal</code> to enter global configuration mode.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Set hostname</span>: Configure a hostname with <code className="bg-gray-700 px-2 py-1 rounded">hostname [name]</code>.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Configure interfaces</span>: Enter interface configuration mode with <code className="bg-gray-700 px-2 py-1 rounded">interface [interface-id]</code>.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Assign IP addresses</span>: Use <code className="bg-gray-700 px-2 py-1 rounded">ip address [ip-address] [subnet-mask]</code>.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Enable interfaces</span>: Use <code className="bg-gray-700 px-2 py-1 rounded">no shutdown</code> to enable an interface.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Configure routing</span>: Set up static routes or routing protocols.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Save configuration</span>: Use <code className="bg-gray-700 px-2 py-1 rounded">write memory</code> or <code className="bg-gray-700 px-2 py-1 rounded">copy running-config startup-config</code>.
              </li>
            </ol>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Advanced Router Configuration</h2>
            <h3 className="text-xl font-semibold text-white mb-3">Routing Protocols</h3>
            <p className="text-gray-300 mb-4">
              Routers use routing protocols to share information about network destinations. Common routing protocols include:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 pl-4">
              <li><span className="font-semibold">OSPF (Open Shortest Path First)</span>: Link-state routing protocol that uses cost as its routing metric</li>
              <li><span className="font-semibold">EIGRP (Enhanced Interior Gateway Routing Protocol)</span>: Advanced distance-vector routing protocol</li>
              <li><span className="font-semibold">BGP (Border Gateway Protocol)</span>: Path-vector routing protocol for internet routing</li>
              <li><span className="font-semibold">RIP (Routing Information Protocol)</span>: Distance-vector protocol that uses hop count as the metric</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-white mb-3">Access Control Lists (ACLs)</h3>
            <p className="text-gray-300 mb-4">
              ACLs filter network traffic by controlling whether packets are forwarded or blocked at the router's interfaces.
              They are used for security purposes and traffic management.
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recommended Videos</h2>
            <div className="space-y-4">
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <iframe 
                    className="w-full h-48"
                    src="https://www.youtube.com/embed/R-JUOpCgTZc" 
                    title="Basic Router Configuration" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold">Basic Router Configuration</h3>
                  <p className="text-gray-400 text-sm">Learn the basics of configuring a Cisco router</p>
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <iframe 
                    className="w-full h-48"
                    src="https://www.youtube.com/embed/KhSzVYoZxAU" 
                    title="Router Configuration Advanced" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold">Advanced Router Configuration</h3>
                  <p className="text-gray-400 text-sm">Advanced routing protocols and security settings</p>
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <iframe 
                    className="w-full h-48"
                    src="https://www.youtube.com/embed/O-YqzpfGGCY" 
                    title="Troubleshooting Router Issues" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold">Troubleshooting Router Issues</h3>
                  <p className="text-gray-400 text-sm">Common problems and how to solve them</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Practice Your Skills</h2>
            <p className="text-gray-300 mb-4">
              Ready to test your knowledge? Try configuring a router in our interactive practice environment.
            </p>
            <Link href="/practice" className="block w-full">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300">
                Go to Practice Area
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
