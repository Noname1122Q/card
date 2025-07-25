"use client";

import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

type Props = { name: string };

export function CanvasCard({ name }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgBlobUrl, setImgBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    setImgBlobUrl(null);
  }, [name]);

  const generateImage = async () => {
    if (!containerRef.current) return;
    const canvas = await html2canvas(containerRef.current, {
      useCORS: true,
      backgroundColor: null,
    });
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImgBlobUrl(url);
      }
    }, "image/png");
  };

  const shareImage = async () => {
    if (!imgBlobUrl) return;
    const resp = await fetch(imgBlobUrl);
    const blob = await resp.blob();
    const file = new File([blob], "invitation.jpg", { type: blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Invitation",
        text: `Invitation for श्रीमान ${name}`,
      });
    } else {
      // fallback to WhatsApp text + image URL
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `श्रीमान ${name} – your invitation:`
        )}&url=${encodeURIComponent(imgBlobUrl)}`,
        "_blank"
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: 600,
          height: 800,
          backgroundImage: 'url("/invitation.jpg")',
          backgroundSize: "cover",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "20%",
            transform: "translateX(-50%)",
            fontSize: 32,
            color: "#7b1212",
            fontFamily: "serif",
          }}
        >
          श्रीमान {name}
        </div>
      </div>

      <button
        onClick={generateImage}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Card
      </button>

      {imgBlobUrl && (
        <button
          onClick={shareImage}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Share via WhatsApp / Device Share
        </button>
      )}
    </div>
  );
}
