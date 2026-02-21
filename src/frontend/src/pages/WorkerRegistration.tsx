import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateWorkerProfile, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import SkillsMultiSelect from '../components/SkillsMultiSelect';
import { useState, useEffect } from 'react';
import { Skill, ExperienceLevel } from '../backend';
import { ArrowRight } from 'lucide-react';

export default function WorkerRegistration() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const createProfile = useCreateWorkerProfile();

  const [mobileNumber, setMobileNumber] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('novice' as ExperienceLevel);
  const [minWage, setMinWage] = useState('');
  const [maxWage, setMaxWage] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userProfile?.name) {
      alert('User profile not found. Please complete role selection first.');
      return;
    }

    try {
      const workerId = await createProfile.mutateAsync({
        name: userProfile.name,
        mobileNumber,
        skills,
        experienceLevel,
        wageRange: {
          min: parseFloat(minWage),
          max: parseFloat(maxWage),
        },
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      });

      alert(`Profile created successfully! Your Worker ID is: ${workerId}`);
      navigate({ to: '/worker/profile' });
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile. Please try again.');
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Worker Registration</h1>
          <p className="text-muted-foreground">Complete your profile to start finding jobs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Fill in your details to create your worker profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+1234567890"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Skills * (Select all that apply)</Label>
                <SkillsMultiSelect selectedSkills={skills} onChange={setSkills} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level *</Label>
                <Select value={experienceLevel} onValueChange={(value) => setExperienceLevel(value as ExperienceLevel)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novice">Novice (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="expert">Expert (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minWage">Minimum Wage (₹/day) *</Label>
                  <Input
                    id="minWage"
                    type="number"
                    placeholder="500"
                    value={minWage}
                    onChange={(e) => setMinWage(e.target.value)}
                    required
                    min="0"
                    step="50"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxWage">Maximum Wage (₹/day) *</Label>
                  <Input
                    id="maxWage"
                    type="number"
                    placeholder="1500"
                    value={maxWage}
                    onChange={(e) => setMaxWage(e.target.value)}
                    required
                    min="0"
                    step="50"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location *</Label>
                <div className="flex gap-2 mb-2">
                  <Button type="button" onClick={handleGetLocation} variant="outline" className="h-12">
                    Use Current Location
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                    step="any"
                    className="h-12"
                  />
                  <Input
                    type="number"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                    step="any"
                    className="h-12"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" disabled={createProfile.isPending} className="w-full h-14 text-lg">
                {createProfile.isPending ? 'Creating Profile...' : 'Create Profile'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
