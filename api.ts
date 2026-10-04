// api.ts — Neon Function: presigned profile-image uploads.
//
// Route contract (only route):
//   POST /upload  { filename, contentType }  +  Authorization: Bearer <jwt>
//     -> 200 { uploadUrl, publicUrl }
//     -> 401 when the token is missing or fails JWKS verification
//
// The browser then PUTs the file bytes directly to `uploadUrl` with
// `Content-Type: <contentType>`, and stores `publicUrl` as the person's
// `image_url`. Objects land in the `profile-images` bucket (public_read)
// under `people/<userId>/<uuid>.<ext>`.
//
// Auth: Managed Auth JWT verified against the injected NEON_AUTH_JWKS_URL,
// issuer derived from NEON_AUTH_BASE_URL (same contract as the web client,
// which mints the token via `authClient.token()`).
// Storage: Files SDK `neon` adapter (`signedUploadUrl`). Called WITHOUT
// `maxSize` so the adapter returns a presigned PUT URL (a `maxSize` would
// switch it to a POST-form upload that the client's plain PUT cannot use).

import { randomUUID } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

const BUCKET = "profile-images";

// Allowed upload content types -> canonical key extension.
const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Lazily-created JWKS client (module-scope cache, per-isolate reuse).
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks(): ReturnType<typeof createRemoteJWKSet> | null {
  const url = process.env.NEON_AUTH_JWKS_URL;
  if (!url) return null;
  if (!jwks) jwks = createRemoteJWKSet(new URL(url));
  return jwks;
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

async function verifyUserId(request: Request): Promise<string | null> {
  const auth = request.headers.get("authorization");
  if (!auth?.toLowerCase().startsWith("bearer ")) return null;
  const set = getJwks();
  if (!set) {
    console.error("[api] NEON_AUTH_JWKS_URL is not set");
    return null;
  }
  try {
    const verifyOpts: { issuer?: string } = {};
    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    if (baseUrl) verifyOpts.issuer = new URL(baseUrl).origin;
    const { payload } = await jwtVerify(auth.slice(7), set, verifyOpts);
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return null;
    return payload.sub;
  } catch (err) {
    console.warn("[api] JWT verification failed:", (err as Error).message);
    return null;
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (url.pathname !== "/upload") {
      return new Response("Not Found", { status: 404, headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders(),
      });
    }

    const userId = await verifyUserId(request);
    if (!userId) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders() });
    }

    let body: { filename?: unknown; contentType?: unknown };
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    if (typeof body.filename !== "string" || body.filename.length === 0) {
      return json({ error: "filename is required" }, 400);
    }
    if (typeof body.contentType !== "string") {
      return json({ error: "contentType is required" }, 400);
    }
    const ext = ALLOWED_CONTENT_TYPES[body.contentType.toLowerCase()];
    if (!ext) {
      return json(
        { error: "Only jpg, jpeg, png, webp, gif images are allowed" },
        400,
      );
    }

    // Keep the user segment to safe characters so a crafted `sub` cannot
    // escape the `people/<userId>/` prefix.
    const safeUserId = userId.replace(/[^A-Za-z0-9_-]/g, "_");
    const key = `people/${safeUserId}/${randomUUID()}.${ext}`;

    try {
      const files = new Files({ adapter: neon({ bucket: BUCKET }) });
      const signed = await files.signedUploadUrl(key, {
        expiresIn: 600,
        contentType: body.contentType,
      });
      if (signed.method !== "PUT") {
        console.error("[api] unexpected signed upload method:", signed.method);
        return json({ error: "Upload failed" }, 500);
      }
      const endpoint = (process.env.AWS_ENDPOINT_URL_S3 ?? "").replace(/\/+$/, "");
      if (!endpoint) {
        console.error("[api] AWS_ENDPOINT_URL_S3 is not set");
        return json({ error: "Upload failed" }, 500);
      }
      return json(
        { uploadUrl: signed.url, publicUrl: `${endpoint}/${BUCKET}/${key}` },
        200,
      );
    } catch (err) {
      console.error("[api] signedUploadUrl failed:", (err as Error).message);
      return json({ error: "Upload failed" }, 500);
    }
  },
};
