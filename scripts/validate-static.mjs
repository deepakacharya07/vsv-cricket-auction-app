import { readFileSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "teams.html",
  "login.html",
  "admin.html",
  "styles.css",
  "app.js",
  "supabase-config.js",
  "supabase/schema.sql",
];

for (const file of requiredFiles) {
  const content = readFileSync(file, "utf8");
  if (!content.trim()) {
    throw new Error(`${file} is empty`);
  }
}

const app = readFileSync("app.js", "utf8");

for (const marker of ["renderAuctionBoard", "renderAdminPage", "renderLoginPage"]) {
  if (!app.includes(marker)) {
    throw new Error(`Missing ${marker}`);
  }
}

console.log("Static app validation passed.");
