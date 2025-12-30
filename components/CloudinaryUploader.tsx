import React, { useState } from "react";
import axios from "axios";

export default function CloudinaryUploader({ onUploaded }: { onUploaded: (media: any) => void }) {
  const [progress, setProgress] = useState(0);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // get signature
    const sigRes = await fetch("/api/uploads/sign");
    const sig = await sigRes.json();

    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sig.apiKey);
    fd.append("timestamp", sig.timestamp.toString());
    fd.append("signature", sig.signature);
    fd.append("folder", "crgram/originals");

    const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/upload`;
    const res = await axios.post(url, fd, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => setProgress(Math.round((evt.loaded * 100) / (evt.total || 1)))
    });

    const data = res.data;
    // return media info to parent
    onUploaded(data);
    setProgress(0);
  }

  return (
    <div className="p-2">
      <input type="file" accept="image/*,video/*" onChange={handleFile} />
      {progress > 0 && <div>Uploading: {progress}%</div>}
    </div>
  );
}
