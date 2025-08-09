// Package definitions for the subscription system
export interface PackageFeatures {
  support: 'email' | 'priority_email' | 'priority';
  analytics: boolean;
  marketing: boolean;
  ai_blog?: boolean;
  social_media?: boolean;
  lead_capture?: boolean;
  booking_calendar?: boolean;
  discount?: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  interval: 'month' | 'year';
  listingsMax: number;
  features: PackageFeatures;
  stripePriceId: string;
  active: boolean;
  popular?: boolean;
  yearlyDiscount?: number;
}

export const PACKAGES: Package[] = [
  // Free tier (for reference, not in paid packages)
  {
    id: 'pkg_free',
    name: 'Free User',
    description: 'Browse properties and contact agents',
    price: 0,
    interval: 'month',
    listingsMax: 0,
    features: {
      support: 'email',
      analytics: false,
      marketing: false,
    },
    stripePriceId: '',
    active: true,
  },

  // Agent tiers
  {
    id: 'pkg_agent_basic',
    name: 'Agent Basic',
    description: 'Perfect for new agents getting started',
    price: 3000, // $30.00
    interval: 'month',
    listingsMax: 5,
    features: {
      support: 'email',
      analytics: false,
      marketing: false,
    },
    stripePriceId: 'price_agent_basic_monthly', // Replace with actual Stripe Price ID
    active: true,
  },

  {
    id: 'pkg_agent_standard',
    name: 'Agent Standard',
    description: 'For growing real estate professionals',
    price: 5000, // $50.00
    interval: 'month',
    listingsMax: 10,
    features: {
      support: 'email',
      analytics: false,
      marketing: false,
    },
    stripePriceId: 'price_agent_standard_monthly', // Replace with actual Stripe Price ID
    active: true,
    popular: true,
  },

  {
    id: 'pkg_agent_professional',
    name: 'Agent Professional',
    description: 'Advanced features for established agents',
    price: 10000, // $100.00
    interval: 'month',
    listingsMax: 20,
    features: {
      support: 'priority_email',
      analytics: false,
      marketing: false,
    },
    stripePriceId: 'price_agent_professional_monthly', // Replace with actual Stripe Price ID
    active: true,
  },

  // Expert tiers
  {
    id: 'pkg_expert_monthly',
    name: 'Real Estate Expert',
    description: 'Complete marketing suite with AI tools',
    price: 20000, // $200.00
    interval: 'month',
    listingsMax: 50,
    features: {
      support: 'priority',
      analytics: true,
      marketing: true,
      ai_blog: true,
      social_media: true,
      lead_capture: true,
      booking_calendar: true,
    },
    stripePriceId: 'price_expert_monthly', // Replace with actual Stripe Price ID
    active: true,
  },

  {
    id: 'pkg_expert_yearly',
    name: 'Real Estate Expert (Yearly)',
    description: 'Complete marketing suite with 20% yearly discount',
    price: 192000, // $1920.00 (20% discount)
    interval: 'year',
    listingsMax: 50,
    features: {
      support: 'priority',
      analytics: true,
      marketing: true,
      ai_blog: true,
      social_media: true,
      lead_capture: true,
      booking_calendar: true,
      discount: '20%',
    },
    stripePriceId: 'price_expert_yearly', // Replace with actual Stripe Price ID
    active: true,
    yearlyDiscount: 20,
  },
];

// Helper functions
export function getPackageById(id: string): Package | undefined {
  return PACKAGES.find(pkg => pkg.id === id);
}

export function getAgentPackages(): Package[] {
  return PACKAGES.filter(pkg => pkg.id.startsWith('pkg_agent_'));
}

export function getExpertPackages(): Package[] {
  return PACKAGES.filter(pkg => pkg.id.startsWith('pkg_expert_'));
}

export function getPaidPackages(): Package[] {
  return PACKAGES.filter(pkg => pkg.price > 0);
}

export function formatPrice(priceInCents: number, interval: 'month' | 'year'): string {
  const price = priceInCents / 100;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
  
  return `${formatted}/${interval}`;
}

export function canUserCreateListing(userRole: string, userPackageId: string | null, currentListingsCount: number): boolean {
  if (userRole === 'USER') return false; // Free users can't create listings
  
  if (!userPackageId) return false; // No package selected
  
  const package_ = getPackageById(userPackageId);
  if (!package_) return false;
  
  return currentListingsCount < package_.listingsMax;
}

export function getRemainingListings(userPackageId: string | null, currentListingsCount: number): number {
  if (!userPackageId) return 0;
  
  const package_ = getPackageById(userPackageId);
  if (!package_) return 0;
  
  return Math.max(0, package_.listingsMax - currentListingsCount);
}
