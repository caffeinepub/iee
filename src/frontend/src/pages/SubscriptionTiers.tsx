import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';

type TierName = 'Basic' | 'Professional' | 'Enterprise';

interface TierFeature {
  name: string;
  basic: string | boolean;
  professional: string | boolean;
  enterprise: string | boolean;
}

export default function SubscriptionTiers() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const [currentTier, setCurrentTier] = useState<TierName>('Basic');

  useEffect(() => {
    if (userProfile && userProfile.role !== 'employer') {
      navigate({ to: '/' });
    }
  }, [userProfile, navigate]);

  const tiers: TierName[] = ['Basic', 'Professional', 'Enterprise'];

  const features: TierFeature[] = [
    { name: 'Job Postings per Month', basic: '10', professional: '50', enterprise: 'Unlimited' },
    { name: 'Candidate Access', basic: '20', professional: '100', enterprise: 'Unlimited' },
    { name: 'Analytics Dashboard', basic: false, professional: true, enterprise: true },
    { name: 'Bulk Job Upload', basic: false, professional: true, enterprise: true },
    { name: 'Priority Support', basic: false, professional: false, enterprise: true },
    { name: 'Custom Branding', basic: false, professional: false, enterprise: true },
    { name: 'API Access', basic: false, professional: false, enterprise: true },
    { name: 'Dedicated Account Manager', basic: false, professional: false, enterprise: true },
  ];

  const tierPricing = {
    Basic: '₹0/month',
    Professional: '₹2,999/month',
    Enterprise: '₹9,999/month',
  };

  const mockExpiryDate = new Date();
  mockExpiryDate.setMonth(mockExpiryDate.getMonth() + 1);

  const handleTierSelection = (tier: TierName) => {
    setCurrentTier(tier);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Subscription Tiers</h1>
        <p className="text-muted-foreground text-lg">Choose the plan that fits your hiring needs</p>
      </div>

      {/* Simulation Banner */}
      <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-800 dark:text-yellow-200">SIMULATION MODE</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            No actual payments are processed. This is a demonstration of subscription tier management.
          </p>
        </div>
      </div>

      {/* Current Tier */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{currentTier} Plan</p>
              <p className="text-sm text-muted-foreground">
                Expires on {mockExpiryDate.toLocaleDateString()}
              </p>
            </div>
            <Badge variant="default" className="text-base px-4 py-2">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tier Comparison */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {tiers.map((tier) => (
          <Card key={tier} className={currentTier === tier ? 'border-primary border-2' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">{tier}</CardTitle>
                {currentTier === tier && (
                  <Badge variant="default">Current</Badge>
                )}
              </div>
              <p className="text-3xl font-bold">{tierPricing[tier]}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {features.map((feature, idx) => {
                  const value = feature[tier.toLowerCase() as keyof TierFeature];
                  return (
                    <li key={idx} className="flex items-start gap-2">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <span className="h-5 w-5 flex-shrink-0"></span>
                        )
                      ) : (
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm">
                        {feature.name}
                        {typeof value === 'string' && `: ${value}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Button
                onClick={() => handleTierSelection(tier)}
                variant={currentTier === tier ? 'outline' : 'default'}
                className="w-full"
                disabled={currentTier === tier}
              >
                {currentTier === tier ? 'Current Plan' : 'Select Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Job Postings This Month</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-sm font-semibold">3 / 10</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Candidate Access</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-sm font-semibold">9 / 20</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Analytics Access</p>
              <Badge variant={currentTier === 'Basic' ? 'outline' : 'default'}>
                {currentTier === 'Basic' ? 'Not Available' : 'Available'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
