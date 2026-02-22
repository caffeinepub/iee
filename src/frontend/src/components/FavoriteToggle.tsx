import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useAddFavoriteWorker, useRemoveFavoriteWorker } from '../hooks/useQueries';
import { toast } from 'sonner';

interface FavoriteToggleProps {
  workerId: string;
  isFavorited: boolean;
}

export default function FavoriteToggle({ workerId, isFavorited }: FavoriteToggleProps) {
  const [isOptimisticFavorited, setIsOptimisticFavorited] = useState(isFavorited);
  const addFavorite = useAddFavoriteWorker();
  const removeFavorite = useRemoveFavoriteWorker();

  const handleToggle = async () => {
    const newState = !isOptimisticFavorited;
    setIsOptimisticFavorited(newState);

    try {
      if (newState) {
        await addFavorite.mutateAsync(workerId);
        toast.success('Worker added to favorites');
      } else {
        await removeFavorite.mutateAsync(workerId);
        toast.success('Worker removed from favorites');
      }
    } catch (error) {
      setIsOptimisticFavorited(!newState);
      toast.error('Failed to update favorites');
      console.error('Error toggling favorite:', error);
    }
  };

  const isLoading = addFavorite.isPending || removeFavorite.isPending;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      className="relative"
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          isOptimisticFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        }`}
      />
    </Button>
  );
}
