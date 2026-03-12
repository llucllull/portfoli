import fs from "fs";

const BASE = "https://cdn.llucllull.dev/content/v1";

async function fetchJson(url) {

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Fetch failed: ${url} (${res.status})`);
  }

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON from:", url);
    console.error(text.slice(0,200));
    throw e;
  }
}

const langsData = await fetchJson(`${BASE}/languages.json`);
const projectsData = await fetchJson(`${BASE}/pages/projects.json`);

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