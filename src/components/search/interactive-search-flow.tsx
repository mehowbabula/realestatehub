'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { Bot, Search, User, ChevronDown } from '@/components/ui/icons'

export default function InteractiveSearchFlow() {
  const router = useRouter()
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isManualFlowOpen, setIsManualFlowOpen] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [searchData, setSearchData] = useState({
    country: '',
    city: '',
    maxPrice: '',
    userType: '',
    propertyType: ''
  })

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore'
  ]

  const cities = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa']
  }

  const propertyTypes = [
    'Apartment', 'House', 'Villa', 'Condo', 'Townhouse', 'Land', 'Commercial'
  ]

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      country: searchData.country,
      city: searchData.city,
      maxPrice: searchData.maxPrice,
      userType: searchData.userType,
      propertyType: searchData.propertyType
    }).toString()
    
    router.push(`/properties?${queryParams}`)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* AI Search */}
      <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-blue-600" />
            AI-Powered Search
          </CardTitle>
          <p className="text-gray-600">Let our AI help you find the perfect property</p>
        </CardHeader>
        <CardContent>
          <Dialog open={isAIOpen} onOpenChange={setIsAIOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Bot className="mr-2 h-5 w-5" />
                Start AI Search
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>AI Property Assistant</DialogTitle>
                <DialogDescription>
                  Tell me what you're looking for and I'll help you find the perfect property
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="e.g., I'm looking for a 2-bedroom apartment in London under £500k"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                />
                <Button className="w-full" onClick={() => setAiInput('')}>
                  Send Message
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Manual Search */}
      <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Search className="h-6 w-6 text-green-600" />
            Manual Search
          </CardTitle>
          <p className="text-gray-600">Use our detailed filters to find properties</p>
        </CardHeader>
        <CardContent>
          <Dialog open={isManualFlowOpen} onOpenChange={setIsManualFlowOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" size="lg">
                <Search className="mr-2 h-5 w-5" />
                Advanced Search
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Find Your Perfect Property</DialogTitle>
                <DialogDescription>
                  Fill in the details to search for properties
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Country</label>
                    <Select value={searchData.country} onValueChange={(value) => setSearchData({...searchData, country: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">City</label>
                    <Select value={searchData.city} onValueChange={(value) => setSearchData({...searchData, city: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {(cities as any)[searchData.country]?.map((city: string) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Maximum Price</label>
                    <Input
                      placeholder="e.g., 500000"
                      value={searchData.maxPrice}
                      onChange={(e) => setSearchData({...searchData, maxPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Property Type</label>
                    <Select value={searchData.propertyType} onValueChange={(value) => setSearchData({...searchData, propertyType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSearch} className="w-full" size="lg">
                  Search Properties
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
