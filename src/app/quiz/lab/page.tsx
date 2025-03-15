"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import Link from "next/link";

interface LabQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function LabQuizContent() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);

  const labQuestions: LabQuestion[] = [
    {
      id: 1,
      question:
        "Which commands should you use on a switch to create VLANs for HR, Finance, and IT departments?",
      options: [
        "vlan 10, vlan 20, vlan 30",
        "vlan create 10, vlan create 20, vlan create 30",
        "vlan 10 name HR, vlan 20 name Finance, vlan 30 name IT",
        "vlan 10 HR, vlan 20 Finance, vlan 30 IT",
      ],
      correctAnswer: 2,
      explanation:
        "The correct commands are 'vlan 10 name HR', 'vlan 20 name Finance', and 'vlan 30 name IT'.",
    },
    {
      id: 2,
      question:
        "Which command is used to set a trunk port that carries traffic for all VLANs?",
      options: [
        "switchport mode trunk",
        "switchport trunk enable",
        "trunk port enable",
        "enable trunk port",
      ],
      correctAnswer: 0,
      explanation:
        "The command 'switchport mode trunk' is used to set a trunk port.",
    },
    {
      id: 3,
      question:
        "What happens if you forget to use the 'no shutdown' command after assigning an IP address to a router interface?",
      options: [
        "The interface will work normally",
        "The interface remains administratively down",
        "The interface will automatically shut down after 5 minutes",
        "The interface will not accept any IP address",
      ],
      correctAnswer: 1,
      explanation:
        "If 'no shutdown' is not used, the interface remains administratively down and will not work.",
    },
    {
      id: 4,
      question:
        "What IP address, subnet mask, and default gateway should be assigned to PC0?",
      options: [
        "IP: 192.168.1.10, Subnet: 255.255.255.0, Gateway: 192.168.1.1",
        "IP: 192.168.1.1, Subnet: 255.255.255.0, Gateway: 192.168.1.10",
        "IP: 192.168.1.10, Subnet: 255.255.0.0, Gateway: 192.168.1.1",
        "IP: 192.168.1.10, Subnet: 255.255.255.0, Gateway: 192.168.1.255",
      ],
      correctAnswer: 0,
      explanation:
        "The correct configuration is IP: 192.168.1.10, Subnet: 255.255.255.0, Gateway: 192.168.1.1.",
    },
    {
      id: 5,
      question:
        "Which command in Windows shows the assigned IP address and default gateway of a PC?",
      options: ["ipconfig", "ifconfig", "show ip", "ip show"],
      correctAnswer: 0,
      explanation:
        "The command 'ipconfig' is used to show the IP configuration on a Windows PC.",
    },
  ];

  const currentQuestion = labQuestions[currentQuestionIndex];

  const handleAnswer = (answerIndex: number) => {
    if (answeredQuestions.includes(currentQuestion.id)) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);

    // Check if all questions are answered
    if (answeredQuestions.length + 1 === labQuestions.length) {
      setQuizCompleted(true);
      setShowScoreboard(true); // Show scoreboard modal
    }
  };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < labQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizCompleted(false);
    setShowScoreboard(false); // Hide scoreboard modal
  };

  if (quizCompleted) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold mb-4">
              Score: {score}/{labQuestions.length}
            </div>
            <div className="text-lg mb-6">
              {score === labQuestions.length
                ? "Perfect score! Excellent work!"
                : score > labQuestions.length / 2
                ? "Good job! Keep practicing to improve."
                : "Keep studying and try again!"}
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Home
              </Button>
              <Button onClick={restartQuiz}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Quiz UI (same as NormalQuizContent) */}
      <div className="flex justify-end p-7 ">
        <Link
          href="/"
          className="text-orange-500 hover:text-orange-600 transition-colors duration-300"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm">
          Question {currentQuestionIndex + 1} of {labQuestions.length}
        </div>
        <div className="text-sm">
          Score: {score}/{labQuestions.length}
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Question #{currentQuestion.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-lg">{currentQuestion.question}</p>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answeredQuestions.includes(currentQuestion.id)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedAnswer !== null
                      ? index === currentQuestion.correctAnswer
                        ? "bg-green-500/20"
                        : selectedAnswer === index
                        ? "bg-red-500/20"
                        : "bg-gray-800"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="mt-4 p-4 bg-blue-500/20 rounded-lg">
                <p className="font-semibold mb-2">Explanation:</p>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous Question
        </Button>
        <Button
          variant="default"
          onClick={handleNextQuestion}
          disabled={
            currentQuestionIndex === labQuestions.length - 1 ||
            !answeredQuestions.includes(currentQuestion.id)
          }
        >
          Next Question
        </Button>
      </div>
      {/* Scoreboard Modal */}
      <Dialog open={showScoreboard} onOpenChange={setShowScoreboard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quiz Completed!</DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <div className="text-4xl font-bold mb-4">
              Score: {score}/{labQuestions.length}
            </div>
            <div className="text-lg mb-6">
              {score === labQuestions.length
                ? "Perfect score! Excellent work!"
                : score > labQuestions.length / 2
                ? "Good job! Keep practicing to improve."
                : "Keep studying and try again!"}
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Home
              </Button>
              <Button onClick={restartQuiz}>Try Again</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
