'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Check, 
  X, 
  Star, 
  Users, 
  Home, 
  MessageSquare, 
  TrendingUp,
  Video,
  Calendar,
  Mail,
  Zap,
  Crown,
  Building2,
  User
} from 'lucide-react'

const pricingPlans = [
  {
    id: 'free',
    name: 'Agent',
    price: 10,
    period: 'month',
    yearlyPrice: 96,
    description: 'Perfect for individual agents',
    features: [
      { name: 'List up to 3 properties', included: true, icon: Home },
      { name: 'Basic agent profile', included: true, icon: User },
      { name: 'Marketing tools', included: false, icon: Zap },
      { name: 'Analytics', included: false, icon: TrendingUp },
      { name: 'Messaging/contact form', included: false, icon: MessageSquare },
      { name: 'Priority listing & support', included: false, icon: Star },
      { name: 'Agent Blog with AI tools', included: false, icon: Mail },
      { name: 'Auto-post to social media', included: false, icon: Video },
      { name: 'AI-generated videos', included: false, icon: Video },
      { name: 'Lead capture & calendar', included: false, icon: Calendar },
      { name: 'Marketing analytics', included: false, icon: TrendingUp }
    ],
    popular: false,
    color: 'gray'
  },
  {
    id: 'pro',
    name: 'Real Estate Agent',
    price: 25,
    period: 'month',
    yearlyPrice: 240,
    description: 'Perfect for individual agents',
    features: [
      { name: 'List up to 10 properties', included: true, icon: Home },
      { name: 'Agent profile with photo & contact', included: true, icon: User },
      { name: 'Marketing tools', included: false, icon: Zap },
      { name: 'Analytics', included: false, icon: TrendingUp },
      { name: 'Messaging/contact form', included: true, icon: MessageSquare },
      { name: 'Priority listing & support', included: false, icon: Star },
      { name: 'Agent Blog with AI tools', included: false, icon: Mail },
      { name: 'Auto-post to social media', included: false, icon: Video },
      { name: 'AI-generated videos', included: false, icon: Video },
      { name: 'Lead capture & calendar', included: false, icon: Calendar },
      { name: 'Marketing analytics', included: false, icon: TrendingUp }
    ],
    popular: false,
    color: 'blue'
  },
  {
    id: 'expert',
    name: 'Real Estate Expert',
    price: 140,
    period: 'month',
    yearlyPrice: 1344,
    description: 'Pro Marketing Toolkit included',
    features: [
      { name: 'List up to 50 properties', included: true, icon: Home },
      { name: 'All features from lower plans', included: true, icon: Check },
      { name: 'Priority listing & agent support', included: true, icon: Star },
      { name: 'Agent Blog (powered by AI writing tools)', included: true, icon: Mail },
      { name: 'Auto-Post to Instagram, YouTube, Facebook, LinkedIn', included: true, icon: Video },
      { name: 'AI-generated Reels / Short-form Video', included: true, icon: Video },
      { name: 'Lead Capture Form + Calendar Booking', included: true, icon: Calendar },
      { name: 'Marketing & Lead Analytics Dashboard', included: true, icon: TrendingUp }
    ],
    popular: true,
    color: 'purple'
  }
]

export default function PricingPage() {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    // TODO: Redirect to registration/checkout
    router.push(`/register?plan=${planId}`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">GlobalRealEstate</span>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Select the perfect plan for your real estate business. Start with our basic plan and upgrade as you grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-purple-500 shadow-lg scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-semibold">
                  <Crown className="inline-block h-4 w-4 mr-1" />
                  Most Popular
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-8' : ''}`}>
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  plan.color === 'gray' ? 'bg-gray-100' :
                  plan.color === 'blue' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  <Users className={`h-8 w-8 ${
                    plan.color === 'gray' ? 'text-gray-600' :
                    plan.color === 'blue' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {formatPrice(isYearly ? plan.yearlyPrice / 12 : plan.price)}
                    <span className="text-lg font-normal text-gray-500">
                      /{isYearly ? 'month billed yearly' : 'month'}
                    </span>
                  </div>
                  {isYearly && plan.price > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      Save {formatPrice(plan.price * 12 - plan.yearlyPrice)} yearly
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button 
                  className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  size="lg"
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  Choose Plan
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        feature.included 
                          ? plan.color === 'gray' ? 'bg-gray-200' :
                            plan.color === 'blue' ? 'bg-blue-200' :
                            'bg-purple-200'
                          : 'bg-gray-100'
                      }`}>
                        {feature.included ? (
                          <Check className={`h-3 w-3 ${
                            plan.color === 'gray' ? 'text-gray-600' :
                            plan.color === 'blue' ? 'text-blue-600' :
                            'text-purple-600'
                          }`} />
                        ) : (
                          <X className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm ${
                          feature.included ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Agent</th>
                  <th className="text-center py-3 px-4">Real Estate Agent</th>
                  <th className="text-center py-3 px-4">Real Estate Expert</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Property Listings</td>
                  <td className="text-center py-3 px-4">Up to 3</td>
                  <td className="text-center py-3 px-4">Up to 10</td>
                  <td className="text-center py-3 px-4">Up to 50</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Priority Listing & Agent Support</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Agent Blog (AI Writing Tools)</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Auto-Post to Social Media</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">AI-Generated Reels/Short Videos</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Lead Capture + Calendar Booking</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Marketing & Lead Analytics</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">All Lower Plan Features</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Grow Your Real Estate Business?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of agents who are already using our platform to generate more leads and close more deals.
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  )
}