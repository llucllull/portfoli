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
const projectsItems = projectsData.body[0].props.items;
const projects = projectsItems.map(p => 
  p.title.en.toLowerCase().replace(/\s+/g, '-')
);

const routes = ["/"];

for (const lang of langs) {
  // Añadimos las rutas base y la nueva de legal
  routes.push(
    `/${lang}`,
    `/${lang}/about`,
    `/${lang}/contact`,
    `/${lang}/projects`,
    `/${lang}/legal`
  );

  for (const slug of projects) {
    routes.push(`/${lang}/projects/${slug}`);
  }
}

fs.writeFileSync("routes.txt", routes.join("\n"));
console.log("Generated routes:", routes.length);