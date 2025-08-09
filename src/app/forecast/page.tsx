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
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  BarChart3, 
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Building2,
  Calculator,
  Star,
  Activity,
  Zap
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface PropertyForecast {
  id: string
  address: string
  currentValue: number
  forecast1Year: number
  forecast3Years: number
  forecast5Years: number
  confidence: number
  riskLevel: 'low' | 'medium' | 'high'
  smartScore: number
  monthlyRentEstimate: number
  rentalYield: number
  marketTrends: {
    priceTrend: 'up' | 'down' | 'stable'
    demandLevel: 'high' | 'medium' | 'low'
    inventoryLevel: 'low' | 'medium' | 'high'
  }
  keyFactors: string[]
}

interface InvestmentAnalysis {
  property: PropertyForecast
  cashFlow: {
    monthlyIncome: number
    monthlyExpenses: number
    netCashFlow: number
    annualReturn: number
  }
  appreciation: {
    projected5Year: number
    annualRate: number
  }
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high'
    marketRisk: number
    propertyRisk: number
    locationRisk: number
  }
  recommendations: string[]
}

export default function ForecastPage() {
  const [selectedProperty, setSelectedProperty] = useState<string>('')
  const [analysisType, setAnalysisType] = useState<'price' | 'investment'>('price')
  const [timeHorizon, setTimeHorizon] = useState<'1year' | '3years' | '5years'>('5years')

  const properties: PropertyForecast[] = [
    {
      id: "1",
      address: "123 Main St, Downtown",
      currentValue: 450000,
      forecast1Year: 472500,
      forecast3Years: 526500,
      forecast5Years: 607500,
      confidence: 85,
      riskLevel: "medium",
      smartScore: 78,
      monthlyRentEstimate: 2800,
      rentalYield: 7.5,
      marketTrends: {
        priceTrend: "up",
        demandLevel: "high",
        inventoryLevel: "low"
      },
      keyFactors: ["Growing tech hub", "Limited new construction", "High rental demand"]
    },
    {
      id: "2",
      address: "456 Oak Ave, Suburbs",
      currentValue: 650000,
      forecast1Year: 669500,
      forecast3Years: 702000,
      forecast5Years: 747500,
      confidence: 92,
      riskLevel: "low",
      smartScore: 88,
      monthlyRentEstimate: 3500,
      rentalYield: 6.5,
      marketTrends: {
        priceTrend: "up",
        demandLevel: "medium",
        inventoryLevel: "medium"
      },
      keyFactors: ["Excellent schools", "Family-friendly area", "Stable market"]
    },
    {
      id: "3",
      address: "789 Beach Blvd, Waterfront",
      currentValue: 850000,
      forecast1Year: 892500,
      forecast3Years: 1011500,
      forecast5Years: 1190000,
      confidence: 78,
      riskLevel: "high",
      smartScore: 82,
      monthlyRentEstimate: 4200,
      rentalYield: 5.9,
      marketTrends: {
        priceTrend: "up",
        demandLevel: "high",
        inventoryLevel: "low"
      },
      keyFactors: ["Luxury market", "Climate change risk", "High appreciation potential"]
    }
  ]

  const getInvestmentAnalysis = (property: PropertyForecast): InvestmentAnalysis => {
    const monthlyExpenses = property.monthlyRentEstimate * 0.4 // 40% expenses
    const netCashFlow = property.monthlyRentEstimate - monthlyExpenses
    const annualReturn = (netCashFlow * 12) / property.currentValue * 100

    return {
      property,
      cashFlow: {
        monthlyIncome: property.monthlyRentEstimate,
        monthlyExpenses,
        netCashFlow,
        annualReturn
      },
      appreciation: {
        projected5Year: property.forecast5Years - property.currentValue,
        annualRate: ((property.forecast5Years / property.currentValue) ** (1/5) - 1) * 100
      },
      riskAssessment: {
        overallRisk: property.riskLevel,
        marketRisk: property.riskLevel === 'high' ? 75 : property.riskLevel === 'medium' ? 50 : 25,
        propertyRisk: 30,
        locationRisk: property.riskLevel === 'high' ? 60 : property.riskLevel === 'medium' ? 40 : 20
      },
      recommendations: [
        "Strong long-term investment potential",
        "Consider holding for 5+ years for maximum returns",
        "Rental income provides steady cash flow",
        property.riskLevel === 'high' ? "Monitor market conditions closely" : "Low risk, stable investment"
      ]
    }
  }

  const selectedPropertyData = properties.find(p => p.id === selectedProperty)
  const analysis = selectedPropertyData ? getInvestmentAnalysis(selectedPropertyData) : null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            AI Price Forecast & Investment Analysis
          </h1>
          <p className="text-lg text-indigo-600">
            Get AI-powered price predictions and smart investment recommendations
          </p>
        </div>

        {/* Property Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              Select Property for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {properties.map((property) => (
                <Card 
                  key={property.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedProperty === property.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                  }`}
                  onClick={() => setSelectedProperty(property.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{property.address.split(',')[0]}</h3>
                      <Badge className={getRiskColor(property.riskLevel)}>
                        {property.riskLevel} risk
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{property.address.split(',').slice(1).join(',')}</p>
                    <div className="text-lg font-bold text-indigo-600 mb-1">
                      {formatCurrency(property.currentValue)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {getTrendIcon(property.marketTrends.priceTrend)}
                      <span>Smart Score: {property.smartScore}/100</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedPropertyData && (
          <Tabs value={analysisType} onValueChange={(value) => setAnalysisType(value as 'price' | 'investment')} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="price">Price Forecast</TabsTrigger>
              <TabsTrigger value="investment">Investment Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="price">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Price Forecast Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Price Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Current Value</div>
                      <div className="text-3xl font-bold text-indigo-600">
                        {formatCurrency(selectedPropertyData.currentValue)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600">1 Year Forecast</div>
                          <div className="font-semibold">{formatCurrency(selectedPropertyData.forecast1Year)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-600 font-medium">
                            +{formatPercentage(((selectedPropertyData.forecast1Year - selectedPropertyData.currentValue) / selectedPropertyData.currentValue) * 100)}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600">3 Year Forecast</div>
                          <div className="font-semibold">{formatCurrency(selectedPropertyData.forecast3Years)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-600 font-medium">
                            +{formatPercentage(((selectedPropertyData.forecast3Years - selectedPropertyData.currentValue) / selectedPropertyData.currentValue) * 100)}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600">5 Year Forecast</div>
                          <div className="font-semibold">{formatCurrency(selectedPropertyData.forecast5Years)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-600 font-medium">
                            +{formatPercentage(((selectedPropertyData.forecast5Years - selectedPropertyData.currentValue) / selectedPropertyData.currentValue) * 100)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">AI Confidence</span>
                        <span className="text-sm font-semibold">{selectedPropertyData.confidence}%</span>
                      </div>
                      <Progress value={selectedPropertyData.confidence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Market Insights Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Market Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Smart Score</div>
                        <div className="text-2xl font-bold text-indigo-600">{selectedPropertyData.smartScore}/100</div>
                        <div className="text-xs text-gray-500">Investment Grade</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Rental Yield</div>
                        <div className="text-2xl font-bold text-green-600">{formatPercentage(selectedPropertyData.rentalYield)}</div>
                        <div className="text-xs text-gray-500">Annual Return</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Market Trends</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Price Trend</span>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(selectedPropertyData.marketTrends.priceTrend)}
                            <span className="text-sm font-medium capitalize">
                              {selectedPropertyData.marketTrends.priceTrend}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Demand Level</span>
                          <Badge className={
                            selectedPropertyData.marketTrends.demandLevel === 'high' ? 'bg-red-100 text-red-700' :
                            selectedPropertyData.marketTrends.demandLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {selectedPropertyData.marketTrends.demandLevel}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Inventory Level</span>
                          <Badge className={
                            selectedPropertyData.marketTrends.inventoryLevel === 'low' ? 'bg-red-100 text-red-700' :
                            selectedPropertyData.marketTrends.inventoryLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {selectedPropertyData.marketTrends.inventoryLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Key Factors</h4>
                      <div className="space-y-1">
                        {selectedPropertyData.keyFactors.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="investment">
              {analysis && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cash Flow Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-green-600" />
                        Cash Flow Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Monthly Income</div>
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(analysis.cashFlow.monthlyIncome)}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Monthly Expenses</div>
                          <div className="text-xl font-bold text-red-600">
                            {formatCurrency(analysis.cashFlow.monthlyExpenses)}
                          </div>
                        </div>
                      </div>

                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Net Monthly Cash Flow</div>
                        <div className={`text-2xl font-bold ${
                          analysis.cashFlow.netCashFlow > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(analysis.cashFlow.netCashFlow)}
                        </div>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Annual Cash-on-Cash Return</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {formatPercentage(analysis.cashFlow.annualReturn)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Overall Risk Level</div>
                        <Badge className={getRiskColor(analysis.riskAssessment.overallRisk)}>
                          {analysis.riskAssessment.overallRisk.toUpperCase()} RISK
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Market Risk</span>
                            <span className="text-sm font-semibold">{analysis.riskAssessment.marketRisk}%</span>
                          </div>
                          <Progress value={analysis.riskAssessment.marketRisk} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Property Risk</span>
                            <span className="text-sm font-semibold">{analysis.riskAssessment.propertyRisk}%</span>
                          </div>
                          <Progress value={analysis.riskAssessment.propertyRisk} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Location Risk</span>
                            <span className="text-sm font-semibold">{analysis.riskAssessment.locationRisk}%</span>
                          </div>
                          <Progress value={analysis.riskAssessment.locationRisk} className="h-2" />
                        </div>
                      </div>

                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">5-Year Appreciation</div>
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(analysis.appreciation.projected5Year)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatPercentage(analysis.appreciation.annualRate)} annually
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        AI Investment Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {!selectedProperty && (
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Select a Property</h3>
              <p className="text-gray-600">
                Choose a property from the cards above to get detailed AI-powered price forecasts and investment analysis.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}