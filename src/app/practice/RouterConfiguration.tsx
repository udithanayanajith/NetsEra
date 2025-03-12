"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import config from "@/app/practice/config.json";

interface Command {
  command: string;
  description: string;
  error: string;
  suggestion: string;
  instructions?: string[];
}

export default function RouterConfiguration() {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isConfigMode, setIsConfigMode] = useState(false); // Track configuration mode
  const [isPrivilegedMode, setIsPrivilegedMode] = useState(false); // Track privileged mode
  const terminalRef = useRef<HTMLDivElement>(null);

  // Load session data from session storage
  useEffect(() => {
    const sessionData = sessionStorage.getItem("terminalSession");
    if (sessionData) {
      const { commands: savedCommands, history: savedHistory } =
        JSON.parse(sessionData);
      setCommands(savedCommands);
      setCommandHistory(savedHistory);
    }
  }, []);

  // Save session data to session storage
  useEffect(() => {
    if (isOpen) {
      sessionStorage.setItem(
        "terminalSession",
        JSON.stringify({ commands, history: commandHistory })
      );
    }
  }, [commands, commandHistory, isOpen]);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  // Handle Linux-like commands
  const handleLinuxCommand = (command: string) => {
    switch (command.trim()) {
      case "clear":
        setCommands([]);
        break;
      case "help":
        setCommands((prev) => [
          ...prev,
          "Available commands:",
          "  clear - Clear the terminal output",
          "  help - Display this help message",
          "  exit - Close the terminal",
          "  enable - Enter privileged mode",
          "  configure terminal - Enter configuration mode",
          "  show interfaces - Display interface information",
        ]);
        break;
      case "exit":
        if (isConfigMode) {
          setIsConfigMode(false);
          setCommands((prev) => [...prev, "Exit configuration mode"]);
        } else if (isPrivilegedMode) {
          setIsPrivilegedMode(false);
          setCommands((prev) => [...prev, "Exit privileged mode"]);
        } else {
          resetAndClose();
        }
        break;
      case "enable":
        setIsPrivilegedMode(true);
        setCommands((prev) => [...prev, "Entered privileged mode"]);
        break;
      default:
        setCommands((prev) => [...prev, `Command not found: ${command}`]);
        break;
    }
  };

  // Handle router/switch commands
  const handleDeviceCommand = (command: string) => {
    let foundCommand = false;
    const allCommands: Command[] = [
      ...config.commands.router,
      ...config.commands.switch,
    ];

    for (const cmd of allCommands) {
      if (command.startsWith(cmd.command.split(" ")[0])) {
        setCommands((prev) => [...prev, cmd.description]);
        setSuggestions(cmd.suggestion ? [cmd.suggestion] : []);
        setInstructions(cmd.instructions || []);

        // Enter configuration mode if the command is "configure terminal"
        if (cmd.command === "configure terminal") {
          if (isPrivilegedMode) {
            setIsConfigMode(true);
            setCommands((prev) => [...prev, "Entered configuration mode"]);
          } else {
            setError("Permission denied: You must be in privileged mode first");
            setSuggestions(["Use 'enable' to enter privileged mode"]);
          }
        }

        foundCommand = true;
        break;
      }
    }

    if (!foundCommand) {
      setError(`Command not found: ${command}`);
      setSuggestions(["Start with 'enable' to enter privileged mode"]);
      setInstructions([
        "1. Enter 'enable' to access privileged mode",
        "2. Enter 'configure terminal' to enter config mode",
        "3. Select an interface: 'interface GigabitEthernet0/0'",
        "4. Assign IP: 'ip address 192.168.1.1 255.255.255.0'",
        "5. Enable interface: 'no shutdown'",
      ]);
    }
  };

  // Handle command input
  const handleCommand = (command: string) => {
    if (!command.trim()) return;

    // Add command to history
    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    // Clear previous error
    setError(null);

    // Get the appropriate prompt based on mode
    let prompt = "Router>";
    if (isConfigMode) {
      prompt = "Router(config)#";
    } else if (isPrivilegedMode) {
      prompt = "Router#";
    }

    // Add command to terminal with the appropriate prompt
    setCommands((prev) => [...prev, `$ ${prompt} ${command}`]);

    // Handle Linux-like commands
    if (["clear", "help", "exit", "enable"].includes(command.trim())) {
      handleLinuxCommand(command);
    } else if (command.trim() === "configure terminal") {
      handleDeviceCommand(command);
    } else {
      // Handle router/switch commands
      handleDeviceCommand(command);
    }

    setInput("");
  };

  // Handle arrow key navigation for command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex]);
    } else if (e.key === "ArrowDown" && historyIndex >= 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setInput(
        newIndex === -1
          ? ""
          : commandHistory[commandHistory.length - 1 - newIndex]
      );
    }
  };

  // Reset and close terminal
  const resetAndClose = () => {
    setIsOpen(false);
    setCommands([]);
    setInput("");
    setError(null);
    setSuggestions([]);
    setInstructions([]);
    setCommandHistory([]);
    setHistoryIndex(-1);
    setIsConfigMode(false); // Reset configuration mode
    setIsPrivilegedMode(false); // Reset privileged mode
    sessionStorage.removeItem("terminalSession");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="cursor-pointer hover:opacity-80 transition-opacity text-white"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src="/images/component/router-icon.png"
          alt="Router Configuration"
          width={400}
          height={100}
          className="invert"
        />
        <p className="text-center mt-2 text-lg">
          Click to configure Router & Switch
        </p>
      </div>

      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => open ? setIsOpen(open) : null}
      >
        <DialogContent className="bg-black border border-orange-500 w-full max-w-6xl">
          <div className="flex gap-3">
            <div
              ref={terminalRef}
              className="w-3/4 h-96 bg-black text-white p-2 font-mono overflow-y-auto"
            >
              {commands.map((cmd, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {cmd}
                </div>
              ))}
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex items-center">
                <span>
                  {isConfigMode
                    ? "$ Router(config)# "
                    : isPrivilegedMode
                    ? "$ Router# "
                    : "$ Router> "}
                </span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCommand(input);
                    }
                  }}
                  className="flex-1 bg-transparent outline-none border-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="w-1/4 bg-gray-900 text-white p-2 font-mono text-sm">
              <h3 className="text-orange-500 mb-2">Suggestions:</h3>
              {suggestions.map((suggestion, i) => (
                <div key={i} className="mb-1">
                  {suggestion}
                </div>
              ))}
              {instructions.length > 0 && (
                <>
                  <h3 className="text-orange-500 mt-4 mb-2">Instructions:</h3>
                  {instructions.map((instruction, i) => (
                    <div key={i} className="mb-1">
                      {instruction}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button 
              onClick={resetAndClose}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
