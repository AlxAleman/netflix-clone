import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
}

export const MovieCardSkeleton = () => (
  <div className="min-w-[200px] md:min-w-[300px] animate-pulse">
    <div className="bg-gray-700 rounded-md h-[300px] md:h-[450px] w-full"></div>
  </div>
);

export const MovieRowSkeleton = ({ count = 6 }: SkeletonLoaderProps) => (
  <div className="px-4 md:px-16 mb-12">
    {/* Title skeleton */}
    <div className="bg-gray-700 h-6 w-48 rounded mb-6 animate-pulse"></div>
    
    {/* Movies skeleton */}
    <div className="flex space-x-4 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="relative h-screen w-full bg-gray-800 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-transparent"></div>
    <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-16 w-full max-w-4xl">
      <div className="mt-20 space-y-6">
        {/* Title skeleton */}
        <div className="bg-gray-700 h-16 w-96 rounded"></div>
        
        {/* Description skeleton */}
        <div className="space-y-3 max-w-2xl">
          <div className="bg-gray-700 h-4 w-full rounded"></div>
          <div className="bg-gray-700 h-4 w-4/5 rounded"></div>
          <div className="bg-gray-700 h-4 w-3/4 rounded"></div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex space-x-4">
          <div className="bg-gray-600 h-12 w-32 rounded"></div>
          <div className="bg-gray-600 h-12 w-40 rounded"></div>
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center space-x-4">
          <div className="bg-gray-600 h-6 w-16 rounded"></div>
          <div className="bg-gray-600 h-6 w-12 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);