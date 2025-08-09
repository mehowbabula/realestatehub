'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Home, 
  Search, 
  Filter,
  Heart,
  Share2,
  Calendar,
  Star,
  ChevronDown,
  Grid,
  List
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

// Will fetch from API; fallback to empty list initially
const mockProperties = [
  {
    id: 1,
    title: "Luxury Downtown Penthouse",
    price: 850000,
    location: "New York, NY",
    bedrooms: 3,
    bathrooms: 2,
    area: 185,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600",
    features: ["Swimming Pool", "Gym", "Parking", "Pet Friendly"],
    rating: 4.8,
    available: true,
    isPremium: true
  },
  {
    id: 2,
    title: "Modern Family Villa",
    price: 1200000,
    location: "Los Angeles, CA",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
    features: ["Garden", "Garage", "Smart Home", "Security"],
    rating: 4.9,
    available: true,
    isPremium: true
  },
  {
    id: 3,
    title: "Charming Townhouse",
    price: 650000,
    location: "Chicago, IL",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    type: "Townhouse",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    features: ["Renovated", "Near Transit", "Storage", "Balcony"],
    rating: 4.6,
    available: true,
    isPremium: false
  },
  {
    id: 4,
    title: "Waterfront Condo",
    price: 950000,
    location: "Miami, FL",
    bedrooms: 2,
    bathrooms: 2,
    area: 140,
    type: "Condo",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600",
    features: ["Ocean View", "Pool", "Gym", "Concierge"],
    rating: 4.7,
    available: true,
    isPremium: true
  },
  {
    id: 5,
    title: "Suburban Family Home",
    price: 750000,
    location: "Austin, TX",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    type: "House",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600",
    features: ["Backyard", "Garage", "Good Schools", "Quiet Area"],
    rating: 4.5,
    available: true,
    isPremium: false
  },
  {
    id: 6,
    title: "Downtown Loft",
    price: 550000,
    location: "Seattle, WA",
    bedrooms: 1,
    bathrooms: 1,
    area: 90,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600",
    features: ["Modern", "City View", "Gym", "Pet Friendly"],
    rating: 4.4,
    available: true,
    isPremium: false
  }
]

const propertyTypes = ["Apartment", "House", "Villa", "Condo", "Townhouse", "Land", "Commercial"]
const features = ["Swimming Pool", "Gym", "Parking", "Pet Friendly", "Garden", "Garage", "Smart Home", "Security", "Balcony", "Ocean View", "Concierge", "Renovated"]

export default function PropertySearchPage() {
  const router = useRouter()
  const [properties, setProperties] = useState(mockProperties)
  const [filteredProperties, setFilteredProperties] = useState(mockProperties)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/listings')
        if (!res.ok) return
        const data = await res.json()
        const mapped = (data.listings || []).map((l: any) => ({
          id: l.id,
          title: l.title,
          price: l.price,
          location: l.location,
          bedrooms: 0,
          bathrooms: 0,
          area: 0,
          type: l.type,
          image: l.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
          features: [],
          rating: 4.7,
          available: l.status === 'active',
          isPremium: true,
        }))
        setProperties(mapped)
        setFilteredProperties(mapped)
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 2000000,
    bedrooms: 0,
    bathrooms: 0,
    propertyType: 'any',
    features: [] as string[]
  })

  const applyFilters = () => {
    const filtered = properties.filter(property => {
      return (
        property.price >= filters.minPrice &&
        property.price <= filters.maxPrice &&
        property.bedrooms >= filters.bedrooms &&
        property.bathrooms >= filters.bathrooms &&
        (filters.propertyType === 'any' || property.type === filters.propertyType) &&
        (filters.features.length === 0 || filters.features.every(feature => property.features.includes(feature)))
      )
    })
    setFilteredProperties(filtered)
  }

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Premium Properties
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Worldwide
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find your perfect home from our curated collection of luxury properties
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex items-center space-x-2">
              <div className="flex-1 flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-400 ml-4" />
                <Input 
                  placeholder="Search by location, property type, or features..." 
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-0 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400">Min Price</label>
                        <Input
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                          className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400">Max Price</label>
                        <Input
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                          className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bedrooms</h3>
                    <Select value={filters.bedrooms.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: Number(value) }))}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bathrooms</h3>
                    <Select value={filters.bathrooms.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: Number(value) }))}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Type */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Property Type</h3>
                    <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {propertyTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Features</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {features.map(feature => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature}
                            checked={filters.features.includes(feature)}
                            onCheckedChange={() => handleFeatureToggle(feature)}
                          />
                          <label htmlFor={feature} className="text-sm text-gray-700 dark:text-gray-300">{feature}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={applyFilters} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Property Listings */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Properties
                </h2>
                <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {filteredProperties.length} found
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-9 w-9 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-9 w-9 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Property Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <Card key={property.id} className="group overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Premium Badge */}
                      {property.isPremium && (
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          Premium
                        </Badge>
                      )}
                      
                      {/* Available Badge */}
                      {property.available && (
                        <Badge className="absolute top-4 right-4 bg-green-600 text-white border-0">
                          Available
                        </Badge>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
                          <Heart className="h-4 w-4 text-white" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
                          <Share2 className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-sm text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-gray-700 dark:text-gray-300">{property.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                      
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                        {formatPrice(property.price)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-1" />
                          <span>{property.area}m²</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {property.features.slice(0, 2).map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {feature}
                          </Badge>
                        ))}
                        {property.features.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            +{property.features.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-gray-200 dark:border-gray-700">
                          <Calendar className="h-4 w-4 mr-1" />
                          Tour
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map(property => (
                  <Card key={property.id} className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0 w-64 h-48 rounded-xl overflow-hidden">
                          <img 
                            src={property.image} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                                {property.title}
                              </h3>
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{property.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                {formatPrice(property.price)}
                              </div>
                              <div className="flex items-center text-sm text-yellow-500 justify-end">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1 text-gray-700 dark:text-gray-300">{property.rating}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1" />
                              <span>{property.bedrooms} beds</span>
                            </div>
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1" />
                              <span>{property.bathrooms} baths</span>
                            </div>
                            <div className="flex items-center">
                              <Home className="h-4 w-4 mr-1" />
                              <span>{property.area}m²</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {property.type}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {property.features.map(feature => (
                              <Badge key={feature} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                              View Details
                            </Button>
                            <Button variant="outline" className="border-gray-200 dark:border-gray-700">
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule Tour
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No properties found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}