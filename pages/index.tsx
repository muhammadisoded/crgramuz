import Head from "next/head";
import useSWR from "swr";
import axios from "axios";
import Post from "../components/Post";
import CloudinaryUploader from "../components/CloudinaryUploader";
import { useSession } from "next-auth/react";

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function Home() {
  const { data, error, mutate } = useSWR("/api/posts", fetcher);
  const { data: session } = useSession();

  if (error) return <div className="p-6">Failed to load</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  async function handleUploaded(media: any) {
    // create post with this single media (authorId from session)
    const body = {
      authorId: session?.user?.id || "anonymous",
      caption: "Uploaded from web",
      media: [
        {
          public_id: media.public_id,
          secure_url: media.secure_url,
          width: media.width,
          height: media.height,
          format: media.format,
          bytes: media.bytes
        }
      ]
    };
    await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    mutate();
  }

  return (
    <>
      <Head><title>CRGRAM — Feed</title></Head>
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">CRGRAM Feed</h1>
        <div className="mb-4">
          <CloudinaryUploader onUploaded={handleUploaded} />
        </div>
        {data.posts.map((post: any) => (
          <Post key={post.id} post={post} />
        ))}
      </main>
    </>
  );
      }
