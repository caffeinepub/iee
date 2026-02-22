import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateWorkerProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skill, ExperienceLevel } from '../backend';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const SKILLS: Skill[] = [
  Skill.masonry,
  Skill.plumbing,
  Skill.electrician,
  Skill.carpentry,
  Skill.painting,
  Skill.welding,
  Skill.roofing,
  Skill.tiling,
  Skill.flooring,
  Skill.generalLabor,
];

const SKILL_LABELS: Record<Skill, string> = {
  [Skill.masonry]: 'Masonry',
  [Skill.plumbing]: 'Plumbing',
  [Skill.electrician]: 'Electrician',
  [Skill.carpentry]: 'Carpentry',
  [Skill.painting]: 'Painting',
  [Skill.welding]: 'Welding',
  [Skill.roofing]: 'Roofing',
  [Skill.tiling]: 'Tiling',
  [Skill.flooring]: 'Flooring',
  [Skill.generalLabor]: 'General Labor',
};

export default function WorkerRegistration() {
  const navigate = useNavigate();
  const createWorkerMutation = useCreateWorkerProfile();

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    selectedSkills: [] as Skill[],
    wageMin: '',
    wageMax: '',
    latitude: '',
    longitude: '',
  });

  const handleSkillToggle = (skill: Skill) => {
    setFormData((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter((s) => s !== skill)
        : [...prev.selectedSkills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.mobileNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.selectedSkills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }

    const wageMin = parseFloat(formData.wageMin) || 0;
    const wageMax = parseFloat(formData.wageMax) || 0;

    if (wageMin <= 0 || wageMax <= 0 || wageMin > wageMax) {
      toast.error('Please enter valid wage range');
      return;
    }

    const latitude = parseFloat(formData.latitude) || 0;
    const longitude = parseFloat(formData.longitude) || 0;

    // Convert selected skills to SkillWithExperience format
    const skillsWithExperience = formData.selectedSkills.map((skill) => ({
      skill,
      experienceLevel: ExperienceLevel.novice,
      yearsOfExperience: BigInt(0),
      certificationStatus: [],
    }));

    try {
      await createWorkerMutation.mutateAsync({
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        skills: skillsWithExperience,
        wageRange: { min: wageMin, max: wageMax },
        coordinates: { latitude, longitude },
      });

      toast.success('Worker profile created successfully!');
      navigate({ to: '/worker/jobs' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create worker profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Worker Registration</CardTitle>
          <CardDescription>Create your worker profile to start finding jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="Enter your mobile number"
                required
              />
            </div>

            {/* Skills Selection */}
            <div className="space-y-2">
              <Label>Skills * (Select at least one)</Label>
              <div className="grid grid-cols-2 gap-2">
                {SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      formData.selectedSkills.includes(skill)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    {SKILL_LABELS[skill]}
                  </button>
                ))}
              </div>
            </div>

            {/* Wage Range */}
            <div className="space-y-2">
              <Label>Desired Wage Range (per day) *</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    value={formData.wageMin}
                    onChange={(e) => setFormData({ ...formData, wageMin: e.target.value })}
                    placeholder="Min wage"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={formData.wageMax}
                    onChange={(e) => setFormData({ ...formData, wageMax: e.target.value })}
                    placeholder="Max wage"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location (Manual Entry)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="Latitude"
                    step="any"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="Longitude"
                    step="any"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your location coordinates or leave blank for default
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={createWorkerMutation.isPending}>
              {createWorkerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Create Worker Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
