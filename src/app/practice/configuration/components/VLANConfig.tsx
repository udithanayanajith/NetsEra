"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface VLAN {
  id: number;
  name: string;
  ports: number[];
}

interface SwitchPort {
  id: number;
  vlan: number | null;
  mode: "access";
  status: "up" | "down";
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
    command: "configure terminal",
    requiredMode: "privileged",
    nextCommands: ["vlan 10", "vlan 20"],
    help: "Enter global configuration mode",
    suggestion: "Use 'configure terminal' to enter config mode",
    instructions: ["1. Enter 'configure terminal' to enter config mode"],
  },
  {
    command: "vlan 10",
    requiredMode: "config",
    nextCommands: ["name Marketing", "interface fastethernet0/1"],
    help: "Create VLAN 10",
    suggestion: "Create Marketing VLAN with: 'vlan 10'",
    instructions: ["1. Create VLAN 10 for Marketing department"],
  },
  {
    command: "name Marketing",
    requiredMode: "config",
    nextCommands: ["interface fastethernet0/1"],
    help: "Set VLAN 10 name",
    suggestion: "Name the VLAN: 'name Marketing'",
    instructions: ["1. Set VLAN name to Marketing"],
  },
  {
    command: "interface fastethernet0/1",
    requiredMode: "config",
    nextCommands: ["switchport mode access"],
    help: "Configure port 1 for Marketing",
    suggestion: "Select interface: 'interface fastethernet0/1'",
    instructions: ["1. Configure port 1 for Marketing VLAN"],
  },
  {
    command: "vlan 20",
    requiredMode: "config",
    nextCommands: ["name Engineering", "interface fastethernet0/2"],
    help: "Create VLAN 20",
    suggestion: "Create Engineering VLAN with: 'vlan 20'",
    instructions: ["1. Create VLAN 20 for Engineering department"],
  },
  {
    command: "name Engineering",
    requiredMode: "config",
    nextCommands: ["interface fastethernet0/2"],
    help: "Set VLAN 20 name",
    suggestion: "Name the VLAN: 'name Engineering'",
    instructions: ["1. Set VLAN name to Engineering"],
  },
  {
    command: "interface fastethernet0/2",
    requiredMode: "config",
    nextCommands: ["switchport mode access"],
    help: "Configure port 2 for Engineering",
    suggestion: "Select interface: 'interface fastethernet0/2'",
    instructions: ["1. Configure port 2 for Engineering VLAN"],
  },
  {
    command: "switchport mode access",
    requiredMode: "interface",
    nextCommands: ["switchport access vlan"],
    help: "Set port mode to access",
    suggestion: "Set mode: 'switchport mode access'",
    instructions: ["1. Set port mode to access"],
  },
  {
    command: "switchport access vlan",
    requiredMode: "interface",
    nextCommands: ["no shutdown"],
    help: "Assign VLAN to port",
    suggestion: "Assign VLAN: 'switchport access vlan 10/20'",
    instructions: ["1. Assign the port to appropriate VLAN"],
  },
  {
    command: "no shutdown",
    requiredMode: "interface",
    nextCommands: ["exit"],
    help: "Enable the interface",
    suggestion: "Enable port: 'no shutdown'",
    instructions: ["1. Enable the port"],
  },
  {
    command: "exit",
    requiredMode: "interface",
    nextCommands: ["end"],
    help: "Exit interface configuration",
    suggestion: "Type 'exit' to return to config mode",
    instructions: ["1. Exit interface configuration"],
  },
  {
    command: "end",
    requiredMode: "config",
    nextCommands: ["write memory"],
    help: "Return to privileged mode",
    suggestion: "Type 'end' to return to privileged mode",
    instructions: ["1. Return to privileged mode"],
  },
  {
    command: "write memory",
    requiredMode: "privileged",
    nextCommands: [],
    help: "Save the configuration",
    suggestion: "Save config: 'write memory'",
    instructions: ["1. Save the configuration"],
  },
];

export default function VLANConfig() {
  const [vlans, setVlans] = useState<VLAN[]>([
    { id: 10, name: "Marketing", ports: [] },
    { id: 20, name: "Engineering", ports: [] },
  ]);

  const [ports, setPorts] = useState<SwitchPort[]>([
    { id: 1, vlan: null, mode: "access", status: "down" },
    { id: 2, vlan: null, mode: "access", status: "down" },
  ]);

  const [mode, setMode] = useState<
    "user" | "privileged" | "config" | "interface"
  >("user");
  const [currentInterface, setCurrentInterface] = useState<string | null>(null);
  const [cliInput, setCliInput] = useState("");
  const [cliOutput, setCliOutput] = useState<string[]>([
    "Welcome to Switch CLI",
    "Type 'help' or '?' for available commands",
    "Start with 'enable' to enter privileged mode",
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [commandProgress, setCommandProgress] = useState<CommandProgress>({
    completed: [],
    nextExpected: ["enable"],
  });

  // Add command history states
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

    // Handle other modes
    const nextCommands = getNextCommand();
    currentSuggestions.push("Next possible commands:");

    // Special handling for config mode when first entering
    if (
      mode === "config" &&
      commandProgress.completed[commandProgress.completed.length - 1] ===
        "configure terminal"
    ) {
      currentSuggestions.push(
        "Option 1:",
        "→ vlan 10",
        "(Create VLAN 10 for Marketing Department)",
        "",
        "Option 2:",
        "→ vlan 20",
        "(Create VLAN 20 for Engineering Department)",
        ""
      );
    } else {
      // Regular command suggestions
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
    }

    currentSuggestions.push("Current mode:", `→ ${mode.toUpperCase()} mode`);

    if (currentInterface) {
      currentSuggestions.push(
        "",
        "Current interface:",
        `→ ${currentInterface}`
      );
    }

    setSuggestions(currentSuggestions);
  }, [mode, currentInterface, commandProgress, error]);

  const getPrompt = () => {
    switch (mode) {
      case "privileged":
        return "Switch#";
      case "config":
        return "Switch(config)#";
      case "interface":
        return `Switch(config-if)#`;
      default:
        return "Switch>";
    }
  };

  const getNextCommand = (): string[] => {
    // Always check current mode first
    if (mode === "user") {
      return ["enable"];
    }

    // Get the last completed command
    const lastCommand =
      commandProgress.completed[
        commandProgress.completed.length - 1
      ]?.toLowerCase();

    // For other modes, check command progress
    switch (mode) {
      case "privileged":
        return ["configure terminal"];

      case "config":
        // If last command was name Marketing
        if (lastCommand === "name marketing") {
          return ["interface fastethernet0/1"];
        }
        // If last command was name Engineering
        if (lastCommand === "name engineering") {
          return ["interface fastethernet0/2"];
        }
        // If last command was vlan 10
        if (lastCommand === "vlan 10") {
          return ["name Marketing"];
        }
        // If last command was vlan 20
        if (lastCommand === "vlan 20") {
          return ["name Engineering"];
        }
        // If we just entered config mode or returned from interface mode
        if (lastCommand === "configure terminal" || lastCommand === "exit") {
          return ["vlan 10", "vlan 20"];
        }
        return ["vlan 10", "vlan 20"];

      case "interface":
        if (lastCommand?.startsWith("interface")) {
          return ["switchport mode access"];
        }
        if (lastCommand === "switchport mode access") {
          return currentInterface?.includes("0/1")
            ? ["switchport access vlan 10"]
            : ["switchport access vlan 20"];
        }
        if (lastCommand?.startsWith("switchport access vlan")) {
          return ["no shutdown"];
        }
        if (lastCommand === "no shutdown") {
          return ["exit"];
        }
        return ["switchport mode access"];

      default:
        return ["enable"];
    }
  };

  const validateCommand = (
    command: string
  ): { valid: boolean; error?: string; help?: string } => {
    const fullCommand = command.trim().toLowerCase();

    // Special commands that are always valid in their modes
    if (command === "exit") {
      return { valid: true };
    }

    if (command === "end" && (mode === "config" || mode === "interface")) {
      return { valid: true };
    }

    if (command === "write memory" && mode === "privileged") {
      return { valid: true };
    }

    // Handle other commands
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

  // Add handleKeyDown function for arrow key navigation
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

    // Add command to history
    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    // Show command in CLI
    setCliOutput((prev) => [...prev, `${getPrompt()} ${command}`]);

    if (command === "clear") {
      setCliOutput([
        "Welcome to Switch CLI",
        "Type 'help' or '?' for available commands",
      ]);
      setCliInput("");
      return;
    }

    // Handle exit command
    if (command === "exit") {
      switch (mode) {
        case "interface":
          setMode("config");
          setCurrentInterface(null);
          setCliOutput((prev) => [...prev, "Returned to configuration mode"]);
          // Clear any error messages
          setError(null);
          break;
        case "config":
          setMode("privileged");
          setCliOutput((prev) => [...prev, "Returned to privileged mode"]);
          setError(null);
          break;
        case "privileged":
          setMode("user");
          setCliOutput((prev) => [...prev, "Returned to user mode"]);
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
          setCommandProgress({
            completed: [],
            nextExpected: ["enable"],
          });
          setError(null);
          break;
      }
      setCliInput("");
      return;
    }

    // Handle other commands
    const validation = validateCommand(command);
    if (!validation.valid) {
      setCliOutput((prev) => [
        ...prev,
        `Command not found. Use "help" or "?" to view available commands.`,
      ]);

      const nextCmd = getNextCommand();
      setSuggestions([
        "Command entered incorrectly!",
        `Next command should be: ${nextCmd}`,
        "Type 'help' or '?' for available commands",
        `You are in ${mode} mode`,
        currentInterface ? `Currently configuring: ${currentInterface}` : "",
      ]);

      setError(validation.error || null);
      setWrongAttempts((prev) => prev + 1);
      setCliInput("");
      return;
    }

    // If command is valid, clear any previous error messages
    setError(null);
    setWrongAttempts(0);
    updateCommandProgress(command);

    // Handle commands
    if (command === "enable") {
      setMode("privileged");
      setCliOutput((prev) => [...prev, "Entered privileged mode"]);
    } else if (command === "configure terminal") {
      setMode("config");
      setCliOutput((prev) => [
        ...prev,
        "Entered configuration mode",
        "Available VLANs:",
        "  VLAN 10 - Marketing Department",
        "  VLAN 20 - Engineering Department",
      ]);
    } else if (command === "write memory") {
      if (mode === "privileged") {
        setCliOutput((prev) => [...prev, "Building configuration...", "[OK]"]);
      }
    } else if (command === "no shutdown") {
      if (currentInterface) {
        const interfaceName = currentInterface;
        setPorts((prev) =>
          prev.map((port) => {
            if (port.id === parseInt(interfaceName.split("/")[1])) {
              return { ...port, status: "up" };
            }
            return port;
          })
        );
        setCliOutput((prev) => [
          ...prev,
          `%LINK-5-CHANGED: Interface ${interfaceName}, changed state to up`,
          `%LINEPROTO-5-UPDOWN: Line protocol on Interface ${interfaceName}, changed state to up`,
        ]);
      }
    } else if (command.startsWith("interface fastethernet")) {
      setMode("interface");
      setCurrentInterface(command.split(" ")[1]);
      setCliOutput((prev) => [
        ...prev,
        `Configuring interface ${command.split(" ")[1]}`,
      ]);
    } else if (command === "switchport mode access") {
      setCliOutput((prev) => [...prev, "Switched port to access mode"]);
    } else if (command.startsWith("switchport access vlan")) {
      const vlanId = parseInt(command.split(" ")[3]);
      setCliOutput((prev) => [...prev, `Assigned port to VLAN ${vlanId}`]);
      if (currentInterface) {
        const portNumber = parseInt(currentInterface.split("/")[1]);
        setPorts((prev) =>
          prev.map((port) =>
            port.id === portNumber ? { ...port, vlan: vlanId } : port
          )
        );
        setVlans((prev) =>
          prev.map((vlan) => ({
            ...vlan,
            ports:
              vlan.id === vlanId
                ? [...new Set([...vlan.ports, portNumber])]
                : vlan.ports.filter((p) => p !== portNumber),
          }))
        );
      }
    }

    setCliInput("");
  };

  const updateCommandProgress = (command: string) => {
    setCommandProgress((prev) => {
      const completed = [...prev.completed, command];
      const validCommand = VALID_COMMANDS.find((cmd) =>
        command.startsWith(cmd.command.toLowerCase())
      );

      // Determine next commands based on current command and mode
      let nextCommands: string[] = [];

      if (validCommand) {
        switch (command.toLowerCase()) {
          case "vlan 10":
            nextCommands = ["name Marketing"];
            break;
          case "name marketing":
            nextCommands = ["interface fastethernet0/1"];
            break;
          case "vlan 20":
            nextCommands = ["name Engineering"];
            break;
          case "name engineering":
            nextCommands = ["interface fastethernet0/2"];
            break;
          case "switchport mode access":
            nextCommands = currentInterface?.includes("0/1")
              ? ["switchport access vlan 10"]
              : ["switchport access vlan 20"];
            break;
          case "no shutdown":
            nextCommands = ["exit"];
            break;
          default:
            nextCommands = validCommand.nextCommands;
        }
      }

      return {
        completed,
        nextExpected: nextCommands,
      };
    });
  };

  return (
    <div className="flex gap-6">
      {/* Left Side: CLI and Configuration */}
      <div className="flex-1 space-y-6">
        {/* Task Description Card with integrated port status */}
        <Card>
          <CardHeader>
            <CardTitle>VLAN Configuration Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded bg-gray-800">
                <strong className="text-lg">Marketing VLAN</strong>
                <ul className="list-disc pl-5 mt-2">
                  <li>VLAN ID: 10</li>
                  <li>Port: FastEthernet0/1</li>
                  <li>Mode: Access</li>
                </ul>
                <div className="mt-3 border-t border-gray-600 pt-3">
                  <strong className="text-sm text-gray-300">
                    Port Status:
                  </strong>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-sm text-gray-400">VLAN:</span>
                      <div className="font-medium">
                        {ports[0].vlan || "None"}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Status:</span>
                      <div
                        className={
                          ports[0].status === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {ports[0].status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded bg-gray-800">
                <strong className="text-lg">Engineering VLAN</strong>
                <ul className="list-disc pl-5 mt-2">
                  <li>VLAN ID: 20</li>
                  <li>Port: FastEthernet0/2</li>
                  <li>Mode: Access</li>
                </ul>
                <div className="mt-3 border-t border-gray-600 pt-3">
                  <strong className="text-sm text-gray-300">
                    Port Status:
                  </strong>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-sm text-gray-400">VLAN:</span>
                      <div className="font-medium">
                        {ports[1].vlan || "None"}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Status:</span>
                      <div
                        className={
                          ports[1].status === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {ports[1].status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CLI Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Switch CLI</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={cliRef}
              className="bg-black text-green-400 font-mono p-4 rounded-lg h-[calc(100vh-300px)] overflow-y-auto mb-4"
            >
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
