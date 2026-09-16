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

  // Regex to look for absolute links (href="/...") that don't already have the base prepended
  const absoluteHrefRegex = new RegExp(`href="\\/(?!${basePattern.replace(/\//g, '')}\\/|https?:|\\/\\/)([^"]*)"`, "g");
  
  // Rewrites href="/about" into href="/project1/about" automatically on build
  const fixedHtml = html.replace(absoluteHrefRegex, `href="${basePattern}$1"`);

  return new Response(fixedHtml, {
    status: response.status,
    headers: response.headers,
  });
});