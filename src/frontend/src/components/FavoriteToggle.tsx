import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useAddFavoriteWorker, useRemoveFavoriteWorker } from '../hooks/useQueries';
import { toast } from 'sonner';

interface FavoriteToggleProps {
  workerId: string;
  isFavorited: boolean;
}

export default function FavoriteToggle({ workerId, isFavorited }: FavoriteToggleProps) {
  const addFavorite = useAddFavoriteWorker();
  const removeFavorite = useRemoveFavoriteWorker();

  const handleToggle = async () => {
    try {
      if (isFavorited) {
        await removeFavorite.mutateAsync(workerId);
        toast.success('Removed from favorites');
      } else {
        await addFavorite.mutateAsync(workerId);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={addFavorite.isPending || removeFavorite.isPending}
      className="h-8 w-8"
    >
      <Heart
        className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
      />
    </Button>
  );
}
