import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateJobPosting, useSaveJobTemplate, useGetJobTemplates } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import SkillsMultiSelect from '../components/SkillsMultiSelect';
import { useState, useEffect } from 'react';
import { Skill, SkillWithExperience, ExperienceLevel, JobTemplate } from '../backend';
import { ArrowRight, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateJobPosting() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createJob = useCreateJobPosting();
  const saveTemplate = useSaveJobTemplate();
  const { data: templates } = useGetJobTemplates();

  const [requiredSkills, setRequiredSkills] = useState<Skill[]>([]);
  const [wageAmount, setWageAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [shiftTiming, setShiftTiming] = useState('');
  const [workerCount, setWorkerCount] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [saveAsTemplateOpen, setSaveAsTemplateOpen] = useState(false);
  const [loadTemplateOpen, setLoadTemplateOpen] = useState(false);

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
      const skillsWithExperience: SkillWithExperience[] = requiredSkills.map((skill) => ({
        skill,
        experienceLevel: 'novice' as ExperienceLevel,
        yearsOfExperience: BigInt(1),
        certificationStatus: [],
      }));

      const jobId = await createJob.mutateAsync({
        requiredSkills: skillsWithExperience,
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

      toast.success(`Job posted successfully! Job ID: ${jobId}`);
      navigate({ to: '/employer/jobs' });
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job. Please try again.');
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!identity || !templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    try {
      const skillsWithExperience: SkillWithExperience[] = requiredSkills.map((skill) => ({
        skill,
        experienceLevel: 'novice' as ExperienceLevel,
        yearsOfExperience: BigInt(1),
        certificationStatus: [],
      }));

      const template: JobTemplate = {
        templateId: `T${Date.now()}`,
        employerId: identity.getPrincipal(),
        templateName,
        requiredSkills: skillsWithExperience,
        wageAmount: parseFloat(wageAmount) || 0,
        duration: parseFloat(duration) || 0,
        shiftTiming: shiftTiming || '',
        workerCount: BigInt(workerCount || 0),
        location: {
          latitude: parseFloat(latitude) || 0,
          longitude: parseFloat(longitude) || 0,
        },
        jobDescription: jobDescription || '',
      };

      await saveTemplate.mutateAsync(template);
      toast.success('Template saved successfully!');
      setSaveAsTemplateOpen(false);
      setTemplateName('');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const handleLoadTemplate = (template: JobTemplate) => {
    setRequiredSkills(template.requiredSkills.map((s) => s.skill));
    setWageAmount(template.wageAmount.toString());
    setDuration(template.duration.toString());
    setShiftTiming(template.shiftTiming);
    setWorkerCount(template.workerCount.toString());
    setLatitude(template.location.latitude.toString());
    setLongitude(template.location.longitude.toString());
    setJobDescription(template.jobDescription);
    setLoadTemplateOpen(false);
    toast.success('Template loaded successfully!');
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Fill in the job requirements and details</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog open={loadTemplateOpen} onOpenChange={setLoadTemplateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Load Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Load from Template</DialogTitle>
                      <DialogDescription>
                        Select a template to pre-fill the form
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {templates && templates.length > 0 ? (
                        templates.map((template) => (
                          <Card
                            key={template.templateId}
                            className="cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => handleLoadTemplate(template)}
                          >
                            <CardContent className="p-4">
                              <p className="font-semibold">{template.templateName}</p>
                              <p className="text-sm text-muted-foreground">
                                {template.requiredSkills.length} skills • ₹{template.wageAmount}/day
                              </p>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No templates saved yet
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={saveAsTemplateOpen} onOpenChange={setSaveAsTemplateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save as Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save as Template</DialogTitle>
                      <DialogDescription>
                        Give your template a name to save it for future use
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="templateName">Template Name</Label>
                        <Input
                          id="templateName"
                          placeholder="e.g., Construction Site Template"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleSaveAsTemplate}
                        disabled={saveTemplate.isPending || !templateName.trim()}
                      >
                        {saveTemplate.isPending ? 'Saving...' : 'Save Template'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
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
