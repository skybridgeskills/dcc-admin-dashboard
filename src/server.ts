import express from "express";
import payload from "payload";
import path from "path";
import jwt from 'jsonwebtoken';

require("dotenv").config();
const app = express();

app.use("/assets", express.static(path.resolve(__dirname, "./assets")));
// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie || '';
  const tokenMatch = cookieHeader.match(/payload-token=([^;]+)/);

  if (tokenMatch) {
    const { tenant, isAdmin } = jwt.decode(tokenMatch[1]) as any;

    if (isAdmin) {
      return next()
    }

    // check if user is on wrong domain
    if (tenant !== req.headers.host) {
      res.clearCookie('payload-token');
      return res.sendStatus(401);
    }
  }
  return next();
})

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here

  app.listen(3000);
};

start();
