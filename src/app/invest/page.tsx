'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Bitcoin, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Users, 
  PieChart, 
  Wallet,
  Target,
  Star,
  Home
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface PropertyInvestment {
  id: string
  title: string
  location: string
  totalValue: number
  tokenPrice: number
  tokensAvailable: number
  totalTokens: number
  monthlyRent: number
  estimatedReturn: number
  image: string
  features: string[]
  occupancy: number
}

interface UserPortfolio {
  totalInvested: number
  currentValue: number
  monthlyIncome: number
  properties: Array<{
    id: string
    title: string
    tokensOwned: number
    investmentValue: number
    monthlyReturn: number
  }>
}

interface CryptoWallet {
  balance: {
    btc: number
    eth: number
    usdt: number
  }
  address: string
}

export default function InvestPage() {
  const [activeTab, setActiveTab] = useState('browse')
  const [selectedProperty, setSelectedProperty] = useState<PropertyInvestment | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState('usdt')
  const [userPortfolio, setUserPortfolio] = useState<UserPortfolio>({
    totalInvested: 15000,
    currentValue: 16250,
    monthlyIncome: 325,
    properties: [
      {
        id: "1",
        title: "Downtown Luxury Apartment",
        tokensOwned: 50,
        investmentValue: 5000,
        monthlyReturn: 125
      },
      {
        id: "2",
        title: "Suburban Family Home",
        tokensOwned: 100,
        investmentValue: 10000,
        monthlyReturn: 200
      }
    ]
  })

  const [cryptoWallet, setCryptoWallet] = useState<CryptoWallet>({
    balance: {
      btc: 0.5,
      eth: 5,
      usdt: 2500
    },
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f12345"
  })

  const properties: PropertyInvestment[] = [
    {
      id: "1",
      title: "Miami Beach Condo",
      location: "Miami, Florida",
      totalValue: 850000,
      tokenPrice: 100,
      tokensAvailable: 1500,
      totalTokens: 8500,
      monthlyRent: 4200,
      estimatedReturn: 8.5,
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400",
      features: ["Ocean View", "Pool", "Gym", "Concierge"],
      occupancy: 95
    },
    {
      id: "2",
      title: "Manhattan Studio",
      location: "New York, NY",
      totalValue: 650000,
      tokenPrice: 65,
      tokensAvailable: 2000,
      totalTokens: 10000,
      monthlyRent: 3200,
      estimatedReturn: 7.2,
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400",
      features: ["City View", "Doorman", "Laundry", "Gym"],
      occupancy: 98
    },
    {
      id: "3",
      title: "Austin Townhouse",
      location: "Austin, Texas",
      totalValue: 450000,
      tokenPrice: 45,
      tokensAvailable: 3000,
      totalTokens: 10000,
      monthlyRent: 2800,
      estimatedReturn: 9.1,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      features: ["Backyard", "Garage", "Modern Kitchen", "2 Floors"],
      occupancy: 90
    }
  ]

  const cryptoPrices = {
    btc: 45000,
    eth: 3200,
    usdt: 1
  }

  const handleInvest = () => {
    if (!selectedProperty || !investmentAmount) return

    const amount = parseFloat(investmentAmount)
    const cryptoValue = cryptoPrices[selectedCrypto as keyof typeof cryptoPrices]
    const tokensToBuy = Math.floor((amount * cryptoValue) / selectedProperty.tokenPrice)

    if (tokensToBuy > selectedProperty.tokensAvailable) {
      toast({
        title: "Insufficient Tokens",
        description: "Not enough tokens available for this investment.",
        variant: "destructive"
      })
      return
    }

    // Update portfolio
    const newProperty = {
      id: selectedProperty.id,
      title: selectedProperty.title,
      tokensOwned: tokensToBuy,
      investmentValue: amount * cryptoValue,
      monthlyReturn: (selectedProperty.monthlyRent * tokensToBuy) / selectedProperty.totalTokens
    }

    setUserPortfolio(prev => ({
      totalInvested: prev.totalInvested + (amount * cryptoValue),
      currentValue: prev.currentValue + (amount * cryptoValue),
      monthlyIncome: prev.monthlyIncome + newProperty.monthlyReturn,
      properties: [...prev.properties, newProperty]
    }))

    // Update wallet
    setCryptoWallet(prev => ({
      ...prev,
      balance: {
        ...prev.balance,
        [selectedCrypto]: prev.balance[selectedCrypto as keyof typeof prev.balance] - amount
      }
    }))

    toast({
      title: "Investment Successful!",
      description: `You've purchased ${tokensToBuy} tokens in ${selectedProperty.title}`,
    })

    // Reset form
    setInvestmentAmount('')
    setSelectedProperty(null)
  }

  const totalReturn = ((userPortfolio.currentValue - userPortfolio.totalInvested) / userPortfolio.totalInvested) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Property Investment Platform
          </h1>
          <p className="text-lg text-green-600">
            Invest in real estate with cryptocurrency starting from just $50
          </p>
        </div>

        {/* Portfolio Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-6 w-6 text-green-600" />
              Your Investment Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${userPortfolio.totalInvested.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Invested</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${userPortfolio.currentValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Current Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {totalReturn.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Total Return</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${userPortfolio.monthlyIncome.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Monthly Income</div>
              </div>
            </div>

            {/* Crypto Wallet */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Your Crypto Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Bitcoin className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="font-semibold">{cryptoWallet.balance.btc} BTC</div>
                      <div className="text-sm text-gray-600">
                        ${(cryptoWallet.balance.btc * cryptoPrices.btc).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bitcoin className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="font-semibold">{cryptoWallet.balance.eth} ETH</div>
                      <div className="text-sm text-gray-600">
                        ${(cryptoWallet.balance.eth * cryptoPrices.eth).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="font-semibold">{cryptoWallet.balance.usdt} USDT</div>
                      <div className="text-sm text-gray-600">
                        ${cryptoWallet.balance.usdt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Properties</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="market">Market Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500">
                        {property.estimatedReturn}% Return
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{property.location}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <span className="text-gray-600">Token Price:</span>
                        <span className="font-semibold ml-1">${property.tokenPrice}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Rent:</span>
                        <span className="font-semibold ml-1">${property.monthlyRent}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Tokens Available</span>
                        <span className="text-sm font-medium">
                          {property.tokensAvailable}/{property.totalTokens}
                        </span>
                      </div>
                      <Progress 
                        value={((property.totalTokens - property.tokensAvailable) / property.totalTokens) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => setSelectedProperty(property)}
                      className="w-full"
                      size="sm"
                    >
                      Invest Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Your Property Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userPortfolio.properties.map((property) => (
                    <Card key={property.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{property.title}</h3>
                            <p className="text-sm text-gray-600">{property.tokensOwned} tokens owned</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${property.investmentValue.toLocaleString()}</div>
                            <div className="text-sm text-green-600">
                              +${property.monthlyReturn.toFixed(2)}/month
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market">
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-semibold">Total Market Cap</h3>
                      <p className="text-2xl font-bold text-green-600">$2.5M</p>
                      <p className="text-sm text-gray-600">+12.5% this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold">Active Investors</h3>
                      <p className="text-2xl font-bold text-blue-600">1,234</p>
                      <p className="text-sm text-gray-600">+89 this week</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Building2 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <h3 className="font-semibold">Properties Listed</h3>
                      <p className="text-2xl font-bold text-purple-600">45</p>
                      <p className="text-sm text-gray-600">3 new today</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Investment Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Invest in {selectedProperty.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <img 
                    src={selectedProperty.image} 
                    alt={selectedProperty.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm text-gray-600">{selectedProperty.location}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Token Price:</span>
                    <div className="font-semibold">${selectedProperty.tokenPrice}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Available:</span>
                    <div className="font-semibold">{selectedProperty.tokensAvailable} tokens</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Cryptocurrency</label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                      <SelectItem value="usdt">Tether (USDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Investment Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Balance: {cryptoWallet.balance[selectedCrypto as keyof typeof cryptoWallet.balance]} {selectedCrypto.toUpperCase()}
                  </p>
                </div>
                
                {investmentAmount && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">
                      You will receive: {Math.floor((parseFloat(investmentAmount) * cryptoPrices[selectedCrypto as keyof typeof cryptoPrices]) / selectedProperty.tokenPrice)} tokens
                    </p>
                    <p className="text-sm text-green-600">
                      Estimated monthly return: ${((selectedProperty.monthlyRent * Math.floor((parseFloat(investmentAmount) * cryptoPrices[selectedCrypto as keyof typeof cryptoPrices]) / selectedProperty.tokenPrice)) / selectedProperty.totalTokens).toFixed(2)}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedProperty(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleInvest} className="flex-1" disabled={!investmentAmount}>
                    Invest
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}