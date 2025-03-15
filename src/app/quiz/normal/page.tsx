"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function NormalQuizContent() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the purpose of a VLAN?",
      options: [
        "To increase network bandwidth",
        "To segment a network into logical groups",
        "To connect to the internet",
        "To encrypt network traffic"
      ],
      correctAnswer: 1,
      explanation: "VLANs (Virtual LANs) are used to segment a physical network into logical groups, improving security and network management by isolating traffic between different departments or groups."
    },
    {
      id: 2,
      question: "Which IP address class is typically used for private networks?",
      options: [
        "Class A (10.0.0.0)",
        "Class B (172.16.0.0)",
        "Class C (192.168.0.0)",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "All three address ranges (10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16) are reserved for private networks as defined in RFC 1918."
    },
    {
      id: 3,
      question: "What is the purpose of a default gateway?",
      options: [
        "To assign IP addresses to network devices",
        "To route traffic between different networks",
        "To secure the network from external threats",
        "To manage network bandwidth"
      ],
      correctAnswer: 1,
      explanation: "A default gateway is a router that serves as an access point to other networks. When a device needs to communicate with a device on another network, it sends the traffic through the default gateway."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answerIndex: number) => {
    if (answeredQuestions.includes(currentQuestion.id)) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);

    // Auto-advance to next question after a delay
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
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
              Score: {score}/{questions.length}
            </div>
            <div className="text-lg mb-6">
              {score === questions.length 
                ? "Perfect score! Excellent work!" 
                : score > questions.length / 2 
                ? "Good job! Keep practicing to improve." 
                : "Keep studying and try again!"}
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => router.push('/')}>
                Back to Home
              </Button>
              <Button onClick={restartQuiz}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mb-4"
        >
          ← Back to Home
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="text-sm">
          Score: {score}/{questions.length}
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
            currentQuestionIndex === questions.length - 1 ||
            !answeredQuestions.includes(currentQuestion.id)
          }
        >
          Next Question
        </Button>
      </div>
    </div>
  );
}
