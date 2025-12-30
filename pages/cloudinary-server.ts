import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import cloudinary from "../../../lib/cloudinary";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form parse error" });
    const file = files.file as any;
    const path = file.filepath || file.path;

    try {
      const result = await cloudinary.uploader.upload(path, {
        folder: "crgram/originals",
        resource_type: "image",
        eager: [
          { width: 1080, crop: "limit", fetch_format: "auto", quality: "auto" },
          { width: 300, height: 300, crop: "thumb", gravity: "face", fetch_format: "auto" },
          { width: 20, effect: "blur:2000", quality: 1 }
        ],
        use_filename: true,
        unique_filename: true
      });

      try { fs.unlinkSync(path); } catch (e) {}

      res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
}