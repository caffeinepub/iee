import { useGetEmployerFavoriteWorkers, useGetWorkerProfile, useGetVerifiedWorker } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Heart, Star, TrendingUp, Briefcase } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import VerificationBadge from '../components/VerificationBadge';
import FavoriteToggle from '../components/FavoriteToggle';

export default function EmployerFavorites() {
  const { data: favoriteIds, isLoading } = useGetEmployerFavoriteWorkers();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (!favoriteIds || favoriteIds.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Favorite Workers</h1>
            <p className="text-muted-foreground">Quick access to your preferred workers</p>
          </div>

          <Card>
            <CardContent className="py-16 text-center">
              <img
                src="/assets/generated/icon-favorite.dim_64x64.png"
                alt="No favorites"
                className="w-20 h-20 mx-auto mb-6 opacity-50"
              />
              <h3 className="text-xl font-semibold mb-2">No favorite workers yet</h3>
              <p className="text-muted-foreground mb-6">
                Add workers to your favorites for quick access when posting jobs
              </p>
              <Button onClick={() => navigate({ to: '/employer/jobs' })}>
                Browse Job Candidates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Favorite Workers</h1>
          <p className="text-muted-foreground">
            {favoriteIds.length} worker{favoriteIds.length !== 1 ? 's' : ''} in your favorites
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {favoriteIds.map((workerId) => (
            <FavoriteWorkerCard key={workerId} workerId={workerId} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FavoriteWorkerCard({ workerId }: { workerId: string }) {
  const { data: worker } = useGetWorkerProfile(workerId);
  const { data: verifiedWorker } = useGetVerifiedWorker(workerId);
  const navigate = useNavigate();

  if (!worker) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{worker.name}</CardTitle>
            {verifiedWorker && verifiedWorker.badgeLevel !== 'none' && (
              <VerificationBadge
                badgeLevel={verifiedWorker.badgeLevel}
                completedJobs={Number(verifiedWorker.completedJobs)}
                size="md"
              />
            )}
          </div>
          <FavoriteToggle workerId={workerId} isFavorited={true} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Reliability</p>
                <p className="font-semibold">{worker.reliabilityScore.toFixed(1)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="font-semibold">{worker.rating.toFixed(1)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Jobs</p>
                <p className="font-semibold">{Number(worker.completedJobs)}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {worker.skills.slice(0, 3).map((skillData, index) => (
                <Badge key={`${skillData.skill}-${index}`} variant="secondary">
                  {skillData.skill.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              ))}
              {worker.skills.length > 3 && (
                <Badge variant="outline">+{worker.skills.length - 3} more</Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate({ to: '/worker/profile' })}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              View Profile
            </Button>
            <Button
              onClick={() => navigate({ to: '/employer/jobs/create' })}
              size="sm"
              className="flex-1"
            >
              Assign to Job
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
