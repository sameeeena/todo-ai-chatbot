"use client"

import React, { useState, useEffect } from "react"
import { 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Layout, 
  Calendar, 
  CheckSquare, 
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Hash,
  Star,
  Clock,
  ChevronRight,
  TrendingUp,
  Inbox,
  Filter,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TodoItem } from "@/components/features/todo-item"
import { TodoForm } from "@/components/features/todo-form"
import { cn } from "@/lib/utils"
import { useTodos } from "@/hooks/use-todos"
import { useSession, authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { data: session, isPending: isSessionLoading } = useSession()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const { todos, isLoading: isTodosLoading, createTodo, toggleTodo, deleteTodo } = useTodos()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/login")
    }
  }, [session, isSessionLoading, router])

  const handleAddTodo = (title: string) => {
    createTodo.mutate({ title })
  }

  const handleToggleTodo = (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (todo) {
      toggleTodo.mutate({ id, completed: !todo.completed })
    }
  }

  const handleDeleteTodo = (id: number) => {
    deleteTodo.mutate(id)
  }

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/login")
  }

  if (!isLoaded || isSessionLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Sidebar - Pro Design */}
      <aside className="w-72 border-r border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 p-8 flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-50 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/10 dark:shadow-white/10 rotate-3">
            <CheckSquare className="w-6 h-6 text-zinc-50 dark:text-zinc-900" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight block leading-none">TodoAI</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1 block">Productivity</span>
          </div>
        </div>

        <div className="space-y-8 flex-1">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-2 mb-4 block">Main Menu</span>
            <nav className="space-y-1">
              <SidebarItem icon={<Inbox className="w-4 h-4" />} label="Inbox" active count={todos.length} />
              <SidebarItem icon={<Calendar className="w-4 h-4" />} label="Today" />
              <SidebarItem icon={<Star className="w-4 h-4" />} label="Important" />
              <SidebarItem icon={<CheckCircle2 className="w-4 h-4" />} label="Completed" count={todos.filter(t => t.completed).length} />
            </nav>
          </div>

          <div>
            <div className="flex items-center justify-between px-2 mb-4">
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Categories</span>
              <Plus className="w-3 h-3 text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" />
            </div>
            <nav className="space-y-1">
              <SidebarItem icon={<Hash className="w-4 h-4 text-brand-500" />} label="Development" />
              <SidebarItem icon={<Hash className="w-4 h-4 text-orange-500" />} label="Personal" />
              <SidebarItem icon={<Hash className="w-4 h-4 text-emerald-500" />} label="Design" />
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 mt-auto">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 tracking-tight">Pro Plan Active</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">You have used 85% of your cloud storage space.</p>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full w-[85%]"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`} alt="User" />
              </div>
              <div className="max-w-[120px]">
                <span className="text-sm font-bold block leading-none truncate">{session.user.name}</span>
                <span className="text-[10px] text-zinc-500 block mt-1 uppercase tracking-wider font-medium">Free Tier</span>
              </div>
            </div>
            <button onClick={handleLogout}>
                <LogOut className="w-4 h-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - Glass Effect */}
        <header className="h-20 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
              <Input 
                placeholder="Search anything..." 
                className="pl-12 bg-zinc-100/50 dark:bg-zinc-900/50 border-none shadow-none focus-visible:ring-2 focus-visible:ring-zinc-900/5 dark:focus-visible:ring-zinc-100/5 rounded-2xl h-12 text-base transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-5 ml-8">
            <Button variant="ghost" size="icon" className="relative rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/50 h-11 w-11">
              <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-brand-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
            </Button>
            <div className="h-8 w-[1px] bg-zinc-200 dark:border-zinc-800 mx-1"></div>
            <Button variant="primary" className="rounded-2xl h-11 px-6 font-bold shadow-lg shadow-zinc-900/10 dark:shadow-white/5">
              <Plus className="w-4 h-4 mr-2 stroke-[3px]" />
              New Feature
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-10 lg:p-14 max-w-5xl mx-auto w-full space-y-12 animate-in">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-500 font-medium text-sm">
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-zinc-900 dark:text-zinc-100">Tasks</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gradient">Productivity Hub</h1>
              <p className="text-zinc-500 text-lg">Manage your tasks with AI-powered insights.</p>
            </div>
            
            <div className="flex gap-3 bg-zinc-100/50 dark:bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
              <Button variant="secondary" size="sm" className="rounded-xl px-4 py-2 font-bold text-xs bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700">List View</Button>
              <Button variant="ghost" size="sm" className="rounded-xl px-4 py-2 font-bold text-xs text-zinc-500">Board View</Button>
              <Button variant="ghost" size="sm" className="rounded-xl px-4 py-2 font-bold text-xs text-zinc-500">Timeline</Button>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatsCard label="Productivity" value="84%" sub="Up 12% this week" icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} color="emerald" />
            <StatsCard label="Completion" value={`${todos.filter(t => t.completed).length}/${todos.length}`} sub="Updated 2m ago" icon={<CheckCircle2 className="w-4 h-4 text-brand-500" />} color="brand" />
            <StatsCard label="Deep Work" value="4.2h" sub="Daily average" icon={<Clock className="w-4 h-4 text-orange-500" />} color="orange" />
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold tracking-tight px-1">Upcoming Tasks</h2>
                <Button variant="ghost" size="sm" className="text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-zinc-100">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort & Filter
                </Button>
              </div>
              
              <TodoForm onAdd={handleAddTodo} />
              
              <div className="grid gap-4 mt-8">
                {isTodosLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                    </div>
                ) : (
                    todos.map((todo, idx) => (
                        <div key={todo.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-in">
                          <TodoItem 
                            todo={todo} 
                            onToggle={handleToggleTodo}
                            onDelete={handleDeleteTodo}
                          />
                        </div>
                    ))
                )}
              </div>
              
              {!isTodosLoading && todos.length === 0 && (
                <div className="text-center py-28 bg-white dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl animate-in">
                  <div className="bg-zinc-50 dark:bg-zinc-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6 shadow-sm">
                    <Inbox className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight">Zero tasks on the horizon</h3>
                  <p className="text-zinc-500 max-w-xs mx-auto">Your inbox is clear. Take a breath or start planning your next big project.</p>
                  <Button variant="outline" className="mt-8 rounded-2xl px-8 h-12 font-bold">
                    Learn More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function SidebarItem({ icon, label, active = false, count }: { icon: React.ReactNode, label: string, active?: boolean, count?: number }) {
  return (
    <div className={cn(
      "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group",
      active 
        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/5" 
        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("transition-transform group-hover:scale-110 duration-200", active ? "text-white dark:text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100")}>
          {icon}
        </div>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {count !== undefined && (
        <span className={cn(
          "text-[10px] font-extrabold px-2 py-0.5 rounded-full",
          active ? "bg-white/20 text-white dark:bg-black/10 dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
        )}>
          {count}
        </span>
      )}
    </div>
  )
}

function StatsCard({ label, value, sub, icon, color }: { label: string, value: string, sub: string, icon: React.ReactNode, color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 dark:bg-emerald-500/10",
    brand: "bg-brand-50 dark:bg-brand-500/10",
    orange: "bg-orange-50 dark:bg-orange-500/10",
  }

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-2xl transition-transform duration-300 group-hover:scale-110 rotate-3", colorMap[color])}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
          <p className="text-2xl font-black mt-1 tracking-tight">{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
        <span className="text-[11px] font-bold text-zinc-500 tracking-tight">{sub}</span>
      </div>
    </div>
  )
}
