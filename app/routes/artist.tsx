import { useEffect, useRef } from 'react';
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";

type LoaderData = {
  textToRender: string;
}

export const loader: LoaderFunction = async () => {
  return { textToRender: "ARTIST" };
};

export default function Artist() {
  const data = useLoaderData<LoaderData>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 200;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate center position
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Draw text
    ctx.fillText(data.textToRender, x, y);

    // Optional: Add a border to the canvas
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [data.textToRender]); // Re-run effect when text changes

  return (
    <div className="p-4">
      <canvas 
        ref={canvasRef}
        className="max-w-full"
        style={{ 
          width: '400px',
          height: '200px'
        }}
      >
        Your browser does not support the canvas element.
      </canvas>
    </div>
  );
}