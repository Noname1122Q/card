// "use client";

// import html2canvas from "html2canvas";
// import { useRef, useState } from "react";

// export default function Home() {
//   const [name, setName] = useState("");

//   const cardRef = useRef<HTMLDivElement>(null);

//   const handleDownload = async () => {
//     if (!cardRef.current) return;

//     const canvas = await html2canvas(cardRef.current);
//     const dataUrl = canvas.toDataURL();
//     console.log(dataUrl);
//     const link = `https://api.whatsapp.com/send?text=${encodeURIComponent(
//       "See this invitation: " + dataUrl
//     )}`;

//     window.open(link, "_blank");
//   };

//   return (
//     <main className="flex flex-col items-center p-4">
//       <input
//         type="text"
//         placeholder="Enter Your Name"
//         className="border p-2 my-2"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <div ref={cardRef} className="relative w-[400px]">
//         <img src="/invitation.jpg" alt="card image" className="w-full" />
//         <div className="absolute top-[70px] left-[90px] text-[20px] font-bold ">
//           {name || "..................."}
//         </div>
//       </div>
//       <button
//         onClick={handleDownload}
//         className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
//       >
//         Send via whatsapp
//       </button>
//     </main>
//   );
// }
"use client";

import { useRef, useState, useEffect } from "react";
import domtoimage from "dom-to-image";

export default function Home() {
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const invitationImage = "/invitation.jpg";

  useEffect(() => {
    if (!canvasRef.current || !name) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = invitationImage;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      ctx.font = "28px serif";
      ctx.fillStyle = "#7b1212";
      ctx.fillText(`          ${name}`, 160, 305);
    };
  }, [name]);

  const generateImage = async () => {
    if (!canvasRef.current) return;
    const blob = await domtoimage.toBlob(canvasRef.current);
    const url = URL.createObjectURL(blob);
    setImageURL(url);
  };

  return (
    <main className="flex flex-col items-center p-8 min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">📨 Invitation Customizer</h1>

      <input
        type="text"
        placeholder="अपना नाम लिखें..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded w-64 mb-6"
      />

      <canvas
        ref={canvasRef}
        style={{ maxWidth: "100%", border: "1px solid #ccc" }}
      />

      {name && (
        <button
          onClick={generateImage}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          Generate Image
        </button>
      )}

      {imageURL && (
        <>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              "Check out this invitation!"
            )}&url=${encodeURIComponent(imageURL)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-blue-600 underline"
          >
            Share on WhatsApp
          </a>

          <a
            href={imageURL}
            download="invitation.jpg"
            className="mt-2 text-blue-600 underline"
          >
            Download Image
          </a>
        </>
      )}
    </main>
  );
}
