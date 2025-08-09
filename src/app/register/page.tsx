'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload,
  MapPin,
  Globe,
  Briefcase
} from 'lucide-react'

interface RegistrationData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  agencyName: string
  licenseNumber: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  bio: string
  languages: string[]
  acceptTerms: boolean
  plan: string
  billingName: string
  billingEmail: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Portugal', 'Netherlands', 'Switzerland', 'Japan'
]

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Dutch'
]

const plans = [
  { id: 'free', name: 'Agent', price: 0 },
  { id: 'pro', name: 'Real Estate Agent', price: 20 },
  { id: 'expert', name: 'Real Estate Expert', price: 50 }
]

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan')
  
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    agencyName: '',
    licenseNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    bio: '',
    languages: [],
    acceptTerms: false,
    plan: planParam || '',
    billingName: '',
    billingEmail: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  const updateField = (field: keyof RegistrationData, value: string | string[] | boolean) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (planParam) {
      updateField('plan', planParam)
    }
  }, [planParam])

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = registrationData.languages
    if (currentLanguages.includes(language)) {
      updateField('languages', currentLanguages.filter(l => l !== language))
    } else {
      updateField('languages', [...currentLanguages, language])
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // TODO: Handle successful registration
      console.log('Registration data:', registrationData)
      router.push('/dashboard')
    }, 3000)
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return registrationData.email && 
               registrationData.password && 
               registrationData.confirmPassword &&
               registrationData.password === registrationData.confirmPassword &&
               registrationData.acceptTerms
      case 2:
        return registrationData.firstName && 
               registrationData.lastName && 
               registrationData.phone
      case 3:
        return registrationData.plan
      case 4:
        return registrationData.billingName && 
               registrationData.billingEmail &&
               registrationData.cardNumber &&
               registrationData.expiryDate &&
               registrationData.cvv
      default:
        return false
    }
  }

  const selectedPlan = plans.find(p => p.id === registrationData.plan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">GlobalRealEstate</span>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 1 && 'Create Your Account'}
              {step === 2 && 'Setup Your Profile'}
              {step === 3 && 'Choose Your Plan'}
              {step === 4 && 'Payment Information'}
            </h2>
            <p className="text-gray-600">
              {step === 1 && 'Join our platform and start growing your real estate business'}
              {step === 2 && 'Tell us about yourself and your agency'}
              {step === 3 && 'Select the perfect plan for your needs'}
              {step === 4 && 'Securely enter your payment information'}
            </p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            {/* Step 1: Account Creation */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={registrationData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone"
                        className="pl-10"
                        value={registrationData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        value={registrationData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={registrationData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={registrationData.acceptTerms}
                    onCheckedChange={(checked) => updateField('acceptTerms', checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the Terms and Conditions and Privacy Policy
                  </Label>
                </div>
              </div>
            )}

            {/* Step 2: Profile Setup */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        className="pl-10"
                        value={registrationData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        className="pl-10"
                        value={registrationData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agencyName">Agency Name (Optional)</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="agencyName"
                      placeholder="Enter your agency name"
                      className="pl-10"
                      value={registrationData.agencyName}
                      onChange={(e) => updateField('agencyName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number (Optional)</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="licenseNumber"
                      placeholder="Enter your license number"
                      className="pl-10"
                      value={registrationData.licenseNumber}
                      onChange={(e) => updateField('licenseNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your experience"
                    value={registrationData.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Languages Spoken</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {languages.map(language => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={registrationData.languages.includes(language)}
                          onCheckedChange={() => handleLanguageToggle(language)}
                        />
                        <Label htmlFor={language} className="text-sm">{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {plans.map(plan => (
                    <Card 
                      key={plan.id}
                      className={`cursor-pointer transition-all ${
                        registrationData.plan === plan.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => updateField('plan', plan.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{plan.name}</h3>
                            <p className="text-gray-600">
                              {plan.price === 0 ? 'FREE Forever' : `${formatPrice(plan.price)}/month`}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {plan.price === 0 ? 'FREE' : formatPrice(plan.price)}
                            </div>
                            {registrationData.plan === plan.id && (
                              <Badge className="bg-green-600">Selected</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedPlan && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Plan Summary</h4>
                      <div className="text-sm text-gray-600">
                        <p>• {selectedPlan.name} Plan</p>
                        <p>• {selectedPlan.price === 0 ? 'No payment required' : `${formatPrice(selectedPlan.price)} billed monthly`}</p>
                        {selectedPlan.price > 0 && (
                          <p>• You can cancel anytime</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 4: Payment Information */}
            {step === 4 && (
              <div className="space-y-4">
                {selectedPlan && selectedPlan.price > 0 ? (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Payment Summary</h4>
                      <div className="flex justify-between items-center">
                        <span>{selectedPlan.name} Plan</span>
                        <span className="font-bold">{formatPrice(selectedPlan.price)}/month</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingName">Billing Name</Label>
                      <Input
                        id="billingName"
                        placeholder="Enter your billing name"
                        value={registrationData.billingName}
                        onChange={(e) => updateField('billingName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingEmail">Billing Email</Label>
                      <Input
                        id="billingEmail"
                        type="email"
                        placeholder="Enter your billing email"
                        value={registrationData.billingEmail}
                        onChange={(e) => updateField('billingEmail', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="pl-10"
                          value={registrationData.cardNumber}
                          onChange={(e) => updateField('cardNumber', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={registrationData.expiryDate}
                          onChange={(e) => updateField('expiryDate', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={registrationData.cvv}
                          onChange={(e) => updateField('cvv', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Payment Required</h3>
                    <p className="text-gray-600">
                      You've selected the free plan. No payment information is needed.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <div className="flex space-x-2">
                {step < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceedToNextStep() || isLoading}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceedToNextStep() || isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RegisterContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  )
}

export default RegisterContent