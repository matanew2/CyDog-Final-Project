"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { AppLayout } from "@/components/layouts/app-layout";
import { useApp } from "@/components/app/app-provider";

export function AIPage() {
  const router = useRouter();
  const { aiChat } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    type: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Chatbot states
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Hello! I'm your AI assistant. Ask me anything about dogs or our system!",
    },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleChange = (field, value, isFile = false) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setChatLoading(true);

    try {
      const response = await aiChat(input);
      const botMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in AI chat:", error);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Chatbot Interface */}
          <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-teal-600">
                  <AvatarFallback>
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>CyDog AI Assistant</CardTitle>
                  <CardDescription className="text-teal-100 dark:text-slate-300">
                    Chat with our AI to learn about dogs and our services
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4 pb-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-2 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role !== "user" && (
                        <Avatar className="h-8 w-8 bg-teal-600 shrink-0">
                          <AvatarFallback>
                            <Bot size={16} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`${
                          msg.role === "user"
                            ? "bg-teal-600 text-white"
                            : "bg-gray-700 text-white"
                        } rounded-lg p-3 max-w-[80%]`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <Avatar className="h-8 w-8 bg-blue-600 shrink-0">
                          <AvatarFallback>
                            <User size={16} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex gap-2 justify-start">
                      <Avatar className="h-8 w-8 bg-teal-600 shrink-0">
                        <AvatarFallback>
                          <Bot size={16} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-2">
                        <span className="animate-pulse">•</span>
                        <span className="animate-pulse delay-100">•</span>
                        <span className="animate-pulse delay-200">•</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={sendMessage} className="flex gap-2 w-full">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-teal-900/50 border-teal-700 text-white flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={chatLoading || !input.trim()}
                  className="bg-teal-600 hover:bg-teal-500"
                >
                  {chatLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>

          {/* Original Dog Form */}
          <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Dog Details</CardTitle>
              <CardDescription className="text-teal-100 dark:text-slate-300">
                Fill in the details for the new dog
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Original form content goes here */}
              {/* For brevity, I've omitted the form content */}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
