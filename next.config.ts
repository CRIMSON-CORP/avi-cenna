import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The old site kept the PTA at the top level. It belongs under About, so
     the page moved and the old URL follows it — permanently, because it is
     linked from outside the site. */
  async redirects() {
    return [{ source: "/pta", destination: "/about/pta", permanent: true }];
  },

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
