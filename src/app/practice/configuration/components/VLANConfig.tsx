"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

interface VLAN {
  id: number;
  name: string;
  ports: number[];
}

interface SwitchPort {
  id: number;
  vlan: number | null;
  mode: "access" | "trunk";
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
    nextCommands: ["switchport access vlan 10", "switchport access vlan 20"],
    help: "Set port mode to access",
    suggestion: "Set mode: 'switchport mode access'",
    instructions: ["1. Set port mode to access"],
  },
  {
    command: "switchport access vlan 10",
    requiredMode: "interface",
    nextCommands: ["exit"],
    help: "Assign VLAN 10 to port",
    suggestion: "Assign VLAN: 'switchport access vlan 10'",
    instructions: ["1. Assign the port to VLAN 10"],
  },
  {
    command: "switchport access vlan 20",
    requiredMode: "interface",
    nextCommands: ["exit"],
    help: "Assign VLAN 20 to port",
    suggestion: "Assign VLAN: 'switchport access vlan 20'",
    instructions: ["1. Assign the port to VLAN 20"],
  },
  {
    command: "interface gigabitethernet0/1",
    requiredMode: "config",
    nextCommands: ["switchport mode trunk"],
    help: "Configure trunk port",
    suggestion: "Select trunk interface: 'interface gigabitethernet0/1'",
    instructions: ["1. Configure trunk port"],
  },
  {
    command: "switchport mode trunk",
    requiredMode: "interface",
    nextCommands: ["switchport trunk allowed vlan 10,20"],
    help: "Set port mode to trunk",
    suggestion: "Set mode: 'switchport mode trunk'",
    instructions: ["1. Set port mode to trunk"],
  },
  {
    command: "switchport trunk allowed vlan 10,20",
    requiredMode: "interface",
    nextCommands: ["exit"],
    help: "Allow VLANs on trunk port",
    suggestion: "Allow VLANs: 'switchport trunk allowed vlan 10,20'",
    instructions: ["1. Allow VLANs on trunk port"],
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
    { id: 3, vlan: null, mode: "access", status: "down" },
    { id: 4, vlan: null, mode: "trunk", status: "down" },
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
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [configCompleted, setConfigCompleted] = useState({
    marketing: false,
    engineering: false,
    trunk: false,
  });

  const cliRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cliRef.current) {
      cliRef.current.scrollTop = cliRef.current.scrollHeight;
    }
  }, [cliOutput]);

  useEffect(() => {
    updateSuggestions();
  }, [mode, currentInterface, commandProgress, error, configCompleted]);

  const updateSuggestions = () => {
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

    const nextCommands = getNextCommands();
    currentSuggestions.push("Next possible commands:");

    if (nextCommands.length === 0) {
      currentSuggestions.push("No more commands needed");
    } else {
      nextCommands.forEach((cmd, index) => {
        currentSuggestions.push(`Option ${index + 1}:`);
        currentSuggestions.push(`→ ${cmd}`);

        const cmdInfo = VALID_COMMANDS.find(
          (c) =>
            c.command === cmd ||
            (cmd.startsWith("switchport access vlan") &&
              c.command.startsWith("switchport access vlan"))
        );

        if (cmdInfo?.help) {
          currentSuggestions.push(`(${cmdInfo.help})`);
        }
        currentSuggestions.push("");
      });
    }

    currentSuggestions.push("Current mode:", `→ ${mode.toUpperCase()} mode`);

    if (currentInterface) {
      currentSuggestions.push(
        "",
        "Current interface:",
        `→ ${currentInterface}`
      );
    }

    currentSuggestions.push(
      "",
      "Configuration Status:",
      `→ Marketing VLAN: ${
        configCompleted.marketing ? "CONFIGURED ✓" : "NOT CONFIGURED ✗"
      }`,
      `→ Engineering VLAN: ${
        configCompleted.engineering ? "CONFIGURED ✓" : "NOT CONFIGURED ✗"
      }`,
      `→ Trunk Port: ${
        configCompleted.trunk ? "CONFIGURED ✓" : "NOT CONFIGURED ✗"
      }`
    );

    setSuggestions(currentSuggestions);
  };

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

  const getNextCommands = (): string[] => {
    if (
      configCompleted.marketing &&
      configCompleted.engineering &&
      configCompleted.trunk
    ) {
      if (mode === "interface") return ["exit"];
      if (mode === "config") return ["end"];
      if (mode === "privileged") return ["write memory"];
      return [];
    }

    if (mode === "user") {
      return ["enable"];
    }

    if (mode === "privileged") {
      return ["configure terminal"];
    }

    if (mode === "config") {
      const lastCommand =
        commandProgress.completed[
          commandProgress.completed.length - 1
        ]?.toLowerCase();

      if (
        configCompleted.marketing &&
        configCompleted.engineering &&
        !configCompleted.trunk
      ) {
        return ["interface gigabitethernet0/1"];
      }

      if (
        configCompleted.marketing &&
        !configCompleted.engineering &&
        (lastCommand === "exit" || lastCommand === "configure terminal")
      ) {
        return ["vlan 20"];
      }

      if (lastCommand === "name marketing") {
        return ["interface fastethernet0/1"];
      }

      if (lastCommand === "name engineering") {
        return ["interface fastethernet0/2"];
      }

      if (lastCommand === "vlan 10") {
        return ["name Marketing"];
      }

      if (lastCommand === "vlan 20") {
        return ["name Engineering"];
      }

      if (lastCommand === "configure terminal") {
        if (!configCompleted.marketing) {
          return ["vlan 10"];
        } else if (!configCompleted.engineering) {
          return ["vlan 20"];
        } else if (!configCompleted.trunk) {
          return ["interface gigabitethernet0/1"];
        }
      }

      if (lastCommand === "exit") {
        if (!configCompleted.marketing) {
          return ["vlan 10"];
        } else if (!configCompleted.engineering) {
          return ["vlan 20"];
        } else if (!configCompleted.trunk) {
          return ["interface gigabitethernet0/1"];
        } else {
          return ["end"];
        }
      }

      const options = [];
      if (!configCompleted.marketing) options.push("vlan 10");
      if (!configCompleted.engineering) options.push("vlan 20");
      if (
        configCompleted.marketing &&
        configCompleted.engineering &&
        !configCompleted.trunk
      )
        options.push("interface gigabitethernet0/1");
      return options.length ? options : ["end"];
    }

    if (mode === "interface") {
      const lastCommand =
        commandProgress.completed[
          commandProgress.completed.length - 1
        ]?.toLowerCase();

      if (lastCommand?.startsWith("interface")) {
        if (currentInterface?.includes("gigabitethernet0/1")) {
          return ["switchport mode trunk"];
        } else {
          return ["switchport mode access"];
        }
      }

      if (lastCommand === "switchport mode access") {
        if (currentInterface?.includes("0/1")) {
          return ["switchport access vlan 10"];
        } else if (currentInterface?.includes("0/2")) {
          return ["switchport access vlan 20"];
        }
      }

      if (lastCommand === "switchport mode trunk") {
        return ["switchport trunk allowed vlan 10,20"];
      }

      if (
        lastCommand?.startsWith("switchport access vlan") ||
        lastCommand === "switchport trunk allowed vlan 10,20"
      ) {
        return ["exit"];
      }

      if (currentInterface?.includes("gigabitethernet0/1")) {
        return ["switchport mode trunk"];
      } else {
        return ["switchport mode access"];
      }
    }

    return ["enable"];
  };

  const validateCommand = (
    command: string
  ): { valid: boolean; error?: string; help?: string } => {
    const fullCommand = command.trim().toLowerCase();

    if (fullCommand === "help" || fullCommand === "?") {
      return { valid: true };
    }

    if (fullCommand === "clear") {
      return { valid: true };
    }

    if (fullCommand === "exit") {
      if (mode !== "user") {
        return { valid: true };
      } else {
        return {
          valid: false,
          error: "Cannot exit from user mode",
          help: "Use 'enable' to enter privileged mode",
        };
      }
    }

    if (fullCommand === "end" && (mode === "config" || mode === "interface")) {
      return { valid: true };
    }

    if (fullCommand === "write memory" && mode === "privileged") {
      return { valid: true };
    }

    if (fullCommand.startsWith("switchport access vlan")) {
      const vlanId = fullCommand.split(" ")[3];

      if (currentInterface?.includes("0/1") && vlanId === "10") {
        return { valid: true };
      } else if (currentInterface?.includes("0/2") && vlanId === "20") {
        return { valid: true };
      } else {
        return {
          valid: false,
          error: `Incorrect VLAN assignment. Use 'switchport access vlan ${
            currentInterface?.includes("0/1") ? "10" : "20"
          }'`,
          help: `Port ${
            currentInterface?.includes("0/1") ? "1" : "2"
          } should be assigned to VLAN ${
            currentInterface?.includes("0/1") ? "10" : "20"
          }`,
        };
      }
    }

    if (fullCommand.startsWith("switchport trunk allowed vlan")) {
      const vlans = fullCommand.split(" ")[4];
      if (vlans === "10,20") {
        return { valid: true };
      } else {
        return {
          valid: false,
          error:
            "Incorrect VLAN list. Use 'switchport trunk allowed vlan 10,20'",
          help: "The trunk should allow both VLANs 10 and 20",
        };
      }
    }

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

    if (command === "help" || command === "?") {
      const nextCmds = getNextCommands();
      setCliOutput((prev) => [
        ...prev,
        "Available commands:",
        ...nextCmds.map((cmd) => `  ${cmd}`),
        "",
        "Other commands:",
        "  exit - Exit current mode",
        "  end - Return to privileged mode",
        "  clear - Clear screen",
        "  help/? - Show this help",
      ]);
      setCliInput("");
      return;
    }

    if (command === "clear") {
      setCliOutput([
        "Welcome to Switch CLI",
        "Type 'help' or '?' for available commands",
      ]);
      setCliInput("");
      return;
    }

    if (command === "exit") {
      switch (mode) {
        case "interface":
          setMode("config");
          setCurrentInterface(null);
          setCliOutput((prev) => [...prev, "Returned to configuration mode"]);
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

    if (command === "end" && (mode === "config" || mode === "interface")) {
      setMode("privileged");
      if (mode === "interface") {
        setCurrentInterface(null);
      }
      setCliOutput((prev) => [...prev, "Returned to privileged mode"]);
      setCliInput("");
      return;
    }

    const validation = validateCommand(command);
    if (!validation.valid) {
      setCliOutput((prev) => [
        ...prev,
        validation.error || "Invalid command. Type 'help' for assistance.",
      ]);

      setError(validation.error || null);
      setWrongAttempts((prev) => prev + 1);
      setCliInput("");
      return;
    }

    setError(null);
    setWrongAttempts(0);

    const newCompleted = [...commandProgress.completed, command];
    setCommandProgress({
      completed: newCompleted,
      nextExpected: getNextCommands(),
    });

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
        setCliOutput((prev) => [
          ...prev,
          "Building configuration...",
          "[OK]",
          configCompleted.marketing &&
          configCompleted.engineering &&
          configCompleted.trunk
            ? "All VLANs and trunk port have been successfully configured and saved!"
            : "Configuration saved, but some items are not configured yet.",
        ]);
      }
    } else if (command.startsWith("interface fastethernet0/1")) {
      setMode("interface");
      setCurrentInterface("fastethernet0/1");
      setCliOutput((prev) => [
        ...prev,
        `Configuring interface fastethernet0/1`,
      ]);
    } else if (command.startsWith("interface fastethernet0/2")) {
      setMode("interface");
      setCurrentInterface("fastethernet0/2");
      setCliOutput((prev) => [
        ...prev,
        `Configuring interface fastethernet0/2`,
      ]);
    } else if (command.startsWith("interface gigabitethernet0/1")) {
      setMode("interface");
      setCurrentInterface("gigabitethernet0/1");
      setCliOutput((prev) => [
        ...prev,
        `Configuring interface gigabitethernet0/1`,
      ]);
    } else if (command === "switchport mode access") {
      setCliOutput((prev) => [...prev, "Switched port to access mode"]);
    } else if (command === "switchport mode trunk") {
      setCliOutput((prev) => [...prev, "Switched port to trunk mode"]);
    } else if (command.startsWith("switchport access vlan")) {
      const vlanId = parseInt(command.split(" ")[3]);

      setCliOutput((prev) => [...prev, `Assigned port to VLAN ${vlanId}`]);

      if (currentInterface) {
        const portNumber = parseInt(currentInterface.split("/")[1]);

        setPorts((prev) =>
          prev.map((port) =>
            port.id === portNumber
              ? { ...port, vlan: vlanId, status: "up" }
              : port
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

        if (vlanId === 10 && currentInterface.includes("0/1")) {
          setConfigCompleted((prev) => ({ ...prev, marketing: true }));
        } else if (vlanId === 20 && currentInterface.includes("0/2")) {
          setConfigCompleted((prev) => ({ ...prev, engineering: true }));
        }
      }
    } else if (command === "switchport trunk allowed vlan 10,20") {
      setCliOutput((prev) => [...prev, "Allowed VLANs 10,20 on trunk port"]);

      if (currentInterface && currentInterface.includes("gigabitethernet0/1")) {
        setPorts((prev) =>
          prev.map((port) =>
            port.id === 4 ? { ...port, mode: "trunk", status: "up" } : port
          )
        );

        setConfigCompleted((prev) => ({ ...prev, trunk: true }));
      }
    } else if (command.startsWith("vlan")) {
      const vlanId = parseInt(command.split(" ")[1]);
      setCliOutput((prev) => [...prev, `Creating VLAN ${vlanId}`]);
    } else if (command.startsWith("name")) {
      const vlanName = command.split(" ")[1];
      setCliOutput((prev) => [...prev, `VLAN name set to ${vlanName}`]);
    }

    setCliInput("");
  };

  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>VLAN Configuration Task</CardTitle>
              <Button onClick={() => setIsNetworkModalOpen(true)}>
                Show the Network
              </Button>
            </div>
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
            <div className="mt-4 p-4 rounded bg-gray-800">
              <strong className="text-lg">Trunk Port</strong>
              <ul className="list-disc pl-5 mt-2">
                <li>Port: GigabitEthernet0/1</li>
                <li>Mode: Trunk</li>
                <li>Allowed VLANs: 10,20</li>
              </ul>
              <div className="mt-3 border-t border-gray-600 pt-3">
                <strong className="text-sm text-gray-300">Port Status:</strong>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-sm text-gray-400">Mode:</span>
                    <div className="font-medium">
                      {ports[3].mode.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Status:</span>
                    <div
                      className={
                        ports[3].status === "up"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {ports[3].status.toUpperCase()}
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
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className={`mb-1 text-sm ${
                    suggestion.startsWith("→")
                      ? "text-green-400 font-bold"
                      : suggestion.includes("CONFIGURED ✓")
                      ? "text-green-500"
                      : suggestion.includes("NOT CONFIGURED ✗")
                      ? "text-red-500"
                      : suggestion.startsWith("Option")
                      ? "text-orange-500"
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

      {/* Network Diagram Modal */}
      <Dialog open={isNetworkModalOpen} onOpenChange={setIsNetworkModalOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-[90%] mx-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setIsNetworkModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <DialogHeader>
              <DialogTitle>
                {" "}
                <h3 className="text-orange-500">Network Diagram :</h3>
              </DialogTitle>
            </DialogHeader>
            <div>
              <img
                src="/images/practice/vlan.png"
                alt="Network Diagram"
                className="w-1/1.8 h-auto rounded-lg mx-auto mb-3"
              />
              <p className="text-m text-gray-600">
                Consider a network setup with 2 switches, 3 PCs, 1 laptop and 1
                databse server. In this session, you will learn how to configure
                VLANs for different departments. The network is divided into two
                departments: Engineering and Sales, requiring VLAN creation and
                PC configuration. According to the diagram, the two switches are
                linked together. One switch connects to 2 PCs, while the other
                connects to 1 PC, 1 laptop and a databse server.View the diagram
                for better understanding.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
