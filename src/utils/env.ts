import "dotenv/config";

export default {
  port: Number(process.env.PORT),
  secretCookie: process.env.COOKIE_SECRET,
};
