import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* The poster frame for the school's film on /about is served by YouTube.
       Allowing just the thumbnail path lets next/image optimise it instead of
       shipping YouTube's full-size JPEG. */
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
};

export default nextConfig;
