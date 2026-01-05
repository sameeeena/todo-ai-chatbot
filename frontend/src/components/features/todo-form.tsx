import React, { useState } from "react"
import { Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TodoFormProps {
  onAdd: (title: string, description?: string) => void
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title)
    setTitle("")
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center gap-2 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-zinc-950/5 dark:focus-within:ring-zinc-100/5 focus-within:border-zinc-300 dark:focus-within:border-zinc-700 transition-all duration-300"
    >
      <div className="pl-3 pr-1 text-zinc-400">
        <Zap className="w-5 h-5 fill-zinc-400/20" />
      </div>
      <Input
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border-none shadow-none focus-visible:ring-0 bg-transparent text-base h-11"
      />
      <Button 
        type="submit" 
        size="md"
        className="rounded-xl px-5 h-10 font-bold tracking-tight"
      >
        <Plus className="w-4 h-4 mr-1.5 stroke-[3px]" />
        Add Task
      </Button>
    </form>
  )
}