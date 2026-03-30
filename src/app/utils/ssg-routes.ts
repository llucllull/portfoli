export function getSSGRoutes(): string[] {
  if (typeof process === 'undefined') return [];

  try {
    const fs = require('fs');
    const path = require('path');

    const filePath = path.join(process.cwd(), 'routes.txt');
    const content = fs.readFileSync(filePath, 'utf-8');

    return content
      .split('\n')
      .map((r: string) => r.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}
