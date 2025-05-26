
import { Card } from "@/components/ui/card";

interface LoadingSkeletonProps {
  type?: 'card' | 'stats' | 'list';
  count?: number;
}

const LoadingSkeleton = ({ type = 'card', count = 3 }: LoadingSkeletonProps) => {
  const renderCardSkeleton = () => (
    <Card className="bg-netflix-card border-netflix-border p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="bg-gray-700 rounded-lg p-3 w-12 h-12"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
          <div className="h-3 bg-gray-600 rounded w-full"></div>
        </div>
      </div>
    </Card>
  );

  const renderStatsSkeleton = () => (
    <Card className="bg-netflix-card border-netflix-border p-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 bg-gray-700 rounded w-16"></div>
        <div className="h-3 bg-gray-600 rounded w-20"></div>
      </div>
    </Card>
  );

  const renderListSkeleton = () => (
    <Card className="bg-netflix-card border-netflix-border p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="bg-gray-700 rounded-lg w-8 h-8"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </Card>
  );

  const skeletonMap = {
    card: renderCardSkeleton,
    stats: renderStatsSkeleton,
    list: renderListSkeleton,
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {skeletonMap[type]()}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
