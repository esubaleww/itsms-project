import { google } from "googleapis";
import ENV from "./config/env.js";

const auth = new google.auth.OAuth2(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
);
auth.setCredentials({ refresh_token: ENV.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth,
  params: { supportsAllDrives: true },
});

const res = await drive.files.list({
  q: `'root' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
  fields: "files(id, name)",
  supportsAllDrives: true,
});
console.log(res.data.files);
