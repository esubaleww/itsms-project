import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, "../templates/emails");

const templates = {};

const loadTemplate = (templateName) => {
  if (templates[templateName]) return templates[templateName];

  const templatePath = path.join(templatesDir, `${templateName}.html`);
  const basePath = path.join(templatesDir, "base.html");

  const baseHtml = fs.readFileSync(basePath, "utf-8");
  const contentHtml = fs.readFileSync(templatePath, "utf-8");

  const fullHtml = baseHtml.replace("{{content}}", contentHtml);
  templates[templateName] = fullHtml;

  return fullHtml;
};

export const renderTemplate = (templateName, data) => {
  let html = loadTemplate(templateName);

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, data[key]);
  });

  html = html.replace(/{{year}}/g, new Date().getFullYear());
  html = html.replace(/{{appName}}/g, "ITSMS");
  html = html.replace(/{{unsubscribeUrl}}/g, data.unsubscribeUrl || "#");
  html = html.replace(/{{privacyUrl}}/g, data.privacyUrl || "#");

  return html;
};
