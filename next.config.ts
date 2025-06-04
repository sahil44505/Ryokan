import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows images from any domain
      },
      {
        protocol: "http", // Also allow non-secure HTTP images if needed
        hostname: "**",
      },
    ],
  },
  reactStrictMode: false,
};
=======
  reactStrictMode: false, 
  /* config options here */
};

>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
export default nextConfig;
