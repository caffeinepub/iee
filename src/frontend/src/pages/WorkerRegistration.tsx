import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateWorkerProfile, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import SkillsMultiSelect from '../components/SkillsMultiSelect';
import { useState, useEffect } from 'react';
import { Skill, SkillWithExperience, ExperienceLevel } from '../backend';
import { UserCircle, ArrowRight } from 'lucide-react';

export default function WorkerRegistration() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const createProfile = useCreateWorkerProfile();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [minWage, setMinWage] = useState('');
  const [maxWage, setMaxWage] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  useEffect(() => {
    if (userProfile?.name) {
      setName(userProfile.name);
    }
  }, [userProfile]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert Skill[] to SkillWithExperience[]
      const skillsWithExperience: SkillWithExperience[] = skills.map((skill) => ({
        skill,
        experienceLevel: 'novice' as ExperienceLevel,
        yearsOfExperience: BigInt(1),
        certificationStatus: [],
      }));

      const workerId = await createProfile.mutateAsync({
        name,
        mobileNumber,
        skills: skillsWithExperience,
        wageRange: {
          min: parseFloat(minWage),
          max: parseFloat(maxWage),
        },
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      });

      alert(`Worker profile created successfully! Your Worker ID: ${workerId}`);
      navigate({ to: '/worker/profile' });
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/assets/generated/worker-icon.dim_128x128.png"
              alt="Worker Registration"
              className="w-16 h-16"
            />
            <h1 className="text-4xl font-bold">Worker Registration</h1>
          </div>
          <p className="text-muted-foreground">Create your worker profile to start finding jobs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Fill in your details to create your worker profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+91 9876543210"
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
                <Label>Wage Range (₹/day) *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Min (e.g., 500)"
                    value={minWage}
                    onChange={(e) => setMinWage(e.target.value)}
                    required
                    min="0"
                    step="50"
                    className="h-12"
                  />
                  <Input
                    type="number"
                    placeholder="Max (e.g., 1500)"
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
                <Label>Your Location *</Label>
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
