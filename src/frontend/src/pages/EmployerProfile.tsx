import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyEmployerProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Phone, Building2, User } from 'lucide-react';
import { useEffect } from 'react';

export default function EmployerProfile() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: employerProfile, isLoading } = useGetMyEmployerProfile();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!employerProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No employer profile found.</p>
            <Button onClick={() => navigate({ to: '/employer/register' })}>Create Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Company Profile</h1>
          <p className="text-muted-foreground">View and manage your company information</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <img
                src="/assets/generated/employer-icon.dim_128x128.png"
                alt="Employer"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <CardTitle className="text-2xl">{employerProfile.companyName}</CardTitle>
                <p className="text-muted-foreground">{employerProfile.companyType}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-semibold">{employerProfile.contactPerson}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-semibold">{employerProfile.mobileNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Company Type</p>
                  <p className="font-semibold">{employerProfile.companyType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">
                    {employerProfile.coordinates.latitude.toFixed(4)}, {employerProfile.coordinates.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
