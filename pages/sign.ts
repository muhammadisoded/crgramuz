import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../../lib/cloudinary";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign: Record<string, any> = { timestamp, folder: "crgram/originals" };
  // @ts-ignore
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  res.status(200).json({
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME
  });
}