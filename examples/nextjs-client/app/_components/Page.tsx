"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SearchResult } from "../page";

type PageProps = {
  page: string;
  pageNumber: number;
  searchResults?: SearchResult;
};

export default function Page({ page, pageNumber, searchResults }: PageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [boxes, setBoxes] = useState(
    [] as { x: number; y: number; w: number; h: number }[]
  );

  useEffect(() => {
    if (imgRef.current && searchResults && searchResults.results) {
      const { width, height } = imgRef.current;
      const { pageWidth, pageHeight, results } = searchResults;
      setBoxes(
        results.map(({ bbox }) => ({
          x: (bbox.x / pageWidth) * width,
          y: (bbox.y / pageHeight) * height,
          w: (bbox.w / pageWidth) * width,
          h: (bbox.h / pageHeight) * height,
        }))
      );
    }
  }, [searchResults, imgRef]);

  return (
    <div key={pageNumber} className="relative">
      <Image
        ref={imgRef}
        src={page}
        layout="responsive"
        width={searchResults?.pageWidth || 800}
        height={searchResults?.pageHeight || 800}
        alt="PDF Page"
      />
      {boxes.length > 0 && (
        <div className="absolute inset-0">
          {boxes.map(({ x, y, w, h }, key) => (
            <div
              key={key}
              className="absolute bg-yellow-400 rounded-sm opacity-50"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${w}px`,
                height: `${h}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
