import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Lire le fichier sw.js depuis public/
    const swPath = path.join(process.cwd(), 'public', 'sw.js');
    const swContent = fs.readFileSync(swPath, 'utf-8');

    // Retourner avec les bons headers
    return new NextResponse(swContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Service-Worker-Allowed': '/',
      },
    });
  } catch (error) {
    console.error('Error serving service worker:', error);
    return new NextResponse('Service Worker not found', { status: 404 });
  }
}
