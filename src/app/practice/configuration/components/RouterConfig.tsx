"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface RouterInterface {
  name: string;
  ipAddress: string;
  subnetMask: string;
  status: "up" | "down";
}

interface Command {
  command: string;
  requiredMode: "user" | "privileged" | "config" | "interface";
  nextCommands: string[];
  error?: string;
  help?: string;
  suggestion?: string;
  instructions?: string[];
}

// Add new interface for tracking command progress
interface CommandProgress {
  completed: string[];
  nextExpected: string[];
}

const VALID_COMMANDS: Command[] = [
  {
    command: "enable",
    requiredMode: "user",
    nextCommands: [
      "configure terminal",
      "show running-config",
      "show interfaces",
    ],
    help: "Enter privileged mode to access configuration commands",
    suggestion: "Use 'enable' to enter privileged mode",
    instructions: ["1. Enter 'enable' to access privileged mode"],
  },
  {
    command: "configure terminal",
    requiredMode: "privileged",
    nextCommands: [
      "interface GigabitEthernet0/0",
      "interface GigabitEthernet0/1",
    ],
    help: "Enter global configuration mode to modify router settings",
    suggestion: "Use 'configure terminal' to enter config mode",
    instructions: ["1. Enter 'configure terminal' to enter config mode"],
  },
  {
    command: "interface GigabitEthernet0/0",
    requiredMode: "config",
    nextCommands: ["ip address", "no shutdown", "shutdown", "exit"],
    help: "Configure the LAN interface",
    suggestion: "Select an interface: 'interface GigabitEthernet0/0'",
    instructions: ["1. Select an interface: 'interface GigabitEthernet0/0'"],
  },
  {
    command: "interface GigabitEthernet0/1",
    requiredMode: "config",
    nextCommands: ["ip address", "no shutdown", "shutdown", "exit"],
    help: "Configure the WAN interface",
    suggestion: "Select an interface: 'interface GigabitEthernet0/1'",
    instructions: ["1. Select an interface: 'interface GigabitEthernet0/1'"],
  },
  {
    command: "ip address",
    requiredMode: "interface",
    nextCommands: ["no shutdown", "shutdown", "exit"],
    help: "Set IP address and subnet mask for the interface",
    error:
      "Invalid IP address format. Use: ip address <ip-address> <subnet-mask>",
    suggestion: "Assign IP: 'ip address 192.168.1.1 255.255.255.0'",
    instructions: ["1. Assign IP: 'ip address 192.168.1.1 255.255.255.0'"],
  },
  {
    command: "write memory",
    requiredMode: "privileged",
    nextCommands: [],
    help: "Save the running configuration to startup configuration",
    suggestion: "Use 'write memory' to save configuration",
    instructions: ["1. Use 'write memory' to save your configuration"],
  },
  {
    command: "no shutdown",
    requiredMode: "interface",
    nextCommands: ["exit"],
    help: "Enable the interface",
    suggestion: "Use 'no shutdown' to enable the interface",
    instructions: ["1. Use 'no shutdown' to enable the interface"],
  },
];

// Function to calculate the Levenshtein distance (edit distance) between two strings
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[a.length][b.length];
};

// Function to find the closest matching command
const findClosestCommand = (
  input: string,
  commands: Command[]
): Command | null => {
  let closestCommand: Command | null = null;
  let minDistance = Infinity;

  for (const cmd of commands) {
    const distance = levenshteinDistance(
      input.toLowerCase(),
      cmd.command.toLowerCase()
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestCommand = cmd;
    }
  }

  // Only return a suggestion if the distance is small (e.g., <= 2)
  return minDistance <= 2 ? closestCommand : null;
};

export default function RouterConfig() {
  const [cliInput, setCliInput] = useState("");
  const [cliOutput, setCliOutput] = useState<string[]>([
    "Welcome to Router CLI",
    "Type 'help' or '?' for available commands",
    "Start with 'enable' to enter privileged mode",
  ]);
  const [mode, setMode] = useState<
    "user" | "privileged" | "config" | "interface"
  >("user");
  const [currentInterface, setCurrentInterface] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [interfaces, setInterfaces] = useState<RouterInterface[]>([
    {
      name: "GigabitEthernet0/0",
      ipAddress: "",
      subnetMask: "",
      status: "down",
    },
    {
      name: "GigabitEthernet0/1",
      ipAddress: "",
      subnetMask: "",
      status: "down",
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0); // Track wrong attempts

  // Add new state for tracking command progress
  const [commandProgress, setCommandProgress] = useState<CommandProgress>({
    completed: [],
    nextExpected: ["enable"],
  });

  const cliRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cliRef.current) {
      cliRef.current.scrollTop = cliRef.current.scrollHeight;
    }
  }, [cliOutput]);

  // Update help, suggestions, and instructions based on the current mode and input
  useEffect(() => {
    const updateHelp = () => {
      const nextCmd = getNextCommand();
      let currentSuggestions: string[] = [];

      switch (mode) {
        case "user":
          currentSuggestions = [
            "Start by entering privileged mode:",
            "1. Type 'enable'",
            "Next expected command: enable",
          ];
          break;
        case "privileged":
          currentSuggestions = [
            "Enter global configuration mode:",
            "1. Type 'configure terminal'",
            "Next expected command: configure terminal",
          ];
          break;
        case "config":
          if (!currentInterface) {
            currentSuggestions = [
              "Select an interface to configure:",
              "1. Type 'interface GigabitEthernet0/0' for the first interface",
              "2. Type 'interface GigabitEthernet0/1' for the second interface",
              `Next expected command: ${nextCmd}`,
            ];
          }
          break;
        case "interface":
          const currentInt = interfaces.find(
            (i) => i.name === currentInterface
          );
          if (currentInt) {
            if (!currentInt.ipAddress) {
              currentSuggestions = [
                "Configure IP address for the interface:",
                "1. Type 'ip address <ip-address> <subnet-mask>'",
                "Example: ip address 192.168.1.1 255.255.255.0",
                `Next expected command: ip address`,
              ];
            } else if (currentInt.status === "down") {
              currentSuggestions = [
                "Enable the interface:",
                "1. Type 'no shutdown' to bring the interface up",
                "Next expected command: no shutdown",
              ];
            } else {
              currentSuggestions = [
                "Interface configuration complete:",
                "1. Type 'exit' to return to global configuration mode",
                "Next expected command: exit",
              ];
            }
          }
          break;
      }

      setSuggestions(currentSuggestions);
    };

    updateHelp();
  }, [mode, currentInterface, interfaces]);

  // Proactively guide the user if they make repeated mistakes
  useEffect(() => {
    if (wrongAttempts >= 2) {
      const nextCommand = getNextCommand();
      if (nextCommand) {
        setSuggestions([`Try this command next: ${nextCommand}`]);
      }
    }
  }, [wrongAttempts]);

  // Update the getNextCommand function to use command progress
  const getNextCommand = (): string => {
    if (commandProgress.nextExpected.length > 0) {
      return commandProgress.nextExpected[0];
    }

    // Default progression if nextExpected is empty
    switch (mode) {
      case "user":
        return "enable";
      case "privileged":
        return "configure terminal";
      case "config":
        return "interface GigabitEthernet0/0";
      case "interface":
        if (!currentInterface) return "interface GigabitEthernet0/0";
        if (!interfaces.find((i) => i.name === currentInterface)?.ipAddress) {
          return "ip address 192.168.1.1 255.255.255.0";
        }
        if (
          interfaces.find((i) => i.name === currentInterface)?.status === "down"
        ) {
          return "no shutdown";
        }
        return "exit";
      default:
        return "enable";
    }
  };

  const getPrompt = () => {
    switch (mode) {
      case "privileged":
        return "Router#";
      case "config":
        return "Router(config)#";
      case "interface":
        return `Router(config-if)#`;
      default:
        return "Router>";
    }
  };

  const validateCommand = (
    command: string
  ): { valid: boolean; error?: string; help?: string } => {
    const fullCommand = command.trim();
    const commandParts = fullCommand.split(" ");
    const baseCommand = commandParts[0].toLowerCase();

    // Special handling for "no shutdown" command
    if (fullCommand.toLowerCase() === "no shutdown") {
      const validCommand = VALID_COMMANDS.find(
        (cmd) => cmd.command === "no shutdown"
      );
      if (validCommand && validCommand.requiredMode === mode) {
        return { valid: true };
      }
      return {
        valid: false,
        error: `Command not available in ${mode} mode.`,
        help: "You need to be in interface mode to use this command.",
      };
    }

    // Special commands (case-insensitive)
    if (["help", "?", "exit", "clear"].includes(baseCommand)) {
      return { valid: true };
    }

    // Find matching command (case-insensitive)
    const validCommand = VALID_COMMANDS.find((cmd) =>
      fullCommand.toLowerCase().startsWith(cmd.command.toLowerCase())
    );
    if (!validCommand) {
      // If no exact match, try to find the closest command
      const closestCommand = findClosestCommand(baseCommand, VALID_COMMANDS);
      if (closestCommand) {
        return {
          valid: false,
          error: `Command not found: ${command}`,
          help: `Did you mean '${closestCommand.command}'?`,
        };
      } else {
        return {
          valid: false,
          error: `Command not found: ${command}`,
          help: "Type 'help' or '?' for available commands.",
        };
      }
    }

    // Check if we're in the right mode
    if (validCommand.requiredMode !== mode) {
      return {
        valid: false,
        error: `Command not available in ${mode} mode.`,
        help: `You need to be in ${validCommand.requiredMode} mode. ${
          validCommand.requiredMode === "privileged"
            ? "Use 'enable' first."
            : validCommand.requiredMode === "config"
            ? "Use 'configure terminal' first."
            : "Check command sequence."
        }`,
      };
    }

    // Validate IP address format if setting IP
    if (baseCommand === "ip" && commandParts[1]?.toLowerCase() === "address") {
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (
        commandParts.length !== 4 ||
        !ipPattern.test(commandParts[2]) ||
        !ipPattern.test(commandParts[3])
      ) {
        return {
          valid: false,
          error: "Invalid IP address format",
          help: "Use format: ip address <ip-address> <subnet-mask>\nExample: ip address 192.168.1.1 255.255.255.0",
        };
      }
    }

    return { valid: true };
  };

  // Update handleCommand to track progress
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const command = cliInput.trim();

    // Add command to history
    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    // Add command to output with prompt
    setCliOutput((prev) => [...prev, `${getPrompt()} ${command}`]);

    // Handle special commands first
    if (command.toLowerCase() === "clear") {
      setCliOutput([
        "Welcome to Router CLI",
        "Type 'help' or '?' for available commands",
      ]);
      setCliInput("");
      return;
    }

    if (command.toLowerCase() === "help" || command.toLowerCase() === "?") {
      const availableCommands = VALID_COMMANDS.filter(
        (cmd) => cmd.requiredMode === mode
      ).map((cmd) => `  ${cmd.command} - ${cmd.help}`);

      setCliOutput((prev) => [
        ...prev,
        "Available commands:",
        ...availableCommands,
        "  clear - Clear screen",
        "  exit - Exit current mode",
        "  help/? - Show this help",
      ]);
      setCliInput("");
      return;
    }

    if (command.toLowerCase() === "exit") {
      switch (mode) {
        case "interface":
          setMode("config");
          setCurrentInterface(null);
          setCliOutput((prev) => [
            ...prev,
            "Exit interface configuration mode",
          ]);
          break;
        case "config":
          setMode("privileged");
          setCliOutput((prev) => [...prev, "Exit configuration mode"]);
          break;
        case "privileged":
          setMode("user");
          setCliOutput((prev) => [...prev, "Exit privileged mode"]);
          break;
      }
      setCliInput("");
      return;
    }

    // Validate command
    const validation = validateCommand(command);
    if (!validation.valid) {
      setCliOutput((prev) => [...prev, `Error: ${validation.error}`]);

      setError(validation.error || null);
      // Enhanced error suggestions - only shown in Help & Suggestions panel
      const nextCmd = getNextCommand();
      setSuggestions([
        "Command entered incorrectly!",
        `Next command should be: ${nextCmd}`,
        "Type 'help' or '?' for available commands",
        "Make sure you are in the correct mode",
        currentInterface
          ? `Currently configuring interface: ${currentInterface}`
          : "No interface selected",
      ]);

      setInstructions([]);
      setWrongAttempts((prev) => prev + 1);
      setCliInput("");
      return;
    }

    // Reset wrong attempts if the command is valid
    setWrongAttempts(0);

    // Update command progress based on successful commands
    updateCommandProgress(command);

    // Handle mode changes and interface configuration
    if (command.toLowerCase() === "enable") {
      setMode("privileged");
      setCliOutput((prev) => [...prev, "Entered privileged mode"]);
    } else if (command.toLowerCase() === "configure terminal") {
      setMode("config");
      setCliOutput((prev) => [...prev, "Entered configuration mode"]);
    } else if (command.toLowerCase().startsWith("interface")) {
      const interfaceName = command.split(" ")[1];
      const targetInterface = interfaces.find(
        (intf) => intf.name.toLowerCase() === interfaceName.toLowerCase()
      );

      if (targetInterface) {
        setMode("interface");
        setCurrentInterface(targetInterface.name);
        setCliOutput((prev) => [
          ...prev,
          `Configuring interface ${targetInterface.name}`,
        ]);
      } else {
        setCliOutput((prev) => [...prev, "Invalid interface name"]);
      }
    } else if (
      command.toLowerCase().startsWith("ip address") &&
      currentInterface
    ) {
      const [, , ipAddress, subnetMask] = command.split(" ");
      setInterfaces(
        interfaces.map((intf) =>
          intf.name === currentInterface
            ? { ...intf, ipAddress, subnetMask }
            : intf
        )
      );
      setCliOutput((prev) => [...prev, "IP address configured"]);
    } else if (command.toLowerCase() === "no shutdown" && currentInterface) {
      setInterfaces(
        interfaces.map((intf) =>
          intf.name === currentInterface ? { ...intf, status: "up" } : intf
        )
      );
      setCliOutput((prev) => [
        ...prev,
        `%LINK-5-CHANGED: Interface ${currentInterface}, changed state to up`,
        `%LINEPROTO-5-UPDOWN: Line protocol on Interface ${currentInterface}, changed state to up`,
      ]);
    } else if (command.toLowerCase() === "show running-config") {
      const config = ["Current configuration:", "!"];

      interfaces.forEach((intf) => {
        if (intf.ipAddress && intf.subnetMask) {
          config.push(
            `interface ${intf.name}`,
            ` ip address ${intf.ipAddress} ${intf.subnetMask}`,
            ` ${intf.status === "up" ? "no shutdown" : "shutdown"}`,
            "!"
          );
        }
      });

      setCliOutput((prev) => [...prev, ...config]);
    } else if (command.toLowerCase() === "write memory") {
      setCliOutput((prev) => [...prev, "Building configuration...", "[OK]"]);
    }

    setCliInput("");
  };

  // Add new function to update command progress
  const updateCommandProgress = (command: string) => {
    const baseCommand = command.split(" ")[0].toLowerCase();
    let newNextExpected: string[] = [];

    switch (baseCommand) {
      case "enable":
        newNextExpected = ["configure terminal"];
        break;
      case "configure":
        newNextExpected = ["interface GigabitEthernet0/0"];
        break;
      case "interface":
        if (command.includes("0/0")) {
          newNextExpected = ["ip address", "no shutdown"];
        } else if (command.includes("0/1")) {
          newNextExpected = ["ip address", "no shutdown"];
        }
        break;
      case "ip":
        newNextExpected = ["no shutdown"];
        break;
      case "no":
        if (currentInterface?.includes("0/0")) {
          newNextExpected = ["exit", "interface GigabitEthernet0/1"];
        } else if (currentInterface?.includes("0/1")) {
          newNextExpected = ["exit", "write memory"];
        }
        break;
      case "exit":
        if (mode === "interface" && currentInterface?.includes("0/0")) {
          newNextExpected = ["interface GigabitEthernet0/1"];
        } else if (mode === "interface" && currentInterface?.includes("0/1")) {
          newNextExpected = ["write memory"];
        }
        break;
    }

    setCommandProgress((prev) => ({
      completed: [...prev.completed, command],
      nextExpected: newNextExpected,
    }));
  };

  // Update the effect that handles wrong attempts to show next command
  useEffect(() => {
    if (wrongAttempts > 0) {
      const nextCommand = getNextCommand();
      setSuggestions([
        `Try this command next: ${nextCommand}`,
        "Type 'help' or '?' for more information",
      ]);
    }
  }, [wrongAttempts]);

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

  return (
    <div className="flex gap-6">
      {/* CLI Section (Left Side) */}
      <div className="flex-1 space-y-6">
        {/* Summary Statement */}
        <Card>
          <CardHeader>
            <CardTitle>Task Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white">
              Configure the router by setting up the following interfaces:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  <strong>GigabitEthernet0/0</strong>: Assign an IP address
                  (e.g., 192.168.1.1) and subnet mask (e.g., 255.255.255.0),
                  then enable the interface.
                </li>
                <li>
                  <strong>GigabitEthernet0/1</strong>: Assign an IP address
                  (e.g., 192.168.2.1) and subnet mask (e.g., 255.255.255.0),
                  then enable the interface.
                </li>
              </ul>
              Use the CLI below to complete the task.
            </p>
          </CardContent>
        </Card>

        {/* CLI Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Router CLI</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={cliRef}
              className="bg-black text-green-400 font-mono p-4 rounded-lg h-96 overflow-y-auto mb-4"
            >
              {cliOutput.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              <div className="flex items-center">
                <span>{getPrompt()}</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCommand(e);
                    }
                  }}
                  className="flex-1 bg-transparent outline-none border-none text-green-400"
                  autoFocus
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interface Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Interface Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interfaces.map((intf) => (
                <div key={intf.name} className="border p-4 rounded-lg">
                  <Label>{intf.name}</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <Label className="text-sm text-gray-500">
                        IP Address
                      </Label>
                      <div>{intf.ipAddress || "Not configured"}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">
                        Subnet Mask
                      </Label>
                      <div>{intf.subnetMask || "Not configured"}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Status</Label>
                      <div
                        className={
                          intf.status === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {intf.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help/Suggestions Section (Right Side) */}
      <Card className="w-1/4">
        <CardHeader>
          <CardTitle>Help & Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {suggestions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-orange-500 mb-2">Suggestions:</h3>
              {suggestions.map((suggestion, i) => (
                <div key={i} className="mb-1">
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          {instructions.length > 0 && (
            <div>
              <h3 className="text-orange-500 mb-2">Instructions:</h3>
              {instructions.map((instruction, i) => (
                <div key={i} className="mb-1">
                  {instruction}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
