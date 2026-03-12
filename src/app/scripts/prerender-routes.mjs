// src/app/scripts/prerender-routes.mjs
import fs from "fs";
import path from "path";

const base = path.join(process.cwd(), "src/jsons/content/v1");

function readJson(relPath) {
  const full = path.join(base, relPath);
  const raw = fs.readFileSync(full, "utf-8");
  return JSON.parse(raw);
}

const langsData = readJson("languages.json");
const projectsData = readJson("pages/projects.json");

const langs = langsData.languages.map(l => l.code);
const projects = projectsData.body[0].props.projects.map(p => p.slug);

const routes = ["/"];

for (const lang of langs) {
  routes.push(
    `/${lang}`,
    `/${lang}/about`,
    `/${lang}/contact`,
    `/${lang}/projects`
  );

  for (const slug of projects) {
    routes.push(`/${lang}/projects/${slug}`);
  }
}

fs.writeFileSync("routes.txt", routes.join("\n"));
console.log("Generated routes:", routes.length);