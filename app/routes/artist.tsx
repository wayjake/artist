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

    // Clear canvas and fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adjust font size relative to viewport
    const fontSize = Math.min(window.innerWidth, window.innerHeight) * 0.1; // 10% of smallest dimension
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate center position
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Draw text
    ctx.fillText(data.textToRender, x, y);

    // Smudge effect
    const smudgeWidth = 50; // Width of the smudge
    const smudgeHeight = 10; // Height of the smudge
    const smudgeOffset = 20; // Offset from the center

    // Get image data
    const imageData = ctx.getImageData(x - smudgeWidth / 2, y - smudgeHeight / 2, smudgeWidth, smudgeHeight);
    const imageDataArray = imageData.data;

    // Smudge to the right
    for (let i = 0; i < imageDataArray.length; i += 4) {
      if (i % (smudgeWidth * 4) < (smudgeWidth / 2) * 4) {
        imageDataArray[i] = imageDataArray[i + 4];     // Red
        imageDataArray[i + 1] = imageDataArray[i + 5]; // Green
        imageDataArray[i + 2] = imageDataArray[i + 6]; // Blue
        imageDataArray[i + 3] = imageDataArray[i + 7]; // Alpha
      }
    }

    // Put the modified image data back
    ctx.putImageData(imageData, x - smudgeWidth / 2 + smudgeOffset, y - smudgeHeight / 2);

    // Optional: Add a border to the canvas
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [data.textToRender]);
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="aspect-square h-[90vh] max-h-[500px]">
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
          width={500}
          height={500}
        >
          Your browser does not support the canvas element.
        </canvas>
      </div>
    </div>
  );
}