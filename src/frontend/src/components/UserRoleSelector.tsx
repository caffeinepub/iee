import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Users, Briefcase } from 'lucide-react';
import { UserRole } from '../backend';

export default function UserRoleSelector() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !selectedRole) {
      return;
    }

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

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Please log in to continue.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to WorkConnect</h1>
          <p className="text-xl text-muted-foreground">Let's get you started. First, tell us about yourself.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Name</CardTitle>
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
                  required
                  className="text-base"
                />
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Choose Your Role</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedRole === UserRole.worker ? 'border-primary border-2 shadow-lg' : 'border-2'
                }`}
                onClick={() => setSelectedRole(UserRole.worker)}
              >
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">I am a Worker</h3>
                    <p className="text-muted-foreground mb-4">
                      Find jobs matching your skills and experience
                    </p>
                    <ul className="text-left space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Browse available jobs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Apply to jobs that match your skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Track your work history and earnings</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedRole === UserRole.employer ? 'border-primary border-2 shadow-lg' : 'border-2'
                }`}
                onClick={() => setSelectedRole(UserRole.employer)}
              >
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">I am an Employer</h3>
                    <p className="text-muted-foreground mb-4">
                      Post jobs and hire skilled workers
                    </p>
                    <ul className="text-left space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Post job openings quickly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Review matched candidates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Manage your workforce efficiently</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={!name.trim() || !selectedRole || saveProfile.isPending}
              className="px-12"
            >
              {saveProfile.isPending ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
