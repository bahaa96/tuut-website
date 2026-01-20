import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    const manifestPath = path.join(process.cwd(), "public", "site.webmanifest");
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent);
    
    // Get the origin from the request to make paths absolute
    const headersList = headers();
    const requestUrl = headersList.get("x-paraglide-request-url");
    const origin = requestUrl 
      ? new URL(requestUrl).origin
      : new URL(request.url).origin;
    
    // Update icon paths to be absolute
    if (manifest.icons) {
      manifest.icons = manifest.icons.map((icon: any) => ({
        ...icon,
        src: icon.src.startsWith("http") 
          ? icon.src 
          : `${origin}${icon.src}`,
      }));
    }
    
    return new NextResponse(JSON.stringify(manifest), {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving webmanifest:", error);
    return new NextResponse("Manifest not found", { status: 404 });
  }
}
