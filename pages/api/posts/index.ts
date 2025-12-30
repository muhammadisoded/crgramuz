import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const posts = await prisma.post.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, image: true } },
        media: true,
        _count: { select: { comments: true, likes: true } }
      }
    });
    return res.status(200).json({ posts });
  }

  if (req.method === "POST") {
    const { authorId, caption, media } = req.body;
    if (!authorId || !media || media.length === 0) return res.status(400).json({ error: "authorId and media required" });

    try {
      const post = await prisma.post.create({
        data: {
          authorId,
          caption,
          media: {
            create: media.map((m: any) => ({
              publicId: m.public_id || m.publicId,
              secureUrl: m.secure_url || m.secureUrl,
              width: m.width,
              height: m.height,
              format: m.format,
              bytes: m.bytes,
              lqip: m.eager?.[2]?.secure_url ?? null
            }))
          }
        },
        include: { media: true, author: true }
      });

      return res.status(201).json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "DB error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
