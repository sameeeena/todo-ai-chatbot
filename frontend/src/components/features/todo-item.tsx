import React from "react"
import { CheckCircle2, Circle, Trash2, MoreHorizontal, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface TodoItemProps {
  todo: {
    id: number
    title: string
    description?: string
    completed: boolean
    created_at?: string
  }
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group relative flex items-start gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 animate-in">
      <button 
        onClick={() => onToggle(todo.id)}
        className="mt-0.5 shrink-0 transition-transform duration-200 active:scale-90"
      >
        {todo.completed ? (
          <div className="bg-green-500 rounded-full p-0.5">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        ) : (
          <Circle className="w-6 h-6 text-zinc-300 dark:text-zinc-600 hover:text-zinc-400 dark:hover:text-zinc-500" />
        )}
      </button>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "text-base font-medium leading-none transition-all",
            todo.completed ? "text-zinc-400 line-through decoration-zinc-400/50" : "text-zinc-900 dark:text-zinc-100"
          )}>
            {todo.title}
          </h3>
        </div>
        
        {todo.description && (
          <p className={cn(
            "text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed",
            todo.completed && "opacity-60"
          )}>
            {todo.description}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            <Clock className="w-3 h-3" />
            <span>Today</span>
          </div>
          {todo.completed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded-md">
              Done
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
          <MoreHorizontal className="w-4 h-4 text-zinc-400" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}