import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export function getSSGRoutes(): string[] {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformServer(platformId)) return [];

  try {
    const fs = require('fs');
    const path = require('path');

    const filePath = path.join(process.cwd(), 'routes.txt');
    const content = fs.readFileSync(filePath, 'utf-8');

    return content
      .split('\n')
      .map((r: string) => r.trim())
      .filter(Boolean);
  } catch (e) {
    console.error('❌ Error reading routes.txt', e);
    return [];
  }
}