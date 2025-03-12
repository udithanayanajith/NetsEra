"use client";
import Link from "next/link";
import Image from "next/image";

export default function SwitchLearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/learn" className="text-blue-500 hover:text-blue-400 mr-2">
          ← Back to Learn
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-6">Switch Configuration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">What is a Network Switch?</h2>
            <p className="text-gray-300 mb-4">
              A network switch is a hardware device that connects devices on a computer network by using packet switching to 
              receive and forward data to the destination device. Unlike hubs, a switch forwards data only to the device that needs it, 
              rather than broadcasting to all devices on the network.
            </p>
            <p className="text-gray-300 mb-4">
              Switches operate at the data link layer (Layer 2) of the OSI model, but some modern switches also operate 
              at the network layer (Layer 3) with routing capabilities.
            </p>
            <div className="flex justify-center my-6">
              <Image 
                src="/images/component/switch-diagram.png" 
                alt="Network Switch Diagram"
                width={500}
                height={300}
                className="rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/images/component/switch-icon.png";
                  e.currentTarget.className = "rounded-lg invert w-40 h-40";
                }}
              />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Basic Switch Configuration Steps</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-4">
              <li className="pl-2">
                <span className="font-semibold">Access the switch CLI</span>: Connect to the switch using a console cable or SSH.
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
                <span className="font-semibold">Configure VLANs</span>: Create and configure VLANs with <code className="bg-gray-700 px-2 py-1 rounded">vlan [vlan-id]</code>.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Configure ports</span>: Enter interface configuration mode with <code className="bg-gray-700 px-2 py-1 rounded">interface [interface-id]</code>.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Assign ports to VLANs</span>: Use <code className="bg-gray-700 px-2 py-1 rounded">switchport mode access</code> and <code className="bg-gray-700 px-2 py-1 rounded">switchport access vlan [vlan-id]</code>.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Configure trunk ports</span>: Use <code className="bg-gray-700 px-2 py-1 rounded">switchport mode trunk</code> for ports connecting to other switches.
              </li>
              <li className="pl-2">
                <span className="font-semibold">Save configuration</span>: Use <code className="bg-gray-700 px-2 py-1 rounded">write memory</code> or <code className="bg-gray-700 px-2 py-1 rounded">copy running-config startup-config</code>.
              </li>
            </ol>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Advanced Switch Configuration</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">VLANs (Virtual Local Area Networks)</h3>
            <p className="text-gray-300 mb-4">
              VLANs allow you to logically segment a switch into multiple broadcast domains. This improves 
              network performance, security, and makes network management easier.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <p className="text-gray-300 font-mono">Switch# configure terminal</p>
              <p className="text-gray-300 font-mono">Switch(config)# vlan 10</p>
              <p className="text-gray-300 font-mono">Switch(config-vlan)# name Engineering</p>
              <p className="text-gray-300 font-mono">Switch(config-vlan)# exit</p>
              <p className="text-gray-300 font-mono">Switch(config)# interface fastethernet 0/1</p>
              <p className="text-gray-300 font-mono">Switch(config-if)# switchport mode access</p>
              <p className="text-gray-300 font-mono">Switch(config-if)# switchport access vlan 10</p>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-3">Spanning Tree Protocol (STP)</h3>
            <p className="text-gray-300 mb-4">
              STP prevents loops in networks with redundant paths. It ensures that there is only one active 
              path between two network devices to prevent broadcast storms.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">Port Security</h3>
            <p className="text-gray-300 mb-4">
              Port security limits the number of MAC addresses that can be learned on a port, 
              protecting against MAC address flooding attacks and unauthorized access.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <p className="text-gray-300 font-mono">Switch(config)# interface fastethernet 0/1</p>
              <p className="text-gray-300 font-mono">Switch(config-if)# switchport port-security</p>
              <p className="text-gray-300 font-mono">Switch(config-if)# switchport port-security maximum 2</p>
              <p className="text-gray-300 font-mono">Switch(config-if)# switchport port-security violation shutdown</p>
            </div>
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
                    src="https://www.youtube.com/embed/1KPyAQNhztM?si=KklYoYP8wCSWreK4" 
                    title="Basic Switch Configuration" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold">Basic Switch Configuration</h3>
                  <p className="text-gray-400 text-sm">Learn the basics of configuring a Cisco switch</p>
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <iframe 
                    className="w-full h-48"
                    src="https://www.youtube.com/embed/jC6MJTh9fRE?si=ewjh6K8-vP_mliO4" 
                    title="VLAN Configuration" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold">VLAN Configuration</h3>
                  <p className="text-gray-400 text-sm">How to configure VLANs on a switch</p>
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <iframe 
                    className="w-full h-48"
                    src="https://www.youtube.com/embed/n5PeI_1Q_8c" 
                    title="Switch Security Features" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold">Switch Security Features</h3>
                  <p className="text-gray-400 text-sm">Learn about port security and other security features</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Practice Your Skills</h2>
            <p className="text-gray-300 mb-4">
              Ready to test your knowledge? Try configuring a switch in our interactive practice environment.
            </p>
            <Link href="/practice" className="block w-full">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300">
                Go to Practice Area
              </button>
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">Key Switch Commands</h2>
            <div className="space-y-2">
              <div className="bg-gray-900 p-2 rounded">
                <code className="text-green-400">show vlan</code>
                <p className="text-gray-300 text-sm">Display VLAN information</p>
              </div>
              <div className="bg-gray-900 p-2 rounded">
                <code className="text-green-400">show interfaces status</code>
                <p className="text-gray-300 text-sm">Show interface status and configuration</p>
              </div>
              <div className="bg-gray-900 p-2 rounded">
                <code className="text-green-400">show mac address-table</code>
                <p className="text-gray-300 text-sm">Display MAC address table</p>
              </div>
              <div className="bg-gray-900 p-2 rounded">
                <code className="text-green-400">show spanning-tree</code>
                <p className="text-gray-300 text-sm">Display spanning tree information</p>
              </div>
              <div className="bg-gray-900 p-2 rounded">
                <code className="text-green-400">show port-security</code>
                <p className="text-gray-300 text-sm">Display port security information</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
