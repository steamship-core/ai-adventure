const { withAxiom } = require("next-axiom");

module.exports = withAxiom({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.steamship.com",
        port: "",
        pathname: "/api/v1/**/raw",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
});
