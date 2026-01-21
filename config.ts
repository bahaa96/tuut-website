const config = {
  apOrigin:
    process.env.NODE_ENV === "production"
      ? "https://tuut.shop"
      : "http://localhost:3000",
  wahaApiKey: process.env.WAHA_API_KEY || "Bvhvv2636046!",
};

export default config;