import React from "react";

export default function Post({ post }: { post: any }) {
  const img = post.media?.[0];
  const src = img?.secureUrl || img?.secure_url;
  return (
    <article className="bg-[#0f0f0f] rounded-2xl mb-6 overflow-hidden shadow-lg">
      <header className="flex items-center p-3">
        <img src={post.author.image || "/default-avatar.png"} className="w-10 h-10 rounded-full mr-3" alt="" />
        <div>
          <div className="font-semibold">{post.author.name || "Unknown"}</div>
          <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </header>

      {src ? (
        <div className="w-full bg-black flex justify-center items-center">
          <img src={src} alt={post.caption || ""} className="max-h-[60vh] object-contain w-full" />
        </div>
      ) : null}

      <div className="p-3">
        <div className="mb-2">{post.caption}</div>
        <div className="text-sm text-gray-400">
          {post._count?.likes || 0} likes · {post._count?.comments || 0} comments
        </div>
      </div>
    </article>
  );
}
