// src/middleware.js
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // Only process standard HTML text pages
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  const basePattern = import.meta.env.BASE_URL; // e.g., "/project1/"

  // If there's no custom project base or it's just root, skip rewriting
  if (!basePattern || basePattern === "/") {
    return response;
  }

  const html = await response.text();

  // Clean base name without slashes for the regex lookahead (e.g., "project1")
  const cleanBase = basePattern.replace(/\//g, '');

  // BULLETPROOF REGEX: Captures href="/..." but completely ignores it if:
  // 1. It already starts with your base (e.g., /project1/)
  // 2. It's an external link (http, https, //)
  const absoluteHrefRegex = new RegExp(`href="\\/(?!${cleanBase}\\/|https?:|\\/\\/)([^"]*)"`, "g");
  
  // Rewrites href="/th/about" into href="/project1/th/about" safely without duplicating
  const fixedHtml = html.replace(absoluteHrefRegex, `href="${basePattern}$1"`);

  return new Response(fixedHtml, {
    status: response.status,
    headers: response.headers,
  });
});