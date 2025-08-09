'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { 
  Home, 
  Bot, 
  Search, 
  User, 
  Building2, 
  ArrowRight, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Bitcoin, 
  Trophy, 
  Users, 
  TrendingUp,
  ChevronDown,
  Star,
  Heart,
  Shield,
  Globe
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as any
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isManualFlowOpen, setIsManualFlowOpen] = useState(false)
  const [aiMessages, setAiMessages] = useState<{ role: string; content: string }[]>([])
  const [aiInput, setAiInput] = useState('')
  const [manualStep, setManualStep] = useState(0)
  const [searchData, setSearchData] = useState({
    country: '',
    city: '',
    maxPrice: '',
    userType: '',
    propertyType: ''
  })

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Portugal', 'Netherlands', 'Switzerland', 'Japan'
  ]

  const propertyTypes = [
    'Apartment', 'House', 'Villa', 'Condo', 'Townhouse', 'Land', 'Commercial'
  ]

  const handleAIMessage = async () => {
    if (!aiInput.trim()) return

    const userMessage = { role: 'user', content: aiInput }
    setAiMessages(prev => [...prev, userMessage])
    setAiInput('')

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = ''
      
      if (aiInput.toLowerCase().includes('buy') || aiInput.toLowerCase().includes('rent')) {
        aiResponse = "Great! Could you please tell me where you're looking, what type of property, and your maximum budget?"
      } else if (aiInput.toLowerCase().includes('agent') || aiInput.toLowerCase().includes('agency')) {
        aiResponse = "Great! I have some exciting options for you with powerful tools to help you with lead generation and automated social media posting to platforms like YouTube, Instagram, and others."
      } else if (searchData.country && searchData.city && searchData.maxPrice) {
        aiResponse = "Here are some options. Feel free to browse!"
        // Show property results
      } else {
        aiResponse = "Hi there! What are you looking for today?"
      }

      setAiMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
    }, 1000)
  }

  const handleManualStep = (step: number) => {
    setManualStep(step)
  }

  const handleSearchData = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section - Peugeot Inspired */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950" />
        
        {/* Geometric shapes overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Real Estate Platform</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white leading-tight">
              Find Your Dream
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Property Worldwide
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover premium properties across the globe with AI-powered matching, 
              cryptocurrency investment options, and trusted agents
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsAIOpen(true)}
              >
                <Bot className="h-5 w-5 mr-2" />
                Start with AI Assistant
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 text-lg rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300"
                onClick={() => router.push('/properties')}
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Properties
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Verified Agents</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Globe className="h-5 w-5" />
                <span className="text-sm">50+ Countries</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Star className="h-5 w-5" />
                <span className="text-sm">Premium Properties</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Three Ways to Find Your Perfect Property
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* AI Assistant */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-gray-800 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Bot className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">AI Assistant</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Chat with our AI to find your perfect property
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full group-hover:shadow-lg transition-all duration-300"
                  size="lg"
                  onClick={() => setIsAIOpen(true)}
                >
                  Start Chatting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* AI Matching */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-gray-800 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">AI Matching</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Swipe through AI-curated properties that match your lifestyle
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full group-hover:shadow-lg transition-all duration-300"
                  size="lg"
                  onClick={() => router.push('/ai-matching')}
                >
                  Find Your Match
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Manual Search */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-gray-800 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Search className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Manual Search</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Guided property search with advanced filters
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full group-hover:shadow-lg transition-all duration-300"
                  size="lg"
                  onClick={() => setIsManualFlowOpen(true)}
                >
                  Begin Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Assistant Dialog */}
      <Dialog open={isAIOpen} onOpenChange={setIsAIOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col bg-white dark:bg-gray-800 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Bot className="h-5 w-5 text-blue-600" />
              AI Property Assistant
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              I'm here to help you find the perfect property. Just tell me what you're looking for!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {aiMessages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <p>Hi there! What are you looking for today?</p>
              </div>
            )}
            
            {aiMessages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIMessage()}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
            <Button onClick={handleAIMessage} disabled={!aiInput.trim()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Guided Flow Dialog */}
      <Dialog open={isManualFlowOpen} onOpenChange={setIsManualFlowOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Get Started</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Choose how you'd like to use our platform
            </DialogDescription>
          </DialogHeader>
          
          {manualStep === 0 && (
            <div className="space-y-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-gray-50 dark:bg-gray-900" 
                    onClick={() => {
                      handleSearchData('userType', 'buyer')
                      handleManualStep(1)
                    }}>
                <CardContent className="p-4 text-center">
                  <Search className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Looking to Buy or Rent</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Find your perfect property</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-gray-50 dark:bg-gray-900"
                    onClick={() => {
                      handleSearchData('userType', 'agent')
                      setIsManualFlowOpen(false)
                      router.push('/pricing')
                    }}>
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">I'm a Real Estate Agent</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">List properties and grow your business</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-gray-50 dark:bg-gray-900"
                    onClick={() => {
                      handleSearchData('userType', 'agency')
                      setIsManualFlowOpen(false)
                      router.push('/pricing')
                    }}>
                <CardContent className="p-4 text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">I'm a Real Estate Agency</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Manage multiple agents and listings</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {manualStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Step 1: Select Country</h3>
              <Select value={searchData.country} onValueChange={(value) => handleSearchData('country', value)}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Choose a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleManualStep(0)}>Back</Button>
                <Button onClick={() => handleManualStep(2)} disabled={!searchData.country}>Next</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}