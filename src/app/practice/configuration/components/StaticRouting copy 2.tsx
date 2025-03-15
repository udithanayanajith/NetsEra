"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Route {
  destination: string;
  nextHop: string;
  mask: string;
  metric: number;
  status: "active" | "inactive";
}

interface PingResult {
  destination: string;
  success: boolean;
  latency: number;
  timestamp: string;
}

interface Command {
  command: string;
  requiredMode: "user" | "privileged" | "config" | "interface";
  nextCommands: string[];
  help?: string;
  suggestion?: string;
  instructions?: string[];
}

interface CommandProgress {
  completed: string[];
  nextExpected: string[];
}

const VALID_COMMANDS: Command[] = [
  {
    command: "enable",
    requiredMode: "user",
    nextCommands: ["configure terminal"],
    help: "Enter privileged mode",
    suggestion: "Use 'enable' to enter privileged mode",
    instructions: ["1. Enter 'enable' to access privileged mode"],
  },

  {
    command: "ping",
    requiredMode: "privileged",
    nextCommands: ["ping", "show ip route"],
    help: "Ping a destination IP",
    suggestion: "Use 'ping <ip-address>'",
    instructions: ["1. Enter ping command with destination IP"],
  },
  {
    command: "show ip route",
    requiredMode: "privileged",
    nextCommands: ["ping", "configure terminal"],
    help: "Display routing table",
    suggestion: "Use 'show ip route' to view routes",
    instructions: ["1. View configured routes"],
  },
];

const SAMPLE_ROUTES = [
  {
    name: "Marketing Network",
    destination: "192.168.10.0",
    mask: "255.255.255.0",
    nextHop: "10.0.0.1",
    metric: 1,
    description: "Route to Marketing department network",
  },
  {
    name: "Engineering Network",
    destination: "192.168.20.0",
    mask: "255.255.255.0",
    nextHop: "10.0.0.2",
    metric: 1,
    description: "Route to Engineering department network",
  },
  {
    name: "Sales Network",
    destination: "192.168.30.0",
    mask: "255.255.255.0",
    nextHop: "10.0.0.3",
    metric: 1,
    description: "Route to Sales department network",
  },
];

const UseCaseCard = ({
  onFillData,
}: {
  onFillData: (route: (typeof SAMPLE_ROUTES)[0]) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Use Case Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-400">
            <p className="font-semibold text-white mb-2">
              Scenario: Department Network Configuration
            </p>
            <p>Configure static routes for three department networks:</p>
          </div>

          <div className="space-y-4">
            {SAMPLE_ROUTES.map((route, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{route.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {route.description}
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Network: {route.destination}</p>
                      <p>Mask: {route.mask}</p>
                      <p>Next Hop: {route.nextHop}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onFillData(route)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Fill Data
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-700 pt-4">
            <h3 className="text-white font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-400 space-y-2">
              <li>Use the "Fill Data" button to populate route information</li>
              <li>Add routes using either the form or CLI commands</li>
              <li>
                CLI Configuration Steps:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Enter privileged mode: enable</li>
                  <li>Enter configuration mode: configure terminal</li>
                  <li>Add route: ip route [network] [mask] [next-hop]</li>
                  <li>Verify configuration: show ip route</li>
                  <li>Test connectivity: ping [ip-address]</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="mt-4 bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">
              Example CLI Commands:
            </h3>
            <pre className="text-sm text-green-400">
              Router&gt; enable{"\n"}
              Router# configure terminal{"\n"}
              Router(config)# ip route 192.168.10.0 255.255.255.0 10.0.0.1{"\n"}
              Router(config)# end{"\n"}
              Router# show ip route{"\n"}
              Router# ping 192.168.10.1
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StaticRouting() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [newRoute, setNewRoute] = useState<Route>({
    destination: "",
    nextHop: "",
    mask: "",
    metric: 1,
    status: "inactive" as const,
  });
  const [pingResults, setPingResults] = useState<PingResult[]>([]);
  const [pingTarget, setPingTarget] = useState("");
  const [cliOutput, setCliOutput] = useState<string[]>([]);
  const [mode, setMode] = useState<
    "user" | "privileged" | "config" | "interface"
  >("user");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [commandProgress, setCommandProgress] = useState<CommandProgress>({
    completed: [],
    nextExpected: ["enable"],
  });
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const cliRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cliRef.current) {
      cliRef.current.scrollTop = cliRef.current.scrollHeight;
    }
  }, [cliOutput]);

  useEffect(() => {
    let currentSuggestions: string[] = ["Command Guide:", ""];

    if (mode === "user") {
      setSuggestions([
        "Command Guide:",
        "",
        "Next possible commands:",
        "Option 1:",
        "→ enable",
        "(Enter privileged mode)",
        "",
        "Current mode:",
        "→ USER mode",
      ]);
      return;
    }

    const nextCommands = getNextCommand();
    currentSuggestions.push("Next possible commands:");

    currentSuggestions.push(
      ...nextCommands
        .map((cmd, index) => [
          `Option ${index + 1}:`,
          `→ ${cmd}`,
          VALID_COMMANDS.find((c) => c.command === cmd)?.help
            ? `(${VALID_COMMANDS.find((c) => c.command === cmd)?.help})`
            : "",
          "",
        ])
        .flat()
    );

    currentSuggestions.push("Current mode:", `→ ${mode.toUpperCase()} mode`);

    setSuggestions(currentSuggestions);
  }, [mode, commandProgress, error]);

  const getPrompt = () => {
    switch (mode) {
      case "privileged":
        return "Router#";
      case "config":
        return "Router(config)#";
      case "interface":
        return "Router(config-if)#";
      default:
        return "Router>";
    }
  };

  const getNextCommand = (): string[] => {
    if (mode === "user") {
      return ["enable"];
    }

    const lastCommand =
      commandProgress.completed[
        commandProgress.completed.length - 1
      ]?.toLowerCase();

    switch (mode) {
      case "privileged":
        return ["configure terminal"];
      case "config":
        return ["ip route"];
      default:
        return ["enable"];
    }
  };

  const validateCommand = (
    command: string
  ): { valid: boolean; error?: string; help?: string } => {
    const fullCommand = command.trim().toLowerCase();

    if (command === "exit") return { valid: true };
    if (command === "end" && (mode === "config" || mode === "interface"))
      return { valid: true };
    if (command === "write memory" && mode === "privileged")
      return { valid: true };

    const validCommand = VALID_COMMANDS.find((cmd) =>
      fullCommand.startsWith(cmd.command.toLowerCase())
    );

    if (!validCommand) {
      return {
        valid: false,
        error: "Command not found",
        help: "Type 'help' or '?' for available commands",
      };
    }

    if (validCommand.requiredMode !== mode) {
      return {
        valid: false,
        error: `Command not available in ${mode} mode`,
        help: `You need to be in ${validCommand.requiredMode} mode`,
      };
    }

    return { valid: true };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && commandHistory.length > 0) {
      e.preventDefault();
      const newIndex =
        historyIndex < commandHistory.length - 1
          ? historyIndex + 1
          : historyIndex;
      setHistoryIndex(newIndex);
      setCliInput(commandHistory[commandHistory.length - 1 - newIndex]);
    } else if (e.key === "ArrowDown" && historyIndex >= 0) {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCliInput(
        newIndex === -1
          ? ""
          : commandHistory[commandHistory.length - 1 - newIndex]
      );
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const command = cliInput.trim().toLowerCase();
    if (!command) return;

    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    setCliOutput((prev) => [...prev, `${getPrompt()} ${command}`]);

    if (command === "clear") {
      setCliOutput(["Router CLI - Type 'help' or '?' for commands"]);
      setCliInput("");
      return;
    }

    if (command === "exit") {
      handleExitCommand();
      return;
    }

    const validation = validateCommand(command);
    if (!validation.valid) {
      handleInvalidCommand(validation);
      return;
    }

    handleValidCommand(command);
    setCliInput("");
  };

  const handleExitCommand = () => {
    switch (mode) {
      case "config":
        setMode("privileged");
        setCliOutput((prev) => [...prev, "Returned to privileged mode"]);
        break;
      case "privileged":
        setMode("user");
        setCliOutput((prev) => [...prev, "Returned to user mode"]);
        setCommandProgress({
          completed: [],
          nextExpected: ["enable"],
        });
        break;
    }
    setError(null);
    setCliInput("");
  };

  const handleInvalidCommand = (validation: {
    error?: string;
    help?: string;
  }) => {
    setCliOutput((prev) => [
      ...prev,
      validation.error || "Invalid command",
      validation.help || "Type 'help' or '?' for available commands",
    ]);
    setError(validation.error || null);
    setWrongAttempts((prev) => prev + 1);
    setCliInput("");
  };

  const handleValidCommand = (command: string) => {
    setError(null);
    setWrongAttempts(0);
    updateCommandProgress(command);

    const cmdLower = command.toLowerCase();

    switch (true) {
      case cmdLower === "enable":
        setMode("privileged");
        setCliOutput((prev) => [...prev, "Entered privileged mode"]);
        break;

      case cmdLower === "configure terminal":
        setMode("config");
        setCliOutput((prev) => [...prev, "Entered configuration mode"]);
        break;

      case cmdLower === "show ip route":
        if (routes.length === 0) {
          setCliOutput((prev) => [...prev, "No routes configured"]);
        } else {
          setCliOutput((prev) => [
            ...prev,
            "Destination        Next Hop          Mask              Metric  Status",
            "----------------------------------------------------------------",
            ...routes.map(
              (route) =>
                `${route.destination.padEnd(17)}${route.nextHop.padEnd(
                  17
                )}${route.mask.padEnd(17)}${route.metric.toString().padEnd(8)}${
                  route.status
                }`
            ),
          ]);
        }
        break;

      case cmdLower.startsWith("ping "):
        const ipAddress = command.split(" ")[1];
        if (!validateIPAddress(ipAddress)) {
          setCliOutput((prev) => [
            ...prev,
            "Invalid IP address format",
            "Usage: ping <ip-address>",
          ]);
          return;
        }
        setPingTarget(ipAddress);
        simulatePing();
        break;

      case cmdLower.startsWith("ip route "):
        if (mode !== "config") {
          setCliOutput((prev) => [
            ...prev,
            "Command not available in current mode",
            "Enter configuration mode first",
          ]);
          return;
        }

        const parts = command.split(" ");
        if (parts.length !== 5) {
          setCliOutput((prev) => [
            ...prev,
            "Invalid command format",
            "Usage: ip route <network> <mask> <next-hop>",
          ]);
          return;
        }

        const [, , network, mask, nextHop] = parts;
        if (
          !validateIPAddress(network) ||
          !validateIPAddress(mask) ||
          !validateIPAddress(nextHop)
        ) {
          setCliOutput((prev) => [...prev, "Invalid IP address format"]);
          return;
        }

        const newRoute: Route = {
          destination: network,
          mask: mask,
          nextHop: nextHop,
          metric: 1,
          status: "active",
        };

        setRoutes((prev) => [...prev, newRoute]);
        setCliOutput((prev) => [...prev, `Added route to ${network}`]);
        break;

      case cmdLower === "write memory":
        if (mode === "privileged") {
          setCliOutput((prev) => [
            ...prev,
            "Building configuration...",
            "[OK]",
            "Configuration saved",
          ]);
        }
        break;

      case cmdLower === "end":
        if (mode === "config") {
          setMode("privileged");
          setCliOutput((prev) => [...prev, "Returned to privileged mode"]);
        }
        break;

      case cmdLower === "help" || cmdLower === "?":
        const availableCommands = VALID_COMMANDS.filter(
          (cmd) => cmd.requiredMode === mode
        ).map((cmd) => `  ${cmd.command} - ${cmd.help}`);

        setCliOutput((prev) => [
          ...prev,
          `Available commands in ${mode.toUpperCase()} mode:`,
          ...availableCommands,
          "",
          "Special commands:",
          "  clear - Clear screen",
          "  exit - Exit current mode",
          mode !== "user" ? "  end - Return to privileged mode" : "",
        ]);
        break;
    }
  };

  const updateCommandProgress = (command: string) => {
    setCommandProgress((prev) => ({
      completed: [...prev.completed, command],
      nextExpected:
        VALID_COMMANDS.find((cmd) =>
          command.startsWith(cmd.command.toLowerCase())
        )?.nextCommands || [],
    }));
  };

  const validateIPAddress = (ip: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;

    const parts = ip.split(".").map(Number);
    return parts.every((part) => part >= 0 && part <= 255);
  };

  const simulatePing = () => {
    if (!validateIPAddress(pingTarget)) {
      setCliOutput((prev) => [
        ...prev,
        "Error: Invalid IP address format",
        "Usage: ping <ip-address>",
      ]);
      return;
    }

    const matchingRoute = routes.find((route) => {
      const destParts = route.destination.split(".");
      const maskParts = route.mask.split(".");
      const targetParts = pingTarget.split(".");

      return destParts.every(
        (part, i) =>
          (parseInt(part) & parseInt(maskParts[i])) ===
          (parseInt(targetParts[i]) & parseInt(maskParts[i]))
      );
    });

    setCliOutput((prev) => [
      ...prev,
      `Pinging ${pingTarget} with 32 bytes of data:`,
    ]);

    let successCount = 0;
    let totalLatency = 0;

    for (let i = 0; i < 4; i++) {
      const success = Math.random() > (matchingRoute ? 0.1 : 0.9);
      const latency = success ? Math.floor(Math.random() * 50) + 1 : 0;

      if (success) {
        successCount++;
        totalLatency += latency;
        setCliOutput((prev) => [
          ...prev,
          `Reply from ${pingTarget}: bytes=32 time=${latency}ms TTL=64`,
        ]);
      } else {
        setCliOutput((prev) => [...prev, "Request timed out"]);
      }
    }

    const avgLatency =
      successCount > 0 ? Math.round(totalLatency / successCount) : 0;
    setCliOutput((prev) => [
      ...prev,
      "",
      `Ping statistics for ${pingTarget}:`,
      `    Packets: Sent = 4, Received = ${successCount}, Lost = ${
        4 - successCount
      } (${Math.round(((4 - successCount) / 4) * 100)}% loss)`,
      successCount > 0
        ? `Approximate round trip times in milli-seconds:
      Minimum = ${Math.min(avgLatency - 5, 1)}ms, Maximum = ${
            avgLatency + 5
          }ms, Average = ${avgLatency}ms`
        : "",
    ]);

    const result: PingResult = {
      destination: pingTarget,
      success: successCount > 0,
      latency: avgLatency,
      timestamp: new Date().toLocaleTimeString(),
    };

    setPingResults((prev) => [result, ...prev.slice(0, 4)]);
  };

  const handleAddRoute = () => {
    if (
      !validateIPAddress(newRoute.destination) ||
      !validateIPAddress(newRoute.nextHop) ||
      !validateIPAddress(newRoute.mask)
    ) {
      setCliOutput((prevOutput) => [
        ...prevOutput,
        "Error: Invalid IP address format",
      ]);
      return;
    }

    setRoutes((prevRoutes) => [
      ...prevRoutes,
      { ...newRoute, status: "active" as const },
    ]);
    setCliOutput((prevOutput) => [
      ...prevOutput,
      `Added route to ${newRoute.destination}`,
    ]);
    setNewRoute({
      destination: "",
      nextHop: "",
      mask: "",
      metric: 1,
      status: "inactive" as const,
    });
  };

  const handleDeleteRoute = (index: number) => {
    setRoutes((prevRoutes) => prevRoutes.filter((_, i) => i !== index));
    setCliOutput((prevOutput) => [...prevOutput, `Deleted route ${index + 1}`]);
  };

  const handleFillData = (route: (typeof SAMPLE_ROUTES)[0]) => {
    setNewRoute({
      destination: route.destination,
      mask: route.mask,
      nextHop: route.nextHop,
      metric: route.metric,
      status: "inactive" as const,
    });
  };

  const [cliInput, setCliInput] = useState("");

  return (
    <div className="flex gap-6">
      {/* Left Side: Main Content */}
      <div className="flex-1 space-y-6">
        <UseCaseCard onFillData={handleFillData} />
        <Card>
          <CardHeader>
            <CardTitle>Static Route Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Destination Network</Label>
                  <input
                    type="text"
                    value={newRoute.destination}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, destination: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded p-2"
                    placeholder="e.g. 192.168.2.0"
                  />
                </div>
                <div>
                  <Label>Subnet Mask</Label>
                  <input
                    type="text"
                    value={newRoute.mask}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, mask: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded p-2"
                    placeholder="e.g. 255.255.255.0"
                  />
                </div>
                <div>
                  <Label>Next Hop</Label>
                  <input
                    type="text"
                    value={newRoute.nextHop}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, nextHop: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded p-2"
                    placeholder="e.g. 192.168.1.1"
                  />
                </div>
                <div>
                  <Label>Metric</Label>
                  <input
                    type="number"
                    value={newRoute.metric}
                    onChange={(e) =>
                      setNewRoute({
                        ...newRoute,
                        metric: parseInt(e.target.value),
                      })
                    }
                    className="w-full mt-1 bg-gray-800 border border-gray-700 rounded p-2"
                    min="1"
                  />
                </div>
                <button
                  onClick={handleAddRoute}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Route
                </button>
              </div>

              <div>
                <Label>Routing Table</Label>
                <div className="mt-2 space-y-2">
                  {routes.map((route, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 rounded p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-mono">
                          <div>
                            {route.destination}/{route.mask}
                          </div>
                          <div className="text-sm text-gray-400">
                            via {route.nextHop}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteRoute(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Metric: {route.metric}</span>
                        <span
                          className={
                            route.status === "active"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {route.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {routes.length === 0 && (
                    <div className="text-gray-500 text-center py-4">
                      No routes configured
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-black text-green-400 font-mono p-4 rounded-lg h-[calc(100vh-300px)] overflow-y-auto">
                  {cliOutput.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))}
                  <form onSubmit={handleCommand} className="flex items-center">
                    <span>{getPrompt()}</span>
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent outline-none border-none text-green-400 ml-2"
                      autoFocus
                    />
                  </form>
                </div>
                <div className="text-sm text-gray-400">
                  <p>Current Mode: {mode.toUpperCase()}</p>
                  <p>Type 'help' or '?' for available commands</p>
                </div>
              </div>

              <div>
                <Label>Recent Ping Results</Label>
                <div className="mt-2 space-y-2 h-[calc(100vh-300px)] overflow-y-auto">
                  {pingResults.map((result, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 rounded p-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-mono">{result.destination}</div>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            result.success ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {result.success ? `${result.latency}ms` : "Failed"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {result.timestamp}
                      </div>
                    </div>
                  ))}
                  {pingResults.length === 0 && (
                    <div className="text-gray-500 text-center py-4">
                      No ping results
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side: Help & Suggestions */}
      <Card className="w-1/4 h-[calc(100vh-24px)] sticky top-3">
        <CardHeader>
          <CardTitle>Help & Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {error && (
              <div className="text-red-500 mb-4 p-2 border border-red-500 rounded">
                {error}
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-orange-500 mb-2">Command Guide:</h3>
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className={`mb-1 text-sm ${
                    suggestion.startsWith("→")
                      ? "text-green-400 font-bold"
                      : "text-gray-400"
                  }`}
                >
                  {suggestion}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-400 mt-4">
              <p>Type 'help' or '?' for all available commands</p>
              <p>Type 'clear' to clear the screen</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
