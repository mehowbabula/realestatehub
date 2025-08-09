'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, Home, User } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import LoginComponent from '@/components/auth/login'
import RegisterComponent from '@/components/auth/register'
import ForgotPasswordComponent from '@/components/auth/forgot-password'
import { signOut, useSession } from 'next-auth/react'

export default function GlobalNavigation() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as any

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  // Authentication flow handlers
  const handleShowLogin = () => {
    setIsRegisterOpen(false)
    setIsForgotPasswordOpen(false)
    setIsLoginOpen(true)
  }

  const handleShowRegister = () => {
    setIsLoginOpen(false)
    setIsForgotPasswordOpen(false)
    setIsRegisterOpen(true)
  }

  const handleShowForgotPassword = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(false)
    setIsForgotPasswordOpen(true)
  }

  const handleCloseAllAuth = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(false)
    setIsForgotPasswordOpen(false)
  }

  const handleLogout = async () => {
    try {
      // Show the logout success modal
      setIsLogoutModalOpen(true)
      
      // Sign out without redirect
      await signOut({ redirect: false })
      
      // After 2 seconds, redirect to homepage and close modal
      setTimeout(() => {
        setIsLogoutModalOpen(false)
        router.push('/')
      }, 2000)
    } catch (error) {
      console.error('Logout error:', error)
      setIsLogoutModalOpen(false)
    }
  }

  return (
    <>
      {/* Modern Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">GlobalRealEstate</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => router.push('/properties')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Properties
                </button>
                <button 
                  onClick={() => router.push('/invest')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Invest
                </button>
                <button 
                  onClick={() => router.push('/forecast')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Forecast
                </button>
                <button 
                  onClick={() => router.push('/agents')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Agents
                </button>
                <button 
                  onClick={() => router.push('/blog')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Blog
                </button>
                <button 
                  onClick={() => router.push('/community')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Community
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    {(user.role === 'agent' || user.role === 'admin') && (
                      <DropdownMenuItem onClick={() => router.push('/add-listing')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Add Listing</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handleShowRegister}>
                    Register
                  </Button>
                  <Button onClick={handleShowLogin}>
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Authentication Dialogs */}
      <LoginComponent 
        isOpen={isLoginOpen} 
        onClose={handleCloseAllAuth} 
        onCreateAccount={handleShowRegister}
        onForgotPassword={handleShowForgotPassword}
      />
      
      <RegisterComponent
        isOpen={isRegisterOpen}
        onClose={handleCloseAllAuth}
        onLoginInstead={handleShowLogin}
      />
      
      <ForgotPasswordComponent
        isOpen={isForgotPasswordOpen}
        onClose={handleCloseAllAuth}
        onBackToLogin={handleShowLogin}
      />

      {/* Logout Success Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Logged Out Successfully
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              You have been successfully logged out. Redirecting to homepage...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
