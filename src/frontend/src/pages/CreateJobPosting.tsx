import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateJobPosting } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import SkillsMultiSelect from '../components/SkillsMultiSelect';
import { useState, useEffect } from 'react';
import { Skill } from '../backend';
import { Briefcase, ArrowRight } from 'lucide-react';

export default function CreateJobPosting() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createJob = useCreateJobPosting();

  const [requiredSkills, setRequiredSkills] = useState<Skill[]>([]);
  const [wageAmount, setWageAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [shiftTiming, setShiftTiming] = useState('');
  const [workerCount, setWorkerCount] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

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
      const jobId = await createJob.mutateAsync({
        requiredSkills,
        wageAmount: parseFloat(wageAmount),
        duration: parseFloat(duration),
        shiftTiming,
        workerCount: BigInt(workerCount),
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        jobDescription,
      });

      alert(`Job posted successfully! Job ID: ${jobId}`);
      navigate({ to: '/employer/jobs' });
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/assets/generated/job-posting-icon.dim_128x128.png"
              alt="Job Posting"
              className="w-16 h-16"
            />
            <h1 className="text-4xl font-bold">Post a Job</h1>
          </div>
          <p className="text-muted-foreground">Create a new job posting to find workers</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Fill in the job requirements and details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Required Skills * (Select all that apply)</Label>
                <SkillsMultiSelect selectedSkills={requiredSkills} onChange={setRequiredSkills} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wage">Wage Amount (₹/day) *</Label>
                  <Input
                    id="wage"
                    type="number"
                    placeholder="1000"
                    value={wageAmount}
                    onChange={(e) => setWageAmount(e.target.value)}
                    required
                    min="0"
                    step="50"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="7"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    min="1"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shift">Shift Timing *</Label>
                  <Input
                    id="shift"
                    type="text"
                    placeholder="9 AM - 5 PM"
                    value={shiftTiming}
                    onChange={(e) => setShiftTiming(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workerCount">Number of Workers *</Label>
                  <Input
                    id="workerCount"
                    type="number"
                    placeholder="5"
                    value={workerCount}
                    onChange={(e) => setWorkerCount(e.target.value)}
                    required
                    min="1"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Job Location *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job requirements, responsibilities, and any other relevant details..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                  rows={5}
                  className="resize-none"
                />
              </div>

              <Button type="submit" size="lg" disabled={createJob.isPending} className="w-full h-14 text-lg">
                {createJob.isPending ? 'Posting Job...' : 'Post Job'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
