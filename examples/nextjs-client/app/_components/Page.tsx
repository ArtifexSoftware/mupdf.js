"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type SearchResult = {
  page: number;
  results: {
    x: number;
    y: number;
    w: number;
    h: number;
  }[];
  pageWidth: number;
  pageHeight: number;
};

type PageProps = {
  page: string;
  pageNumber: number;
  searchResults?: SearchResult;
};

export default function Page({ page, pageNumber, searchResults }: PageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [boxes, setBoxes] = useState(
    [] as {
      x: number;
      y: number;
      w: number;
      h: number;
    }[]
  );
  useEffect(() => {
    if (imgRef.current && searchResults && searchResults.results) {
      const { width, height } = imgRef.current;
      const { pageWidth, pageHeight, results } = searchResults;
      setBoxes(
        results.map(({ x, y, w, h }) => ({
          x: (x / pageWidth) * width,
          y: (y / pageHeight) * height,
          w: (w / pageWidth) * width,
          h: (h / pageHeight) * height,
        }))
      );
    }
  }, [searchResults]);

  if (boxes.length) {
    return (
      <div className="relative">
        <Image
          ref={imgRef}
          src={page}
          width={800}
          height={800}
          alt="PDF Page"
        />
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
      </div>
    );
  }

  return (
    <div key={pageNumber} className="relative">
      <Image ref={imgRef} src={page} width={800} height={800} alt="PDF Page" />
    </div>
  );
}
