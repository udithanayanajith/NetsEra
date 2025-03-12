"use client";
import Link from "next/link";
import Image from "next/image";

export default function PCLearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/learn" className="text-blue-500 hover:text-blue-400 mr-2">
          {'\u2190'} Back to Learn
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-6">PC Configuration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">PC Network Configuration</h2>
            <p className="text-gray-300 mb-4">
              Configuring a PC for networking involves setting up various parameters to ensure proper communication 
              with other devices on the network. This includes configuring IP addresses, subnet masks, default gateways, 
              and DNS servers.
            </p>
            <p className="text-gray-300 mb-4">
              A properly configured PC can connect to local networks, access the internet, and communicate with 
              other networked devices like printers, servers, and other computers.
            </p>
            <div className="flex justify-center my-6">
              <Image 
                src="/images/component/pc-network-config.png" 
                alt="PC Network Configuration"
                width={500}
                height={300}
                className="rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/images/component/pc-icon.png";
                  e.currentTarget.className = "rounded-lg invert w-40 h-40";
                }}
              />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Basic PC Network Configuration Steps</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Windows Configuration</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-4">
                <li className="pl-2">
                  <span className="font-semibold">Access Network Settings</span>: Open Control Panel {' > '} Network and Internet {' > '} Network and Sharing Center
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Change adapter settings</span>: Click on "Change adapter settings" in the left panel
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Configure network adapter</span>: Right-click on your network adapter and select "Properties"
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Select TCP/IPv4</span>: Double-click on "Internet Protocol Version 4 (TCP/IPv4)"
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Configure IP settings</span>: Choose between automatic (DHCP) or manual IP configuration
                </li>
                <li className="pl-2">
                  <span className="font-semibold">For manual configuration</span>: Enter IP address, subnet mask, default gateway, and DNS servers
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Apply settings</span>: Click OK to save changes
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Linux Configuration</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-4">
                <li className="pl-2">
                  <span className="font-semibold">Access Network Settings</span>: Open System Settings and select Network
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Select network interface</span>: Click on the network interface you want to configure
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Configure settings</span>: Click on the gear icon to open detailed settings
                </li>
                <li className="pl-2">
                  <span className="font-semibold">IPv4 tab</span>: Select method (DHCP or Manual)
                </li>
                <li className="pl-2">
                  <span className="font-semibold">For manual configuration</span>: Enter IP address, netmask, gateway, and DNS servers
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Apply settings</span>: Click Apply to save changes
                </li>
              </ol>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Advanced Network Configuration</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">Configuring Multiple Network Profiles</h3>
            <p className="text-gray-300 mb-4">
              For laptops and devices that connect to different networks, it's useful to set up multiple network profiles 
              for home, work, or public networks. Each profile can have different security settings and network configurations.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">Network Troubleshooting Commands</h3>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <p className="text-gray-300 font-mono"><span className="text-green-400">ipconfig</span> - Displays IP configuration information</p>
              <p className="text-gray-300 font-mono"><span className="text-green-400">ping</span> - Tests connectivity to another device</p>
              <p className="text-gray-300 font-mono"><span className="text-green-400">tracert</span> - Traces the route to a destination</p>
              <p className="text-gray-300 font-mono"><span className="text-green-400">nslookup</span> - Queries DNS servers</p>
              <p className="text-gray-300 font-mono"><span className="text-green-400">netstat</span> - Displays network connections</p>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-3">Firewall Configuration</h3>
            <p className="text-gray-300 mb-4">
              Configuring your PC's firewall is essential for security. Windows Firewall and other third-party firewalls 
              allow you to control which applications can access the network and which incoming connections are allowed.
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
                    src="https://www.youtube.com/embed/HK5cViQTnp0" 
                    title="Windows Network Configuration" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold">Windows Network Configuration</h3>
                  <p className="text-gray-400 text-sm">Learn how to configure network settings in Windows</p>
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <iframe 
                    className="w-full h-48"
                    src="https://www.youtube.com/embed/SlzmynljThk" 
                    title="Linux Network Configuration" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold">Linux Network Configuration</h3>
                  <p className="text-gray-400 text-sm">Learn how to configure network settings in Linux</p>
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <iframe 
                    className="w-full h-48"
                    src="https://www.youtube.com/embed/1i3XdhC2ZAs" 
                    title="Network Troubleshooting" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold">Network Troubleshooting</h3>
                  <p className="text-gray-400 text-sm">Common network issues and how to resolve them</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Practice Your Skills</h2>
            <p className="text-gray-300 mb-4">
              Ready to test your knowledge? Try configuring a PC in our interactive practice environment.
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
