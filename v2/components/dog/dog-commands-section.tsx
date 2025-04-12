"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, Mic, Send } from "lucide-react"

interface DogCommandsSectionProps {
  dogId: string
}

export function DogCommandsSection({ dogId }: DogCommandsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCommands, setSelectedCommands] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [voiceCommand, setVoiceCommand] = useState<string | null>(null)

  // Mock commands
  const commands = [
    "Sit",
    "Stay",
    "Heel",
    "Come",
    "Down",
    "Fetch",
    "Roll Over",
    "Speak",
    "Search",
    "Track",
    "Find",
    "Alert",
    "Guard",
    "Release",
    "Jump",
    "Crawl",
  ]

  // Favorite commands
  const favoriteCommands = ["Sit", "Stay", "Come", "Down", "Search", "Track"]

  const filteredCommands = commands.filter((command) => command.toLowerCase().includes(searchTerm.toLowerCase()))

  const toggleCommand = (command: string) => {
    if (selectedCommands.includes(command)) {
      setSelectedCommands(selectedCommands.filter((c) => c !== command))
    } else {
      setSelectedCommands([...selectedCommands, command])
    }
  }

  const toggleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      // Simulate voice recognition result
      setTimeout(() => {
        setVoiceCommand("Come and search the area")
      }, 1000)
    } else {
      // Start recording
      setIsRecording(true)
      setVoiceCommand(null)
    }
  }

  const sendCommands = () => {
    // Simulate sending commands
    console.log("Sending commands:", selectedCommands)
    // Clear selected commands after sending
    setSelectedCommands([])
    // Clear voice command after sending
    setVoiceCommand(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-teal-300 dark:text-teal-400" />
          <Input
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-teal-900/50 dark:bg-slate-900/50 border-teal-700 dark:border-slate-700 text-white placeholder:text-teal-300 dark:placeholder:text-teal-400"
          />
        </div>
        <Button
          className={`${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600"}`}
          onClick={toggleVoiceRecording}
        >
          <Mic className="mr-2 h-4 w-4" />
          {isRecording ? "Recording..." : "Voice Command"}
        </Button>
      </div>

      {voiceCommand && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-teal-700/30 dark:bg-teal-800/30 p-3 flex justify-between items-center"
        >
          <p className="text-white">"{voiceCommand}"</p>
          <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600"
            onClick={sendCommands}
          >
            <Send className="h-4 w-4 mr-1" /> Send
          </Button>
        </motion.div>
      )}

      <div>
        <h3 className="mb-2 text-lg font-medium text-white">Favorites</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {favoriteCommands.map((command) => (
            <CommandButton
              key={command}
              command={command}
              isSelected={selectedCommands.includes(command)}
              onClick={() => toggleCommand(command)}
              isFavorite
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium text-white">All Commands</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <AnimatePresence>
            {filteredCommands.map((command) => (
              <CommandButton
                key={command}
                command={command}
                isSelected={selectedCommands.includes(command)}
                onClick={() => toggleCommand(command)}
                isFavorite={favoriteCommands.includes(command)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button
          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white w-full max-w-xs"
          disabled={selectedCommands.length === 0}
          onClick={sendCommands}
        >
          <Send className="mr-2 h-4 w-4" />
          Send to Dog
        </Button>
      </div>
    </div>
  )
}

interface CommandButtonProps {
  command: string
  isSelected: boolean
  onClick: () => void
  isFavorite?: boolean
}

function CommandButton({ command, isSelected, onClick, isFavorite = false }: CommandButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex h-12 items-center justify-center rounded-lg p-2 transition-colors ${
        isSelected
          ? "bg-teal-600 dark:bg-teal-700 text-white"
          : "bg-teal-900/70 dark:bg-slate-900/70 text-teal-100 dark:text-slate-300 hover:bg-teal-800 dark:hover:bg-slate-800"
      }`}
    >
      {command}
      {isFavorite && <Star className="absolute right-1 top-1 h-3 w-3 text-yellow-400" fill="currentColor" />}
    </motion.button>
  )
}
