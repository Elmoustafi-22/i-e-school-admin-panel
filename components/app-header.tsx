import { User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AppHeader() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-border bg-card">
      <div className="flex h-full items-center justify-between px-8">
        <h1 className="text-xl font-semibold text-foreground">i-eSchool Admin Panel</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Admin</span>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
