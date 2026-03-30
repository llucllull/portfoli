// src/app/utils/ssg-routes.ts
import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';

export function getSSGRoutes(): string[] {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformServer(platformId)) return [];

  try {
    const filePath = path.join(process.cwd(), 'routes.txt');
    const content = fs.readFileSync(filePath, 'utf-8');

    return content
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
  } catch (e) {
    console.error('❌ Error reading routes.txt', e);
    return [];
  }
}

function extractSlug(route: string): string {
  const parts = route.split('/').filter(Boolean);

  if (parts.length <= 1) return 'home';

  return parts.slice(1).join('/');
}