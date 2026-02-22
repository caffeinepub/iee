import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Download, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { SkillWithExperience, Skill, ExperienceLevel, Coordinates } from '../backend';

interface ParsedJob {
  jobDescription: string;
  skills: SkillWithExperience[];
  wageAmount: number;
  duration: number;
  shiftTiming: string;
  workerCount: bigint;
  location: Coordinates;
  isValid: boolean;
  errors: string[];
}

export default function BulkJobUpload() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { actor } = useActor();
  const [file, setFile] = useState<File | null>(null);
  const [parsedJobs, setParsedJobs] = useState<ParsedJob[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: string[]; failed: string[] } | null>(null);

  useEffect(() => {
    if (userProfile && userProfile.role !== 'employer') {
      navigate({ to: '/' });
    }
  }, [userProfile, navigate]);

  const downloadTemplate = () => {
    const csvContent = `jobDescription,skills,wageAmount,duration,shiftTiming,workerCount,latitude,longitude
"Construction work","masonry,carpentry",500,5,"9AM-5PM",10,28.6139,77.2090
"Plumbing repair","plumbing",400,2,"10AM-4PM",2,28.7041,77.1025`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job_upload_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseSkills = (skillsStr: string): SkillWithExperience[] => {
    const skillMap: Record<string, Skill> = {
      masonry: 'masonry' as Skill,
      plumbing: 'plumbing' as Skill,
      electrician: 'electrician' as Skill,
      carpentry: 'carpentry' as Skill,
      painting: 'painting' as Skill,
      roofing: 'roofing' as Skill,
      flooring: 'flooring' as Skill,
      tiling: 'tiling' as Skill,
      welding: 'welding' as Skill,
      generalLabor: 'generalLabor' as Skill,
    };

    return skillsStr.split(',').map((s) => {
      const skillKey = s.trim().toLowerCase();
      return {
        skill: skillMap[skillKey] || ('generalLabor' as Skill),
        experienceLevel: 'novice' as ExperienceLevel,
        yearsOfExperience: BigInt(1),
        certificationStatus: [],
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((line) => line.trim());
      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));

      const jobs: ParsedJob[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
        const errors: string[] = [];

        const jobDescription = values[0] || '';
        const skillsStr = values[1] || '';
        const wageAmount = parseFloat(values[2]) || 0;
        const duration = parseFloat(values[3]) || 0;
        const shiftTiming = values[4] || '';
        const workerCount = BigInt(parseInt(values[5]) || 0);
        const latitude = parseFloat(values[6]) || 0;
        const longitude = parseFloat(values[7]) || 0;

        if (!jobDescription) errors.push('Missing job description');
        if (!skillsStr) errors.push('Missing skills');
        if (wageAmount <= 0) errors.push('Invalid wage amount');
        if (duration <= 0) errors.push('Invalid duration');
        if (!shiftTiming) errors.push('Missing shift timing');
        if (workerCount <= 0) errors.push('Invalid worker count');
        if (latitude === 0 || longitude === 0) errors.push('Invalid coordinates');

        jobs.push({
          jobDescription,
          skills: parseSkills(skillsStr),
          wageAmount,
          duration,
          shiftTiming,
          workerCount,
          location: { latitude, longitude },
          isValid: errors.length === 0,
          errors,
        });
      }

      setParsedJobs(jobs);
    };

    reader.readAsText(uploadedFile);
  };

  const handleBulkUpload = async () => {
    if (!actor || parsedJobs.length === 0) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const validJobs = parsedJobs.filter((j) => j.isValid);
      const jobEntries: [string, SkillWithExperience[], number, number, string, bigint, Coordinates, string][] =
        validJobs.map((job) => [
          job.jobDescription,
          job.skills,
          job.wageAmount,
          job.duration,
          job.shiftTiming,
          job.workerCount,
          job.location,
          job.jobDescription,
        ]);

      const result = await actor.bulkJobUpload(jobEntries);

      setUploadResult({
        success: result.successfullyCreatedJobs,
        failed: result.invalidEntries,
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const validCount = parsedJobs.filter((j) => j.isValid).length;
  const invalidCount = parsedJobs.length - validCount;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Bulk Job Upload</h1>
        <p className="text-muted-foreground text-lg">Upload multiple job postings at once using CSV</p>
      </div>

      {/* Instructions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Download the CSV template below</li>
            <li>Fill in your job details following the format</li>
            <li>Upload the completed CSV file</li>
            <li>Review the parsed jobs and fix any errors</li>
            <li>Submit to create all valid job postings</li>
          </ol>
          <Button onClick={downloadTemplate} variant="outline" className="mt-4" size="default">
            <Download className="h-4 w-4 mr-2" />
            Download CSV Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {file && (
              <Badge variant="default">
                <CheckCircle className="h-4 w-4 mr-1" />
                {file.name}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {parsedJobs.length > 0 && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview ({parsedJobs.length} jobs)</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="default">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {validCount} Valid
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="destructive">
                      <XCircle className="h-4 w-4 mr-1" />
                      {invalidCount} Invalid
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {parsedJobs.map((job, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      job.isValid ? 'bg-muted border-border' : 'bg-destructive/10 border-destructive'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{job.jobDescription || 'Untitled Job'}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          <span>₹{job.wageAmount}</span>
                          <span>{job.duration} days</span>
                          <span>{Number(job.workerCount)} workers</span>
                          <span>{job.shiftTiming}</span>
                        </div>
                      </div>
                      {job.isValid ? (
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      )}
                    </div>
                    {!job.isValid && job.errors.length > 0 && (
                      <div className="mt-2 text-sm text-destructive">
                        <p className="font-semibold">Errors:</p>
                        <ul className="list-disc list-inside">
                          {job.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {validCount > 0 && (
            <div className="flex justify-end">
              <Button onClick={handleBulkUpload} disabled={isUploading} size="lg">
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Create {validCount} Job{validCount > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <Alert className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Upload Complete!</p>
            <p className="text-sm">
              Successfully created {uploadResult.success.length} job posting{uploadResult.success.length > 1 ? 's' : ''}.
            </p>
            {uploadResult.failed.length > 0 && (
              <p className="text-sm text-destructive mt-1">
                Failed to create {uploadResult.failed.length} job{uploadResult.failed.length > 1 ? 's' : ''}.
              </p>
            )}
            <Button
              onClick={() => navigate({ to: '/employer/jobs' })}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              View My Jobs
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
