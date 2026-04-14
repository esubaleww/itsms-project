// scripts/getRefreshToken.js
import { google } from "googleapis";
import ENV from "./config/env.js";
import http from "http";
import url from "url";
import http from "http";
import url from "url";

const REDIRECT_URI = "http://localhost:5000";

const oauth2Client = new google.auth.OAuth2(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
);

const scopes = ["https://www.googleapis.com/auth/drive"];

// Create a simple server to catch the redirect
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/") {
    const code = parsedUrl.query.code;

    if (code) {
      try {
        const { tokens } = await oauth2Client.getToken({
          code: code,
          redirect_uri: REDIRECT_URI,
        });

        console.log("\n✅ Success! Add this to your .env:\n");
        console.log("GOOGLE_REFRESH_TOKEN=" + tokens.refresh_token);
        console.log("\n");

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h1>✅ Authorization successful! You can close this window.</h1>",
        );

        server.close();
        process.exit(0);
      } catch (err) {
        console.error("❌ Error:", err.message);
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>❌ Error occurred</h1>");
        server.close();
      }
    } else {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end("<h1>❌ No authorization code found</h1>");
      server.close();
    }
  }
});

// Start the server
server.listen(5000, () => {
  console.log("\n✅ Server listening on http://localhost:3000");

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    redirect_uri: REDIRECT_URI,
    prompt: "consent",
  });

  console.log("\n🔐 Go to this URL:\n");
  console.log(authUrl);
  console.log("\n");
});
