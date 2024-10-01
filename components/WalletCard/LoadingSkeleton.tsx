import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    <Card className="rounded-xl bg-white p-5 sm:p-8">
      <CardContent className="p-0">
        <Skeleton className="h-16 w-full mb-4" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-20 w-full mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-10 w-1/5" />
          <Skeleton className="h-10 w-1/5" />
          <Skeleton className="h-10 w-1/5" />
          <Skeleton className="h-10 w-1/5" />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default LoadingSkeleton;
