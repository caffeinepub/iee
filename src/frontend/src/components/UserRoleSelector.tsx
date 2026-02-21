import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserRole } from '../backend';

export default function UserRoleSelector() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  if (!identity) {
    navigate({ to: '/' });
    return null;
  }

  const handleSubmit = async () => {
    if (!name.trim() || !selectedRole) return;

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        role: selectedRole,
      });

      if (selectedRole === UserRole.worker) {
        navigate({ to: '/worker/register' });
      } else {
        navigate({ to: '/employer/register' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to IEE!</h1>
          <p className="text-xl text-muted-foreground">Let's set up your profile</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's your name?</CardTitle>
            <CardDescription>This will be displayed on your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg h-12"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Choose your role</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === UserRole.worker ? 'border-primary border-2 shadow-lg' : 'border-2'
              }`}
              onClick={() => setSelectedRole(UserRole.worker)}
            >
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img
                    src="/assets/generated/worker-icon.dim_128x128.png"
                    alt="Worker"
                    className="w-20 h-20 rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">I'm a Worker</h3>
                <p className="text-muted-foreground mb-4">Looking for job opportunities</p>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Find nearby jobs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Build your profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Track earnings</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === UserRole.employer ? 'border-primary border-2 shadow-lg' : 'border-2'
              }`}
              onClick={() => setSelectedRole(UserRole.employer)}
            >
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img
                    src="/assets/generated/employer-icon.dim_128x128.png"
                    alt="Employer"
                    className="w-16 h-16 rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">I'm an Employer</h3>
                <p className="text-muted-foreground mb-4">Looking to hire workers</p>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Post job openings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Find verified workers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Manage workforce</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!name.trim() || !selectedRole || saveProfile.isPending}
            className="px-12 h-14 text-lg"
          >
            {saveProfile.isPending ? 'Creating Profile...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
