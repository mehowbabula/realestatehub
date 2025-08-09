'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Heart, X, Info, Home, Users, Lightbulb, Star } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Property {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  description: string
  features: string[]
  aiMatchScore: number
}

interface UserPreference {
  lifestyle: string
  guestsOften: boolean
  naturalLight: boolean
  workFromHome: boolean
  outdoorSpace: boolean
  budget: number
  location: string
}

export default function AIMatchingPage() {
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null)
  const [preferences, setPreferences] = useState<UserPreference | null>(null)
  const [learningProgress, setLearningProgress] = useState(0)
  const [showQuestions, setShowQuestions] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [swipedProperties, setSwipedProperties] = useState<Property[]>([])
  const [likedProperties, setLikedProperties] = useState<Property[]>([])

  const questions = [
    {
      id: 1,
      text: "Do you often host guests?",
      icon: Users,
      type: "boolean"
    },
    {
      id: 2,
      text: "Do you need plenty of natural light?",
      icon: Lightbulb,
      type: "boolean"
    },
    {
      id: 3,
      text: "Do you work from home?",
      icon: Home,
      type: "boolean"
    },
    {
      id: 4,
      text: "What's your monthly budget?",
      icon: Star,
      type: "budget"
    }
  ]

  const mockProperties: Property[] = [
    {
      id: "1",
      title: "Modern Downtown Apartment",
      price: 2500,
      location: "Downtown",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      description: "Stunning modern apartment with city views",
      features: ["Balcony", "Gym", "Pool", "Parking"],
      aiMatchScore: 85
    },
    {
      id: "2",
      title: "Cozy Suburban House",
      price: 3200,
      location: "Suburbs",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      description: "Perfect family home with garden",
      features: ["Garden", "Garage", "Patio", "Fireplace"],
      aiMatchScore: 92
    },
    {
      id: "3",
      title: "Luxury Penthouse",
      price: 4500,
      location: "City Center",
      bedrooms: 2,
      bathrooms: 2.5,
      area: 2000,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400",
      description: "Exclusive penthouse with panoramic views",
      features: ["Terrace", "Concierge", "Spa", "Wine Cellar"],
      aiMatchScore: 78
    }
  ]

  useEffect(() => {
    if (!showQuestions && mockProperties.length > 0) {
      loadNextProperty()
    }
  }, [showQuestions])

  const loadNextProperty = () => {
    const remainingProperties = mockProperties.filter(
      prop => !swipedProperties.some(swiped => swiped.id === prop.id)
    )
    
    if (remainingProperties.length > 0) {
      const nextProperty = remainingProperties[Math.floor(Math.random() * remainingProperties.length)]
      setCurrentProperty(nextProperty)
    } else {
      setCurrentProperty(null)
      toast({
        title: "All properties viewed!",
        description: "You've seen all available properties. Check back later for new listings.",
      })
    }
  }

  const handleAnswer = (answer: any) => {
    const newProgress = ((currentQuestion + 1) / questions.length) * 100
    setLearningProgress(newProgress)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowQuestions(false)
      setPreferences({
        lifestyle: "modern",
        guestsOften: answer.guestsOften || false,
        naturalLight: answer.naturalLight || false,
        workFromHome: answer.workFromHome || false,
        outdoorSpace: answer.outdoorSpace || false,
        budget: answer.budget || 3000,
        location: "any"
      })
    }
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentProperty) {
      if (direction === 'right') {
        setLikedProperties([...likedProperties, currentProperty])
        toast({
          title: "Liked!",
          description: `Added ${currentProperty.title} to your favorites`,
        })
      } else {
        setSwipedProperties([...swipedProperties, currentProperty])
      }
      
      loadNextProperty()
    }
  }

  if (showQuestions) {
    const question = questions[currentQuestion]
    const Icon = question.icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-blue-600">
                AI Property Matching
              </CardTitle>
              <p className="text-center text-gray-600">
                Let us learn your preferences to find your perfect home
              </p>
            </CardHeader>
            <CardContent>
              <Progress value={learningProgress} className="mb-6" />
              
              <div className="text-center mb-8">
                <Icon className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">{question.text}</h3>
              </div>

              <div className="space-y-3">
                {question.type === "boolean" && (
                  <>
                    <Button 
                      onClick={() => handleAnswer({ [question.text.toLowerCase().replace(/\s+/g, '')]: true })}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      Yes
                    </Button>
                    <Button 
                      onClick={() => handleAnswer({ [question.text.toLowerCase().replace(/\s+/g, '')]: false })}
                      variant="outline"
                      className="w-full"
                    >
                      No
                    </Button>
                  </>
                )}
                
                {question.type === "budget" && (
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleAnswer({ budget: 2000 })}
                      variant="outline"
                      className="w-full"
                    >
                      Under $2,000
                    </Button>
                    <Button 
                      onClick={() => handleAnswer({ budget: 3000 })}
                      variant="outline"
                      className="w-full"
                    >
                      $2,000 - $3,000
                    </Button>
                    <Button 
                      onClick={() => handleAnswer({ budget: 4000 })}
                      variant="outline"
                      className="w-full"
                    >
                      $3,000 - $4,000
                    </Button>
                    <Button 
                      onClick={() => handleAnswer({ budget: 5000 })}
                      variant="outline"
                      className="w-full"
                    >
                      Over $4,000
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">AI Property Matching</h1>
          <p className="text-gray-600">Swipe right to like, left to pass</p>
        </div>

        {currentProperty ? (
          <Card className="mb-6 overflow-hidden">
            <div className="relative">
              <img 
                src={currentProperty.image} 
                alt={currentProperty.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-500">
                  {currentProperty.aiMatchScore}% Match
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{currentProperty.title}</h3>
                  <p className="text-gray-600">{currentProperty.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">${currentProperty.price}</p>
                  <p className="text-sm text-gray-500">/month</p>
                </div>
              </div>

              <div className="flex gap-4 mb-4 text-sm">
                <span>{currentProperty.bedrooms} beds</span>
                <span>{currentProperty.bathrooms} baths</span>
                <span>{currentProperty.area} sq ft</span>
              </div>

              <p className="text-gray-700 mb-4">{currentProperty.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {currentProperty.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">{feature}</Badge>
                ))}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => handleSwipe('left')}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                >
                  <X className="w-6 h-6 mr-2" />
                  Pass
                </Button>
                <Button 
                  onClick={() => handleSwipe('right')}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <Heart className="w-6 h-6 mr-2" />
                  Like
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No more properties</h3>
              <p className="text-gray-600 mb-4">
                You've viewed all available properties. Check back later for new listings!
              </p>
              <Button onClick={() => window.location.reload()}>
                Start Over
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button variant="outline" size="sm">
            <Info className="w-4 h-4 mr-2" />
            View Liked Properties ({likedProperties.length})
          </Button>
        </div>
      </div>
    </div>
  )
}