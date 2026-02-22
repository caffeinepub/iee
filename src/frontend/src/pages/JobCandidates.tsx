import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetJobMatches, useGetJobPosting, useGetWorkerProfile, useGetVerifiedWorker, useGetEmployerFavoriteWorkers, useAssignWorkerToJob } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, MapPin, Star, TrendingUp, User } from 'lucide-react';
import VerificationBadge from '../components/VerificationBadge';
import FavoriteToggle from '../components/FavoriteToggle';
import AvailabilityIndicator from '../components/AvailabilityIndicator';
import { useState } from 'react';
import { toast } from 'sonner';

export default function JobCandidates() {
  const { jobId } = useParams({ from: '/employer/job/$jobId/candidates' });
  const navigate = useNavigate();
  const { data: job, isLoading: jobLoading } = useGetJobPosting(jobId);
  const { data: matches, isLoading: matchesLoading } = useGetJobMatches(jobId);
  const { data: favorites } = useGetEmployerFavoriteWorkers();
  const assignWorker = useAssignWorkerToJob();
  const [expandedWorker, setExpandedWorker] = useState<string | null>(null);

  if (jobLoading || matchesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Job not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAssignWorker = async (workerId: string) => {
    try {
      await assignWorker.mutateAsync({ jobId, workerId });
      toast.success('Worker assigned successfully!');
    } catch (error) {
      console.error('Error assigning worker:', error);
      toast.error('Failed to assign worker');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/employer/jobs' })}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Candidates</h1>
          <p className="text-muted-foreground">{job.jobDescription}</p>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline">₹{job.wageAmount}/day</Badge>
            <Badge variant="outline">{job.duration} days</Badge>
            <Badge variant="outline">{job.shiftTiming}</Badge>
            <Badge variant="outline">
              {job.assignedWorkers.length}/{Number(job.workerCount)} workers assigned
            </Badge>
          </div>
        </div>

        {!matches || matches.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No matching candidates found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <CandidateCard
                key={match.workerId}
                match={match}
                isFavorited={favorites?.includes(match.workerId) || false}
                isAssigned={job.assignedWorkers.includes(match.workerId)}
                onAssign={() => handleAssignWorker(match.workerId)}
                isAssigning={assignWorker.isPending}
                expanded={expandedWorker === match.workerId}
                onToggleExpand={() =>
                  setExpandedWorker(expandedWorker === match.workerId ? null : match.workerId)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CandidateCardProps {
  match: any;
  isFavorited: boolean;
  isAssigned: boolean;
  onAssign: () => void;
  isAssigning: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}

function CandidateCard({
  match,
  isFavorited,
  isAssigned,
  onAssign,
  isAssigning,
  expanded,
  onToggleExpand,
}: CandidateCardProps) {
  const { data: worker } = useGetWorkerProfile(match.workerId);
  const { data: verifiedWorker } = useGetVerifiedWorker(match.workerId);
  const navigate = useNavigate();

  if (!worker) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold">{worker.name}</h3>
              {verifiedWorker && verifiedWorker.badgeLevel !== 'none' && (
                <VerificationBadge
                  badgeLevel={verifiedWorker.badgeLevel}
                  completedJobs={Number(verifiedWorker.completedJobs)}
                  size="md"
                />
              )}
              <FavoriteToggle workerId={match.workerId} isFavorited={isFavorited} />
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Match Score</p>
                  <p className="font-semibold">{match.matchScore.toFixed(1)}/5.0</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Reliability</p>
                  <p className="font-semibold">{match.reliabilityScore.toFixed(1)}/5.0</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Skills Match</p>
                  <p className="font-semibold">{match.skillsMatchPercentage.toFixed(0)}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-semibold">{match.distance.toFixed(1)} km</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skillData, index) => (
                  <Badge key={`${skillData.skill}-${index}`} variant="secondary">
                    {skillData.skill.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <AvailabilityIndicator workerId={match.workerId} />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => navigate({ to: '/worker/profile' })}
                variant="outline"
                size="sm"
              >
                View Full Profile
              </Button>
              {isAssigned ? (
                <Badge variant="default" className="px-4 py-2">
                  Assigned
                </Badge>
              ) : (
                <Button onClick={onAssign} disabled={isAssigning} size="sm">
                  {isAssigning ? 'Assigning...' : 'Assign to Job'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
