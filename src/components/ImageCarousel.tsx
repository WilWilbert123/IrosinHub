"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageCarousel({ images, fallbackImage }: { images: string[], fallbackImage?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    if (fallbackImage) {
      return (
        <Image
          src={fallbackImage}
          alt="Resort Image"
          fill
          priority
          className="object-cover transition-transform hover:scale-105 duration-700"
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
        <span className="text-zinc-400">No images available</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full group">
      <Image
        src={images[currentIndex]}
        alt={`Resort image ${currentIndex + 1}`}
        fill
        priority={currentIndex === 0}
        className="object-cover transition-transform duration-500 ease-in-out"
      />

      {images.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-zinc-900 hover:bg-white hover:scale-110 transition-all border-none shadow-md"
              onClick={(e) => {
                e.preventDefault();
                prevImage();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm text-zinc-900 hover:bg-white hover:scale-110 transition-all border-none shadow-md"
              onClick={(e) => {
                e.preventDefault();
                nextImage();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${idx === currentIndex
                    ? "bg-white w-6 shadow-sm"
                    : "bg-white/50 hover:bg-white/80"
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(idx);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
